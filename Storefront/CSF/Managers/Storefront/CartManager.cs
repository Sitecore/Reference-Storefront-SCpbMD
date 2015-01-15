//-----------------------------------------------------------------------
// <copyright file="CartManager.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2014
// </copyright>
// <summary>The manager class responsible for encapsulating the cart business logic for the site.</summary>
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

namespace Sitecore.Commerce.Storefront.Managers.Storefront
{
    using Sitecore.Commerce.Connect.CommerceServer.Inventory.Models;
    using Sitecore.Commerce.Connect.CommerceServer.Orders.Models;
    using Sitecore.Commerce.Connect.CommerceServer.Orders.Pipelines;
    using Sitecore.Commerce.Storefront.Models.InputModels;
    using Sitecore.Commerce.Storefront.Models.SitecoreItemModels;
    using Sitecore.Commerce.Entities.Carts;
    using Sitecore.Commerce.Entities.Inventory;
    using Sitecore.Commerce.Services.Carts;
    using Sitecore.Commerce.Services.Inventory;
    using Sitecore.Diagnostics;
    using System.Collections.Generic;
    using System.Linq;
    using Models = Sitecore.Commerce.Connect.DynamicsRetail.Entities;
    using Sitecore.Commerce.Connect.DynamicsRetail.Entities.Shipping;
    using Sitecore.Commerce.Entities;
    using Sitecore.Commerce.Connect.DynamicsRetail.Services.Carts;
    using Sitecore.Commerce.Connect.CommerceServer.Orders;

    /// <summary>
    /// Defines the CartManager class.
    /// </summary>
    // TODO: When we start using base types for service calls, this might help in fixing the problem supressed below.
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
    public class CartManager : BaseManager
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CartManager" /> class.
        /// </summary>
        /// <param name="inventoryManager">The inventory manager.</param>
        /// <param name="cartServiceProvider">The cart service provider.</param>
        public CartManager([NotNull] InventoryManager inventoryManager, [NotNull] CommerceCartServiceProvider cartServiceProvider)
        {
            Assert.ArgumentNotNull(inventoryManager, "inventoryManager");
            Assert.ArgumentNotNull(cartServiceProvider, "cartServiceProvider");

            this.InventoryManager = inventoryManager;
            this.CartServiceProvider = cartServiceProvider;
        }

        /// <summary>
        /// Gets or sets the inventory manager.
        /// </summary>
        /// <value>
        /// The inventory manager.
        /// </value>
        public InventoryManager InventoryManager { get; protected set; }

        /// <summary>
        /// Gets or sets the cart service provider.
        /// </summary>
        /// <value>
        /// The cart service provider.
        /// </value>
        public CartServiceProvider CartServiceProvider { get; protected set; }

        #region Methods (public, non-static)

