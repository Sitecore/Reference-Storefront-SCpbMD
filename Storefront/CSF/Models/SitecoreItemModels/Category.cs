//-----------------------------------------------------------------------
// <copyright file="Storefront.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the Category class.</summary>
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
    using DotNetOpenAuth.OpenId.Extensions.AttributeExchange;
    using Sitecore.Commerce.Connect.CommerceServer.Search.Models;
    using System.Collections.Generic;
    using Sitecore.Data.Items;

    /// <summary>
    /// Category class
    /// </summary>
    public class Category : SitecoreItemBase
    {

        private int _itemsPerPage;

        /// <summary>
        /// Initializes a new instance of the <see cref="CommercePromotion"/> class.
        /// </summary>
        /// <param name="item">The item.</param>
        public Category(Item item)
        {
            Item = item;
        }

        /// <summary>
        /// The Name of the Item
        /// </summary>
        public string Name
        {
            get { return Item.Name; }
        }

        /// <summary>
        /// Returns the DisplayName of the Item
        /// </summary>
        public string DisplayName { get { return Item.DisplayName;  } }

        /// <summary>
        /// The Title of the Create Wish List Page
        /// </summary>
        /// <returns></returns>
        public string Title()
        {
            return Item["Title"];
        }

        /// <summary>
        /// Label for the Wish List Name field
        /// </summary>
        /// <returns></returns>
        public string NameTitle()
        {
            return Item["Name Title"];
        }

        /// <summary>
        /// The Required Facets
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public List<CommerceQueryFacet> RequiredFacets { get; set; }

        /// <summary>
        /// The Sort Fields
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public List<CommerceQuerySort> SortFields { get; set; }

        /// <summary>
        /// Items per page
        /// </summary>
        public int ItemsPerPage
        {
            get
            {
                return (_itemsPerPage == 0) ? Constants.Settings.DefaultItemsPerPage : _itemsPerPage;
            }
            set { _itemsPerPage = value; }
        }
    }
}