//-----------------------------------------------------------------------
// <copyright file="CatalogController.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the CheckoutController class.</summary>
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
    using Models;
    using Sitecore.Commerce.Connect.CommerceServer;
    using Sitecore.Commerce.Connect.CommerceServer.Catalog;
    using Sitecore.Commerce.Connect.CommerceServer.Catalog.Fields;
    using Sitecore.Commerce.Connect.CommerceServer.Inventory.Models;
    using Sitecore.Commerce.Connect.CommerceServer.Search;
    using Sitecore.Commerce.Connect.CommerceServer.Search.Models;
    using Sitecore.Commerce.Contacts;
    using Sitecore.Commerce.Entities.Inventory;
    using Sitecore.Commerce.Entities.Prices;
    using Sitecore.Commerce.Pipelines;
    using Sitecore.Commerce.Storefront.Managers;
    using Sitecore.Commerce.Storefront.Managers.Storefront;
    using Sitecore.Commerce.Storefront.Models.SitecoreItemModels;
    using Sitecore.Commerce.Storefront.Models.Storefront;
    using Sitecore.Commerce.Storefront.Services;
    using Sitecore.Commerce.Storefront.SitecorePipelines;
    using Sitecore.ContentSearch.Linq;
    using Sitecore.Data;
    using Sitecore.Data.Fields;
    using Sitecore.Data.Items;
    using Sitecore.Data.Managers;
    using Sitecore.Data.Templates;
    using Sitecore.Diagnostics;
    using Sitecore.Mvc.Presentation;
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Text;
    using System.Web.Mvc;
    
    /// <summary>
    /// Used to manage the data and view retrieval for catalog pages
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
    public class CatalogController : BaseController
    {
        #region Variables

        private const string CurentCategoryViewModelKeyName = "CurrentCategoryViewModel";
        private const string CurentProductViewModelKeyName = "CurrentProductViewModel";
        private const string DynamicProductPrices = "DynamicProductPrices";

        /// <summary>
        /// The commerce named search template
        /// </summary>
        public static ID CommerceNamedSearchTemplate = new ID("{9F7D719A-3A05-4A64-AA74-3C46D8D0D20D}");

        #endregion

        /// <summary>
        /// Initializes a new instance of the <see cref="CatalogController" /> class.
        /// </summary>
        /// <param name="inventoryManager">The inventory manager.</param>
        /// <param name="contactFactory">The contact factory.</param>
        /// <param name="accountManager">The account manager.</param>
        /// <param name="pricingManager">The pricing manager.</param>
        /// <param name="catalogServiceProvider">The catalog service provider.</param>
        public CatalogController(
            [NotNull] InventoryManager inventoryManager, 
            [NotNull] ContactFactory contactFactory, 
            [NotNull] AccountManager accountManager, 
            [NotNull] PricingManager pricingManager,
            [NotNull] CatalogServiceProvider catalogServiceProvider) : base(contactFactory)
        {
            Assert.ArgumentNotNull(inventoryManager, "inventoryManager");
            Assert.ArgumentNotNull(accountManager, "accountManager");
            Assert.ArgumentNotNull(pricingManager, "pricingManager");

            this.InventoryManager = inventoryManager;
            this.AccountManager = accountManager;
            this.PricingManager = pricingManager;
            this.CatalogManager = new CatalogManager(catalogServiceProvider);
        }

        /// <summary>
        /// Gets or sets the inventory manager.
        /// </summary>
        /// <value>
        /// The inventory manager.
        /// </value>
        public InventoryManager InventoryManager { get; protected set; }

        /// <summary>
        /// Gets or sets the account manager.
        /// </summary>
        /// <value>
        /// The account manager.
        /// </value>
        public AccountManager AccountManager { get; protected set; }

        /// <summary>
        /// Gets or sets the pricing manager.
        /// </summary>
        /// <value>
        /// The pricing manager.
        /// </value>
        public PricingManager PricingManager { get; protected set; }

        /// <summary>
        /// Gets the catalog manager.
        /// </summary>
        public CatalogManager CatalogManager { get; private set; }

        #region Controller actions

        /// <summary>
        /// An action to manage data for the home page
        /// </summary>
        /// <returns>The view that represents the home page</returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly", MessageId = "HomePage", Justification = "This is a valid name.")]
        public ActionResult HomePage()
        {
            return View(CurrentRenderingView);
        }

        /// <summary>
        /// An action to manage data for the CategoryList
        /// </summary>
        /// <returns>The view that represents the CategoryList</returns>
        public ActionResult CategoryList()
        {
            if (Sitecore.Context.PageMode.IsPreview)
            {
                return View();
            }

            var datasource = CurrentRendering.DataSource;

            if (!string.IsNullOrEmpty(datasource))
            {
                var datasourceItem = Context.Database.GetItem(ID.Parse(datasource));
                var categoryViewModel = GetCategoryViewModel(null, null, datasourceItem, CurrentRendering, "");

                return View(CurrentRenderingView, categoryViewModel);
            }

            return View(CurrentRenderingView);
        }

        /// <summary>
        /// PageTitle View
        /// </summary>
        /// <returns></returns>
        public ActionResult PageTitle()
        {
            return View();
        }

        /// <summary>
        /// An action to manage data for the ProductList
        /// </summary>
        /// <returns>The view that represents the ProductList</returns>
        public ActionResult ProductList(
            [Bind(Prefix = Constants.QueryStrings.Paging)] int? pageNumber,
            [Bind(Prefix = Constants.QueryStrings.Facets)] string facetValues,
            [Bind(Prefix = Constants.QueryStrings.Sort)] string sortField,
            [Bind(Prefix = Constants.QueryStrings.SortDirection)] CommerceConstants.SortDirection? sortDirection)
        {
            if (Sitecore.Context.PageMode.IsPreview)
            {
                return View();
            }

            var productSearchOptions = new CommerceSearchOptions
            {
                NumberOfItemsToReturn = Constants.Settings.DefaultItemsPerPage,
                StartPageIndex = 0,
                SortField = sortField
            };

            var currentRendering = RenderingContext.Current.Rendering;
            if (string.IsNullOrEmpty(currentRendering.DataSource))
                return GetNoDataSourceView();

            var datasource = currentRendering.Item;

            var productSearchResults = this.CatalogManager.GetProductSearchResults(datasource, productSearchOptions);

            if (productSearchResults != null)
            {
                productSearchResults.DisplayName = datasource.DisplayName;
                var productIds = productSearchResults.Products.Select(product => product.Name).ToArray();
                if (productIds.Length > 0)
                {
                    CurrentSiteContext.Items[DynamicProductPrices] = this.PricingManager.GetProductBulkPrices(this.CurrentStorefront, productIds).Result;
                }

                return View(CurrentRenderingView, productSearchResults);
            }

            return View(CurrentRenderingView);
        }

        /// <summary>
        /// An action to manage data for the ProductList
        /// </summary>
        /// <returns>The view that represents the ProductList</returns>
        public ActionResult MultipleProductLists(
            [Bind(Prefix = Constants.QueryStrings.Paging)] int? pageNumber,
            [Bind(Prefix = Constants.QueryStrings.Facets)] string facetValues,
            [Bind(Prefix = Constants.QueryStrings.Sort)] string sortField,
            [Bind(Prefix = Constants.QueryStrings.SortDirection)] CommerceConstants.SortDirection? sortDirection)
        {
            var productSearchOptions = new CommerceSearchOptions
            {
                NumberOfItemsToReturn = Constants.Settings.DefaultItemsPerPage,
                StartPageIndex = 0,
                SortField = sortField
            };

            var currentRendering = RenderingContext.Current.Rendering;
            if (string.IsNullOrEmpty(currentRendering.DataSource))
                return GetNoDataSourceView();

            var datasource = currentRendering.Item;

            var multipleProductSearchResults = this.CatalogManager.GetMultipleProductSearchResults(datasource, productSearchOptions);

            if (multipleProductSearchResults != null)
            {
                multipleProductSearchResults.Initialize(this.CurrentRendering);
                multipleProductSearchResults.DisplayName = datasource.DisplayName;
                return View(CurrentRenderingView, multipleProductSearchResults);
            }

            return View(CurrentRenderingView);
        }

        /// <summary>
        /// The action for rendering the category view
        /// </summary>
        /// <param name="pageNumber">The product page number</param>
        /// <param name="facetValues">A facet query string</param>
        /// <param name="sortField">The field to sort on</param>
        /// <param name="pageSize">The page size</param>
        /// <param name="sortDirection">The direction to sort</param>
        /// <returns>The category view</returns>
        public ActionResult Category(
            [Bind(Prefix = Constants.QueryStrings.Paging)] int? pageNumber,
            [Bind(Prefix = Constants.QueryStrings.Facets)] string facetValues,
            [Bind(Prefix = Constants.QueryStrings.Sort)] string sortField,
            [Bind(Prefix = Constants.QueryStrings.PageSize)] int? pageSize,
            [Bind(Prefix = Constants.QueryStrings.SortDirection)] CommerceConstants.SortDirection? sortDirection)
        {
            if (Sitecore.Context.PageMode.IsPreview)
            {
                return null;
            }

            Category currentCategory;

            //This is a Wild Card - Wild card pages are named "*"
            if (Item.Name == "*")
            {
                //Supported option - pass in a categoryid
                currentCategory = this.CatalogManager.GetCurrentCategoryByUrl();
                ViewBag.Title = currentCategory.Name;
            }
            else
            {
                currentCategory = this.CatalogManager.GetCategory(Item);
            }

            if (currentCategory == null)
            {
                return View(CurrentRenderingView, null);
            }

            var productSearchOptions = new CommerceSearchOptions(pageSize.GetValueOrDefault(currentCategory.ItemsPerPage), pageNumber.GetValueOrDefault(0));

            UpdateOptionsWithFacets(currentCategory.RequiredFacets, facetValues, productSearchOptions);
            UpdateOptionsWithSorting(sortField, sortDirection, productSearchOptions);

            var viewModel = GetCategoryViewModel(productSearchOptions, currentCategory.SortFields, currentCategory.InnerItem, this.CurrentRendering, currentCategory.InnerItem.DisplayName);

            return View(CurrentRenderingView, viewModel);
        }

        /// <summary>
        /// The action for rendering the product list header view
        /// </summary>
        public ActionResult Navigation()
        {
            var dataSourcePath = Item["CategoryDatasource"];

            if (string.IsNullOrEmpty(dataSourcePath))
                return View(CurrentRenderingView, null);

            var dataSource = Item.Database.GetItem(dataSourcePath);

            if (dataSource == null)
                return View(CurrentRenderingView, null);

            Category currentCategory = this.CatalogManager.GetCategory(dataSource);

            if (currentCategory == null)
                return View(CurrentRenderingView, null);

            var viewModel = GetNavigationViewModel(currentCategory.InnerItem, this.CurrentRendering);

            return View(CurrentRenderingView, viewModel);
        }

        /// <summary>
        /// Childs the category navigation.
        /// </summary>
        public ActionResult ChildCategoryNavigation()
        {
            ISiteContext siteContext = CommerceTypeLoader.CreateInstance<ISiteContext>();

            Item categoryItem = siteContext.CurrentCatalogItem;
            Template t = TemplateManager.GetTemplate(categoryItem.TemplateID, Sitecore.Context.Database);
            Assert.IsTrue(t.DescendsFrom(CommerceConstants.KnownTemplateIds.CommerceCategoryTemplate), "Current item must be a Category.");

            var viewModel = GetNavigationViewModel(categoryItem, this.CurrentRendering);
            if (viewModel.ChildCategories.Count == 0)
            {
                viewModel = GetNavigationViewModel(categoryItem.Parent, this.CurrentRendering);
            }

            return View(CurrentRenderingView, viewModel);
        }

        /// <summary>
        /// The action for rendering the product list header view
        /// </summary>
        public ActionResult ProductListHeader(
            [Bind(Prefix = Constants.QueryStrings.Paging)] int? pageNumber,
            [Bind(Prefix = Constants.QueryStrings.Facets)] string facetValues,
            [Bind(Prefix = Constants.QueryStrings.Sort)] string sortField,
            [Bind(Prefix = Constants.QueryStrings.PageSize)] int? pageSize,
            [Bind(Prefix = Constants.QueryStrings.SortDirection)] CommerceConstants.SortDirection? sortDirection)
        {
            var currentCategory = this.CatalogManager.GetCurrentCategoryByUrl();
            var productSearchOptions = new CommerceSearchOptions(pageSize.GetValueOrDefault(currentCategory.ItemsPerPage), pageNumber.GetValueOrDefault(0));

            UpdateOptionsWithFacets(currentCategory.RequiredFacets, facetValues, productSearchOptions);
            UpdateOptionsWithSorting(sortField, sortDirection, productSearchOptions);

            var viewModel = GetProductListHeaderViewModel(productSearchOptions, currentCategory.SortFields, currentCategory.InnerItem, this.CurrentRendering);

            return View(CurrentRenderingView, viewModel);
        }

        /// <summary>
        /// The action for rendering the pagination view
        /// </summary>
        public ActionResult Pagination(
            [Bind(Prefix = Constants.QueryStrings.Paging)] int? pageNumber,
            [Bind(Prefix = Constants.QueryStrings.PageSize)] int? pageSize,
            [Bind(Prefix = Constants.QueryStrings.Facets)] string facetValues)
        {
            var currentCategory = this.CatalogManager.GetCurrentCategoryByUrl();
            var productSearchOptions = new CommerceSearchOptions(pageSize.GetValueOrDefault(currentCategory.ItemsPerPage), pageNumber.GetValueOrDefault(0));

            UpdateOptionsWithFacets(currentCategory.RequiredFacets, facetValues, productSearchOptions);
            var viewModel = GetPaginationViewModel(productSearchOptions, currentCategory.InnerItem, CurrentRendering);

            return View(CurrentRenderingView, viewModel);
        }

        /// <summary>
        /// The action for rendering the product facets view
        /// </summary>
        public ActionResult ProductFacets(
            [Bind(Prefix = Constants.QueryStrings.Paging)] int? pageNumber,
            [Bind(Prefix = Constants.QueryStrings.PageSize)] int? pageSize,
            [Bind(Prefix = Constants.QueryStrings.Facets)] string facetValues)
        {
            var currentCategory = this.CatalogManager.GetCurrentCategoryByUrl();
            var productSearchOptions = new CommerceSearchOptions(pageSize.GetValueOrDefault(currentCategory.ItemsPerPage), pageNumber.GetValueOrDefault(0));

            UpdateOptionsWithFacets(currentCategory.RequiredFacets, facetValues, productSearchOptions);
            var viewModel = GetProductFacetsViewModel(productSearchOptions, currentCategory.InnerItem, this.CurrentRendering);

            return View(this.CurrentRenderingView, viewModel);
        }

        /// <summary>
        /// Returns a curated set of product Images based on the Datasource
        /// </summary>
        /// <returns></returns>
        public ActionResult CuratedProductImages()
        {
            //var datasource = this.CurrentRendering.DataSource;
            //var datasourceItem = Sitecore.Context.Database.GetItem(ID.Parse(datasource));

            //if (datasourceItem == null)
            //{
            //    //Not a valid data source.
            //    //TODO log the error
            //    return View(this.CurrentRenderingView, new PromoList());
            //}
            //var item = Sitecore.Context.Item;
            
            var images = new List<MediaItem>();

            MultilistField field = Item.Fields["ProductImages"];

            if (field != null)
            {
                images.AddRange(field.TargetIDs.Select(id => Item.Database.GetItem(id)).Select(mediaItem => (MediaItem)mediaItem));
            }

            //var viewModel = new PromoList(datasourceItem);


            //foreach (var associatedItemId in associatedItemIdArray)
            //{
            //    var commercePromotion = SitecoreItemManager.Instance().GetItem<CommercePromotion>(associatedItemId);
            //    viewModel.Promotions.Add(commercePromotion);
            //}

            return View(CurrentRenderingView, images);
        }

        /// <summary>
        /// The action for logging a visit to the product details page.
        /// </summary>
        /// <returns>The action result.</returns>
        public ActionResult VisitedProductDetailsPage()
        {
            var result = new VisitedProductDetailsPageResult();
            var request = new VisitedProductDetailsPageRequest(CatalogUrlManager.ExtractItemIdFromCurrentUrl());
            request.ParentCategoryName = CatalogUrlManager.ExtractCategoryNameFromCurrentUrl();
            request.CatalogName = CatalogUrlManager.ExtractCatalogNameFromCurrentUrl();
            var args = new ServicePipelineArgs(request, result);

            Sitecore.Pipelines.CorePipeline.Run(Constants.PipelineNames.VisitedProductDetailsPage, args);

            return this.View(CurrentRenderingView);
        }

        /// <summary>
        /// The action for logging a visit to a category page.
        /// </summary>
        /// <returns>The action result.</returns>
        public ActionResult VisitedCategoryPage()
        {
            var result = new VisitedCategoryPageResult();
            var request = new VisitedCategoryPageRequest(CatalogUrlManager.ExtractItemIdFromCurrentUrl());
            request.CatalogName = CatalogUrlManager.ExtractCatalogNameFromCurrentUrl();
            var args = new ServicePipelineArgs(request, result);

            Sitecore.Pipelines.CorePipeline.Run(Constants.PipelineNames.VisitedCategoryPage, args);

            return this.View(CurrentRenderingView);
        }

        /// <summary>
        /// The action for rendering the product view
        /// </summary>
        /// <returns>The product view</returns>
        public ActionResult Product()
        {
            //Wild card pages are named "*"
            if (Item.Name == "*")
            {
                // This is a Wild Card

                //Supported option - pass in a productid
                var productId = CatalogUrlManager.ExtractItemIdFromCurrentUrl();

                string virtualProductCacheKey = string.Format(CultureInfo.InvariantCulture, "VirtualProduct_{0}", productId);
                ProductViewModel productViewModel;
                if (CurrentSiteContext.Items.Contains(virtualProductCacheKey))
                {
                    productViewModel = CurrentSiteContext.Items[virtualProductCacheKey] as ProductViewModel;
                    //return View(this.CurrentRenderingView, CurrentSiteContext.Items[virtualProductCacheKey] as ProductViewModel);
                }
                else
                {
                    if (string.IsNullOrEmpty(productId))
                    {
                        //No ProductId passed in on the URL
                        //Use to Storefront DefaultProductId
                        productId = StorefrontManager.CurrentStorefront.DefaultProductId;
                    }

                    var productItem = SearchNavigation.GetProduct(productId, CurrentCatalog.Name);
                    if (productItem == null)
                    {
                        var message = string.Format(CultureInfo.InvariantCulture, "The requested product '{0}' does not exist in the catalog '{1}' or cannot be displayed in the language '{2}'", productId, this.CurrentCatalog.Name, Sitecore.Context.Language);
                        Log.Error(message, this);
                        throw new InvalidOperationException(message);
                    }

                    this.Item = productItem;
                    productViewModel = GetProductViewModel(this.Item, this.CurrentRendering);
                    CurrentSiteContext.Items.Add(virtualProductCacheKey, productViewModel);
                }

                return View(CurrentRenderingView, productViewModel);
            }

            //Special handling for gift card
            if (Item.Name.ToLower(CultureInfo.InvariantCulture) == ProductItemResolver.BuyGiftCardUrlRoute)
            {
                Item = SearchNavigation.GetProduct(StorefrontManager.CurrentStorefront.GiftCardProductId, CurrentCatalog.Name);
            }

            return View(CurrentRenderingView, GetProductViewModel(Item, CurrentRendering));
        }

        /// <summary>
        /// Sign up visitor for product back in stock notification.
        /// </summary>
        /// <param name="id">The product id.</param>
        [HttpPost]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly", MessageId = "SignUp")]
        public void SignUpForBackInStockNotification(string id)
        {
            var visitorId = this.ContactFactory.GetContact();
            var email = Context.User.Profile.Email;
            if (string.IsNullOrEmpty(email))
            {
                var commerceUser = this.AccountManager.GetUser(visitorId).Result;
                if (commerceUser == null || string.IsNullOrEmpty(commerceUser.Email))
                {
                    return;
                }

                email = commerceUser.Email;
            }

            this.InventoryManager.VisitorSignupForStockNotification(this.CurrentStorefront, visitorId, email, id, string.Empty, null);
        }

        #endregion

        #region Protected helper methods

        /// <summary>
        /// This method returns child categories for this category
        /// </summary>
        /// <param name="searchOptions">The options to perform the search with</param>
        /// <param name="categoryItem">The category item whose children to retrieve</param>
        /// <returns>A list of child categories</returns>       
        protected CategorySearchResults GetChildCategories(CommerceSearchOptions searchOptions, Item categoryItem)
        {
            var returnList = new List<Item>();
            var totalPageCount = 0;
            var totalCategoryCount = 0;

            if (Item != null)
            {
                var searchResponse = SearchNavigation.GetCategoryChildCategories(categoryItem.ID, searchOptions);

                returnList.AddRange(searchResponse.ResponseItems);

                totalCategoryCount = searchResponse.TotalItemCount;
                totalPageCount = searchResponse.TotalPageCount;
            }

            var results = new CategorySearchResults(returnList, totalCategoryCount, totalPageCount, searchOptions.StartPageIndex, new List<FacetCategory>());

            return results;
        }

        /// <summary>
        /// Creates a product view model based on an Item and Rendering
        /// </summary>
        /// <param name="productItem">The product item to based the model on</param>
        /// <param name="rendering">The rendering to initialize the model with</param>
        /// <returns>A Product View Model</returns>
        protected ProductViewModel GetProductViewModel(Item productItem, Rendering rendering)
        {
            var siteContext = CommerceTypeLoader.CreateInstance<ISiteContext>();
            if (siteContext.Items[CurentProductViewModelKeyName] == null)
            {
                var variants = new List<VariantViewModel>();
                if (productItem != null && productItem.HasChildren)
                {
                    foreach (Item item in productItem.Children)
                    {
                        var v = new VariantViewModel(item);
                        variants.Add(v);
                    }
                }

                var productViewModel = new ProductViewModel(productItem);
                productViewModel.Initialize(rendering, variants);
                PopulateStockInformation(productViewModel);
                var pricing = this.PricingManager.GetProductPrices(this.CurrentStorefront, productViewModel.ProductId, null).Result.FirstOrDefault().Value;

                if (siteContext.Items[DynamicProductPrices] == null)
                { 
                    siteContext.Items.Add(DynamicProductPrices, new Dictionary<string, Price>());
                }

                (siteContext.Items[DynamicProductPrices] as IDictionary<string, Price>).Add(productViewModel.ProductId, pricing);

                // get upsells
                if (productItem != null && productItem.Fields.Contains(CommerceConstants.KnownFieldIds.RelationshipList) && !string.IsNullOrEmpty(productItem[CommerceConstants.KnownFieldIds.RelationshipList]))
                {
                    var upsells = new List<Item>();
                    var field = new RelationshipField(productItem.Fields[CommerceConstants.KnownFieldIds.RelationshipList]);

                    if (field != null)
                    {
                        // display the upsells for this productItem
                        //TODO make number to take configurable
                        var relationships = GetRelationshipsFromField(field, "upsell").Take(9).ToList();
                        if (relationships != null)
                        {
                            upsells = relationships;
                        }
                    }

                    productViewModel.Upsells = upsells;
                }

                siteContext.Items[CurentProductViewModelKeyName] = productViewModel;
            }

            return (ProductViewModel)siteContext.Items[CurentProductViewModelKeyName];
        }

        /// <summary>
        /// Populates the stock information
        /// </summary>
        /// <param name="model">The product model</param>
        protected void PopulateStockInformation(ProductViewModel model)
        {
            //Check for Gift Card
            if (model.ProductId == StorefrontManager.CurrentStorefront.GiftCardProductId)
            {
                //Gift cards are always in stock..
                model.StockStatus = StockStatus.InStock;
                return;
            }

            var stockInfos = this.InventoryManager.GetStockInformation(this.CurrentStorefront, new List<CommerceInventoryProduct> { new CommerceInventoryProduct { ProductId = model.ProductId, CatalogName = model.CatalogName } }).Result;
            var stockInfo = stockInfos.FirstOrDefault();
            if (stockInfo == null || stockInfo.Status == null)
            {
                return;
            }

            model.StockStatus = stockInfo.Status;
            this.InventoryManager.VisitedProductStockStatus(this.CurrentStorefront, stockInfo, string.Empty);
        }        

        /// <summary>
        /// Gets a lists of target items from a relationship field
        /// </summary>
        /// <param name="field">the relationship field</param>
        /// <param name="relationshipName">the relationship name, for example upsell</param>
        /// <returns>a list of relationship targets or null if no items found</returns>
        protected List<Item> GetRelationshipsFromField(RelationshipField field, string relationshipName)
        {
            List<Item> items = null;

            IEnumerable<Item> relationships = field.GetRelationshipsTargets(relationshipName);

            if (relationships != null)
            {
                items = new List<Item>(relationships);
            }

            return items;
        }

        /// <summary>
        /// Builds a category view model or retrieves it if it already exists
        /// </summary>
        /// <param name="productSearchOptions">The product options class for finding child products</param>
        /// <param name="sortFields">The fields to sort he results on</param>
        /// <param name="categoryItem">The category item to base the view model on</param>
        /// <param name="rendering">The rendering to initialize the model with</param>
        /// <param name="cacheName">Name of the cache.</param>
        /// <returns>
        /// A category view model
        /// </returns>
        protected virtual CategoryViewModel GetCategoryViewModel(CommerceSearchOptions productSearchOptions, IEnumerable<CommerceQuerySort> sortFields, Item categoryItem, Rendering rendering, string cacheName)
        {
            string cacheKey = "Category/" + cacheName;
            bool noCache = (string.IsNullOrEmpty(cacheName));

            var siteContext = CommerceTypeLoader.CreateInstance<ISiteContext>();
            if (siteContext.Items[cacheKey] == null || noCache)
            {
                var categoryViewModel = new CategoryViewModel(categoryItem);

                ProductSearchResults childProducts = null;
                if (productSearchOptions != null)
                {
                    childProducts = GetChildProducts(productSearchOptions, categoryItem);
                }

                categoryViewModel.Initialize(rendering, childProducts, sortFields, productSearchOptions);
                if (childProducts != null && childProducts.Products.Count > 0)
                {
                    var productIds = childProducts.Products.Select(product => product.Name).ToArray();
                    siteContext.Items[DynamicProductPrices] = this.PricingManager.GetProductBulkPrices(this.CurrentStorefront, productIds).Result;
                }

                if (!noCache)
                {
                    siteContext.Items[cacheKey] = categoryViewModel;
                }
                return categoryViewModel;
            }

            return (CategoryViewModel)siteContext.Items[cacheKey];

        }

        /// <summary>
        /// Builds a navigation view model or retrieves it if it already exists
        /// </summary>
        /// <param name="categoryItem">The category item to base the view model on</param>
        /// <param name="rendering">The rendering to initialize the model with</param>
        /// <returns>
        /// A category view model
        /// </returns>
        protected virtual NavigationViewModel GetNavigationViewModel(Item categoryItem, Rendering rendering)
        {
            string cacheKey = "Navigation/" + categoryItem.Name;
            bool noCache = (string.IsNullOrEmpty(categoryItem.Name));

            var siteContext = CommerceTypeLoader.CreateInstance<ISiteContext>();
            if (siteContext.Items[cacheKey] == null || noCache)
            {
                var navigationViewModel = new NavigationViewModel();
                CategorySearchResults childCategories = GetChildCategories(new CommerceSearchOptions(), categoryItem);                
                navigationViewModel.Initialize(rendering, childCategories);
                if (noCache)
                    return navigationViewModel;

                siteContext.Items[cacheKey] = navigationViewModel;
            }

            return (NavigationViewModel)siteContext.Items[cacheKey];

        }

        /// <summary>
        /// Builds a product list header view model
        /// </summary>
        public ProductListHeaderViewModel GetProductListHeaderViewModel(CommerceSearchOptions productSearchOptions, IEnumerable<CommerceQuerySort> sortFields, Item categoryItem, Rendering rendering)
        {
            var viewModel = new ProductListHeaderViewModel();

            ProductSearchResults childProducts = null;
            if (productSearchOptions != null)
                childProducts = GetChildProducts(productSearchOptions, categoryItem);

            viewModel.Initialize(rendering, childProducts, sortFields, productSearchOptions);

            return viewModel;
        }

        /// <summary>
        /// Builds a pagination view model
        /// </summary>
        public PaginationViewModel GetPaginationViewModel(CommerceSearchOptions productSearchOptions, Item categoryItem, Rendering rendering)
        {
            var viewModel = new PaginationViewModel();

            ProductSearchResults childProducts = null;
            if (productSearchOptions != null)
                childProducts = GetChildProducts(productSearchOptions, categoryItem);

            viewModel.Initialize(rendering, childProducts, productSearchOptions);

            return viewModel;
        }

        /// <summary>
        /// Builds a product facets view model
        /// </summary>
        public ProductFacetsViewModel GetProductFacetsViewModel(CommerceSearchOptions productSearchOptions, Item categoryItem, Rendering rendering)
        {
            var viewModel = new ProductFacetsViewModel();

            ProductSearchResults childProducts = null;
            if (productSearchOptions != null)
                childProducts = GetChildProducts(productSearchOptions, categoryItem);

            viewModel.Initialize(rendering, childProducts, productSearchOptions);

            return viewModel;
        }

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

            if (Item != null)
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

                        var existingFacet = facets.FirstOrDefault(item => item.Name.Equals(name, StringComparison.OrdinalIgnoreCase));

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