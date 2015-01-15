//-----------------------------------------------------------------------
// <copyright file="SearchController.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the SearchController class.</summary>
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

namespace Sitecore.Commerce.Storefront.Controllers
{
    using Sitecore.Commerce.Connect.CommerceServer;
    using Sitecore.Commerce.Connect.CommerceServer.Search;
    using Sitecore.Commerce.Connect.CommerceServer.Search.Models;
    using Sitecore.Commerce.Contacts;
    using Sitecore.Commerce.Storefront.Managers;
    using Sitecore.Commerce.Storefront.Managers.Storefront;
    using Sitecore.Commerce.Storefront.Models;
    using Sitecore.Commerce.Storefront.Models.SitecoreItemModels;
    using Sitecore.Commerce.Storefront.Models.Storefront;
    using Sitecore.Data.Items;
    using Sitecore.Diagnostics;
    using Sitecore.Mvc.Presentation;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;

    /// <summary>
    /// Manages all search related requests
    /// </summary>
    public class SearchController : BaseController
    {
        #region Variables

        private const string CurrentCategoryViewModelKeyName = "CurrentCategoryViewModel";
        private const string DynamicProductPrices = "DynamicProductPrices";

        #endregion

        #region Properties

        /// <summary>
        /// Initializes a new instance of the <see cref="SearchController"/> class.
        /// </summary>
        /// <param name="pricingManager">The pricing service.</param>
        /// <param name="contactFactory">The contact factory.</param>
        public SearchController([NotNull] PricingManager pricingManager, [NotNull] ContactFactory contactFactory)
            : base(contactFactory)
        {
            this.PricingManager = pricingManager;            
        }

        /// <summary>
        /// Gets or sets the pricing manager.
        /// </summary>
        /// <value>
        /// The pricing manager.
        /// </value>
        public PricingManager PricingManager { get; protected set; }

        #endregion

        /// <summary>
        /// The action for rendering the search bar.
        /// </summary>
        /// <param name="searchKeyword">The search keyword.</param>
        /// <returns>The action for rendering the search bar.</returns>
        public ActionResult SearchBar(
            [Bind(Prefix = Constants.QueryStrings.SearchKeyword)] string searchKeyword)
        {
            var model = new SearchBarModel { SearchKeyword = searchKeyword };
            return this.View(this.CurrentRenderingView, model);
        }

        /// <summary>
        /// The action for rendering the search results facets view
        /// </summary>
        public ActionResult SearchResultsFacets(
            [Bind(Prefix = Constants.QueryStrings.SearchKeyword)] string searchKeyword,
            [Bind(Prefix = Constants.QueryStrings.Paging)] int? pageNumber,
            [Bind(Prefix = Constants.QueryStrings.Facets)] string facetValues,
            [Bind(Prefix = Constants.QueryStrings.Sort)] string sortField,
            [Bind(Prefix = Constants.QueryStrings.PageSize)] int? pageSize,
            [Bind(Prefix = Constants.QueryStrings.SortDirection)] CommerceConstants.SortDirection? sortDirection)
        {
            if (Sitecore.Context.PageMode.IsPreview)
            {
                return View();
            }

            var searchInfo = this.GetSearchInfo(searchKeyword, pageNumber, facetValues, sortField, pageSize, sortDirection);
            var viewModel = this.GetProductFacetsViewModel(searchInfo.SearchOptions, searchKeyword, searchInfo.Catalog.Name, this.CurrentRendering);
            return this.View(this.GetAbsoluteRenderingView("/Catalog/ProductFacets"), viewModel);
        }

