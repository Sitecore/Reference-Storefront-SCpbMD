//-----------------------------------------------------------------------
// <copyright file="ProductItem.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
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
    using Sitecore.Data.Items;

    /// <summary>
    /// Used to represent a product item
    /// </summary>
    public class ProductItem : IImageEntity
    {       
        /// <summary>
        /// Initializes a new instance of the <see cref="ProductItem" /> class
        /// </summary>
        /// <param name="sitecoreItem">The sitecore item to initialize the product item with</param>
        public ProductItem(Item sitecoreItem)
        {
            _item = sitecoreItem;
        }

        /// <summary>
        /// Gets the item the product is based on
        /// </summary>
        public Item Item
        {
            get { return _item; }
        }

        /// <summary>
        /// Gets or sets the Product ImageFileName.
        /// </summary>
        public string ImageFilename
        {
            get
            {
                return Item["Image_filename"];
            }

            set
            {
                Item["Image_filename"] = value;
            }
        }

        private Item _item { get; set; }
    }
}