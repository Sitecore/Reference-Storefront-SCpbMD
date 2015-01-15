//-----------------------------------------------------------------------
// <copyright file="OrdersJsonResult.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the OrdersJsonResult class.</summary>
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

namespace Sitecore.Commerce.Storefront.Models.JsonResults
{
    using Sitecore.Diagnostics;
    using System.Collections.Generic;
    using Sitecore.Commerce.Entities.Orders;

    /// <summary>
    /// Json result for orders operations.
    /// </summary>
    public class OrdersJsonResult : BaseJsonResult
    {
        private readonly List<OrderHeaderItemJsonResult> _orders = new List<OrderHeaderItemJsonResult>();

        /// <summary>
        /// Initializes a new instance of the <see cref="OrdersJsonResult" /> class.
        /// </summary>
        /// <param name="orderHeaders">The order headers.</param>
        public OrdersJsonResult(IEnumerable<OrderHeader> orderHeaders)
        {
            Assert.ArgumentNotNull(orderHeaders, "orderHeaders");

            foreach (var orderHeader in orderHeaders)
            {
                this._orders.Add(new OrderHeaderItemJsonResult(orderHeader));
            }
        }

        /// <summary>
        /// The orders.
        /// </summary>
        public List<OrderHeaderItemJsonResult> Orders 
        { 
            get 
            { 
                return this._orders; 
            } 
        }
    }
}