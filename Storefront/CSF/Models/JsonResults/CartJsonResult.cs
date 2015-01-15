//-----------------------------------------------------------------------
// <copyright file="CartJsonResult.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the CartJsonResult class.</summary>
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
    using Sitecore.Commerce.Entities.Carts;
    using Sitecore.Commerce.Services;
    using Sitecore.Commerce.Services.Carts;
    using Sitecore.Diagnostics;
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Web;

    /// <summary>
    /// Emits the Json result of a Cart request.
    /// </summary>
    public class CartJsonResult : BaseJsonResult
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CartJsonResult"/> class.
        /// </summary>
        public CartJsonResult()
            : base()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CartJsonResult"/> class.
        /// </summary>
        /// <param name="result">The result.</param>
        public CartJsonResult(ServiceProviderResult result)
            : base(result)
        {
        }

        /// <summary>
        /// Initializes this object based on the data contained in the provided cart.
        /// </summary>
        /// <param name="cart">The cart used to initialize this object.</param>
        public virtual void Initialize(Sitecore.Commerce.Entities.Carts.Cart cart)
        {
            this.Lines = new List<CartLineJsonResult>();
            this.Adjustments = new List<CartAdjustmentJsonResult>();

            if (cart != null)
            {
                foreach (var line in (cart.Lines ?? Enumerable.Empty<CartLine>()))
                {
                    this.Lines.Add(new CartLineJsonResult((CustomCommerceCartLine)line));
                }

                foreach (var adjustment in (cart.Adjustments ?? Enumerable.Empty<CartAdjustment>()))
                {
                    this.Adjustments.Add(new CartAdjustmentJsonResult(adjustment));
                }

                var commerceTotal = (CommerceTotal)cart.Total;
                this.Subtotal = commerceTotal.Subtotal.ToString("C", Sitecore.Context.Language.CultureInfo);
                this.TaxTotal = cart.Total.TaxTotal.Amount.ToString("C", Sitecore.Context.Language.CultureInfo);
                this.Total = cart.Total.Amount.ToString("C", Sitecore.Context.Language.CultureInfo);
                this.Discount = commerceTotal.OrderLevelDiscountAmount.ToString("C", Sitecore.Context.Language.CultureInfo);
                this.ShippingTotal = commerceTotal.ShippingTotal.ToString("C", Sitecore.Context.Language.CultureInfo);
            }
        }

        /// <summary>
        /// Gets or sets a value indicating whether the request is in preview mode.
        /// </summary>
        public bool IsPreview { get; set; }

        /// <summary>
        /// Gets or sets the lines.
        /// </summary>
        /// <value>
        /// The lines.
        /// </value>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly", Justification = "This is the desired behavior.")]
        public List<CartLineJsonResult> Lines { get; set; }

        /// <summary>
        /// Gets or sets the list of cart adjustments.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly", Justification = "This is the desired behavior.")]
        public List<CartAdjustmentJsonResult> Adjustments { get; set; }

        /// <summary>
        /// Gets or sets the sub total.
        /// </summary>
        /// <value>
        /// The sub total.
        /// </value>
        public string Subtotal { get; set; }

        /// <summary>
        /// Gets or sets the tax total.
        /// </summary>
        /// <value>
        /// The tax total.
        /// </value>
        public string TaxTotal { get; set; }

        /// <summary>
        /// Gets or sets the total.
        /// </summary>
        /// <value>
        /// The total.
        /// </value>
        public string Total { get; set; }

        /// <summary>
        /// Gets or sets the discount.
        /// </summary>
        /// <value>
        /// The discount.
        /// </value>
        public string Discount { get; set; }

        /// <summary>
        /// Gets or sets the shipping total.
        /// </summary>
        public string ShippingTotal { get; set; }
    }
}