        /// <summary>
        /// Adds the line item to cart.
        /// </summary>
        /// <param name="storefront">The storefront.</param>
        /// <param name="visitorContext">The visitor context.</param>
        /// <param name="inputModelList">The input model.</param>
        /// <returns>
        /// The manager response where the result is retuned indicating the success or failure of the operation.
        /// </returns>
        public virtual ManagerResponse<CartResult, bool> AddLineItemsToCart([NotNull] CommerceStorefront storefront, [NotNull] VisitorContext visitorContext, IEnumerable<AddCartLineInputModel> inputModelList)
        {
            Assert.ArgumentNotNull(inputModelList, "inputModelList");

            CartCacheHelper.InvalidateCartCache(visitorContext.GetCustomerId());

            var lines = new List<CartLine>();

            foreach (var inputModel in inputModelList)
            {
                Assert.ArgumentNotNullOrEmpty(inputModel.ProductId, "inputModel.ProductId");
                Assert.ArgumentNotNullOrEmpty(inputModel.CatalogName, "inputModel.CatalogName");
                Assert.ArgumentNotNull(inputModel.Quantity, "inputModel.Quantity");

                var quantity = (uint)inputModel.Quantity;

                var cartLine = new CommerceCartLine(inputModel.CatalogName, inputModel.ProductId, inputModel.VariantId == "-1" ? null : inputModel.VariantId, quantity);

                cartLine.Properties["ProductUrl"] = inputModel.ProductUrl;
                cartLine.Properties["ImageUrl"] = inputModel.ImageUrl;

                //Special handling for a Gift Card
                if (inputModel.ProductId == storefront.GiftCardProductId)
                {
                    cartLine.Properties.Add("GiftCardAmount", inputModel.GiftCardAmount);
                }

                UpdateStockInformation(storefront, visitorContext, cartLine, inputModel.CatalogName);
                lines.Add(cartLine);
            }

            var cartResult = this.LoadCartByName(storefront.ShopName, storefront.DefaultCartName, visitorContext.UserId, false);

            var cart = cartResult.Cart as CommerceCart;
            var cartLineResult = this.AddLinesToCart(cart, lines, true);

            CartCacheHelper.AddCartToCache(cartLineResult.Cart as CommerceCart);

            bool success = true;

            if (!cartLineResult.Success || cart == null || cart.Properties["_Basket_Errors"] != null)
            {
                // no cart OR _basket_errors present
                success = false;
            }

            return new ManagerResponse<CartResult, bool>(cartLineResult, success);
        }

        /// <summary>
        /// Removes the line item from cart.
        /// </summary>
        /// <param name="storefront">The storefront.</param>
        /// <param name="visitorContext">The visitor context.</param>
        /// <param name="externalCartLineId">The external cart line identifier.</param>
        /// <returns>
        /// The manager response where the modified CommerceCart is returned in the Result.
        /// </returns>
        public virtual ManagerResponse<CartResult, CommerceCart> RemoveLineItemFromCart([NotNull] CommerceStorefront storefront, [NotNull] VisitorContext visitorContext, [NotNull] string externalCartLineId)
        {
            Assert.ArgumentNotNullOrEmpty(externalCartLineId, "externalCartLineId");

            var cartResult = this.LoadCartByName(storefront.ShopName, storefront.DefaultCartName, visitorContext.UserId, false);

            CommerceCart cart = cartResult.Cart as CommerceCart;
            var lineToRemove = cart.Lines.SingleOrDefault(cl => cl.ExternalCartLineId == externalCartLineId);
            if (lineToRemove == null)
            {
                return new ManagerResponse<CartResult, CommerceCart>(new CartResult { Success = true }, cart);
            }

            CartCacheHelper.InvalidateCartCache(visitorContext.GetCustomerId());

            var cartRemoveResult = this.RemoveCartLines(cart, new[] { new CartLine { ExternalCartLineId = externalCartLineId } }, true);

            CartCacheHelper.AddCartToCache(cartRemoveResult.Cart as CommerceCart);

            return new ManagerResponse<CartResult, CommerceCart>(cartRemoveResult, cartRemoveResult.Cart as CommerceCart);
        }

        /// <summary>
        /// Returns the current user cart.
        /// </summary>
        /// <param name="storefront"></param>
        /// <param name="visitorContext"></param>
        /// <param name="refresh"></param>
        /// <returns>The manager response where the modified CommerceCart is returned in the Result.</returns>
        public virtual ManagerResponse<CartResult, CommerceCart> GetCurrentCart([NotNull] CommerceStorefront storefront, [NotNull] VisitorContext visitorContext, bool refresh = false)
        {
            string customerId = visitorContext.GetCustomerId();

            if (refresh)
            {
                CartCacheHelper.InvalidateCartCache(customerId);
            }

            CartResult cartResult = null;

            var cart = CartCacheHelper.GetCart(customerId);
            if (cart == null)
            {
                cartResult = this.LoadCartByName(storefront.ShopName, storefront.DefaultCartName, visitorContext.UserId, refresh);
                if (cartResult != null && cartResult.Cart != null)
                {
                    CartCacheHelper.AddCartToCache(cartResult.Cart as CommerceCart);
                }
            }

            cart = CartCacheHelper.GetCart(customerId);

            if (cartResult == null)
            {
                cartResult = new CartResult() { Cart = cart };
            }

            return new ManagerResponse<CartResult, CommerceCart>(cartResult, cart);
        }

