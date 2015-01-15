//-----------------------------------------------------------------------
// <copyright file="CustomCommerceCartLine.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the CustomCommerceCartLine class.</summary>
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

namespace Sitecore.Commerce.Storefront.Models
{
    using System;
    using System.Collections.Generic;

    using Newtonsoft.Json;

    using Sitecore.Data.Items;

    using Sitecore.Commerce.Connect.CommerceServer.Orders.Models;
    
    

    /// <summary>
    /// A extension of the default cart line to allow for additional properties
    /// </summary>
    public class CustomCommerceCartLine : CommerceCartLine
    {
        private List<MediaItem> _images;

        /// <summary>
        /// Initializes a new instance of the <see cref="CustomCommerceCartLine"/> class.
        /// </summary>
        public CustomCommerceCartLine()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CustomCommerceCartLine"/> class.
        /// </summary>
        /// <param name="productCatalog">The product catalog.</param>
        /// <param name="productId">The product identifier.</param>
        /// <param name="variantId">The variant identifier.</param>
        /// <param name="quantity">The quantity.</param>
        public CustomCommerceCartLine(string productCatalog, string productId, string variantId, uint quantity)
            : base(productCatalog, productId, variantId, quantity)
        {
        }

        /// <summary>
        /// Gets the description as a html string
        /// </summary>
        [JsonIgnore]
        public List<MediaItem> Images
        {
            get
            {
                if (_images != null)
                {
                    return _images;
                }

                _images = new List<MediaItem>();

                var field = Properties["_product_Images"] as string;

                if (field != null)
                {
                    var imageIds = field.Split(new char[] { '|' }, StringSplitOptions.RemoveEmptyEntries);

                    foreach (var id in imageIds)
                    {
                        MediaItem mediaItem = Context.Database.GetItem(id);
                        _images.Add(mediaItem);
                    }
                }

                return _images;
            }
        }
    }
}