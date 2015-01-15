// <copyright file="Constants.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>QueryStringCollection helper class</summary>
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

namespace Sitecore.Commerce.Storefront
{
    /// <summary>
    /// Used to store common strings used in the site
    /// </summary>
    public static class Constants
    {
        /// <summary>
        /// Used to store strings using in query strings
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1034:NestedTypesShouldNotBeVisible", Justification = "Required for access purposes")]
        public static class QueryStrings
        {
            /// <summary>
            /// Used for paging
            /// </summary>
            public const string Paging = "pg";

            /// <summary>
            /// Used for the sorting field
            /// </summary>
            public const string Sort = "s";

            /// <summary>
            /// Used for the sorting field direction
            /// </summary>
            public const string SortDirection = "sd";

            /// <summary>
            /// Used for facets
            /// </summary>
            public const string Facets = "f";

            /// <summary>
            /// Used for separating facets
            /// </summary>
            public const char FacetsSeparator = '|';

            /// <summary>
            /// Used for the search keyword
            /// </summary>
            public const string SearchKeyword = "q";

            /// <summary>
            /// Used for page size
            /// </summary>
            public const string PageSize = "ps";
        }

        /// <summary>
        /// Used to hold some of the default settings for the site
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1034:NestedTypesShouldNotBeVisible", Justification = "Required for access purposes")]
        public static class Settings
        {
            /// <summary>
            /// The default number of items per page
            /// </summary>
            public const int DefaultItemsPerPage = 12;
        }

        /// <summary>
        /// Used to hold some of the default settings for the site
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1034:NestedTypesShouldNotBeVisible", Justification = "Required for access purposes")]
        public static class CartConstants
        {
            /// <summary>
            /// Name of the Billing address
            /// </summary>
            public const string BillingAddressName = "Billing";

            /// <summary>
            /// Name of the shipping address
            /// </summary>
            public const string ShippingAddressName = "Shipping";
        }

        /// <summary>
        /// Contains constants that represent page event data names.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1034:NestedTypesShouldNotBeVisible", Justification = "Required for access purposes")]
        public static class PageEventDataNames
        {
            /// <summary>
            /// The name of the ProductId page event data.
            /// </summary>
            public const string ProductId = "ProductId";

            /// <summary>
            /// The name of the ParentCategoryName page event data.
            /// </summary>
            public const string ParentCategoryName = "ParentCategoryName";

            /// <summary>
            /// The name of the CatalogName page event data.
            /// </summary>
            public const string CatalogName = "CatalogName";

            /// <summary>
            /// The name of the CategoryName page event data.
            /// </summary>
            public const string CategoryName = "CategoryName";
        }

        /// <summary>
        /// Contains constants that represent Sitecore pipeline names.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1034:NestedTypesShouldNotBeVisible", Justification = "Required for access purposes")]
        public static class PipelineNames
        {
            private const string Prefix = "commerce.storefront.";

            /// <summary>
            /// The name of the VisitedProductDetailsPage pipeline.
            /// </summary>
            public const string VisitedProductDetailsPage = Prefix + "visitedProductDetailsPage";

            /// <summary>
            /// The name of the VisitedCategoryPage pipeline.
            /// </summary>
            public const string VisitedCategoryPage = Prefix + "visitedCategoryPage";
        }
    }
}