        /// <summary>
        /// Changes the line quantity.
        /// </summary>
        /// <param name="storefront">The storefront.</param>
        /// <param name="visitorContext">The visitor context.</param>
        /// <param name="inputModel">The input model.</param>
        /// <returns>
        /// The manager response where the modified CommerceCart is returned in the Result.
        /// </returns>
        public virtual ManagerResponse<CartResult, CommerceCart> ChangeLineQuantity([NotNull] CommerceStorefront storefront, [NotNull] VisitorContext visitorContext, [NotNull] UpdateCartLineInputModel inputModel)
        {
            Assert.ArgumentNotNull(inputModel, "inputModel");
            Assert.ArgumentNotNullOrEmpty(inputModel.ExternalCartLineId, "inputModel.ExternalCartLineId");

            CartCacheHelper.InvalidateCartCache(visitorContext.GetCustomerId());

            var getCartResult = this.LoadCartByName(storefront.ShopName, storefront.DefaultCartName, visitorContext.UserId);
            var cart = getCartResult.Cart;
            var result = new CartResult { Cart = cart, Success = true };

            var cartLineToChange = cart.Lines.SingleOrDefault(cl => cl.Product != null && cl.ExternalCartLineId == inputModel.ExternalCartLineId);
            if (inputModel.Quantity == 0 && cartLineToChange != null)
            {
                result = this.RemoveCartLines(cart, new[] { cartLineToChange }, true);
            }
            else
            {
                if (cartLineToChange != null)
                {
                    cartLineToChange.Quantity = inputModel.Quantity;
                    result = this.UpdateCartLines(cart, new[] { cartLineToChange }, true);
                }
            }

            CartCacheHelper.AddCartToCache(result.Cart as CommerceCart);

            return new ManagerResponse<CartResult, CommerceCart>(result, result.Cart as CommerceCart);
        }

        /// <summary>
        /// Adds the promo code to cart.
        /// </summary>
        /// <param name="storefront">The storefront.</param>
        /// <param name="visitorContext">The visitor context.</param>
        /// <param name="promoCode">The promo code.</param>
        /// <returns>
        /// The manager response where the modified CommerceCart is returned in the Result.
        /// </returns>
        public virtual ManagerResponse<AddPromoCodeResult, CommerceCart> AddPromoCodeToCart([NotNull] CommerceStorefront storefront, [NotNull] VisitorContext visitorContext, string promoCode)
        {
            Assert.ArgumentNotNullOrEmpty(promoCode, "promoCode");

            var getCartResult = this.LoadCartByName(storefront.ShopName, storefront.DefaultCartName, visitorContext.UserId);
            var cart = (CommerceCart)getCartResult.Cart;

            CartCacheHelper.InvalidateCartCache(visitorContext.GetCustomerId());

            var result = this.AddPromoCodeToCart(cart, promoCode, true);

            if (!result.Success)
            {
                Helpers.LogSystemMessages(result.SystemMessages, result);
            }

            CartCacheHelper.AddCartToCache(result.Cart as CommerceCart);

            return new ManagerResponse<AddPromoCodeResult, CommerceCart>(result, result.Cart as CommerceCart);
        }

