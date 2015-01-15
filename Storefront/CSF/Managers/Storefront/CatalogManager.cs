//-----------------------------------------------------------------------
// <copyright file="CategoryViewModel.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the CategoryViewModel class.</summary>
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

namespace Sitecore.Commerce.Storefront.Managers.Storefront
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Text;
    using Sitecore.Data.Fields;
    using Sitecore.Data.Items;
    using Sitecore.Diagnostics;
    using Sitecore.Mvc.Presentation;
    using Sitecore.Commerce.Connect.CommerceServer;
    using Sitecore.Commerce.Connect.CommerceServer.Catalog;
    using Sitecore.Commerce.Connect.CommerceServer.Search;
    using Sitecore.Commerce.Connect.CommerceServer.Search.Models;
    using Sitecore.Commerce.Storefront.Models;
    using Sitecore.Commerce.Storefront.Models.SitecoreItemModels;
    using Sitecore.Commerce.Storefront.Models.Storefront;
    using Sitecore.Commerce.Storefront.Services;

    /// <summary>
    /// CatalogManager class
    /// </summary>  
    public class CatalogManager : BaseManager
    {
        private Catalog _currentCatalog;
        
        /// <summary>
        /// Initializes a new instance of the <see cref="CatalogManager"/> class.
        /// </summary>
        /// <param name="catalogServiceProvider">The catalog service provider.</param>
        public CatalogManager([NotNull] CatalogServiceProvider catalogServiceProvider)
        {
            Assert.ArgumentNotNull(catalogServiceProvider, "catalogServiceProvider");
            this.CatalogServiceProvider = catalogServiceProvider;
        }

        /// <summary>
        /// Gets or sets the catalog service provider.
        /// </summary>
        public CatalogServiceProvider CatalogServiceProvider { get; protected set; }

        /// <summary>
        /// The current catalog being accessed
        /// </summary>
        public Catalog CurrentCatalog
        {
            get
            {
                if (_currentCatalog == null)
                {
                    _currentCatalog = StorefrontManager.CurrentStorefront.DefaultCatalog;
                    if (_currentCatalog == null)
                    {
                        //There was no catalog associated with the storefront or we are not using multi-storefront
                        //So we use the default catalog
                        _currentCatalog = new Catalog(Context.Database.GetItem(CommerceConstants.KnownItemIds.DefaultCatalog));
                    }
                }

                return _currentCatalog;
            }
        }

        /// <summary>
        /// Registers an event specifying that the category page has been visited.
        /// </summary>
        /// <param name="categoryName">The category name.</param>
        /// <param name="catalogName">The catalog name.</param>
        /// <returns>A <see cref="VisitedCategoryPageResult"/> specifying the result of the service request.</returns>
        public VisitedCategoryPageResult VisitedCategoryPage([NotNull] string categoryName, string catalogName)
        {
            // dha: todo: create page events.
            var request = new VisitedCategoryPageRequest(categoryName);
            request.CatalogName = catalogName;
            return this.CatalogServiceProvider.VisitedCategoryPage(request);
        }

        /// <summary>
        /// Registers an event specifying that the product details page has been visited.
        /// </summary>
        /// <param name="productId">the product id.</param>
        /// <param name="parentCategoryName">the parent category name.</param>
        /// <param name="catalogName">the catalog name.</param>
        /// <returns>A <see cref="VisitedProductDetailsPageResult"/> specifying the result of the service request.</returns>
        public VisitedProductDetailsPageResult VisitedProductDetailsPage([NotNull] string productId, string parentCategoryName, string catalogName)
        {
            var request = new VisitedProductDetailsPageRequest(productId);
            request.ParentCategoryName = parentCategoryName;
            request.CatalogName = catalogName;
            return this.CatalogServiceProvider.VisitedProductDetailsPage(request);
        }

        /// <summary>
        /// This method returns the ProductSearchResults for a datasource
        /// </summary>
        /// <param name="dataSource">The datasource to perform the search with</param>
        /// <param name="productSearchOptions">The search options.</param>
        /// <returns>A ProductSearchResults</returns>     
        public ProductSearchResults GetProductSearchResults(Item dataSource, CommerceSearchOptions productSearchOptions)
        {
            Assert.ArgumentNotNull(productSearchOptions, "productSearchOptions");

            if (dataSource != null)
            {
                int totalProductCount = 0;
                int totalPageCount = 0;
                string error = string.Empty;

                if (dataSource.TemplateName == "Commerce Named Search" || dataSource.TemplateName == "Named Search")
                {

                    var returnList = new List<Item>();
                    IEnumerable<CommerceQueryFacet> facets = null;
                    var searchOptions = new CommerceSearchOptions(10, 0);
                    var defaultBucketQuery = dataSource[CommerceConstants.KnownSitecoreFieldNames.DefaultBucketQuery];
                    var persistendBucketFilter = CleanLanguageFromFilter(dataSource[CommerceConstants.KnownSitecoreFieldNames.PersistentBucketFilter]);

                    try
                    {
                        var searchResponse = SearchNavigation.SearchCatalogItems(defaultBucketQuery,
                            persistendBucketFilter, searchOptions);

                        if (searchResponse != null)
                        {
                            returnList.AddRange(searchResponse.ResponseItems);

                            totalProductCount = searchResponse.TotalItemCount;
                            totalPageCount = searchResponse.TotalPageCount;
                            facets = searchResponse.Facets;
                        }
                    }
                    catch (Exception ex)
                    {
                        error = ex.Message;
                    }
                    return new ProductSearchResults(returnList, totalProductCount, totalPageCount, searchOptions.StartPageIndex, facets);
                }

                var childProducts = GetChildProducts(productSearchOptions, dataSource).Products;
                return new ProductSearchResults(childProducts, totalProductCount, totalPageCount, productSearchOptions.StartPageIndex, new List<CommerceQueryFacet>());
            }

            return null;
        }

        /// <summary>
        /// This method returns a list of ProductSearchResults for a datasource
        /// </summary>
        /// <param name="dataSource">The datasource to perform the searches with</param>
        /// <param name="productSearchOptions">The search options.</param>
        /// <returns>A list of ProductSearchResults</returns>       
        public MultipleProductSearchResults GetMultipleProductSearchResults(BaseItem dataSource, CommerceSearchOptions productSearchOptions)
        {
            Assert.ArgumentNotNull(productSearchOptions, "productSearchOptions");

            MultilistField searchesField = dataSource.Fields["Named Searches"];
            var searches = searchesField.GetItems();
            var productsSearchResults = new List<ProductSearchResults>();
            foreach (Item search in searches)
            {
                var productsSearchResult = GetProductSearchResults(search, productSearchOptions);
                if (productsSearchResult != null)
                {
                    productsSearchResult.DisplayName = search["title"];
                    productsSearchResults.Add(productsSearchResult);
                }
            }

            return new MultipleProductSearchResults(productsSearchResults);
        }

        /// <summary>
        /// This method returns the current category by URL
        /// </summary> 
        public Category GetCurrentCategoryByUrl()
        {
            Category currentCategory;

            var categoryId = CatalogUrlManager.ExtractItemIdFromCurrentUrl();

            string virtualCategoryCacheKey = string.Format(CultureInfo.InvariantCulture, "VirtualCategory_{0}", categoryId);

            if (CurrentSiteContext.Items.Contains(virtualCategoryCacheKey))
            {
                currentCategory = CurrentSiteContext.Items[virtualCategoryCacheKey] as Category;
            }
            else
            {
                currentCategory = GetCategory(categoryId);
                CurrentSiteContext.Items.Add(virtualCategoryCacheKey, currentCategory);
            }

            return currentCategory;
        }

        /// <summary>
        /// Get category by id
        /// </summary>
        public Category GetCategory(string categoryId) 
        {
            var categoryItem = SearchNavigation.GetCategory(categoryId, CurrentCatalog.Name);
            return GetCategory(categoryItem);
        }

        /// <summary>
        /// Get category by item
        /// </summary>
        public Category GetCategory(Item item)
        {
            var category = new Category(item)
            {
                RequiredFacets = CurrentSearchManager.GetFacetFieldsForItem(item).ToList(),
                SortFields = CurrentSearchManager.GetSortFieldsForItem(item).ToList(),
                ItemsPerPage = CurrentSearchManager.GetItemsPerPageForItem(item)
            };

            return category;
        }

        #region Protected helper methods

        /// <summary>
        /// This method returns child products for this category
        /// </summary>
        /// <param name="searchOptions">The options to perform the search with</param>
        /// <param name="categoryItem">The category item whose children to retrieve</param>
        /// <returns>A list of child products</returns>        
        protected ProductSearchResults GetChildProducts(CommerceSearchOptions searchOptions, Item categoryItem)
        {
            IEnumerable<CommerceQueryFacet> facets = null;
            var returnList = new List<Item>();
            var totalPageCount = 0;
            var totalProductCount = 0;

            if (RenderingContext.Current.Rendering.Item != null)
            {
                SearchResponse searchResponse = null;
                if (CatalogUtility.IsItemDerivedFromCommerceTemplate(categoryItem, CommerceConstants.KnownTemplateIds.CommerceDynamicCategoryTemplate) || categoryItem.TemplateName == "Commerce Named Search")
                {
                    try
                    {
                        var defaultBucketQuery = categoryItem[CommerceConstants.KnownSitecoreFieldNames.DefaultBucketQuery];
                        var persistendBucketFilter = categoryItem[CommerceConstants.KnownSitecoreFieldNames.PersistentBucketFilter];
                        persistendBucketFilter = CleanLanguageFromFilter(persistendBucketFilter);
                        searchResponse = SearchNavigation.SearchCatalogItems(defaultBucketQuery, persistendBucketFilter, searchOptions);
                    }
                    catch (Exception ex)
                    {
                        // TODO log exception
                        // For now it just keeps the searchResponse to null
                        Helpers.LogException(ex, this);
                    }
                }
                else
                {
                    searchResponse = SearchNavigation.GetCategoryProducts(categoryItem.ID, searchOptions);
                }

                if (searchResponse != null)
                {
                    returnList.AddRange(searchResponse.ResponseItems);

                    totalProductCount = searchResponse.TotalItemCount;
                    totalPageCount = searchResponse.TotalPageCount;
                    facets = searchResponse.Facets;
                }
            }

            var results = new ProductSearchResults(returnList, totalProductCount, totalPageCount, searchOptions.StartPageIndex, facets);
            return results;
        }

        /// <summary>
        /// Cleans the language from filter.
        /// </summary>
        /// <param name="filter">The filter.</param>
        /// <returns>The updated filter.</returns>
        protected string CleanLanguageFromFilter(string filter)
        {
            if (filter.IndexOf("language:", StringComparison.OrdinalIgnoreCase) < 0)
            {
                return filter;
            }

            var newFilter = new StringBuilder();

            var statementList = filter.Split(';');
            foreach (var statement in statementList)
            {
                if (statement.IndexOf("language", StringComparison.OrdinalIgnoreCase) >= 0)
                {
                    continue;
                }

                if (newFilter.Length > 0)
                {
                    newFilter.Append(';');
                }

                newFilter.Append(statement);
            }

            return newFilter.ToString();
        }

        #endregion
    }
}