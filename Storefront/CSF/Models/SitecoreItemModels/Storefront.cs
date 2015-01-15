//-----------------------------------------------------------------------
// <copyright file="Storefront.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the CommercePromotion class.</summary>
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
    using Sitecore.Commerce.Connect.CommerceServer;
    using Sitecore.Mvc.Presentation;
    using Sitecore.Data.Items;
    using Sitecore.Commerce.Storefront.Managers;
    using Sitecore.Commerce.Storefront.SitecorePipelines;

    /// <summary>
    /// CommercePromotion class
    /// </summary>
    public class CommerceStorefront : SitecoreItemBase
    {

        /// <summary>
        /// Default Constructor
        /// </summary>
        public CommerceStorefront()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CommercePromotion"/> class.
        /// </summary>
        /// <param name="item">The item.</param>
        public CommerceStorefront(Item item)
        {
            Item = item;

            // TODO: Temporary fix until we merge with AX.
            if (StorefrontManager.IsInStorefront)
            {
                if (!string.IsNullOrWhiteSpace(Context.Site.Name))
                {
                    this._shopName = Context.Site.Name;
                }
            }
        }

        /// <summary>
        /// Gets a value indicating whether [use ax checkout].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [use ax checkout]; otherwise, <c>false</c>.
        /// </value>
        public bool UseAXCheckout
        {
            get
            {
                return MainUtil.GetBool(this.Item[StorefrontConstants.KnownFieldNames.UseAXCheckoutControl], false);
            }
        }

        /// <summary>
        /// Gets the root item.
        /// </summary>
        /// <value>
        /// The root item.
        /// </value>
        public Item RootItem
        {
            get
            {
                return Sitecore.Context.Database.GetItem(Sitecore.Context.Site.RootPath);
            }
        }

        /// <summary>
        /// Gets the home item.
        /// </summary>
        /// <value>
        /// The home item.
        /// </value>
        public Item HomeItem
        {
            get
            {
                return this.Item;
            }
        }

        /// <summary>
        /// Gets the global item.
        /// </summary>
        /// <value>
        /// The global item.
        /// </value>
        public Item GlobalItem
        {
            get
            {
                return Sitecore.Context.Database.GetItem(Sitecore.Context.Site.RootPath + "/Global");
            }
        }

        /// <summary>
        /// The key that is used in the routing to identify the storefront
        /// Example "storefronts/contoso/product/xxxx"  contoso is the route key
        /// and is used to map to the correct storefront for additional configuration values
        /// </summary>
        public string RouteKey
        {
            get { return Item["RouteKey"]; }
        }

        private string _shopName = "website";

        /// <summary>
        /// Gets or sets the name of the shop.
        /// </summary>
        /// <value>The name of the shop.</value>
        public string ShopName
        {
            get  {  return _shopName; }
            set { _shopName = value; }
        }

        private string _defaultCartName = CommerceConstants.CartSettings.DefaultCartName;

        /// <summary>
        /// Gets or sets the default cart name
        /// </summary>
        /// <value>The default name of the cart.</value>
        public string DefaultCartName
        {
            get { return _defaultCartName; }
            set { _defaultCartName = value; }
        }

        /// <summary>
        /// The tracking cookie name to use if analytics is off or if we hit the site in preview/edit mode
        /// </summary>
        private string _visitorTrackingCookieName = "_visitor";

        /// <summary>
        /// Visitor tracking cookie for this storefront
        /// </summary>
        public string VisitorTrackingCookieName
        {
            get { return _visitorTrackingCookieName; }
            set { _visitorTrackingCookieName = value; }

        }

        /// <summary>
        /// The key name to store the unique visitor id in
        /// </summary>
        private string _visitorIdKeyName = "visitorId";

        /// <summary>
        /// Visitor Id Key for the site
        /// </summary>
        public string VisitorIdKeyName
        {
            get { return _visitorIdKeyName; }
            set { _visitorIdKeyName = value; }
        }

        /// <summary>
        /// The number of days to keep the cookie
        /// </summary>
        private int _visitorCookieExpiryInDays = 1;

        /// <summary>
        /// Visitor Cookie Expiration Days
        /// </summary>
        public int VisitorCookieExpiryInDays
        {
            get { return _visitorCookieExpiryInDays; }
            set { _visitorCookieExpiryInDays = value; }
        }

        /// <summary>
        /// The Default Catalog for this storefront
        /// </summary>
        public Catalog DefaultCatalog
        {
            get
            {
                //If this is not in a storefront then return the default catalog
                if (Item == null)
                {
                    var defaultCatalogContainer =
                        Context.Database.GetItem(CommerceConstants.KnownItemIds.DefaultCatalog);
                    var catalogPath = defaultCatalogContainer.Fields["Catalog"].Source + "/" + defaultCatalogContainer.Fields["Catalog"].Value;
                    var defaultCatalog = Context.Database.GetItem(catalogPath);
                    return new Catalog(defaultCatalog);
                }

                //Get list of all related catalogs
                var catalogs = Item.Fields["Catalogs"].Value;
                var catalogArray = catalogs.Split("|".ToCharArray());
                if (catalogArray.Length == 0) return null;

                //Return first catalog
                var catalogItem = Context.Database.GetItem(catalogArray[0]);
                return new Catalog(catalogItem);
            }
        }

        /// <summary>
        /// ProductId established for the Gift Card
        /// </summary>
        public string GiftCardProductId
        {
            get
            {
                return Item == null ? "22565422120" : Item["GiftCardProductId"];
            }
        }

        /// <summary>
        /// The gift card amount options.
        /// </summary>        
        public string GiftCardAmountOptions
        {
            get
            {
                if (Item == null)
                {
                    return "10|20|25|50|100";
                }

                return Item["GiftCardAmountOptions"];               
            }
        }

        /// <summary>
        /// Default ProductId to use if no ProductId is presented
        /// </summary>
        public string DefaultProductId
        {

            get
            {
                return Item == null ? "22565422120" : Item["DefaultProductId"];
            }
        }

        /// <summary>
        /// Product Images location
        /// </summary>
        public string ProductImages
        {

            get
            {
                if (Item == null)
                {
                    return "";
                }
                var productImagesItem = Item.Database.GetItem(Item["Product Images"]);
                return productImagesItem == null ? "" : productImagesItem.Uri.ToString();
            }
        }

        /// <summary>
        /// General Images location
        /// </summary>
        public string GeneralImages
        {

            get
            {
                if (Item == null)
                {
                    return "";
                }
                var generalImagesItem = Item.Database.GetItem(Item["General Images"]);

                return generalImagesItem==null ? "" : generalImagesItem.Paths.FullPath;
            }
        }

        /// <summary>
        /// The Title of the Page
        /// </summary>
        /// <returns></returns>
        public string Title()
        {
            return Item == null ? "default" : Item["Title"];
        }

        /// <summary>
        /// Label for the Wish List Name field
        /// </summary>
        /// <returns></returns>
        public string NameTitle()
        {
            return Item == null ? "default" : Item["Name Title"];
        }

        /// <summary>
        /// Resolve the title to show on the page
        /// </summary>
        /// <returns></returns>
        public string ResolvePageTitle()
        {
            if (RenderingContext.Current.Rendering.Item.Name == "*")
            {
                // This is a Wild Card

                //Supported option - pass in a productid
                var virtualId = CatalogUrlManager.ExtractItemIdFromCurrentUrl();
                var wildType = Web.WebUtil.GetUrlName(1);

                switch (wildType.ToLowerInvariant())
                {
                    case ProductItemResolver.ProductUrlRoute:
                        var virtualProduct = SearchNavigation.GetProduct(virtualId, DefaultCatalog.Name);
                        return virtualProduct.DisplayName;
                    case ProductItemResolver.CategoryUrlRoute:
                    case ProductItemResolver.ShopUrlRoute:
                        var virtualCategoryItem = SearchNavigation.GetCategory(virtualId, DefaultCatalog.Name);
                        var virtualCategory = new Category(virtualCategoryItem);
                        return virtualCategory.DisplayName;
                }

                // check if the URL has the format shop/<category>/<product>
                wildType = Web.WebUtil.GetUrlName(2);
                if (wildType.ToLowerInvariant() == ProductItemResolver.ShopUrlRoute)
                {
                    var virtualProduct = SearchNavigation.GetProduct(virtualId, DefaultCatalog.Name);
                    return virtualProduct.DisplayName;
                }
            }

            return RenderingContext.Current.Rendering.Item.DisplayName;
        }
    }
}