        /// <summary>
        /// The action for rendering the search results list header view
        /// </summary>
        public ActionResult SearchResultsListHeader(
            [Bind(Prefix = Constants.QueryStrings.SearchKeyword)] string searchKeyword,
            [Bind(Prefix = Constants.QueryStrings.Paging)] int? pageNumber,
            [Bind(Prefix = Constants.QueryStrings.Facets)] string facetValues,
            [Bind(Prefix = Constants.QueryStrings.Sort)] string sortField,
            [Bind(Prefix = Constants.QueryStrings.PageSize)] int? pageSize,
            [Bind(Prefix = Constants.QueryStrings.SortDirection)] CommerceConstants.SortDirection? sortDirection)
        {
            if (Sitecore.Context.PageMode.IsPreview)
            {
                return View();
            }

            var searchInfo = this.GetSearchInfo(searchKeyword, pageNumber, facetValues, sortField, pageSize, sortDirection);
            var viewModel = this.GetProductListHeaderViewModel(searchInfo.SearchOptions, searchInfo.SortFields, searchInfo.SearchKeyword, searchInfo.Catalog.Name, this.CurrentRendering);
            return this.View(this.GetAbsoluteRenderingView("/Catalog/ProductListHeader"), viewModel);
        }

        /// <summary>
        /// An action to manage data for the search results list
        /// </summary>
        /// <returns>The view that represents the search results list</returns>
        public ActionResult SearchResultsList(
            [Bind(Prefix = Constants.QueryStrings.SearchKeyword)] string searchKeyword,
            [Bind(Prefix = Constants.QueryStrings.Paging)] int? pageNumber,
            [Bind(Prefix = Constants.QueryStrings.Facets)] string facetValues,
            [Bind(Prefix = Constants.QueryStrings.Sort)] string sortField,
            [Bind(Prefix = Constants.QueryStrings.PageSize)] int? pageSize,
            [Bind(Prefix = Constants.QueryStrings.SortDirection)] CommerceConstants.SortDirection? sortDirection)
        {
            if (Sitecore.Context.PageMode.IsPreview)
            {
                return View();
            }

            var searchInfo = this.GetSearchInfo(searchKeyword, pageNumber, facetValues, sortField, pageSize, sortDirection);
            var viewModel = GetCategoryViewModel(searchInfo.SearchOptions, searchInfo.SortFields, searchInfo.SearchKeyword, searchInfo.Catalog.Name, this.CurrentRendering);
            return this.View(this.GetAbsoluteRenderingView("/Catalog/ProductList"), viewModel);
        }

        /// <summary>
        /// The action for rendering the pagination view
        /// </summary>
        public ActionResult SearchResultsPagination(
            [Bind(Prefix = Constants.QueryStrings.SearchKeyword)] string searchKeyword,
            [Bind(Prefix = Constants.QueryStrings.Paging)] int? pageNumber,
            [Bind(Prefix = Constants.QueryStrings.Facets)] string facetValues,
            [Bind(Prefix = Constants.QueryStrings.Sort)] string sortField,
            [Bind(Prefix = Constants.QueryStrings.PageSize)] int? pageSize,
            [Bind(Prefix = Constants.QueryStrings.SortDirection)] CommerceConstants.SortDirection? sortDirection)
        {
            if (Sitecore.Context.PageMode.IsPreview)
            {
                return View();
            }

            var searchInfo = this.GetSearchInfo(searchKeyword, pageNumber, facetValues, sortField, pageSize, sortDirection);
            var viewModel = this.GetPaginationViewModel(searchInfo.SearchOptions, searchInfo.SearchKeyword, searchInfo.Catalog.Name, this.CurrentRendering);
            return this.View(this.GetRenderingView("Pagination"), viewModel);
        }

        /// <summary>
        /// Builds a product list header view model
        /// </summary>
        protected virtual ProductListHeaderViewModel GetProductListHeaderViewModel(CommerceSearchOptions productSearchOptions, IEnumerable<CommerceQuerySort> sortFields, string searchKeyword, string catalogName, Rendering rendering)
        {
            var viewModel = new ProductListHeaderViewModel();

            ProductSearchResults childProducts = null;
            if (productSearchOptions != null)
            {
                childProducts = this.GetChildProducts(productSearchOptions, searchKeyword, catalogName);
            }

            viewModel.Initialize(rendering, childProducts, sortFields, productSearchOptions);

            return viewModel;
        }

