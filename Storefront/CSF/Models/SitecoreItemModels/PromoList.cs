//-----------------------------------------------------------------------
// <copyright file="PromoList.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the PromoList class.</summary>
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

namespace Sitecore.Commerce.Storefront.Models.SitecoreItemModels
{
    using System.Collections.Generic;
    using Sitecore.Data.Items;

    /// <summary>
    /// PromoList class
    /// </summary>
    public class PromoList : SitecoreItemBase
    {

        /// <summary>
        /// The promotions
        /// </summary>
        public List<CommercePromotion> Promotions = new List<CommercePromotion>();

        /// <summary>
        /// Initializes a new instance of the <see cref="PromoList"/> class.
        /// </summary>
        public PromoList()
        {
            //New instance.  _item will be null for non persisted instance
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="PromoList"/> class.
        /// </summary>
        /// <param name="item">The item.</param>
        public PromoList(Item item)
        {
            Item = item;
        }

        /// <summary>
        /// Gets the width.
        /// </summary>
        /// <value>
        /// The width.
        /// </value>
        public string Width
        {
            get { return GetFieldWithDefault("Width", "0"); }
        }

        /// <summary>
        /// Gets the height.
        /// </summary>
        /// <value>
        /// The height.
        /// </value>
        public string Height
        {
            get { return GetFieldWithDefault("Height", "0"); }
        }

        /// <summary>
        /// Gets the width of the item.
        /// </summary>
        /// <value>
        /// The width of the item.
        /// </value>
        public string ItemWidth
        {
            get { return GetFieldWithDefault("Item Width", "0"); }
        }

        /// <summary>
        /// Gets the height of the item.
        /// </summary>
        /// <value>
        /// The height of the item.
        /// </value>
        public string ItemHeight
        {
            get { return GetFieldWithDefault("Item Height", "0"); }
        }

        /// <summary>
        /// Gets the header text.
        /// </summary>
        /// <value>
        /// The header text.
        /// </value>
        public string HeaderText
        {
            get { return GetFieldWithDefault("Header Text", ""); }
        }

        /// <summary>
        /// Gets the footer text.
        /// </summary>
        /// <value>
        /// The footer text.
        /// </value>
        public string FooterText
        {
            get { return GetFieldWithDefault("Footer Text", ""); }
        }
    }
}