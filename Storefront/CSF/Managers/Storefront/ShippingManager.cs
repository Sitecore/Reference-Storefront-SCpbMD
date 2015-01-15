﻿//-----------------------------------------------------------------------
// <copyright file="ShippingManager.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2014
// </copyright>
// <summary>The manager class responsible for encapsulating the shipping logic for the site.</summary>
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
    using Sitecore.Commerce.Connect.CommerceServer.Orders.Models;
    using Sitecore.Commerce.Services.Shipping.Generics;
    using Sitecore.Commerce.Connect.DynamicsRetail.Services.Shipping;
    using Sitecore.Commerce.Storefront.Models.InputModels;
    using Sitecore.Commerce.Storefront.Models.SitecoreItemModels;
    using Sitecore.Commerce.Entities.Shipping;
    using Sitecore.Commerce.Services.Shipping;
    using Sitecore.Diagnostics;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using Sitecore.Commerce.Entities.Carts;

    /// <summary>
    /// Defines the ShippingManager class.
    /// </summary>
    public class ShippingManager : BaseManager
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ShippingManager"/> class.
        /// </summary>
        /// <param name="shippingServiceProvider">The shipping service provider.</param>
        /// <param name="cartManager">The cart manager.</param>
        public ShippingManager([NotNull] ShippingServiceProvider shippingServiceProvider, [NotNull] CartManager cartManager)
        {
            Assert.ArgumentNotNull(shippingServiceProvider, "shippingServiceProvider");
            Assert.ArgumentNotNull(cartManager, "cartManager");

            this.ShippingServiceProvider = shippingServiceProvider;
            this.CartManager = cartManager;
        }

        /// <summary>
        /// Gets or sets the shipping service provider.
        /// </summary>
        /// <value>
        /// The shipping service provider.
        /// </value>
        public ShippingServiceProvider ShippingServiceProvider { get; protected set; }

        /// <summary>
        /// Gets or sets the cart manager.
        /// </summary>
        /// <value>
        /// The cart manager.
        /// </value>
        public CartManager CartManager { get; protected set; }

        /// <summary>
        /// Gets the shipping preferences.
        /// </summary>
        /// <param name="cart">The cart.</param>
        /// <returns>The manager response where the shipping options are returned in the Result.</returns>
        public ManagerResponse<GetShippingOptionsResult, List<ShippingOption>> GetShippingPreferences([NotNull] Cart cart)
        {
            Assert.ArgumentNotNull(cart, "cart");

            var request = new GetShippingOptionsRequest(cart);
            var result = this.ShippingServiceProvider.GetShippingOptions(request);

            if (!result.Success)
            {
                Helpers.LogSystemMessages(result.SystemMessages, result);
            }

            return new ManagerResponse<GetShippingOptionsResult,List<ShippingOption>>(result, result.ShippingOptions.ToList());
        }

        /// <summary>
        /// Gets the shipping methods.
        /// </summary>
        /// <param name="storefront">The storefront.</param>
        /// <param name="visitorContext">The visitor context.</param>
        /// <param name="inputModel">The input model.</param>
        /// <returns>
        /// The manager response where the shipping methods are returned in the Result.
        /// </returns>
        public ManagerResponse<GetDeliveryMethodsResult, IReadOnlyCollection<ShippingMethod>> GetShippingMethods([NotNull] CommerceStorefront storefront, [NotNull] VisitorContext visitorContext, [NotNull] GetShippingMethodsInputModel inputModel)
        {
            Assert.ArgumentNotNull(storefront, "storefront");
            Assert.ArgumentNotNull(visitorContext, "visitorContext");
            Assert.ArgumentNotNull(inputModel, "inputModel");

            var response = this.CartManager.GetCurrentCart(storefront, visitorContext);
            var cart = response.Result;
            var preferenceType = InputModelExtension.GetShippingOptionType(inputModel.ShippingPreferenceType);

            var request = new GetDeliveryMethodsRequest(
                new ShippingOption { ShippingOptionType = preferenceType },
                (inputModel.ShippingAddress != null) ? inputModel.ShippingAddress.ToParty() : null) 
                { 
                    Cart = cart, 
                    Lines = (inputModel.Lines != null) ? inputModel.Lines.ToCommerceCartLines() : null 
                };

            GetDeliveryMethodsResult result = this.ShippingServiceProvider.GetShippingMethods<GetShippingMethodsRequest, GetDeliveryMethodsResult>(request);

            return new ManagerResponse<GetDeliveryMethodsResult, IReadOnlyCollection<ShippingMethod>>(result, result.ShippingMethods);
        }
    }
}