        /// <summary>
        /// Builds a product facets view model
        /// </summary>
        protected virtual ProductFacetsViewModel GetProductFacetsViewModel(CommerceSearchOptions productSearchOptions, string searchKeyword, string catalogName, Rendering rendering)
        {
            var viewModel = new ProductFacetsViewModel();

            ProductSearchResults childProducts = null;
            if (productSearchOptions != null)
            {
                childProducts = this.GetChildProducts(productSearchOptions, searchKeyword, catalogName);
            }

            viewModel.Initialize(rendering, childProducts, productSearchOptions);

            return viewModel;
        }

        /// <summary>
        /// Builds a pagination view model
        /// </summary>
        protected virtual PaginationViewModel GetPaginationViewModel(CommerceSearchOptions productSearchOptions, string searchKeyword, string catalogName, Rendering rendering)
        {
            var viewModel = new PaginationViewModel();

            ProductSearchResults childProducts = null;
            if (productSearchOptions != null)
            {
                childProducts = this.GetChildProducts(productSearchOptions, searchKeyword, catalogName);
            }

            viewModel.Initialize(rendering, childProducts, productSearchOptions);

            return viewModel;
        }

        /// <summary>
        /// Builds a category view model or retrieves it if it already exists
        /// </summary>
        /// <param name="productSearchOptions">The product options class for finding child products</param>
        /// <param name="sortFields">The fields to sort he results on</param>
        /// <param name="searchKeyword">The keyword to search for</param>
        /// <param name="catalogName">The name of the catalog to search against</param>
        /// <param name="rendering">The rendering to initialize the model with</param>
        /// <returns>A category view model</returns>
        protected virtual CategoryViewModel GetCategoryViewModel(CommerceSearchOptions productSearchOptions, IEnumerable<CommerceQuerySort> sortFields, string searchKeyword, string catalogName, Rendering rendering)
        {
            var siteContext = CommerceTypeLoader.CreateInstance<ISiteContext>();
            if (siteContext.Items[CurrentCategoryViewModelKeyName] == null)
            {
                var categoryViewModel = new CategoryViewModel();

                var childProducts = GetChildProducts(productSearchOptions, searchKeyword, catalogName);

                categoryViewModel.Initialize(rendering, childProducts, sortFields, productSearchOptions);
                if (childProducts != null && childProducts.Products.Count > 0)
                {
                    var productIds = childProducts.Products.Select(product => product.Name).ToArray();
                    siteContext.Items[DynamicProductPrices] = this.PricingManager.GetProductBulkPrices(StorefrontManager.CurrentStorefront, productIds).Result;
                }                

                siteContext.Items[CurrentCategoryViewModelKeyName] = categoryViewModel;
            }

            var viewModel = (CategoryViewModel)siteContext.Items[CurrentCategoryViewModelKeyName];

            return viewModel;
        }