        /// <summary>
        /// Removes the promo code from cart.
        /// </summary>
        /// <param name="storefront">The storefront.</param>
        /// <param name="visitorContext">The visitor context.</param>
        /// <param name="promoCode">The promo code.</param>
        /// <returns>
        /// The manager response where the modified CommerceCart is returned in the Result.
        /// </returns>
        public virtual ManagerResponse<RemovePromoCodeResult, CommerceCart> RemovePromoCodeFromCart([NotNull] CommerceStorefront storefront, [NotNull] VisitorContext visitorContext, string promoCode)
        {
            Assert.ArgumentNotNull(storefront, "storefront");
            Assert.ArgumentNotNull(visitorContext, "visitorContext");
            Assert.ArgumentNotNullOrEmpty(promoCode, "promoCode");

            var getCartResult = this.LoadCartByName(storefront.ShopName, storefront.DefaultCartName, visitorContext.UserId);
            var cart = (CommerceCart)getCartResult.Cart;

            CartCacheHelper.InvalidateCartCache(visitorContext.GetCustomerId());

            var result = this.RemovePromoCodeFromCart(cart, promoCode, true);

            if (!result.Success)
            {
                Helpers.LogSystemMessages(result.SystemMessages, result);
            }

            CartCacheHelper.AddCartToCache(result.Cart as CommerceCart);

            return new ManagerResponse<RemovePromoCodeResult, CommerceCart>(result, result.Cart as CommerceCart);
        }

        /// <summary>
        /// Sets the shipping methods.
        /// </summary>
        /// <param name="storefront">The storefront.</param>
        /// <param name="visitorContext">The visitor context.</param>
        /// <param name="inputModel">The input model.</param>
        /// <returns>
        /// The manager response where the modified CommerceCart is returned in the Result.
        /// </returns>
        public virtual ManagerResponse<AddShippingInfoResult, CommerceCart> SetShippingMethods([NotNull] CommerceStorefront storefront, [NotNull] VisitorContext visitorContext, [NotNull] SetShippingMethodsInputModel inputModel)
        {
            Assert.ArgumentNotNull(storefront, "storefront");
            Assert.ArgumentNotNull(visitorContext, "visitorContext");
            Assert.ArgumentNotNull(inputModel, "inputModel");

            var response = this.GetCurrentCart(storefront, visitorContext, true);
            var cart = (CommerceCart)response.ServiceProviderResult.Cart;
            var orderPreferenceType = InputModelExtension.GetShippingOptionType(inputModel.OrderShippingPreferenceType);

            if (inputModel.ShippingAddresses != null && inputModel.ShippingAddresses.Any())
            {
                var cartParties = cart.Parties.ToList();
                cartParties.AddRange(inputModel.ShippingAddresses.ToParties());
                cart.Parties = cartParties.AsReadOnly();
            }

            var internalShippingList = inputModel.ShippingMethods.ToShippingInfoList();

            if (orderPreferenceType != ShippingOptionType.DeliverItemsIndividually)
            {
                foreach (var shipping in internalShippingList)
                {
                    shipping.LineIDs = (from CommerceCartLine lineItem in cart.Lines select lineItem.ExternalCartLineId).ToList().AsReadOnly();
                }
            }

            var result = this.AddShippingInfoToCart(cart, orderPreferenceType, internalShippingList);

            return new ManagerResponse<AddShippingInfoResult, CommerceCart>(result, result.Cart as CommerceCart);
        }

