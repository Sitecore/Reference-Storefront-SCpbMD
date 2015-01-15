//-----------------------------------------------------------------------
// <copyright file="ProductViewModel.cs" company="Sitecore Corporation">
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
    using Sitecore.Commerce.Connect.CommerceServer;
    using Sitecore.Commerce.Connect.CommerceServer.Orders.Models;
    using Sitecore.Commerce.Storefront.Managers;
    using Sitecore.Commerce.Entities.Inventory;
    using Sitecore.Commerce.Entities.Prices;
    using Sitecore.Data.Fields;
    using Sitecore.Data.Items;
    using Sitecore.Mvc;
    using Sitecore.Mvc.Presentation;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Globalization;
    using System.Linq;
    using System.Web;

    /// <summary>
    /// A view model for a Product.
    /// </summary>
    public class ProductViewModel : Sitecore.Mvc.Presentation.RenderingModel
    {
        private const string DynamicProductPrices = "DynamicProductPrices";
        private readonly Item _item;
        private List<MediaItem> _images;

        /// <summary>
        /// Initializes a new instance of the <see cref="ProductViewModel" /> class
        /// </summary>
        public ProductViewModel()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ProductViewModel" /> class
        /// </summary>
        /// <param name="item">The item to initialize the class with</param>
        public ProductViewModel(Item item)
        {
            _item = item;
            Upsells = new List<Item>();
        }

        /// <summary>
        /// Gets the item for the current model
        /// </summary>
        public override Item Item
        {
            get
            {
                if (_item == null)
                {
                    return base.Item;
                }

                return _item;
            }
        }

        /// <summary>
        /// Gets or sets the Product Id.
        /// </summary>
        public string ProductId
        {
            get
            {
                return Item.Name;
            }

            set
            {
                Item.Name = value;
            }
        }

        /// <summary>
        /// Returns the MediaItem representing the stars image
        /// </summary>
        /// <returns></returns>
        public MediaItem StarsImage()
        {
            var imagesDirectory = StorefrontManager.CurrentStorefront.GeneralImages;
            MediaItem mediaItem = Item.Database.GetItem(imagesDirectory + "/Stars/" + RatingStarImage);
            return mediaItem;
        }

        /// <summary>
        /// Gets or sets the Product Description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Gets the description as a html string
        /// </summary>
        public HtmlString DescriptionRender
        {
            get
            {
                return PageContext.Current.HtmlHelper.Sitecore().Field("Description", Item);
            }
        }

        /// <summary>
        /// General purpose field renderer
        /// </summary>
        /// <param name="fieldName">the field to render</param>
        /// <returns></returns>
        public HtmlString RenderField(string fieldName)
        {
            return PageContext.Current.HtmlHelper.Sitecore().Field(fieldName, Item);
        }

        /// <summary>
        /// Gets the description as a html string
        /// </summary>
        public List<MediaItem> Images
        {
            get
            {
                if (_images != null)
                {
                    return _images;
                }

                _images = new List<MediaItem>();

                MultilistField field = Item.Fields["Images"];

                if (field != null)
                {
                    foreach (var id in field.TargetIDs)
                    {
                        MediaItem mediaItem = Item.Database.GetItem(id);
                        _images.Add(mediaItem);
                    }
                }

                return _images;
            }
        }

        /// <summary>
        /// Gets or sets the Product DisplayName.
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// Gets the display name as an html string
        /// </summary>
        public HtmlString DisplayNameRender
        {
            get
            {
                return PageContext.Current.HtmlHelper.Sitecore().Field(FieldIDs.DisplayName.ToString(), Item);
            }
        }

        /// <summary>
        /// Gets or sets the Product ListPrice.
        /// </summary>
        public decimal? ListPrice
        {
            get
            {
                var siteContext = CommerceTypeLoader.CreateInstance<ISiteContext>();
                if (siteContext.CurrentContext.Items != null && siteContext.CurrentContext.Items[DynamicProductPrices] != null)
                {
                    Price price;
                    var dynamicProductPrices = (siteContext.CurrentContext.Items[DynamicProductPrices] as IDictionary<string, Price>);                    
                    if (dynamicProductPrices.TryGetValue(this.ProductId, out price))
                    {
                        return (price as CommercePrice).Amount;
                    }
                }

                var selectedCurrency = siteContext.CurrentContext.Request.Cookies["currency"];
                if (selectedCurrency != null)
                {
                    if (Item["Price_" + selectedCurrency.Value] != null)
                    {
                        return decimal.Parse(Item["Price_" + selectedCurrency.Value].Replace("$", string.Empty), CultureInfo.InvariantCulture);
                    }
                }

                if (!string.IsNullOrWhiteSpace(Item["ListPrice"]))
                {
                    return decimal.Parse(Item["ListPrice"].Replace("$", string.Empty), CultureInfo.InvariantCulture);
                }

                return null;
            }

            set
            {
                Item["ListPrice"] = value.ToString();
            }
        }

        /// <summary>
        /// Average Customer Rating
        /// </summary>
        public decimal CustomerAverageRating
        {
            get
            {
                var ratingString = Item["CustomerAverageRating"];
                decimal rating;
                if (decimal.TryParse(ratingString, out rating))
                {
                    return rating;
                }

                return 0;
            }

        }

        /// <summary>
        /// Computes the Star image to use given the rating of the product.  
        /// Based on naming convention (stars_sm_#) where # is the whole number of the rating (0-5)
        /// </summary>
        public string RatingStarImage
        {
            get
            {
                string starsImage = "stars_sm_0";
                decimal rating = CustomerAverageRating;
                if (rating > 0 && rating < 1)
                {
                    starsImage = "stars_sm_1";
                }
                else
                    if (rating > 1 && rating < 2)
                    {
                        starsImage = "stars_sm_1";
                    }
                    else
                        if (rating > 2 && rating < 3)
                        {
                            starsImage = "stars_sm_2";
                        }
                        else
                            if (rating > 3 && rating < 4)
                            {
                                starsImage = "stars_sm_3";
                            }
                            else
                                if (rating > 4 && rating < 5)
                                {
                                    starsImage = "stars_sm_4";
                                }
                                else
                                {
                                    starsImage = "stars_sm_5";
                                }
                return starsImage;
            }
        }

        /// <summary>
        /// Gets or sets the Product AdjustedPrice.
        /// </summary>
        public decimal? AdjustedPrice
        {
            get
            {
                var siteContext = CommerceTypeLoader.CreateInstance<ISiteContext>();
                if (siteContext.CurrentContext.Items != null && siteContext.CurrentContext.Items[DynamicProductPrices] != null)
                {               
                    Price price;
                    var dynamicProductPrices = (siteContext.CurrentContext.Items[DynamicProductPrices] as IDictionary<string, Price>);
                    if (dynamicProductPrices.TryGetValue(this.ProductId, out price))
                    {
                        return (price as CommercePrice).ListPrice;
                    }
                }

                var selectedCurrency = siteContext.CurrentContext.Request.Cookies["currency"];
                if (selectedCurrency != null)
                {
                    if (Item["Price_" + selectedCurrency.Value] != null)
                    {
                        return decimal.Parse(Item["Price_" + selectedCurrency.Value].Replace("$", string.Empty), CultureInfo.InvariantCulture);
                    }
                }

                if (!string.IsNullOrWhiteSpace(Item["AdjustedPrice"]))
                {
                    return decimal.Parse(Item["AdjustedPrice"].Replace("$", string.Empty), CultureInfo.InvariantCulture);
                }

                return null;
            }

            set
            {
                Item["AdjustedPrice"] = value.ToString();
            }
        }

        /// <summary>
        /// Gets the percentage savings for the product.
        /// </summary>
        public decimal SavingsPercentage
        {
            get
            {
                if (this.ListPrice.HasValue && this.AdjustedPrice.HasValue && this.ListPrice.Value > this.AdjustedPrice.Value)
                {
                    var percentage = decimal.Floor(100 * (this.ListPrice.Value - this.AdjustedPrice.Value) / this.ListPrice.Value);
                    var roundedPercentage = percentage + (5 - (percentage % 5));
                    return roundedPercentage;
                }

                return 0;
            }
        }

        /// <summary>
        /// Gets or sets the Product AdjustedPrice.
        /// </summary>
        public bool IsOnSale
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(Item["OnSale"]))
                {
                    if (Item["OnSale"] == "1")
                    {
                        return true;
                    }
                    return false;
                }
                return false;
            }

            set
            {
                Item["OnSale"] = value.ToString();
            }
        }

        /// <summary>
        /// Gets the list price as an html string
        /// </summary>
        public HtmlString ListPriceRender
        {
            get
            {
                var siteContext = CommerceTypeLoader.CreateInstance<ISiteContext>();
                var selectedCurrency = siteContext.CurrentContext.Request.Cookies["currency"];
                if (selectedCurrency != null)
                {
                    if (!string.IsNullOrEmpty(Item["Product_Price_" + selectedCurrency.Value]))
                    {
                        return PageContext.Current.HtmlHelper.Sitecore().Field("Product_Price_" + selectedCurrency.Value, Item);
                    }
                }

                return PageContext.Current.HtmlHelper.Sitecore().Field("ListPrice", Item);
            }
        }

        /// <summary>
        /// Gets or sets a value indicating whether the item is a product
        /// </summary>
        public bool IsProduct
        {
            get
            {
                var val = Item["IsProduct"];

                return (!string.IsNullOrEmpty(val) && val != "0");
            }

            set
            {
                Item["IsProduct"] = value ? "1" : "0";
            }
        }

        /// <summary>
        /// Gets the Catalog name.
        /// </summary>
        public string CatalogName
        {
            get
            {
                return Item["CatalogName"];
            }
        }

        /// <summary>
        /// Gets or sets the default Quantity to be used when creating a new LineItem.
        /// </summary>
        public decimal? Quantity
        {
            get
            {
                return 0;
            }

            set
            {
            }
        }

        /// <summary>
        /// Gets or sets the gift card amount.
        /// </summary> 
        [Required]
        [Display(Name = "Gift Card Amount")]
        public decimal? GiftCardAmount
        {
            get
            {
                return 0;
            }

            set
            {
            }
        }

        /// <summary>
        /// Gets the gift card amount options.
        /// </summary>       
        public List<KeyValuePair<string, decimal?>> GiftCardAmountOptions
        {
            get
            {
                string[] options = StorefrontManager.CurrentStorefront.GiftCardAmountOptions.Split('|');
                if (options.Length > 1 || options[0].Equals("*", StringComparison.Ordinal))
                {
                    var giftCardAmountOptions = new Dictionary<string, decimal?>();
                    foreach (string option in options)
                    {
                        giftCardAmountOptions.Add(option, Convert.ToDecimal(option, CultureInfo.InvariantCulture));
                    }

                    return giftCardAmountOptions.ToList();
                }

                return null;
            }
        }

        /// <summary>
        /// Gets or sets the stock status.
        /// </summary>
        public StockStatus StockStatus { get; set; }

        /// <summary>
        /// Gets or sets the stock count.
        /// </summary>
        public double StockCount { get; set; }

        /// <summary>
        /// Gets or sets the variants for the current product
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly", Justification = "This is the desired behavior")]
        public List<VariantViewModel> Variants
        {
            get;
            protected set;
        }

        /// <summary>
        /// Gets or sets the UpSells for the current product
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly", Justification = "This is the desired behavior")]
        public List<Item> Upsells
        {
            get;
            set;
        }

        /// <summary>
        /// Initializes the model with the specified data
        /// </summary>
        /// <param name="rendering">The rendering associated to the current render</param>
        /// <param name="variants">The variants associated to the current product</param>
        public void Initialize(Rendering rendering, List<VariantViewModel> variants)
        {
            base.Initialize(rendering);
            Variants = variants;
        }

        /// <summary>
        /// Get a proper product link
        /// </summary>
        /// <returns></returns>
        public string GetLink()
        {
            return Links.LinkManager.GetDynamicUrl(Item);
        }

        /// <summary>
        /// Get the available colors of all the variants
        /// </summary>
        /// <returns></returns>
        public List<string> VariantProductColor
        {
            get
            {
                return Variants.GroupBy(v => v.ProductColor).Select(grp => grp.First().ProductColor).ToList();
            }
        }

        /// <summary>
        /// Get the available sizes of all the variants
        /// </summary>
        /// <returns></returns>
        public List<string> VariantSizes
        {
            get
            {
                var groups = Variants.GroupBy(v => v.Size);
                var sizes = groups.Select(grp => grp.First().Size).ToList();
                return sizes;
            }
        }

        /// <summary>
        /// Get the product list display texts item
        /// </summary>
        /// <returns></returns>
        public Item ProductListTexts
        {
            get
            {
                var home = Context.Database.GetItem(Context.Site.RootPath + Context.Site.StartItem);
                var textsItemPath = home["Product List Texts"];
                if (string.IsNullOrEmpty(textsItemPath))
                    return null;
                return Context.Database.GetItem(textsItemPath);
            }
        }

        /// <summary>
        /// Get the add to cart link display text for the product summery
        /// </summary>
        /// <returns></returns>
        public string AddToCartLinkText
        {
            get
            {
                var productListTexts = ProductListTexts;
                if (productListTexts != null)
                    return productListTexts["Add To Cart Link Text"];
                return string.Empty;
            }
        }

        /// <summary>
        /// Get the product details link display text for the product summery
        /// </summary>
        /// <returns></returns>
        public string ProductDetailsLinkText
        {
            get
            {
                var productListTexts = ProductListTexts;
                if (productListTexts != null)
                    return productListTexts["Product Page Link Text"];
                return string.Empty;
            }
        }
    }
}