        /// <summary>
        /// This method returns child products for this category
        /// </summary>
        /// <param name="searchOptions">The options to perform the search with</param>
        /// <param name="searchKeyword">The keyword to search for</param>
        /// <param name="catalogName">The name of the catalog to search against</param>
        /// <returns>A list of child products</returns>        
        protected ProductSearchResults GetChildProducts(CommerceSearchOptions searchOptions, string searchKeyword, string catalogName)
        {
            Assert.ArgumentNotNull(searchKeyword, "searchOptions");
            Assert.ArgumentNotNull(searchKeyword,"searchKeyword");
            Assert.ArgumentNotNull(searchKeyword, "catalogName");

            var returnList = new List<Item>();
            var totalPageCount = 0;
            var totalProductCount = 0;
            IEnumerable<CommerceQueryFacet> facets = Enumerable.Empty<CommerceQueryFacet>();

            if (Item != null && !string.IsNullOrEmpty(searchKeyword.Trim()))
            {
                SearchResponse searchResponse = null;
                searchResponse = SearchNavigation.SearchCatalogItemsByKeyword(searchKeyword, catalogName, searchOptions);

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
        /// Takes a collection of a facets and a querystring of facet values and adds the values to the collection
        /// </summary>
        /// <param name="facets">The facet collection</param>
        /// <param name="valueQueryString">The values to add to the collection in querystring format</param>
        /// <param name="productSearchOptions">The options to update with facets</param>
        protected void UpdateOptionsWithFacets(IEnumerable<CommerceQueryFacet> facets, string valueQueryString, CommerceSearchOptions productSearchOptions)
        {
            if (facets != null && facets.Any())
            {
                if (!string.IsNullOrEmpty(valueQueryString))
                {
                    var facetValuesCombos = valueQueryString.Split(new char[] { '&' });

                    foreach (var facetValuesCombo in facetValuesCombos)
                    {
                        var facetValues = facetValuesCombo.Split(new char[] { '=' });

                        var name = facetValues[0];

                        var existingFacet = facets.FirstOrDefault(item => item.Name.Equals(name, System.StringComparison.OrdinalIgnoreCase));

                        if (existingFacet != null)
                        {
                            var values = facetValues[1].Split(new char[] { Constants.QueryStrings.FacetsSeparator });

                            foreach (var value in values)
                            {
                                existingFacet.Values.Add(value);
                            }
                        }
                    }
                }

                productSearchOptions.FacetFields = facets;
            }
        }

        /// <summary>
        /// Adds and required sorting to the options class
        /// </summary>
        /// <param name="sortField">The field to sort on</param>
        /// <param name="sortDirection">The direction to perform the sorting</param>
        /// <param name="productSearchOptions">The options class to add the sorting to.</param>
        protected void UpdateOptionsWithSorting(string sortField, CommerceConstants.SortDirection? sortDirection, CommerceSearchOptions productSearchOptions)
        {
            if (!string.IsNullOrEmpty(sortField))
            {
                productSearchOptions.SortField = sortField;

                if (sortDirection.HasValue)
                {
                    productSearchOptions.SortDirection = sortDirection.Value;
                }

                ViewBag.SortField = sortField;
                ViewBag.SortDirection = sortDirection;
            }
        }

        private SearchInfo GetSearchInfo(string searchKeyword, int? pageNumber, string facetValues, string sortField, int? pageSize, CommerceConstants.SortDirection? sortDirection)
        {
            var searchManager = CommerceTypeLoader.CreateInstance<ICommerceSearchManager>();
            var searchInfo = new SearchInfo();
            searchInfo.SearchKeyword = searchKeyword ?? string.Empty;
            searchInfo.RequiredFacets = searchManager.GetFacetFieldsForItem(this.Item);
            searchInfo.SortFields = searchManager.GetSortFieldsForItem(this.Item);
            searchInfo.Catalog = StorefrontManager.CurrentStorefront.DefaultCatalog;
            searchInfo.ItemsPerPage = pageSize ?? searchManager.GetItemsPerPageForItem(this.Item);
            if (searchInfo.ItemsPerPage == 0)
            {
                searchInfo.ItemsPerPage = Constants.Settings.DefaultItemsPerPage;
            }

            var productSearchOptions = new CommerceSearchOptions(searchInfo.ItemsPerPage, pageNumber.GetValueOrDefault(0));
            this.UpdateOptionsWithFacets(searchInfo.RequiredFacets, facetValues, productSearchOptions);
            this.UpdateOptionsWithSorting(sortField, sortDirection, productSearchOptions);
            searchInfo.SearchOptions = productSearchOptions;

            return searchInfo;
        }

        private class SearchInfo
        {
            public string SearchKeyword { get; set; }
            public IEnumerable<CommerceQueryFacet> RequiredFacets { get; set; }
            public IEnumerable<CommerceQuerySort> SortFields { get; set; }
            public int ItemsPerPage { get; set; }
            public Catalog Catalog { get; set; }
            public CommerceSearchOptions SearchOptions { get; set; }
        }
    }
}