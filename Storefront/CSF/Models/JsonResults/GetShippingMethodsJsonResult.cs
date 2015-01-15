//-----------------------------------------------------------------------
// <copyright file="GetShippingMethodsJsonResult.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the GetShippingMethodsJsonResult class.</summary>
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

namespace Sitecore.Commerce.Storefront.Models.JsonResults
{
    using Sitecore.Commerce.Connect.DynamicsRetail.Entities.Shipping;
    using Sitecore.Commerce.Connect.DynamicsRetail.Entities.Stores;
    using Sitecore.Commerce.Connect.DynamicsRetail.Services.Shipping;
    using Sitecore.Commerce.Connect.DynamicsRetail.Services.Stores;
    using Sitecore.Commerce.Entities.Shipping;
    using Sitecore.Commerce.Services;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    /// <summary>
    /// The Json result of a request to retrieve nearby store locations.
    /// </summary>
    public class GetShippingMethodsJsonResult : BaseJsonResult
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GetShippingMethodsJsonResult"/> class.
        /// </summary>
        public GetShippingMethodsJsonResult()
            : base()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="GetShippingMethodsJsonResult"/> class.
        /// </summary>
        /// <param name="result">The service provider result.</param>
        public GetShippingMethodsJsonResult(GetDeliveryMethodsResult result)
            : base(result)
        {
            if (result != null)
            {
                this.ShippingMethods = result.ShippingMethods;
                this.LineShippingMethods = result.ShippingMethodsPerItems;
            }
        }

        /// <summary>
        /// Gets or sets the available order-level shipping methods.
        /// </summary>
        public IEnumerable<ShippingMethod> ShippingMethods { get; set; }

        /// <summary>
        /// Gets or sets the available line item shipping methods.
        /// </summary>
        public IEnumerable<ShippingMethodPerItem> LineShippingMethods { get; set; }
    }
}