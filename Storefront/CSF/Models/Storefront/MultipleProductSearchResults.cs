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

namespace Sitecore.Commerce.Storefront.Models.Storefront
{

    using System.Collections.Generic;

    /// <summary>
    /// Used to represent a product search result item
    /// </summary>
    public class MultipleProductSearchResults : Sitecore.Mvc.Presentation.RenderingModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ProductSearchResults" /> class
        /// </summary>
        /// <param name="productSearchResults">The productSearchResults to init the item with</param>
        public MultipleProductSearchResults(List<ProductSearchResults> productSearchResults)
        {
            ProductSearchResults = productSearchResults;
        }

        /// <summary>
        /// The Displayname to show
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// Gets the ProductSearchResults items for the results
        /// </summary>
        public List<ProductSearchResults> ProductSearchResults { get; private set; }
    }
}