        /// <summary>
        /// Merges the carts.
        /// </summary>
        /// <param name="storefront">The storefront.</param>
        /// <param name="visitorContext">The visitor context.</param>
        /// <param name="anonymousVisitorId">The anonymous visitor identifier.</param>
        /// <returns>
        /// The manager response where the merged cart is returned in the result.
        /// </returns>
        public virtual ManagerResponse<CartResult, CommerceCart> MergeCarts([NotNull] CommerceStorefront storefront, [NotNull] VisitorContext visitorContext, string anonymousVisitorId)
        {
            var userId = visitorContext.UserId;
            var getCartResult = this.LoadCartByName(storefront.ShopName, storefront.DefaultCartName, userId);
            var currentCart = (CommerceCart)getCartResult.Cart;
            var cartResult = new CartResult { Cart = currentCart, Success = true };

            if (userId != anonymousVisitorId)
            {
                CartCacheHelper.InvalidateCartCache(userId);
                var cartFromAnonymous = CartCacheHelper.GetCart(anonymousVisitorId);

                if (cartFromAnonymous != null && cartFromAnonymous.Lines.Any())
                {
                    CartCacheHelper.InvalidateCartCache(anonymousVisitorId);
                    cartResult = this.MergeCarts(currentCart, cartFromAnonymous);
                }
            }

            CartCacheHelper.AddCartToCache(cartResult.Cart as CommerceCart);

            return new ManagerResponse<CartResult,CommerceCart>(cartResult, cartResult.Cart as CommerceCart);
        }

        #endregion

        #region Methods (protected, virtual)

        /// <summary>
        /// Adds the lines to cart.
        /// </summary>
        /// <param name="cart">The cart.</param>
        /// <param name="lines">The lines.</param>
        /// <param name="refresh">if set to <c>true</c> [refresh].</param>
        /// <returns>
        /// The cart result.
        /// </returns>
        protected virtual CartResult AddLinesToCart(Cart cart, IEnumerable<CartLine> lines, bool refresh = false)
        {
            Assert.ArgumentNotNull(cart, "cart");
            Assert.ArgumentNotNull(lines, "lines");

            var request = new AddCartLinesRequest(cart, lines);

            request.RefreshCart(refresh);

            var cartResult = this.CartServiceProvider.AddCartLines(request);

            return cartResult;
        }

        /// <summary>
        /// Removes product from the visitor's cart.
        /// </summary>
        /// <param name="cart"></param>
        /// <param name="cartLines"></param>
        /// <param name="refreshCart"></param>
        /// <returns>
        /// the cart result.
        /// </returns>
        protected virtual CartResult RemoveCartLines(Cart cart, IEnumerable<CartLine> cartLines, bool refreshCart = false)
        {
            Assert.ArgumentNotNull(cart, "cart");
            Assert.ArgumentNotNull(cartLines, "cartLine");

            var request = new RemoveCartLinesRequest(cart, cartLines);
            request.RefreshCart(refreshCart);
            var cartResult = this.CartServiceProvider.RemoveCartLines(request);

            return cartResult;
        }

        /// <summary>
        /// Updates the cart lines.
        /// </summary>
        /// <param name="cart">The cart.</param>
        /// <param name="cartLines">The cart lines.</param>
        /// <param name="refreshCart">if set to <c>true</c> [refresh cart].</param>
        /// <returns>The cart result.</returns>
        protected virtual CartResult UpdateCartLines(Cart cart, IEnumerable<CartLine> cartLines, bool refreshCart = false)
        {
            var request = new UpdateCartLinesRequest(cart, cartLines);
            request.RefreshCart(refreshCart);
            var result = this.CartServiceProvider.UpdateCartLines(request);

            return result;
        }

        /// <summary>
        /// Merges the carts.
        /// </summary>
        /// <param name="userCart">The user cart.</param>
        /// <param name="anonymousCart">The anonymous cart.</param>
        /// <returns>
        /// The merged cart.
        /// </returns>
        protected virtual CartResult MergeCarts([NotNull] CommerceCart userCart, [NotNull] CommerceCart anonymousCart)
        {
            Assert.ArgumentNotNull(userCart, "userCart");
            Assert.ArgumentNotNull(anonymousCart, "anonymousCart");

            if ((userCart.ShopName != anonymousCart.ShopName) || (userCart.ExternalId == anonymousCart.ExternalId))
            {
                return new CartResult() { Cart = userCart, Success = true };
            }

            var mergeCartRequest = new MergeCartRequest(anonymousCart, userCart);
            var result = this.CartServiceProvider.MergeCart(mergeCartRequest);

            return result;
        }

