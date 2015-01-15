//-----------------------------------------------------------------------
// <copyright file="GetNearbyStoresJsonResult.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the GetNearbyStoresJsonResult class.</summary>
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
    using Sitecore.Commerce.Connect.DynamicsRetail.Entities.Stores;
    using Sitecore.Commerce.Connect.DynamicsRetail.Services.Stores;
    using Sitecore.Commerce.Services;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    /// <summary>
    /// The Json result of a request to retrieve nearby store locations.
    /// </summary>
    public class GetNearbyStoresJsonResult : BaseJsonResult
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GetNearbyStoresJsonResult"/> class.
        /// </summary>
        public GetNearbyStoresJsonResult()
            : base()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="GetNearbyStoresJsonResult"/> class.
        /// </summary>
        /// <param name="result">The service provider result.</param>
        public GetNearbyStoresJsonResult(GetNearbyStoresResult result)
            : base(result)
        {
            if (result != null)
            {
                this.Stores = result.Stores;
            }
        }

        /// <summary>
        /// Gets or sets the nearby stores.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Required for javascript integration.")]
        public IEnumerable<Store> Stores { get; set; }
    }
}