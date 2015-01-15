//-----------------------------------------------------------------------
// <copyright file="CartLineJsonResult.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the CartLineJsonResult class.</summary>
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
    using Sitecore.Commerce.Services.Carts;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using Sitecore.Commerce.Storefront.Extensions;
    using Sitecore.Commerce.Connect.CommerceServer.Orders.Models;
    using Sitecore.Commerce.Storefront.Managers;
    using System.Globalization;

    /// <summary>
    /// Emits the Json result of a cart line request.
    /// </summary>
    public class CartLineJsonResult : BaseJsonResult
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CartLineJsonResult"/> class.
        /// </summary>
        /// <param name="line">The line.</param>
        public CartLineJsonResult(CustomCommerceCartLine line)
        {
            var product = (CommerceCartProduct)line.Product;
            var productItem = Sitecore.Commerce.Storefront.SitecorePipelines.ProductItemResolver.ResolveCatalogItem(product.ProductId, product.ProductCatalog, true);

            this.Image = line.Images[0].GetImageUrl(100, 100);
            this.DisplayName = product.DisplayName;
            this.Color = product.Properties["Color"] as string;
            this.LineDiscount = ((CommerceTotal)line.Total).LineItemDiscountAmount.ToString(Sitecore.Context.Language.CultureInfo);
            this.Quantity = line.Quantity.ToString(Sitecore.Context.Language.CultureInfo);
            this.LinePrice = product.Price.Amount.ToString(Sitecore.Context.Language.CultureInfo);
            this.LineTotal = line.Total.Amount.ToString(Sitecore.Context.Language.CultureInfo);
            this.ExternalCartLineId = line.ExternalCartLineId;
            this.ProductUrl = Sitecore.Links.LinkManager.GetDynamicUrl(productItem);
            this.DiscountOfferNames = line.Properties["OfferNames"] as string;
        }

        /// <summary>
        /// Gets or sets the image.
        /// </summary>
        /// <value>
        /// The image.
        /// </value>
        public string Image { get; set; }

        /// <summary>
        /// Gets or sets the display name.
        /// </summary>
        /// <value>
        /// The display name.
        /// </value>
        public string DisplayName { get; set; }

        /// <summary>
        /// Gets or sets the color.
        /// </summary>
        /// <value>
        /// The color.
        /// </value>
        public string Color { get; set; }

        /// <summary>
        /// Gets or sets the line discount.
        /// </summary>
        /// <value>
        /// The line discount.
        /// </value>
        public string LineDiscount { get; set; }

        /// <summary>
        /// Gets or sets the discount offer names.
        /// </summary>
        /// <value>
        /// The discount offer names.
        /// </value>
        public string DiscountOfferNames { get; set; }

        /// <summary>
        /// Gets or sets the quantity.
        /// </summary>
        /// <value>
        /// The quantity.
        /// </value>
        public string Quantity { get; set; }

        /// <summary>
        /// Gets or sets the line price.
        /// </summary>
        /// <value>
        /// The line price.
        /// </value>
        public string LinePrice { get; set; }

        /// <summary>
        /// Gets or sets the line total.
        /// </summary>
        /// <value>
        /// The line total.
        /// </value>
        public string LineTotal { get; set; }

        /// <summary>
        /// Gets or sets the external cart line identifier.
        /// </summary>
        /// <value>
        /// The external cart line identifier.
        /// </value>
        public string ExternalCartLineId { get; set; }

        /// <summary>
        /// Gets or sets the product URL.
        /// </summary>
        /// <value>
        /// The product URL.
        /// </value>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings")]
        public string ProductUrl { get; set; }
    }
}