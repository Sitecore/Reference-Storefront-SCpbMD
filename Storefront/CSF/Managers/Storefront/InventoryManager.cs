//-----------------------------------------------------------------------
// <copyright file="InventoryManager.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2014
// </copyright>
// <summary>The manager class responsible for encapsulating the inventory business logic for the site.</summary>
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
    using Sitecore.Commerce.Connect.CommerceServer.Inventory;
    using Sitecore.Commerce.Contacts;
    using Sitecore.Commerce.Entities.Inventory;
    using Sitecore.Commerce.Multishop;
    using Sitecore.Commerce.Services.Inventory;
    using Sitecore.Commerce.Storefront.Models.SitecoreItemModels;
    using Sitecore.Configuration;
    using Sitecore.Diagnostics;
    using System.Collections.Generic;

    /// <summary>
    /// Defines the InventoryManager class.
    /// </summary>
    public class InventoryManager : BaseManager
    {
        private readonly CommerceContextBase _obecContext;

        #region Constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="InventoryManager" /> class.
        /// </summary>
        /// <param name="inventoryServiceProvider">The inventory service provider.</param>
        /// <param name="contactFactory">The contact factory.</param>
        public InventoryManager([NotNull] InventoryServiceProvider inventoryServiceProvider, [NotNull] ContactFactory contactFactory)
        {
            Assert.ArgumentNotNull(inventoryServiceProvider, "inventoryServiceProvider");
            Assert.ArgumentNotNull(contactFactory, "contactFactory");

            this.InventoryServiceProvider = inventoryServiceProvider;
            this.ContactFactory = contactFactory;
            this._obecContext = (CommerceContextBase)Factory.CreateObject("commerceContext", true);
        }

        #endregion

        #region Properties (public)

        /// <summary>
        /// Gets or sets the inventory service provider.
        /// </summary>
        /// <value>
        /// The inventory service provider.
        /// </value>
        public InventoryServiceProvider InventoryServiceProvider { get; protected set; }

        /// <summary>
        /// Gets or sets the contact factory.
        /// </summary>
        /// <value>
        /// The contact factory.
        /// </value>
        public ContactFactory ContactFactory { get; protected set; }

        #endregion

        #region Methods (public, virtual)

        /// <summary>
        /// Gets the stock information.
        /// </summary>
        /// <param name="storefront">The storefront.</param>
        /// <param name="products">The products.</param>
        /// <returns>The manager response which returns an enumerable collection of StockInformation in the Result.</returns>
        public virtual ManagerResponse<GetStockInformationResult, IEnumerable<StockInformation>> GetStockInformation([NotNull] CommerceStorefront storefront, IEnumerable<InventoryProduct> products)
        {
            Assert.ArgumentNotNull(storefront, "storefront");
            Assert.ArgumentNotNull(products, "products");

            var request = new GetStockInformationRequest(storefront.ShopName, products, StockDetailsLevel.Status) { Location = this._obecContext.InventoryLocation, VisitorId = this.ContactFactory.GetContact() };
            var result = this.InventoryServiceProvider.GetStockInformation(request);

            return new ManagerResponse<GetStockInformationResult, IEnumerable<StockInformation>>(result, result == null ? new List<StockInformation>() : result.StockInformation);
        }

        /// <summary>
        /// Gets the pre orderable information.
        /// </summary>
        /// <param name="storefront">The storefront.</param>
        /// <param name="products">The products.</param>
        /// <returns>The manager response which returns an enumerable collection of OrderableInformation in the Result.</returns>
        public virtual ManagerResponse<GetPreOrderableInformationResult, IEnumerable<OrderableInformation>> GetPreOrderableInformation([NotNull] CommerceStorefront storefront, IEnumerable<InventoryProduct> products)
        {
            Assert.ArgumentNotNull(storefront, "storefront");
            Assert.ArgumentNotNull(products, "products");

            var request = new GetPreOrderableInformationRequest(storefront.ShopName, products);
            var result = this.InventoryServiceProvider.GetPreOrderableInformation(request);

            return new ManagerResponse<GetPreOrderableInformationResult, IEnumerable<OrderableInformation>>(result, result == null ? new List<OrderableInformation>() : result.OrderableInformation);
        }

        /// <summary>
        /// Gets the back orderable information.
        /// </summary>
        /// <param name="storefront">The storefront.</param>
        /// <param name="products">The products.</param>
        /// <returns>The manager response which returns an enumerable collection of OrderableInformation in the Result.</returns>
        public virtual ManagerResponse<GetBackOrderableInformationResult, IEnumerable<OrderableInformation>> GetBackOrderableInformation([NotNull] CommerceStorefront storefront, IEnumerable<InventoryProduct> products)
        {
            Assert.ArgumentNotNull(storefront, "storefront");
            Assert.ArgumentNotNull(products, "products");
            
            var request = new GetBackOrderableInformationRequest(storefront.ShopName, products);
            var result = this.InventoryServiceProvider.GetBackOrderableInformation(request);

            return new ManagerResponse<GetBackOrderableInformationResult, IEnumerable<OrderableInformation>>(result, result == null ? new List<OrderableInformation>() : result.OrderableInformation);
        }

        /// <summary>
        /// Visiteds the product stock status.
        /// </summary>
        /// <param name="storefront">The storefront.</param>
        /// <param name="stockInformation">The stock information.</param>
        /// <param name="location">The location.</param>
        /// <returns>The manager response which returns success flag in the Result.</returns>
        public virtual ManagerResponse<VisitedProductStockStatusResult, bool> VisitedProductStockStatus([NotNull] CommerceStorefront storefront, StockInformation stockInformation, string location)
        {
            Assert.ArgumentNotNull(storefront, "storefront");
            Assert.ArgumentNotNull(stockInformation, "stockInformation");

            var request = new VisitedProductStockStatusRequest(storefront.ShopName, stockInformation) { Location = location };
            var result = this.InventoryServiceProvider.VisitedProductStockStatus(request);

            return new ManagerResponse<VisitedProductStockStatusResult, bool>(result, result.Success);
        }

        /// <summary>
        /// Visitors the sign up for stock notification.
        /// </summary>
        /// <param name="storefront">The storefront.</param>
        /// <param name="userId">The user identifier.</param>
        /// <param name="email">The email.</param>
        /// <param name="productId">The product identifier.</param>
        /// <param name="location">The location.</param>
        /// <param name="interestDate">The interest date.</param>
        /// <returns>
        /// The manager response which returns success flag in the Result.
        /// </returns>
        public virtual ManagerResponse<VisitorSignUpForStockNotificationResult, bool> VisitorSignupForStockNotification([NotNull] CommerceStorefront storefront, string userId, string email, string productId, string location, System.DateTime? interestDate)
        {
            Assert.ArgumentNotNull(storefront, "storefront");
            Assert.ArgumentNotNullOrEmpty(userId, "userId");
            Assert.ArgumentNotNullOrEmpty(productId, "productId");

            if (string.IsNullOrEmpty(email))
            {
                return new ManagerResponse<VisitorSignUpForStockNotificationResult, bool>(new VisitorSignUpForStockNotificationResult() { Success = false }, false);
            }

            var builder = new CommerceInventoryProductBuilder();
            var request = new VisitorSignUpForStockNotificationRequest(storefront.ShopName, userId, email, builder.CreateInventoryProduct(productId)) { Location = location, InterestDate = interestDate };
            var result = this.InventoryServiceProvider.VisitorSignUpForStockNotification(request);

            return new ManagerResponse<VisitorSignUpForStockNotificationResult, bool>(result, result.Success);
        }

        #endregion
    }
}