        /// <summary>
        /// Adds a party to a cart
        /// </summary>
        /// <param name="storefront">The Storefront Context</param>
        /// <param name="visitorContext">The Visitor Context</param>
        /// <param name="cart">the cart</param>
        /// <param name="party">the party info</param>
        /// <returns>the updated cart</returns>
        protected virtual CommerceCart AddPartyToCart([NotNull] CommerceStorefront storefront, [NotNull] VisitorContext visitorContext, [NotNull] CommerceCart cart, [NotNull] Sitecore.Commerce.Connect.DynamicsRetail.Entities.CommerceParty party)
        {
            Assert.ArgumentNotNull(cart, "cart");
            Assert.ArgumentNotNull(party, "party");

            var request = new AddPartiesRequest(cart, new List<Party> { party });
            var result = this.CartServiceProvider.AddParties(request);

            return result.Cart as CommerceCart;
        }

        /// <summary>
        /// Removes party info from a cart
        /// </summary>
        /// <param name="storefront">The Storefront Context</param>
        /// <param name="visitorContext">The Visitor Context</param>
        /// <param name="cart">the cart</param>
        /// <param name="party">the party info</param>
        /// <returns>the updated cart</returns>
        protected virtual CommerceCart RemovePartyFromCart([NotNull] CommerceStorefront storefront, [NotNull] VisitorContext visitorContext, [NotNull] CommerceCart cart, [NotNull] Sitecore.Commerce.Connect.DynamicsRetail.Entities.CommerceParty party)
        {
            Assert.ArgumentNotNull(cart, "cart");
            Assert.ArgumentNotNull(party, "party");

            var request = new RemovePartiesRequest(cart, new List<Party> { party });
            var result = this.CartServiceProvider.RemoveParties(request);
            if (!result.Success)
            {
                Helpers.LogSystemMessages(result.SystemMessages, result);
            }

            return result.Cart as CommerceCart;
        }

        /// <summary>
        /// Updates party info on a cart
        /// </summary>
        /// <param name="storefront">The Storefront Context</param>
        /// <param name="visitorContext">The Visitor Context</param>
        /// <param name="cart">the cart</param>
        /// <param name="parties">the party info</param>
        /// <returns>the updated cart</returns>
        protected virtual CommerceCart UpdatePartiesInCart([NotNull] CommerceStorefront storefront, [NotNull] VisitorContext visitorContext, [NotNull] CommerceCart cart, [NotNull] List<Sitecore.Commerce.Connect.DynamicsRetail.Entities.CommerceParty> parties)
        {
            Assert.ArgumentNotNull(cart, "cart");
            Assert.ArgumentNotNull(parties, "parties");

            if (!parties.Any())
            {
                return cart;
            }

            var request = new UpdatePartiesRequest(cart, parties.Cast<Party>().ToList());
            var result = this.CartServiceProvider.UpdateParties(request);
            if (!result.Success)
            {
                Helpers.LogSystemMessages(result.SystemMessages, result);
            }

            return result.Cart as CommerceCart;
        }

        /// <summary>
        /// Adds payment info to a cart
        /// </summary>
        /// <param name="storefront">The Storefront Context</param>
        /// <param name="visitorContext">The Visitor Context</param>
        /// <param name="cart">the cart</param>
        /// <param name="info">the payment info</param>
        /// <param name="party">the party info</param>
        /// <param name="refreshCart">if set to <c>true</c> the cart will be re-calculated using the Commerce Server pipelines.</param>
        /// <returns>
        /// the updated cart
        /// </returns>
        protected virtual CommerceCart AddPaymentInfoToCart([NotNull] CommerceStorefront storefront, [NotNull] VisitorContext visitorContext, [NotNull] CommerceCart cart, [NotNull] PaymentInfo info, [NotNull] Sitecore.Commerce.Connect.DynamicsRetail.Entities.CommerceParty party, bool refreshCart = false)
        {
            Assert.ArgumentNotNull(cart, "cart");
            Assert.ArgumentNotNull(info, "info");
            Assert.ArgumentNotNull(party, "party");
            Assert.ArgumentCondition(info is CommerceCreditCardPaymentInfo, "info", "info is CommerceCreditCardPaymentInfo");

            var creditCardInfo = info as CommerceCreditCardPaymentInfo;
            creditCardInfo.PartyID = party.ExternalId;
            creditCardInfo.Amount = cart.Total.Amount;

            var paymentRequest = new AddPaymentInfoRequest(cart, new List<PaymentInfo> { creditCardInfo });
            paymentRequest.RefreshCart(refreshCart);

            var paymentResult = this.CartServiceProvider.AddPaymentInfo(paymentRequest);

            return paymentResult.Cart as CommerceCart;
        }

