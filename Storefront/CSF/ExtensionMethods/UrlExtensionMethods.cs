//-----------------------------------------------------------------------
// <copyright file="UrlExtensionMethods.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the ProfileExtensions class.</summary>
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

namespace Sitecore.Commerce.Storefront.Extensions
{
    using Sitecore.ContentSearch.Linq;
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;

    /// <summary>
    /// Extension methods for the MVC UrlHelper class
    /// </summary>
    public static class UrlExtensionMethods
    {
        /// <summary>
        /// Creates a url for a facet
        /// </summary>
        /// <param name="helper">The helper class we are extending from</param>
        /// <param name="facetName">The name of the facet</param>
        /// <param name="facetValue">The value of the facet</param>
        /// <returns>The new facet url</returns>
        public static string AddToFacets(this UrlHelper helper, string facetName, string facetValue)
        {
            var currentUrl = UrlBuilder.CurrentUrl;
            var facetQuery = currentUrl.QueryList[Constants.QueryStrings.Facets];
            var facetQueryString = GetFacetQueryString(facetQuery, facetName, facetValue);

            if (!string.IsNullOrEmpty(facetQueryString))
                currentUrl.QueryList.AddOrSet(Constants.QueryStrings.Facets, HttpUtility.UrlDecode(facetQueryString).Remove(0, 1));
            else
                currentUrl.QueryList.Remove(Constants.QueryStrings.Facets);
            
            currentUrl.QueryList.Remove(Constants.QueryStrings.Paging);

            return currentUrl.ToString(true);
        }

        /// <summary>
        /// Creates an query string for a facet
        /// </summary>
        private static string GetFacetQueryString(string facetQuery, string facetName, string facetValue)
        {
            var facetCollection = new QueryStringCollection();

            if (!string.IsNullOrEmpty(facetQuery))
                facetCollection.Parse(HttpUtility.UrlDecode(facetQuery));

            if (facetCollection.Contains(facetName))
            {
                var facetQueryValues = facetCollection[facetName];

                if (facetQueryValues.Contains(facetValue))
                {
                    var newFacetQueryValues = string.Empty;
                    var facetValues = facetQueryValues.Split('|').Where(p => !string.Equals(p, facetValue, StringComparison.OrdinalIgnoreCase)).ToList();

                    if (facetValues.Count() > 0)
                        facetCollection.Set(facetName, string.Join("|", facetValues));
                    else
                        facetCollection.Remove(facetName);
                }
                else
                    facetCollection.Set(facetName, facetQueryValues + Constants.QueryStrings.FacetsSeparator + facetValue);
            }
            else
                facetCollection.Add(facetName, facetValue);

            return facetCollection.ToString();
        }

        /// <summary>
        /// Creates a url for a facet
        /// </summary>
        /// <param name="helper">The helper class we are extending from</param>
        /// <param name="page">The number of the new page to point to</param>
        /// <returns>The new facet url</returns>
        public static string AddPageNumber(this UrlHelper helper, int page)
        {
            var current = UrlBuilder.CurrentUrl;
            current.QueryList.AddOrSet(Constants.QueryStrings.Paging, page.ToString(CultureInfo.InvariantCulture));

            CleanNestedCollections(current);

            var url = current.ToString(true);

            return url;
        }

        private static void CleanNestedCollections(UrlBuilder current)
        {
            var facetQuery = current.QueryList[Constants.QueryStrings.Facets];

            if (facetQuery != null)
            {
                var decodedFacets = HttpUtility.UrlDecode(facetQuery);
                current.QueryList.AddOrSet(Constants.QueryStrings.Facets, decodedFacets);
            }
        }
    }
}