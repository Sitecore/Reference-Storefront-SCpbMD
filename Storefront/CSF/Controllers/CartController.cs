//-----------------------------------------------------------------------
// <copyright file="CartController.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the CartController class.</summary>
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
    using Sitecore.Commerce.Connect.CommerceServer;
    using Sitecore.Commerce.Connect.CommerceServer.Orders.Models;
    using Sitecore.Commerce.Contacts;
    using Sitecore.Commerce.Services.Carts;
    using Sitecore.Commerce.Storefront.Managers.Storefront;
    using Sitecore.Commerce.Storefront.Models.InputModels;
    using Sitecore.Commerce.Storefront.Models.JsonResults;
    using Sitecore.Commerce.Storefront.Models.Storefront;
    using Sitecore.Diagnostics;
    using System;
    using System.Collections.Generic;
    using System.Web.Mvc;

    /// <summary>
    ///     Defines the shopping cart controller type.
    /// </summary>
    public class CartController : BaseController
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="CartController" /> class.
        /// </summary>
        /// <param name="cartManager">The cart manager.</param>
        /// <param name="accountManager">The account manager.</param>
        /// <param name="contactFactory">The contact factory.</param>
        public CartController([NotNull] CartManager cartManager, [NotNull] AccountManager accountManager,
            [NotNull] ContactFactory contactFactory)
            : base(contactFactory)
        {
            Assert.ArgumentNotNull(cartManager, "cartManager");
            Assert.ArgumentNotNull(accountManager, "accountManager");

            CartManager = cartManager;
            AccountManager = accountManager;

            if (Context.User.IsAuthenticated)
            {
                CurrentVisitorContext.ResolveCommerceUser(accountManager);
            }
        }

        /// <summary>
        ///     Gets or sets the cart manager.
        /// </summary>
        /// <value>
        ///     The cart manager.
        /// </value>
        public CartManager CartManager { get; protected set; }

        /// <summary>
        ///     Gets or sets the account manager.
        /// </summary>
        /// <value>
        ///     The account manager.
        /// </value>
        public AccountManager AccountManager { get; protected set; }

        /// <summary>
        ///     Gets the current cart
        ///     Returns an empty cart if not found
        /// </summary>
        /// <returns></returns>
        public ManagerResponse<CartResult, CommerceCart> CurrentCart()
        {
            return CartManager.GetCurrentCart(CurrentStorefront, CurrentVisitorContext, false);
        }

        /// <summary>
        ///     main cart controller action
        /// </summary>
        /// <returns>the cart view</returns>
        public override ActionResult Index()
        {
            return View(this.GetRenderingView("ShoppingCart"));
        }

        /// <summary>
        ///     The Mini cart controller action.
        /// </summary>
        /// <param name="updateCart">if set to <c>true</c> [update cart].</param>
        /// <returns>the mini cart view</returns>
        public ActionResult MiniCart(bool updateCart = false)
        {
            return PartialView("_MiniCart",
                CartManager.GetCurrentCart(CurrentStorefront, CurrentVisitorContext, updateCart).Result);
        }

        /// <summary>
        ///     The action for rendering the basket view
        /// </summary>
        // TODO: Once we split from AX, let's reuse the Minicart method instead of Basket.
        public ActionResult Basket(bool updateCart = false)
        {
            var cart = CartManager.GetCurrentCart(CurrentStorefront, CurrentVisitorContext, updateCart).Result;

            var cartViewModel = CartRenderingModel.Get(cart, this.CurrentRendering);

            return PartialView(this.GetRenderingView("MiniCart"), cartViewModel);
        }

        /// <summary>
        ///     Baskets the update.
        /// </summary>
        /// <param name="updateCart">if set to <c>true</c> [update cart].</param>
        /// <returns>Returns the Json cart result.</returns>
        public JsonResult BasketUpdate(bool updateCart = false)
        {
            var response = CartManager.GetCurrentCart(CurrentStorefront, CurrentVisitorContext, updateCart);
            var cart = response.Result;

            return Json(new MiniCartJsonResult(response.ServiceProviderResult), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        ///     Gets the current cart.
        /// </summary>
        /// <returns>Returns the Json cart result.</returns>
        public JsonResult GetCurrentCart()
        {
            var response = CartManager.GetCurrentCart(CurrentStorefront, CurrentVisitorContext, false);
            CartJsonResult cartResult = new CartJsonResult(response.ServiceProviderResult);
            cartResult.Initialize(response.ServiceProviderResult.Cart);
            return Json(cartResult, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Adds a product to the cart
        /// </summary>
        /// <param name="inputModel">The input model.</param>
        /// <returns>
        /// true if the product was added
        /// </returns>
        [HttpPost]
        public bool AddCartLine(AddCartLineInputModel inputModel)
        {
            Assert.ArgumentNotNull(inputModel, "inputModel");
            Assert.ArgumentNotNull(CartManager, "CartManager");

            var response = CartManager.AddLineItemsToCart(CurrentStorefront, CurrentVisitorContext,
                new List<AddCartLineInputModel> {inputModel});

            var errorMessage = response.ServiceProviderResult.Cart.Properties["_Basket_Errors_"] as string;

            return response.Result;
        }

        /// <summary>
        /// Adds the items to cart.
        /// </summary>
        /// <param name="inputModels">The input model.</param>
        /// <returns>
        /// Returns json result with add items to cart operation status
        /// </returns>
        [Authorize]
        [HttpPost]
        public JsonResult AddCartLines(IEnumerable<AddCartLineInputModel> inputModels)
        {
            Assert.ArgumentNotNull(inputModels, "inputModels");
            Assert.ArgumentNotNull(CartManager, "CartManager");

            var success = true;

            try
            {
                var response = CartManager.AddLineItemsToCart(CurrentStorefront, CurrentVisitorContext, inputModels);

                success = response.Result;
            }
            catch (Exception ex)
            {
                CommerceLog.Current.Error(ex.ToString(), this);
                success = false;
            }

            return new JsonResult {Data = new {result = success}};
        }

        /// <summary>
        /// Deletes a line item from a cart
        /// </summary>
        /// <param name="externalCartLineId">The external cart line identifier.</param>
        /// <returns>
        /// the partial view of the updated cart
        /// </returns>
        [HttpPost]
        public JsonResult DeleteLineItem(string externalCartLineId)
        {
            Assert.ArgumentNotNullOrEmpty(externalCartLineId, "externalCartLineId");

            var response = CartManager.RemoveLineItemFromCart(CurrentStorefront, CurrentVisitorContext, externalCartLineId);
            var jsonResult = new CartJsonResult(response.ServiceProviderResult);
            if (response.ServiceProviderResult.Success)
            {
                jsonResult.Initialize(response.Result);
            }

            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Update a cart line item
        /// </summary>
        /// <param name="inputModel">The input model.</param>
        /// <returns>
        /// The partial view of the updated cart
        /// </returns>
        [HttpPost]
        public JsonResult UpdateLineItem(UpdateCartLineInputModel inputModel)
        {
            Assert.ArgumentNotNull(inputModel, "inputModel");
            Assert.ArgumentNotNull(CartManager, "CartManager");
            Assert.ArgumentNotNullOrEmpty(inputModel.ExternalCartLineId, "inputModel.ExternalCartLineId");

            var response = CartManager.ChangeLineQuantity(CurrentStorefront, CurrentVisitorContext, inputModel);
            var jsonResult = new CartJsonResult(response.ServiceProviderResult);
            if (response.ServiceProviderResult.Success)
            {
                jsonResult.Initialize(response.Result);
            }

            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Applies the discount.
        /// </summary>
        /// <param name="promoCode">The promo code.</param>
        /// <returns>
        /// The partial view of the updated cart
        /// </returns>
        [HttpPost]
        public JsonResult ApplyDiscount(string promoCode)
        {
            Assert.ArgumentNotNull(promoCode, "promoCode");

            var response = CartManager.AddPromoCodeToCart(CurrentStorefront, CurrentVisitorContext, promoCode);

            CartJsonResult cartResult = new CartJsonResult(response.ServiceProviderResult);
            cartResult.Initialize(response.ServiceProviderResult.Cart);

            return Json(cartResult);
        }

        /// <summary>
        /// Removes a discount.
        /// </summary>
        /// <param name="promoCode">The promo code.</param>
        /// <returns>
        /// The partial view of the updated cart
        /// </returns>
        [HttpPost]
        public JsonResult RemoveDiscount(string promoCode)
        {
            Assert.ArgumentNotNullOrEmpty(promoCode, "promoCode");

            var response = CartManager.RemovePromoCodeFromCart(CurrentStorefront, CurrentVisitorContext, promoCode);

            CartJsonResult cartResult = new CartJsonResult(response.ServiceProviderResult);
            cartResult.Initialize(response.ServiceProviderResult.Cart);

            return Json(cartResult);
        }
    }
}