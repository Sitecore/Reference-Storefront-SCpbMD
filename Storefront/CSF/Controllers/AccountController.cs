//-----------------------------------------------------------------------
// <copyright file="AccountController.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the AccountController class.</summary>
//-----------------------------------------------------------------------
// Copyright 2015 Sitecore Corporation A/S
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file 
// except in compliance with the License. You may obtain a copy of the License at
//       http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software distributed under the 
// License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
// either express or implied. See the License for the specific language governing permissions 
// and limitations under the License.
// -------------------------------------------------------------------------------------------

namespace Sitecore.Commerce.Storefront.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Web.Mvc;
    using System.Diagnostics.CodeAnalysis;
    using Sitecore;
    using Commerce.Services.Customers;
    using Connect.CommerceServer;
    using Connect.CommerceServer.Configuration;
    using Connect.CommerceServer.Orders.Models;
    using Managers;
    using Models = Sitecore.Commerce.Connect.DynamicsRetail.Entities;
    using Models;
    using Entities.Customers;
    using Sitecore.Data.Items;
    using Diagnostics;
    using Links;
    using Sitecore.Commerce.Storefront.Managers.Storefront;
    using Sitecore.Commerce.Contacts;
    using Sitecore.Commerce.Storefront.Models.JsonResults;
    using Sitecore.Commerce.Storefront.Models.InputModels;
    using Sitecore.Commerce.Entities.Orders;
    using Sitecore.Commerce.Entities;

    /// <summary>
    /// Used to handle all account actions
    /// </summary>
    [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
    public class AccountController : BaseController
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AccountController" /> class.
        /// </summary>
        /// <param name="orderManager">The order manager.</param>
        /// <param name="accountManager">The account manager.</param>
        /// <param name="contactFactory">The contact factory.</param>
        public AccountController([NotNull] OrderManager orderManager,
            [NotNull] AccountManager accountManager,
            [NotNull] ContactFactory contactFactory)
            : base(contactFactory)
        {
            Assert.ArgumentNotNull(accountManager, "accountManager");
            Assert.ArgumentNotNull(orderManager, "orderManager");

            this.OrderManager = orderManager;
            this.AccountManager = accountManager;

            if (Context.User.IsAuthenticated)
            {
                CurrentVisitorContext.ResolveCommerceUser(accountManager);
            }
        }

        /// <summary>
        /// Gets or sets the account manager.
        /// </summary>
        /// <value>
        /// The account manager.
        /// </value>
        public AccountManager AccountManager { get; set; }

        /// <summary>
        /// Gets or sets the order manager.
        /// </summary>
        /// <value>
        /// The order manager.
        /// </value>
        public OrderManager OrderManager { get; protected set; }

        /// <summary>
        /// Gives the various types of messages
        /// </summary>
        public enum ManageMessageId
        {
            /// <summary>
            /// Indicates a successful password change
            /// </summary>
            ChangePasswordSuccess,

            /// <summary>
            /// Indicates a successful password set
            /// </summary>
            SetPasswordSuccess,

            /// <summary>
            /// Indicates a successful account delete
            /// </summary>
            RemoveLoginSuccess,
        }

        /// <summary>
        /// The default action for the main page for the account section
        /// </summary>
        /// <returns>The view for the section</returns>
        public override ActionResult Index()
        {
            return View(this.GetRenderingView("Index"));
        }

        /// <summary>
        /// Recent Orders PlugIn for Account Management Home Page
        /// </summary>
        /// <returns>The view to display recent orders</returns>
        [HttpGet]
        [Authorize]
        public JsonResult RecentOrders()
        {
            var commerceUser = this.AccountManager.GetUser(Context.User.Name).Result;

            var recentOrders = new List<OrderHeader>();

            if (commerceUser != null)
            {
                var orders = this.OrderManager.GetOrders(commerceUser.ExternalId, Context.Site.Name).Result.ToList();
                recentOrders = orders.Where(order => (order as CommerceOrderHeader).LastModified > DateTime.Today.AddDays(-30)).Take(5).ToList();
            }

            var result = new OrdersJsonResult(recentOrders);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Profile PlugIn for Account Management Home Page
        /// </summary>
        /// <returns>The view to display profile page</returns>
        [HttpGet]
        public ActionResult AccountHomeProfile()
        {
            var model = new ProfileModel();

            if (Context.User.IsAuthenticated)
            {
                var commerceUser = this.AccountManager.GetUser(this.CurrentVisitorContext.UserName).Result;
                if (commerceUser != null)
                {
                    model.FirstName = commerceUser.FirstName;
                    model.Email = commerceUser.Email;
                    model.LastName = commerceUser.LastName;
                    model.TelephoneNumber = commerceUser.GetPropertyValue("Phone") as string;
                }
            }

            Item item = Context.Item.Children.SingleOrDefault(p => p.Name == "EditProfile");

            if (item != null)
            {
                //If there is a specialy EditProfile then use it
                ViewBag.EditProfileLink = LinkManager.GetDynamicUrl(item);
            }
            else
            {
                //Else go global Edit Profile
                item = Context.Item.Database.GetItem("/sitecore/content/Home/MyAccount/Profile");
                ViewBag.EditProfileLink = LinkManager.GetDynamicUrl(item);
            }
            return View(CurrentRenderingView, model);
        }

        /// <summary>
        /// Address Book in the Home Page
        /// </summary>
        /// <returns>The list of addresses</returns>
        [HttpGet]
        [Authorize]
        public JsonResult AddressList()
        {
            var addresses = this.AllAddresses();
            var result = new AddressListItemJsonResult(addresses, this.GetAvailableCountries());
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Addresseses this instance.
        /// </summary>
        /// <returns>The view to display address book</returns>
        [Authorize]
        public ActionResult Addresses()
        {
            return View("~/Views/Storefront/Account/Addresses.cshtml");
        }

        /// <summary>
        /// Handles deleting of an address and removing it from a user's profile
        /// </summary>
        /// <param name="externalId">The external identifier.</param>
        /// <returns>
        /// The JsonResult with deleting operation status
        /// </returns>
        [HttpPost]
        [Authorize]
        public JsonResult AddressDelete(string externalId)
        {
            var addresses = new List<Sitecore.Commerce.Connect.DynamicsRetail.Entities.CommerceParty>();
            var response = this.AccountManager.RemovePartiesFromCurrentUser(this.CurrentStorefront, this.CurrentVisitorContext, externalId);
            if (response.ServiceProviderResult.Success)
            {
                addresses = this.AllAddresses();
            }

            var result = new AddressListItemJsonResult(addresses, this.GetAvailableCountries());
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Handles updates to an address
        /// </summary>
        /// <param name="model">Any changes to the address</param>
        /// <returns>The view to display the updated address</returns>
        [HttpPost]
        [Authorize]
        public JsonResult AddressModify(Models.CommerceParty model)
        {
            var addresses = new List<Sitecore.Commerce.Connect.DynamicsRetail.Entities.CommerceParty>();
            var commerceUser = this.AccountManager.GetUser(Context.User.Name).Result;
            var customer = new CommerceCustomer { ExternalId = commerceUser.ExternalId };
            var parties = new List<Models.CommerceParty> { model };
            if (string.IsNullOrEmpty(model.ExternalId))
            {
                var response = this.AccountManager.AddParties(this.CurrentStorefront, customer, parties);
                if (response.ServiceProviderResult.Success)
                {
                    addresses = this.AllAddresses();
                }
            }
            else
            {
                var response = this.AccountManager.UpdateParties(this.CurrentStorefront, customer, parties);
                if (response.ServiceProviderResult.Success)
                {
                    addresses = this.AllAddresses();
                }
            }

            var result = new AddressListItemJsonResult(addresses, this.GetAvailableCountries());
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// The action to display existing details about the current user
        /// </summary>
        /// <returns>The view to show the user's profile details</returns>
        [HttpGet]
        public ActionResult ProfileDetails()
        {
            var model = new ProfileModel();

            if (!Context.User.IsAuthenticated) return View(model);
            var commerceUser = this.AccountManager.GetUser(this.CurrentVisitorContext.UserName).Result;

            if (commerceUser == null) return View(model);
            model.FirstName = commerceUser.FirstName;
            model.Email = commerceUser.Email;
            model.LastName = commerceUser.LastName;
            model.TelephoneNumber = commerceUser.GetPropertyValue("Phone") as string;

            return View(model);
        }

        /// <summary>
        /// The action to display existing details about the current user
        /// </summary>
        /// <returns>The view to show the user's profile details</returns>
        [HttpGet]
        public ActionResult ProfileDelete()
        {
            return View();
        }

        /// <summary>
        /// The action to display existing details about the current user
        /// </summary>
        /// <param name="deleteProfile">if set to <c>true</c> [delete profile].</param>
        /// <returns>
        /// The view to show the user's profile details
        /// </returns>
        [HttpPost]
        public ActionResult ProfileDelete(bool deleteProfile)
        {
            if (Context.User.IsAuthenticated && deleteProfile)
            {
                var response = this.AccountManager.DeleteUser(this.CurrentStorefront, this.CurrentVisitorContext);
                if (response.Result)
                {
                    return LogOff();
                }

                // user is authenticated, but not in the CommerceUsers domain - probably here because we are in edit or preview mode
                var msg = string.Format(CultureInfo.InvariantCulture, "Cannot delete user {0}.", Context.User.LocalName);
                ModelState.AddModelError(string.Empty, msg);
            }

            return View();
        }

        /// <summary>
        /// The action to handle the user changing their profile properties
        /// </summary>
        /// <param name="model">The action request.</param>
        /// <returns>
        /// The view to display after updating the user's profile
        /// </returns>
        // TODO:  Aling the name to the action request.
        [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling"), HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public JsonResult ProfileDetails(UpdateUserInputModel model)
        {
            ProfileJsonResult jsonResult = new ProfileJsonResult();

            if (ModelState.IsValid && model != null && Context.User.IsAuthenticated)
            {
                var response = this.AccountManager.UpdateUser(this.CurrentStorefront, this.CurrentVisitorContext, model);

                if (response.ServiceProviderResult.Success)
                {
                    jsonResult.SetResult(response.ServiceProviderResult);
                    ViewBag.Saved = true;
                }
                else
                {
                    if (response.ServiceProviderResult.SystemMessages.Count > 0)
                    {
                        ModelState.AddModelError(string.Empty, response.ServiceProviderResult.SystemMessages[0].Message);
                    }
                }

                if (!ModelState.IsValid && model != null)
                {
                    foreach (var modelState in ModelState.Values)
                    {
                        if (modelState.Errors.Count > 0)
                        {
                            foreach (var error in modelState.Errors)
                            {
                                jsonResult.Errors.Add(error.ErrorMessage);
                            }
                        }
                    }
                }
            }

            return Json(jsonResult);
        }

        /// <summary>
        /// An action to handle displaying the login form
        /// </summary>
        /// <param name="returnUrl">A location to redirect the user to</param>
        /// <returns>The view to display to the user</returns>
        [SuppressMessage("Microsoft.Design", "CA1054:UriParametersShouldNotBeStrings", MessageId = "0#", Justification = "url not required in webpage")]
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View("~/Views/Storefront/Account/Login.cshtml");
        }

        /// <summary>
        /// Handles a user trying to login
        /// </summary>
        /// <param name="model">The user's login details</param>
        /// <returns>The view to display to the user</returns>
        [SuppressMessage("Microsoft.Design", "CA1054:UriParametersShouldNotBeStrings", MessageId = "1#", Justification = "No required for this scenario")]
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Login(LoginModel model)
        {
            if (ModelState.IsValid && this.AccountManager.Login(CurrentStorefront, CurrentVisitorContext, UpdateUserName(model.UserName), model.Password, model.RememberMe))
            {
                var options = new UrlOptions
                {
                    AddAspxExtension = false,
                    LanguageEmbedding = LanguageEmbedding.Never
                };

                return RedirectToLocal(StorefrontManager.StorefrontHome);
            }

            // If we got this far, something failed, redisplay form
            ModelState.AddModelError(string.Empty, "The user name or password provided is incorrect.");
            return View("/Views/Storefront/Account/Login.cshtml");
        }

        /// <summary>
        /// Handles a user trying to log off
        /// </summary>
        /// <returns>The view to display to the user after logging off</returns>
        public ActionResult LogOff()
        {
            this.AccountManager.Logout();

            return RedirectToLocal(StorefrontManager.StorefrontHome);
        }

        /// <summary>
        /// Forgots the password.
        /// </summary>
        /// <returns>The view to display.</returns>
        [AllowAnonymous]
        public ActionResult ForgotPassword()
        {
            return View(this.CurrentRenderingView);
        }

        /// <summary>
        /// Resets the password.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public JsonResult ResetPassword(string userName)
        {
            Assert.ArgumentNotNullOrEmpty(userName, "userName");

            ResetPasswordJsonResult result = new ResetPasswordJsonResult(userName, new UpdatePasswordResult() { Success = true });

            return Json(result);
        }

        /// <summary>
        /// Resets the password confirmation.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <returns></returns>
        [AllowAnonymous]
        public ActionResult ResetPasswordConfirmation(string userName)
        {
            ViewBag.UserName = userName;

            return View(this.CurrentRenderingView);
        }

        /// <summary>
        /// Handles displaying a form for the user to login
        /// </summary>
        /// <returns>The view to display to the user</returns>
        [AllowAnonymous]
        public ActionResult Register()
        {
            return View(this.CurrentRenderingView);
        }

        /// <summary>
        /// Handles a user trying to register
        /// </summary>
        /// <param name="inputModel">The input model.</param>
        /// <returns>
        /// The view to display to the user after they register
        /// </returns>
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public JsonResult Register(RegisterUserInputModel inputModel)
        {
            RegisterJsonResult result = new RegisterJsonResult();

            if (ModelState.IsValid)
            {
                var response = this.AccountManager.RegisterUser(this.CurrentStorefront, inputModel);
                if (response.ServiceProviderResult.Success)
                {
                    result.SetResult(response.ServiceProviderResult);

                    // TODO: Remove this at one point because AX insists on returning a warning message when the external id is not specified.  
                    //       We do not want to display this warning message.
                    result.Errors.Clear();

                    this.AccountManager.Login(CurrentStorefront, CurrentVisitorContext, response.Result.UserName, inputModel.Password, false);
                }
                else
                {
                    ViewBag.Saved = false;
                    result.SetErrors(response.ServiceProviderResult);
                }
            }

            return Json(result);
        }

        /// <summary>
        /// Orderses the history.
        /// </summary>
        /// <returns>
        /// The view to display all orders for current user
        /// </returns>
        [Authorize]
        public ActionResult MyOrders()
        {
            var commerceUser = this.AccountManager.GetUser(Context.User.Name).Result;
            var orders = this.OrderManager.GetOrders(commerceUser.ExternalId, Context.Site.Name).Result;
            return View("~/Views/Storefront/Account/MyOrders.cshtml", orders.ToList());
        }

        /// <summary>
        /// Orders the detail.
        /// </summary>
        /// <param name="id">The order confirmation Id.</param>
        /// <returns>
        /// The view to display order details
        /// </returns>
        [Authorize]
        public ActionResult MyOrder(string id)
        {
            var response = this.OrderManager.GetOrderDetails(CurrentStorefront, CurrentVisitorContext, id);
            ViewBag.ItemShipping = response.Result.Lines.Count > 1 && (response.Result.Shipping == null || response.Result.Shipping.Count == 0);
            return View("~/Views/Storefront/Account/MyOrder.cshtml", response.Result);
        }

        /// <summary>
        /// Displays the Profile Edit Page.
        /// </summary>
        /// <returns>
        /// Profile Edit Page
        /// </returns>
        [Authorize]
        public ActionResult EditProfile()
        {
            return View("~/Views/Storefront/Account/EditProfile.cshtml");
        }

        #region Helpers


        /// <summary>
        /// Concats the user name with the current domain if it missing
        /// </summary>
        /// <param name="userName">The user's user name</param>
        /// <returns>The updated user name</returns>
        public virtual string UpdateUserName(string userName)
        {
            var defaultDomain = CommerceServerSitecoreConfig.Current.DefaultCommerceUsersDomain;
            if (string.IsNullOrWhiteSpace(defaultDomain))
            {
                defaultDomain = CommerceConstants.ProfilesStrings.CommerceUsersDomainName;
            }

            return !userName.StartsWith(defaultDomain, StringComparison.OrdinalIgnoreCase) ? string.Concat(defaultDomain, @"\", userName) : userName;
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return Redirect("/");
        }

        private Dictionary<string, string> GetAvailableCountries()
        {
            var countries = OrderManager.GetAvailableCountries().Result;
            return countries;
        }

        private List<Models.CommerceParty> AllAddresses()
        {
            var response = this.AccountManager.GetCurrentUserParties(this.CurrentStorefront, this.CurrentVisitorContext);
            if (response.ServiceProviderResult.Success && response.Result != null)
            {
                return response.Result.ToList();
            }

            return new List<Models.CommerceParty>();
        }

        #endregion
    }
}