        /// <summary>
        /// Removes Payment info from a cart
        /// </summary>
        /// <param name="storefront">The Storefront Context</param>
        /// <param name="visitorContext">The Visitor Context</param>
        /// <param name="cart">the cart</param>
        /// <param name="info">the payment info</param>
        /// <param name="refreshCart">if set to <c>true</c> the cart will be re-calculated using the Commerce Server pipelines.</param>
        /// <returns>
        /// the updated cart
        /// </returns>
        protected virtual CommerceCart RemovePaymentInfoFromCart([NotNull] CommerceStorefront storefront, [NotNull] VisitorContext visitorContext, [NotNull] CommerceCart cart, [NotNull] List<PaymentInfo> info, bool refreshCart = false)
        {
            Assert.ArgumentNotNull(cart, "cart");
            Assert.ArgumentNotNull(info, "info");

            var removePaymentRequest = new RemovePaymentInfoRequest(cart, info);
            removePaymentRequest.RefreshCart(refreshCart);
            var removeResult = this.CartServiceProvider.RemovePaymentInfo(removePaymentRequest);

            return removeResult.Cart as CommerceCart;
        }

        /// <summary>
        /// Adds shipping info to a cart
        /// </summary>
        /// <param name="cart">The cart.</param>
        /// <param name="orderShippingPreferenceType">Type of the order shipping preference.</param>
        /// <param name="shipments">The shipments.</param>
        /// <returns>
        /// the updated cart
        /// </returns>
        protected virtual AddShippingInfoResult AddShippingInfoToCart([NotNull] CommerceCart cart, [NotNull] Sitecore.Commerce.Entities.Shipping.ShippingOptionType orderShippingPreferenceType, [NotNull] IEnumerable<ShippingInfo> shipments)
        {
            Assert.ArgumentNotNull(cart, "cart");
            Assert.ArgumentNotNull(orderShippingPreferenceType, "orderShippingPreferenceType");
            Assert.ArgumentNotNull(shipments, "shipments");

            var request = new AddShippingInformationRequest(cart, shipments.ToList(), orderShippingPreferenceType);
            var result = this.CartServiceProvider.AddShippingInfo(request);
            if (!result.Success)
            {
                Helpers.LogSystemMessages(result.SystemMessages, result);
            }

            return result;
        }

        /// <summary>
        /// Adds the promo code to cart.
        /// </summary>
        /// <param name="cart">The cart.</param>
        /// <param name="promoCode">The promo code.</param>
        /// <param name="refreshCart">if set to <c>true</c> [refresh cart].</param>
        /// <returns>
        /// The add promo code result.
        /// </returns>
        protected virtual AddPromoCodeResult AddPromoCodeToCart([NotNull]CommerceCart cart, [NotNull]string promoCode, bool refreshCart = false)
        {
            Assert.ArgumentNotNullOrEmpty(promoCode, "promoCode");

            var request = new AddPromoCodeRequest(cart, promoCode);
            request.RefreshCart(refreshCart);
            var result = ((CommerceCartServiceProvider)this.CartServiceProvider).AddPromoCode(request);

            return result;
        }

