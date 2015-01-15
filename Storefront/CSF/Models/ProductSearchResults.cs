//-----------------------------------------------------------------------
// <copyright file="ProductSearchResults.cs" company="Sitecore Corporation">
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
    using System.Collections.Generic;
    using Sitecore.Commerce.Connect.CommerceServer.Search.Models;
    
    /// <summary>
    /// Used to represent a product search result item
    /// </summary>
    public class ProductSearchResults : Sitecore.Mvc.Presentation.RenderingModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ProductSearchResults" /> class
        /// </summary>
        /// <param name="products">The products to init the item with</param>
        /// <param name="totalProductCount">The total number of products</param>
        /// <param name="totalPageCount">The total number of pages</param>
        /// <param name="currentPageNumber">The current page number</param>
        /// <param name="facets">The facets for the collection of products</param>
        public ProductSearchResults(List<Item> products, int totalProductCount, int totalPageCount, int currentPageNumber, IEnumerable<CommerceQueryFacet> facets)
        {
            Products = products;
            TotalPageCount = totalPageCount;
            TotalProductCount = totalProductCount;
            Facets = facets;
            CurrentPageNumber = currentPageNumber;
        }

        /// <summary>
        /// The Displayname to show
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// Gets the product items for the results
        /// </summary>
        public List<Item> Products { get; private set; }

        /// <summary>
        /// Gets the total product count
        /// </summary>
        public int TotalProductCount { get; private set; }

        /// <summary>
        /// Gets the total page count
        /// </summary>
        public int TotalPageCount { get; private set; }

        /// <summary>
        /// Gets the collection of facets for the collection of products
        /// </summary>
        public IEnumerable<CommerceQueryFacet> Facets { get; private set; }

        /// <summary>
        /// Gets the current page number
        /// </summary>
        public int CurrentPageNumber { get; private set; }
    }
}