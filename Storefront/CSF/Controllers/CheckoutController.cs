//-----------------------------------------------------------------------
// <copyright file="CheckoutController.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
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
    using Sitecore;
    using Sitecore.Commerce.Connect.CommerceServer.Orders.Models;
    using Sitecore.Commerce.Connect.DynamicsRetail.Entities.Carts;
    using Sitecore.Commerce.Contacts;
    using Sitecore.Commerce.Entities.GiftCards;
    using Sitecore.Commerce.Entities.LoyaltyPrograms;
    using Sitecore.Commerce.Entities.Payments;
    using Sitecore.Commerce.Entities.Shipping;
    using Sitecore.Commerce.Storefront.Managers;
    using Sitecore.Commerce.Storefront.Managers.Storefront;
    using Sitecore.Commerce.Storefront.Models.InputModels;
    using Sitecore.Commerce.Storefront.Models.JsonResults;
    using Sitecore.Commerce.Storefront.Models.Storefront;
    using Sitecore.Diagnostics;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using MCC = Sitecore.Commerce.Storefront.Constants.CartConstants;

    /// <summary>
    /// Handles all calls to checkout
    /// </summary>
    public class CheckoutController : BaseController
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CheckoutController" /> class.
        /// </summary>
        /// <param name="cartManager">The cart manager.</param>
        /// <param name="orderManager">The order manager.</param>
        /// <param name="loyaltyProgramManager">The loyalty program manager.</param>
        /// <param name="accountManager">The account manager.</param>
        /// <param name="paymentManager">The payment manager.</param>
        /// <param name="shippingManager">The shipping manager.</param>
        /// <param name="giftCardManager">The gift card manager.</param>
        /// <param name="storeManager">The store manager.</param>
        /// <param name="contactFactory">The contact factory.</param>
        public CheckoutController([NotNull] CartManager cartManager, 
            [NotNull] OrderManager orderManager, 
            [NotNull] LoyaltyProgramManager loyaltyProgramManager, 
            [NotNull] AccountManager accountManager,
            [NotNull] PaymentManager paymentManager,
            [NotNull] ShippingManager shippingManager,
            [NotNull] GiftCardManager giftCardManager,
            [NotNull] StoreManager storeManager,
            [NotNull] ContactFactory contactFactory)
            : base(contactFactory)
        {
            Assert.ArgumentNotNull(cartManager, "cartManager");
            Assert.ArgumentNotNull(orderManager, "orderManager");
            Assert.ArgumentNotNull(loyaltyProgramManager, "loyaltyProgramManager");
            Assert.ArgumentNotNull(accountManager, "accountManager");
            Assert.ArgumentNotNull(paymentManager, "paymentManager");
            Assert.ArgumentNotNull(shippingManager, "shippingManager");
            Assert.ArgumentNotNull(giftCardManager, "giftCardManager");
            Assert.ArgumentNotNull(storeManager, "storeManager");

            this.CartManager = cartManager;
            this.OrderManager = orderManager;
            this.LoyaltyProgramManager = loyaltyProgramManager;
            this.AccountManager = accountManager;
            this.PaymentManager = paymentManager;
            this.ShippingManager = shippingManager;
            this.GiftCardManager = giftCardManager;
            this.StoreManager = storeManager;

            if (Sitecore.Context.User.IsAuthenticated)
            {
                CurrentVisitorContext.ResolveCommerceUser(accountManager);
            }
        }

        /// <summary>
        /// Gets or sets the cart manager.
        /// </summary>
        /// <value>
        /// The cart manager.
        /// </value>
        public CartManager CartManager { get; protected set; }

        /// <summary>
        /// Gets or sets the payment manager.
        /// </summary>
        /// <value>
        /// The payment manager.
        /// </value>
        public PaymentManager PaymentManager { get; protected set; }

        /// <summary>
        /// Gets or sets the shipping manager.
        /// </summary>
        /// <value>
        /// The shipping manager.
        /// </value>
        public ShippingManager ShippingManager { get; protected set; }

        /// <summary>
        /// Gets or sets the order manager.
        /// </summary>
        /// <value>
        /// The order manager.
        /// </value>
        public OrderManager OrderManager { get; protected set; }

        /// <summary>
        /// Gets or sets the loyalty program manager.
        /// </summary>
        /// <value>
        /// The loyalty program manager.
        /// </value>
        public LoyaltyProgramManager LoyaltyProgramManager { get; protected set; }

        /// <summary>
        /// Gets or sets the account manager.
        /// </summary>
        /// <value>
        /// The account manager.
        /// </value>
        public AccountManager AccountManager { get; protected set; }

        /// <summary>
        /// Gets or sets the gift card manager.
        /// </summary>
        /// <value>
        /// The gift card manager.
        /// </value>
        public GiftCardManager GiftCardManager { get; protected set; }

        /// <summary>
        /// Gets or sets the store manager.
        /// </summary>
        /// <value>
        /// The store manager.
        /// </value>
        public StoreManager StoreManager { get; protected set; }

        /// <summary>
        /// Handles the index view of the controller
        /// </summary>
        /// <returns>The action for this view</returns>
        [HttpGet]
        public ActionResult StartCheckout()
        {
            if (Sitecore.Context.PageMode.IsPreview)
            {
                return View();
            }

            var viewRequested = this.Request.QueryString["view"];
            if (this.CurrentStorefront.UseAXCheckout || (viewRequested != null && viewRequested == "DynamicsCheckout"))
            {
                return View(this.GetRenderingView("DynamicsCheckout"));
            }

            var response = this.CartManager.GetCurrentCart(CurrentStorefront, CurrentVisitorContext, true);
            var cart = (CommerceCart)response.ServiceProviderResult.Cart;
            if (cart.Lines == null || !cart.Lines.Any())
            {
                var cartPageUrl = StorefrontManager.StorefrontUri("/shoppingcart");
                return Redirect(cartPageUrl);
            }

            AddSupportingDataToViewBag(cart, true);
            return View(this.CurrentRenderingView, new CartRenderingModel(response.Result));
        }

        /// <summary>
        /// Retrieves data required to start the checkout process.
        /// </summary>
        /// <returns>Data required to start the checkout process.</returns>
        [HttpGet]
        public JsonResult GetCheckoutData()
        {
            var result = new GetCheckoutDataJsonResult();

            var response = this.CartManager.GetCurrentCart(CurrentStorefront, CurrentVisitorContext, true);
            result.SetErrors(response.ServiceProviderResult);
            var cart = (CommerceCart)response.ServiceProviderResult.Cart;
            if (cart.Lines == null || !cart.Lines.Any())
            {
                return result;
            }

            result.ShowShipping = true;
            result.ShowPayment = false;
            result.IsCheckoutInfoValid = false;

            this.AddShippingOptionsToResult(result, cart);
            this.AddShippingMethodsToResult(result, cart);
            result.Countries = this.GetAvailableCountries();
            result.PaymentOptions = this.GetPaymentOptions(cart);
            result.PaymentMethods = this.GetPaymentMethods();

            // get current shipping info
            result.CurrentOrderShippingAddress = this.GetCurrentOrderShippingAddress(cart);
            result.ShippingMethods = new List<ShippingMethod>().AsReadOnly();

            // get current payment info
            result.GiftCardPayment = cart.Payment != null && cart.Payment.Any() ? cart.Payment.OfType<GiftCardPaymentInfo>().FirstOrDefault() : new GiftCardPaymentInfo { Amount = 0M };
            result.LoyaltyCardPayment = cart.Payment != null && cart.Payment.Any() ? cart.Payment.OfType<LoyaltyCardPaymentInfo>().FirstOrDefault() : new LoyaltyCardPaymentInfo { Amount = 0M };
            result.CreditCardPayment = cart.Payment != null && cart.Payment.Any() ? cart.Payment.OfType<CommerceCreditCardPaymentInfo>().FirstOrDefault() : new CommerceCreditCardPaymentInfo { Amount = 0M };
            result.CurrentBillingAddress = this.GetCurrentBillingAddress(cart);

            // get user's address if authenticated
            result.IsUserAuthenticated = Sitecore.Context.User.IsAuthenticated;
            if (Sitecore.Context.User.IsAuthenticated)
            {
                result.UserAddresses = this.GetUserAddresses();
            }

            result.UserEmail = Sitecore.Context.User.IsAuthenticated ? CurrentVisitorContext.ResolveCommerceUser(this.AccountManager).Email : string.Empty;
            result.CartLoyaltyCardNumber = cart.LoyaltyCardID;
            result.IsCheckoutInfoValid = true;

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Submits the order in json.
        /// </summary>
        /// <param name="inputModel">The input model.</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult SubmitOrderJson(SubmitOrderInputModel inputModel)
        {
            Assert.ArgumentNotNull(inputModel, "inputModel");

            var response = this.OrderManager.SubmitVisitorOrder(CurrentStorefront, CurrentVisitorContext, inputModel);
            var result = new SubmitOrderJsonResult(response.ServiceProviderResult);
            if (response.ServiceProviderResult.Success)
            {
                if (response.ServiceProviderResult.CartWithErrors == null)
                {
                    result.ConfirmUrl = string.Concat(StorefrontManager.StorefrontUri("checkout/Order Confirmation"), "?confirmationId=", (response.Result.TrackingNumber));
                }
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Gets the available shipping methods.
        /// </summary>
        /// <param name="inputModel">The input model.</param>
        /// <returns>
        /// The available shipping methods.
        /// </returns>
        [HttpPost]
        public JsonResult GetShippingMethodsJson(GetShippingMethodsInputModel inputModel)
        {
            Assert.ArgumentNotNull(inputModel, "inputModel");
            Assert.ArgumentNotNull(inputModel.ShippingAddress, "inputModel.ShippingAddress");
            Assert.ArgumentNotNull(inputModel.ShippingPreferenceType, "inputModel.ShippingPreferenceType");

            var response = this.ShippingManager.GetShippingMethods(CurrentStorefront, CurrentVisitorContext, inputModel);
            var result = new GetShippingMethodsJsonResult(response.ServiceProviderResult);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Sets the shipping methods.
        /// </summary>
        /// <returns>
        /// The action for this view
        /// </returns>
        [HttpPost]
        public JsonResult SetShippingMethodsJson(SetShippingMethodsInputModel inputModel)
        {
            Assert.ArgumentNotNull(inputModel, "inputModel");

            var response = this.CartManager.SetShippingMethods(CurrentStorefront, CurrentVisitorContext, inputModel);
            var result = new CartJsonResult(response.ServiceProviderResult);
            if (response.ServiceProviderResult.Success) {
                result.Initialize(response.Result);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Gets the nearby stores.
        /// </summary>
        /// <param name="inputModel">The input model.</param>
        /// <returns>
        /// A list of stores
        /// </returns>
        [HttpPost]
        public JsonResult GetNearbyStoresJson(GetNearbyStoresInputModel inputModel)
        {
            Assert.ArgumentNotNull(inputModel, "inputModel");

            var response = this.StoreManager.GetNearbyStores(CurrentStorefront, CurrentVisitorContext, inputModel);
            var result = new GetNearbyStoresJsonResult(response.ServiceProviderResult);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Gets the available states.
        /// </summary>
        /// <param name="countryCode">The country code.</param>
        /// <returns>
        /// A list of states based on the country
        /// </returns>
        [HttpPost]
        public JsonResult GetAvailableStatesJson(string countryCode)
        {
            Assert.ArgumentNotNullOrEmpty(countryCode, "countryCode");

            var response = this.OrderManager.GetAvailableStates(CurrentStorefront, CurrentVisitorContext, countryCode);
            var result = new GetAvailableStatesJsonResult(response.ServiceProviderResult);
            if (response.ServiceProviderResult.Success)
            {
                result.States = response.Result;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Gets the gift card balance.
        /// </summary>
        /// <param name="giftCardId">The gift card identifier.</param>
        /// <returns>
        /// A response containing the gift card balance.
        /// </returns>
        [HttpPost]
        public JsonResult GetGiftCardBalanceJson(string giftCardId)
        {
            Assert.ArgumentNotNullOrEmpty(giftCardId, "giftCardId");

            var response = this.GiftCardManager.GetGiftCardBalance(CurrentStorefront, CurrentVisitorContext, giftCardId);
            var result = new GetGiftCardJsonResult(response.ServiceProviderResult);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Gets the gift card balance.
        /// </summary>
        /// <param name="inputModel">The input model.</param>
        /// <returns>
        /// A response containing the gift card balance.
        /// </returns>
        [HttpPost]
        public JsonResult CheckGiftCardBalance(GetGiftCardBalanceInputModel inputModel)
        {
            Assert.ArgumentNotNull(inputModel, "inputModel");
            Assert.ArgumentNotNullOrEmpty(inputModel.GiftCardId, "inputModel.GiftCardId");

            var response = this.GiftCardManager.GetGiftCardBalance(CurrentStorefront, CurrentVisitorContext, inputModel.GiftCardId);
            var result = new GetGiftCardJsonResult(response.ServiceProviderResult);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Applies the discount.
        /// </summary>
        /// <param name="promoCode">The action request.</param>
        /// <returns>
        /// A result containing the updated cart information.
        /// </returns>
        [HttpPost]
        public JsonResult ApplyDiscountJson(string promoCode)
        {
            Assert.ArgumentNotNull(promoCode, "promoCode");

            var response = this.CartManager.AddPromoCodeToCart(CurrentStorefront, CurrentVisitorContext, promoCode);
            var result = new CartJsonResult(response.ServiceProviderResult);
            if (response.ServiceProviderResult.Success)
            {
                result.Initialize(response.Result);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Removes a discount.
        /// </summary>
        /// <param name="promoCode">The promo code.</param>
        /// <returns>
        /// A result containing the the updated cart information.
        /// </returns>
        [HttpPost]
        public ActionResult RemoveDiscountJson(string promoCode)
        {
            Assert.ArgumentNotNull(promoCode, "promoCode");

            var response = this.CartManager.RemovePromoCodeFromCart(CurrentStorefront, CurrentVisitorContext, promoCode);
            var result = new CartJsonResult(response.ServiceProviderResult);
            if (response.ServiceProviderResult.Success)
            {
                result.Initialize(response.Result);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Deletes a line item from a cart
        /// </summary>
        /// <param name="externalCartLineId">The external cart line identifier.</param>
        /// <returns>
        /// A response containing the updated cart information
        /// </returns>
        [HttpPost]
        public JsonResult DeleteLineItemJson(string externalCartLineId)
        {
            Assert.ArgumentNotNullOrEmpty(externalCartLineId, "externalCartLineId");

            var response = this.CartManager.RemoveLineItemFromCart(CurrentStorefront, CurrentVisitorContext, externalCartLineId);
            var result = new CartJsonResult(response.ServiceProviderResult);
            if (response.ServiceProviderResult.Success)
            {
                result.Initialize(response.Result);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Update a cart line item
        /// </summary>
        /// <param name="inputModel">The input model.</param>
        /// <returns>
        /// A result containing the updated cart information.
        /// </returns>
        [HttpPost]
        public JsonResult UpdateLineItemJson(UpdateCartLineInputModel inputModel)
        {
            Assert.ArgumentNotNull(inputModel, "inputModel");
            Assert.ArgumentNotNull(this.CartManager, "CartManager");
            Assert.ArgumentNotNullOrEmpty(inputModel.ExternalCartLineId, "inputModel.ExternalCartLineId");

            var response = this.CartManager.ChangeLineQuantity(CurrentStorefront, CurrentVisitorContext, inputModel);
            var result = new CartJsonResult(response.ServiceProviderResult);
            if (response.ServiceProviderResult.Success)
            {
                result.Initialize(response.Result);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Updates the loytalty card.
        /// </summary>
        /// <param name="loyaltyCardNumber">The action request.</param>
        /// <returns>
        /// True is loyalty card was associated sucessfully, otherwise false
        /// </returns>
        [HttpPost]
        public JsonResult UpdateLoyaltyCard(string loyaltyCardNumber)
        {
            // dha: todo: remove after adapting to all-json version
            Assert.ArgumentNotNullOrEmpty(loyaltyCardNumber, "loyaltyCardNumber");

            var response = this.LoyaltyProgramManager.AssociateLoyaltyCardWithCurrentCart(CurrentStorefront, CurrentVisitorContext, loyaltyCardNumber);
            return Json(new { wasUpdated = response.Result, errors = response.ServiceProviderResult.SystemMessages.Select(sm => sm.Message).ToList() }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Updates the loytalty card.
        /// </summary>
        /// <param name="loyaltyCardNumber">The loyalty card number.</param>
        /// <returns>
        /// A response indicating whether the loyalty card was successfully updated or not.
        /// </returns>
        [HttpPost]
        public JsonResult UpdateLoyaltyCardJson(string loyaltyCardNumber)
        {
            Assert.ArgumentNotNullOrEmpty(loyaltyCardNumber, "loyaltyCardNumber");

            var response = this.LoyaltyProgramManager.AssociateLoyaltyCardWithCurrentCart(CurrentStorefront, CurrentVisitorContext, loyaltyCardNumber);
            var result = new UpdateLoyaltyCardJsonResult(response.ServiceProviderResult);
            result.WasUpdated = response.Result;

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Confirms the order submitted.
        /// </summary>
        /// <param name="confirmationId">The order identifier.</param>
        /// <returns>
        /// the submitted view
        /// </returns>
        public ActionResult Confirm(string confirmationId)
        {
            if (Sitecore.Context.PageMode.IsPreview)
            {
                return View("Submitted");
            }

            Assert.ArgumentNotNullOrEmpty(confirmationId, "confirmationId");
            var response = this.OrderManager.GetOrderDetails(CurrentStorefront, CurrentVisitorContext, confirmationId);
            return View("Submitted", response.Result);
        }

        /// <summary>
        /// Confirms the order submitted.
        /// </summary>
        /// <param name="confirmationId">The order identifier.</param>
        /// <returns>
        /// A result containing the order information.
        /// </returns>
        public JsonResult ConfirmJson(string confirmationId)
        {
            Assert.ArgumentNotNullOrEmpty(confirmationId, "confirmationId");

            if (Sitecore.Context.PageMode.IsPreview)
            {
                var emptyResult = new CartJsonResult();
                emptyResult.IsPreview = true;
                return Json(emptyResult, JsonRequestBehavior.AllowGet);
            }

            var response = this.OrderManager.GetOrderDetails(CurrentStorefront, CurrentVisitorContext, confirmationId);
            var result = new OrderJsonResult(response.ServiceProviderResult);
            result.Initialize(response.Result);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        private void AddSupportingDataToViewBag(CommerceCart cart, bool showShipping)
        {
            // dha: todo: remove after adapting to all-json version
            ViewBag.ShowShipping = showShipping;
            ViewBag.ShowPayment = !showShipping;
            ViewBag.IsCheckoutInfoValid = false;

            this.GetShippingOptions(cart);
            this.GetAllShippingMethods(cart);
            ViewBag.Countries = this.GetAvailableCountries();
            ViewBag.PaymentOptions = this.GetPaymentOptions(cart);
            ViewBag.PaymentMethods = this.GetPaymentMethods();

            // get current shipping info
            ViewBag.CurrentOrderShippingAddress = this.GetCurrentOrderShippingAddress(cart);
            ViewBag.ShippingMethods = new List<ShippingMethod>().AsReadOnly();

            // get current payment info
            ViewBag.GiftCardPayment = cart.Payment != null && cart.Payment.Any() ? cart.Payment.OfType<GiftCardPaymentInfo>().FirstOrDefault() : new GiftCardPaymentInfo { Amount = 0M };
            ViewBag.LoyaltyCardPayment = cart.Payment != null && cart.Payment.Any() ? cart.Payment.OfType<LoyaltyCardPaymentInfo>().FirstOrDefault() : new LoyaltyCardPaymentInfo { Amount = 0M };
            ViewBag.CreditCardPayment = cart.Payment != null && cart.Payment.Any() ? cart.Payment.OfType<CommerceCreditCardPaymentInfo>().FirstOrDefault() : new CommerceCreditCardPaymentInfo { Amount = 0M };
            ViewBag.CurrentBillingAddress = this.GetCurrentBillingAddress(cart);

            // get user's address if authenticated
            if (Sitecore.Context.User.IsAuthenticated)
            {
                ViewBag.UserAddresses = this.GetUserAddresses();
            }

            ViewBag.UserEmail = Sitecore.Context.User.IsAuthenticated ? CurrentVisitorContext.ResolveCommerceUser(this.AccountManager).Email : string.Empty;
            ViewBag.CartLoyaltyCardNumber = cart.LoyaltyCardID;
            ViewBag.IsCheckoutInfoValid = true;
        }

        private IDictionary<string, Sitecore.Commerce.Connect.DynamicsRetail.Entities.CommerceParty> GetUserAddresses()
        {
            var response = this.AccountManager.GetUserAddresses(this.CurrentStorefront, this.CurrentVisitorContext, Sitecore.Context.User.Name);

            return response.Result.ToDictionary(party => party.ExternalId);
        }

        private void GetShippingOptions(CommerceCart cart)
        {
            // dha: todo: remove after adapting to all-json version
            var shippingOptionsResult = this.ShippingManager.GetShippingPreferences(cart);
            var orderShippingOptions = new List<ShippingOption>();
            var lineShippingOptions = new List<LineShippingOption>();
            if (shippingOptionsResult.ServiceProviderResult.Success)
            {
                orderShippingOptions = shippingOptionsResult.ServiceProviderResult.ShippingOptions.ToList();
                lineShippingOptions = shippingOptionsResult.ServiceProviderResult.LineShippingPreferences.ToList();
            }

            ViewBag.OrderShippingOptions = orderShippingOptions;
            ViewBag.LineShippingOptions = lineShippingOptions;
        }

        private void AddShippingOptionsToResult(GetCheckoutDataJsonResult result, CommerceCart cart)
        {
            var shippingOptionsResult = this.ShippingManager.GetShippingPreferences(cart);
            var orderShippingOptions = new List<ShippingOption>();
            var lineShippingOptions = new List<LineShippingOption>();
            if (shippingOptionsResult.ServiceProviderResult.Success)
            {
                orderShippingOptions = shippingOptionsResult.ServiceProviderResult.ShippingOptions.ToList();
                lineShippingOptions = shippingOptionsResult.ServiceProviderResult.LineShippingPreferences.ToList();
            }

            result.OrderShippingOptions = orderShippingOptions;
            result.LineShippingOptions = lineShippingOptions;
        }

        private IDictionary<string, string> GetAvailableCountries()
        {
            var countries = this.OrderManager.GetAvailableCountries().Result;
            return countries;
        }

        private IEnumerable<PaymentOption> GetPaymentOptions(CommerceCart cart)
        {
            var response = this.PaymentManager.GetPaymentOptions(this.CurrentStorefront, this.CurrentVisitorContext, cart);
            return response.Result;
        }

        private IEnumerable<PaymentMethod> GetPaymentMethods()
        {
            var response = this.PaymentManager.GetPaymentMethods(this.CurrentStorefront, this.CurrentVisitorContext, new PaymentOption());
            return response.Result;
        }

        private CommerceParty GetCurrentOrderShippingAddress(CommerceCart cart)
        {
            // TODO should handle more than one shipping on the cart
            ViewBag.States = new Dictionary<string, string>();
            var party = new CommerceParty { Name = MCC.ShippingAddressName, ExternalId = "0" };
            if (cart.Shipping == null || !cart.Shipping.Any() || cart.Parties == null || !cart.Parties.Any())
            {
                return party;
            }

            // ALL LINES HAVE TO BE SHIP TOGETHER FOR AN ORDER SHIPPING
            var lineIds = cart.Lines.Select(l => l.ExternalCartLineId).ToList();
            var shipping = cart.Shipping.FirstOrDefault(s => !lineIds.Except(s.LineIDs).Any()) as CommerceShippingInfo;
            if (shipping == null)
            {
                return party;
            }

            party = cart.Parties.FirstOrDefault(p => p.ExternalId.Equals(shipping.PartyID, StringComparison.OrdinalIgnoreCase)) as CommerceParty;
            if (party == null)
            {
                return new CommerceParty { Name = MCC.ShippingAddressName, ExternalId = "0" };
            }

            if (!string.IsNullOrEmpty(party.Country))
            {
                var statesResponse = this.OrderManager.GetAvailableStates(this.CurrentStorefront, this.CurrentVisitorContext, party.CountryCode);
                ViewBag.States = statesResponse.ServiceProviderResult;
            }

            return party;
        }

        private CommerceParty GetCurrentBillingAddress(CommerceCart cart)
        {
            var party = new CommerceParty { Name = MCC.BillingAddressName, ExternalId = "1" };
            if (cart.Payment == null || !cart.Payment.Any() || cart.Parties == null || !cart.Parties.Any())
            {
                return party;
            }

            var payment = cart.Payment.FirstOrDefault();
            if (payment == null)
            {
                return party;
            }

            var billingPartyId = payment.PartyID;
            return cart.Parties.FirstOrDefault(p => p.ExternalId.Equals(billingPartyId, StringComparison.OrdinalIgnoreCase)) as CommerceParty;
        }

        private void GetAllShippingMethods(CommerceCart cart)
        {
            // dha: todo: remove after adapting to all-json version
            var shippingRequest = new GetShippingMethodsInputModel() { ShippingPreferenceType = ShippingOptionType.None.Name };
            var response = this.ShippingManager.GetShippingMethods(this.CurrentStorefront, this.CurrentVisitorContext, shippingRequest);

            if (response.ServiceProviderResult.Success)
            {
                foreach (var sm in response.Result)
                {
                    var isEmailMethod = sm.GetPropertyValue("IsEmailShippingMethod") != null && (bool)sm.GetPropertyValue("IsEmailShippingMethod");
                    var isShipToStoreMethod = sm.GetPropertyValue("IsShipToStoreShippingMethod") != null && (bool)sm.GetPropertyValue("IsShipToStoreShippingMethod");

                    if (isEmailMethod)
                    {
                        ViewBag.EmailDeliveryMethodId = sm.ExternalId;
                        ViewBag.EmailDeliveryMethodName = sm.Description;
                    }

                    if (isShipToStoreMethod)
                    {
                        ViewBag.ShipToStoreDeliveryMethodId = sm.ExternalId;
                        ViewBag.ShipToStoreDeliveryMethodName = sm.Description;
                    }
                }

                return;
            }

            ViewBag.EmailDeliveryMethodId = string.Empty;
            ViewBag.EmailDeliveryMethodName = string.Empty;
            ViewBag.ShipToStoreDeliveryMethodId = string.Empty;
            ViewBag.ShipToStoreDeliveryMethodName = string.Empty;
        }

        private void AddShippingMethodsToResult(GetCheckoutDataJsonResult result, CommerceCart cart)
        {
            var shippingRequest = new GetShippingMethodsInputModel() { ShippingPreferenceType = ShippingOptionType.None.Name };
            var response = this.ShippingManager.GetShippingMethods(this.CurrentStorefront, this.CurrentVisitorContext, shippingRequest);

            if (response.ServiceProviderResult.Success)
            {
                foreach (var sm in response.Result)
                {
                    var isEmailMethod = sm.GetPropertyValue("IsEmailShippingMethod") != null && (bool)sm.GetPropertyValue("IsEmailShippingMethod");
                    var isShipToStoreMethod = sm.GetPropertyValue("IsShipToStoreShippingMethod") != null && (bool)sm.GetPropertyValue("IsShipToStoreShippingMethod");

                    if (isEmailMethod)
                    {
                        result.EmailDeliveryMethodId = sm.ExternalId;
                        result.EmailDeliveryMethodName = sm.Description;
                    }

                    if (isShipToStoreMethod)
                    {
                        result.ShipToStoreDeliveryMethodId = sm.ExternalId;
                        result.ShipToStoreDeliveryMethodName = sm.Description;
                    }
                }

                return;
            }

            result.EmailDeliveryMethodId = string.Empty;
            result.EmailDeliveryMethodName = string.Empty;
            result.ShipToStoreDeliveryMethodId = string.Empty;
            result.ShipToStoreDeliveryMethodName = string.Empty;
        }
    }
}