        /// <summary>
        /// Removes the promo code from cart.
        /// </summary>
        /// <param name="cart">The cart.</param>
        /// <param name="promoCode">The promo code.</param>
        /// <param name="refreshCart">if set to <c>true</c> [refresh cart].</param>
        /// <returns>
        /// The remove promo code result.
        /// </returns>
        protected virtual RemovePromoCodeResult RemovePromoCodeFromCart([NotNull]CommerceCart cart, [NotNull]string promoCode, bool refreshCart = false)
        {
            Assert.ArgumentNotNullOrEmpty(promoCode, "promoCode");

            var request = new RemovePromoCodeRequest(cart, promoCode);
            var result = ((CommerceCartServiceProvider)this.CartServiceProvider).RemovePromoCode(request);

            return result;
        }

        /// <summary>
        /// Loads the the cart by given its cart name.
        /// </summary>
        /// <param name="shopName">Name of the shop.</param>
        /// <param name="cartName">Name of the cart.</param>
        /// <param name="userName">Name of the user.</param>
        /// <param name="refreshCart">if set to <c>true</c> [refresh cart].</param>
        /// <returns>The cart result.</returns>
        protected virtual CartResult LoadCartByName(string shopName, string cartName, string userName, bool refreshCart = false)
        {
            var request = new LoadCartByNameRequest(shopName, cartName, userName);
            request.RefreshCart(refreshCart);
            var result = this.CartServiceProvider.LoadCart(request);

            return result;
        }

        /// <summary>
        /// Updates the stock information.
        /// </summary>
        /// <param name="storefront">The storefront.</param>
        /// <param name="visitorContext">The visitor context.</param>
        /// <param name="cartLine">The cart line.</param>
        /// <param name="catalogName">Name of the catalog.</param>
        protected virtual void UpdateStockInformation([NotNull] CommerceStorefront storefront, [NotNull] VisitorContext visitorContext, [NotNull] CommerceCartLine cartLine, [NotNull] string catalogName)
        {
            Assert.ArgumentNotNull(cartLine, "cartLine");

            var products = new List<InventoryProduct> { new CommerceInventoryProduct { ProductId = cartLine.Product.ProductId, CatalogName = catalogName } };
            var stockInfoResult = this.InventoryManager.GetStockInformation(storefront, products).ServiceProviderResult;
            if (stockInfoResult.StockInformation == null || !stockInfoResult.StockInformation.Any())
            {
                return;
            }

            var stockInfo = stockInfoResult.StockInformation.FirstOrDefault();
            var orderableInfo = new OrderableInformation();
            if (stockInfo != null && stockInfo.Status != null)
            {
                if (Equals(stockInfo.Status, StockStatus.PreOrderable))
                {
                    var preOrderableResult = this.InventoryManager.GetPreOrderableInformation(storefront, products).ServiceProviderResult;
                    if (preOrderableResult.OrderableInformation != null && preOrderableResult.OrderableInformation.Any())
                    {
                        orderableInfo = preOrderableResult.OrderableInformation.FirstOrDefault();
                    }
                }
                else if (Equals(stockInfo.Status, StockStatus.BackOrderable))
                {
                    var backOrderableResult = this.InventoryManager.GetBackOrderableInformation(storefront, products).ServiceProviderResult;
                    if (backOrderableResult.OrderableInformation != null && backOrderableResult.OrderableInformation.Any())
                    {
                        orderableInfo = backOrderableResult.OrderableInformation.FirstOrDefault();
                    }
                }
            }

            if (stockInfo != null)
            {
                cartLine.Product.StockStatus = stockInfo.Status;
            }

            if (orderableInfo == null)
            {
                return;
            }

            cartLine.Product.InStockDate = orderableInfo.InStockDate;
            cartLine.Product.ShippingDate = orderableInfo.ShippingDate;
        }

        #endregion
    }
}