//-----------------------------------------------------------------------
// <copyright file="MiniCartJsonResult.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Emits the Json result of a MiniCart update request.</summary>
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
    using Sitecore.Commerce.Connect.CommerceServer.Orders.Models;
    using Sitecore.Commerce.Services.Carts;
    using System.Globalization;

    /// <summary>
    /// Defines the MiniCartJsonResult class.
    /// </summary>
    public class MiniCartJsonResult
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MiniCartJsonResult"/> class.
        /// </summary>
        /// <param name="result">The result.</param>
        public MiniCartJsonResult(CartResult result)
        {
            this.LineItemCount = ((CommerceCart)result.Cart).LineItemCount;

            // TODO:  Uxse format provider in order to use the current user's locale.
            this.Total = ((CommerceTotal)result.Cart.Total).Subtotal.ToString("C", Sitecore.Context.Language.CultureInfo);
        }

        /// <summary>
        /// Gets or sets the line item count.
        /// </summary>
        /// <value>
        /// The line item count.
        /// </value>
        public int LineItemCount { get; set; }

        /// <summary>
        /// Gets or sets the total.
        /// </summary>
        /// <value>
        /// The total.
        /// </value>
        public string Total { get; set; }
    }
}