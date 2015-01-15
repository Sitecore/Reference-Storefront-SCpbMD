//-----------------------------------------------------------------------
// <copyright file="WishListController.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the WishListController class.</summary>
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
    using Sitecore.Commerce.Storefront.Managers.Storefront;
    using Sitecore.Diagnostics;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Web.Mvc;
    using Sitecore.Commerce.Contacts;
    using Sitecore.Commerce.Entities.WishLists;
    using Sitecore.Commerce.Storefront.Models.InputModels;
    using Sitecore.Commerce.Storefront.Models.JsonResults;

    /// <summary>
    /// Used to handle all Wish List Actions
    /// </summary>
    public class WishListController : BaseController
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="WishListController" /> class.
        /// </summary>
        /// <param name="inventoryManager">The inventory manager.</param>
        /// <param name="accountManager">The account manager.</param>
        /// <param name="wishListManager">The wish list manager.</param>
        /// <param name="contactFactory">The contact factory.</param>
        public WishListController(
            [NotNull] InventoryManager inventoryManager,
            [NotNull] AccountManager accountManager,
            [NotNull] WishListManager wishListManager,
            [NotNull] ContactFactory contactFactory)
            : base(contactFactory)
        {
            Assert.ArgumentNotNull(accountManager, "accountManager");
            Assert.ArgumentNotNull(accountManager, "accountManager");
            Assert.ArgumentNotNull(contactFactory, "contactFactory");
            Assert.ArgumentNotNull(inventoryManager, "inventoryManager");
            Assert.ArgumentNotNull(wishListManager, "wishListManager");

            this.InventoryManager = inventoryManager;
            this.AccountManager = accountManager;
            this.WishListManager = wishListManager;

            if (Context.User.IsAuthenticated)
            {
                CurrentVisitorContext.ResolveCommerceUser(accountManager);
            }
        }

        /// <summary>
        /// Gets or sets the wish list manager.
        /// </summary>
        /// <value>
        /// The wish list manager.
        /// </value>
        public WishListManager WishListManager { get; protected set; }

        /// <summary>
        /// Gets or sets the inventory manager.
        /// </summary>
        /// <value>
        /// The inventory manager.
        /// </value>
        public InventoryManager InventoryManager { get; protected set; }

        /// <summary>
        /// Gets or sets the account manager.
        /// </summary>
        /// <value>
        /// The account manager.
        /// </value>
        public AccountManager AccountManager { get; set; }

        /// <summary>
        ///  Main  controller action
        /// </summary>
        /// <returns>My wish lists view</returns>
        public override ActionResult Index()
        {
            return View("~/Views/Storefront/Account/MyWishLists.cshtml");
        }

        /// <summary>
        /// Show Active Wish Lists
        /// </summary>
        /// <returns>
        /// Returns active wish lists
        /// </returns>
        [HttpGet]
        [Authorize]
        public JsonResult ActiveWishLists()
        {
            var commerceUser = this.AccountManager.GetUser(Context.User.Name).Result;
            var wishLists = new List<WishListHeader>();

            if (commerceUser != null)
            {
                wishLists = this.WishListsHeaders();
            }

            var result = new WishListsJsonResult(wishLists);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Gets the wish lists.
        /// </summary>
        /// <returns>A wish list</returns>
        [HttpGet]
        [Authorize]
        public JsonResult GetWishList(string id)
        {
            Assert.ArgumentNotNull(id, "id");

            var commerceUser = this.AccountManager.GetUser(Context.User.Name).Result;
            var wishList = new WishList();

            if (commerceUser != null)
            {
                wishList = this.WishList(id);
            }

            var result = new WishListJsonResult(wishList);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// View a Wish List based on it's Id
        /// </summary>
        /// <param name="id">The Id of the Wish List</param>
        /// <returns>
        /// Returns the view with wish lists details
        /// </returns>
        [HttpGet]
        [Authorize]
        public ActionResult ViewWishList(string id)
        {
            return View("~/Views/Storefront/Account/MyWishList.cshtml");
        }

        /// <summary>
        /// Create Wish List
        /// </summary>
        /// <param name="name">The name.</param>
        /// <returns>
        /// Creates wish list
        /// </returns>
        [HttpPost]
        [Authorize]
        public JsonResult CreateWishList(string name)
        {
            Assert.ArgumentNotNull(name, "name");

            var commerceUser = this.AccountManager.GetUser(Context.User.Name).Result;
            var wishLists = new List<WishListHeader>();

            if (commerceUser != null)
            {
                var response = this.WishListManager.CreateWishList(this.CurrentStorefront, this.CurrentVisitorContext, name);
                if (response.ServiceProviderResult.Success)
                {
                    wishLists = this.WishListsHeaders();
                }
            }

            var result = new WishListsJsonResult(wishLists);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Deletes the wish list.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns>
        /// Deletes wish list
        /// </returns>
        [HttpPost]
        [Authorize]
        public JsonResult DeleteWishList(string id)
        {
            Assert.ArgumentNotNull(id, "id");

            var commerceUser = this.AccountManager.GetUser(Context.User.Name).Result;
            var wishLists = new List<WishListHeader>();

            if (commerceUser != null)
            {
                var response = this.WishListManager.DeleteWishList(this.CurrentStorefront, this.CurrentVisitorContext, id);
                if (response.ServiceProviderResult.Success)
                {
                    wishLists = this.WishListsHeaders();
                }
            }

            var result = new WishListsJsonResult(wishLists);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Add the wish lists to the cart.
        /// </summary>
        /// <param name="ids">The ids.</param>
        /// <returns>
        /// Add the wish lists to the cart.
        /// </returns>
        [HttpPost]
        [Authorize]
        public JsonResult AddWishListsToCart(List<string> ids)
        {
            Assert.ArgumentNotNull(ids, "ids");

            var wishLists = new List<WishListHeader>();

            // TODO ADD ALL THE ITEMS ON EACH WISH LIST TO THE CART

            var result = new WishListsJsonResult(wishLists);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Updates the wish list.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="name">The name.</param>
        /// <param name="isFavorite">if set to <c>true</c> [is favorite].</param>
        /// <returns>
        /// Updates wish list
        /// </returns>
        [HttpPost]
        [Authorize]
        public JsonResult UpdateWishList(string id, string name, bool isFavorite)
        {
            Assert.ArgumentNotNull(id, "id");
            Assert.ArgumentNotNull(name, "name");
            Assert.ArgumentNotNull(isFavorite, "isFavorite");

            var commerceUser = this.AccountManager.GetUser(Context.User.Name).Result;
            var wishLists = new List<WishListHeader>();

            if (commerceUser != null)
            {
                var response = this.WishListManager.UpdateWishList(this.CurrentStorefront, this.CurrentVisitorContext, id, name, isFavorite);
                if (response.ServiceProviderResult.Success)
                {
                    wishLists = this.WishListsHeaders();
                }
            }

            var result = new WishListsJsonResult(wishLists);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Adds to wish list.
        /// </summary>
        /// <param name="model">The view model.</param>
        /// <returns>
        /// true if the product was added
        /// </returns>
        [HttpPost]
        [Authorize]
        public bool AddToWishList(AddToWishListInputModel model)
        {
            Assert.ArgumentNotNull(model, "model");

            var response = this.WishListManager.AddLinesToWishList(this.CurrentStorefront, this.CurrentVisitorContext, model);

            return response.ServiceProviderResult.Success;
        }

        /// <summary>
        /// Deletes the wish list line item.
        /// </summary>
        /// <param name="wishListId">The wish list identifier.</param>
        /// <param name="lineId">The line identifier.</param>
        /// <returns>
        /// Returns json result with delete line item operation status
        /// </returns>
        [HttpPost]
        [Authorize]
        public JsonResult DeleteLineItem(string wishListId, string lineId)
        {
            Assert.ArgumentNotNull(wishListId, "wishListId");
            Assert.ArgumentNotNull(lineId, "lineId");

            var commerceUser = this.AccountManager.GetUser(Context.User.Name).Result;
            var wishList = new WishList();

            if (commerceUser != null)
            {
                var response = this.WishListManager.RemoveWishListLines(this.CurrentStorefront, this.CurrentVisitorContext, wishListId, new List<string> { lineId });
                if (response.ServiceProviderResult.Success)
                {
                    wishList = this.WishList(wishListId);
                }
            }

            var result = new WishListJsonResult(wishList);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Updates the wish list line item.
        /// </summary>
        /// <param name="wishListId">The wish list identifier.</param>
        /// <param name="productId">The product identifier.</param>
        /// <param name="variantId">The variant identifier.</param>
        /// <param name="quantity">The quantity.</param>
        /// <returns>
        /// Returns the view with update wish list
        /// </returns>
        [HttpPost]
        [Authorize]
        public ActionResult UpdateLineItem(string wishListId, string productId, string variantId, string quantity)
        {
            Assert.ArgumentNotNull(wishListId, "wishListId");
            Assert.ArgumentNotNull(productId, "productId");
            Assert.ArgumentNotNull(quantity, "quantity");

            var commerceUser = this.AccountManager.GetUser(Context.User.Name).Result;
            var wishList = new WishList();

            if (commerceUser != null)
            {
                var response = this.WishListManager.UpdateWishListLine(this.CurrentStorefront, this.CurrentVisitorContext, wishListId, productId, variantId, System.Convert.ToUInt32(quantity, CultureInfo.CurrentCulture));
                if (response.ServiceProviderResult.Success)
                {
                    wishList = this.WishList(wishListId);
                }
            }
            
            var result = new WishListJsonResult(wishList);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        private WishList WishList(string wishListId)
        {
            var getResponse = this.WishListManager.GetWishList(this.CurrentStorefront, this.CurrentVisitorContext, wishListId);
            return getResponse.ServiceProviderResult.Success ? getResponse.Result : new WishList();
        }

        private List<WishListHeader> WishListsHeaders()
        {
            var getResponse = this.WishListManager.GetWishLists(this.CurrentStorefront, this.CurrentVisitorContext);
            return getResponse.ServiceProviderResult.Success ? getResponse.Result.ToList() : new List<WishListHeader>();
        }
    }
}