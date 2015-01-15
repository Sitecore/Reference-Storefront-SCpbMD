//---------------------------------------------------------------------
// <copyright file="CartCacheHelper.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>The CartCacheHelper class</summary>
//---------------------------------------------------------------------
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

namespace Sitecore.Commerce.Storefront
{
    using System.Globalization;
    using Sitecore;
    using Sitecore.Diagnostics;
    using Sitecore.Commerce.Connect.CommerceServer;
    using Sitecore.Commerce.Connect.CommerceServer.Caching;
    using Sitecore.Commerce.Connect.CommerceServer.Orders.Models;
    
    /// <summary>
    /// Cart Cache Helper
    /// </summary>
    /// <remarks>
    /// As constantly getting a basket from Commerce server can be expensive, this cache can be used as a way to mitigate getting a cart.
    /// When a cart for a customer is created, it will be placed into the cache.  When operations are performed on the cart, the cahce is invalidated for that
    /// customer cart, if it exists in the cahce.
    /// </remarks>
    public static class CartCacheHelper
    {
        /// <summary>
        /// Invalidates the cart cache.
        /// </summary>
        /// <param name="customerId">the customer id</param>
        public static void InvalidateCartCache([NotNull]string customerId)
        {
            var cacheProvider = GetCacheProvider();
            
            //// our customerid isn't a GUID, it's the AX account number 
            var id = customerId; // Guid.Parse(customerId).ToString("D");
            
            if (!cacheProvider.Contains(CommerceConstants.KnownCachePrefixes.Sitecore, CommerceConstants.KnownCacheNames.CommerceCartCache, id))
            {
                var msg = string.Format(CultureInfo.InvariantCulture, "CartCacheHelper::InvalidateCartCache - Cart for customer id {0} is not in the cache!", id);
                CommerceTrace.Current.Write(msg);
            }

            cacheProvider.RemoveData(CommerceConstants.KnownCachePrefixes.Sitecore, CommerceConstants.KnownCacheNames.CommerceCartCache, id);

            CartCookieHelper.DeleteCartCookieForCustomer(id);
        }

        /// <summary>
        /// Adds the cart to cache.
        /// </summary>
        /// <param name="cart">The cart.</param>
        public static CommerceCart AddCartToCache(CommerceCart cart)
        {
            var cacheProvider = GetCacheProvider();

            //// our customerid isn't a GUID, it's the AX account number 
            var id = cart.CustomerId; // Guid.Parse(cart.CustomerId).ToString("D");

            if (cacheProvider.Contains(CommerceConstants.KnownCachePrefixes.Sitecore, CommerceConstants.KnownCacheNames.CommerceCartCache, id))
            {
                var msg = string.Format(CultureInfo.InvariantCulture, "CartCacheHelper::AddCartToCache - Cart for customer id {0} is already in the cache!", id);
                CommerceTrace.Current.Write(msg);
            }
            
            cacheProvider.AddData(CommerceConstants.KnownCachePrefixes.Sitecore, CommerceConstants.KnownCacheNames.CommerceCartCache, id, cart);
            CartCookieHelper.CreateCartCookieForCustomer(id);

            return cart;
        }

        /// <summary>
        /// Gets a cart from the cache.
        /// </summary>
        /// <param name="customerId">the customer id</param>
        /// <returns>A Cart. Returns null if no cart is in the cache</returns>
        public static CommerceCart GetCart([NotNull]string customerId)
        {
            var cacheProvider = GetCacheProvider();

            //// our customerid isn't a GUID, it's the AX account number 
            var id = customerId; // Guid.Parse(customerId).ToString("D");

            var cart = cacheProvider.GetData<CommerceCart>(CommerceConstants.KnownCachePrefixes.Sitecore, CommerceConstants.KnownCacheNames.CommerceCartCache, id);

            if (cart == null)
            {
                var msg = string.Format(CultureInfo.InvariantCulture, "CartCacheHelper::GetCart - Cart for customerId {0} does not exist in the cache!", id);
                CommerceTrace.Current.Write(msg);
            }

            return cart;
        }

        /// <summary>
        /// Gets the cache provider
        /// </summary>
        /// <returns>the cahce provider</returns>
        private static ICacheProvider GetCacheProvider()
        {
            var cacheProvider = CommerceTypeLoader.GetCacheProvider(CommerceConstants.KnownCacheNames.CommerceCartCache);
            Assert.IsNotNull(cacheProvider, "Could not retrieve the cache provider '{0}'.", CommerceConstants.KnownCacheNames.CommerceCartCache);

            return cacheProvider;
        }
    }
}