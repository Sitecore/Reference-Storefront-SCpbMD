//---------------------------------------------------------------------
// <copyright file="TriggerVisitedCategoryPagePageEvent.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the TriggerVisitedCategoryPagePageEvent class.</summary>
//---------------------------------------------------------------------
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

namespace Sitecore.Commerce.Storefront.SitecorePipelines
{
    using Sitecore.Commerce.Pipelines.Common;
    using Sitecore.Commerce.Storefront.Services;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    /// <summary>
    /// Defines the processor that triggers the page event to track visits to the product details page.
    /// </summary>
    public class TriggerVisitedCategoryPagePageEvent : TriggerPageEvent
    {
        /// <summary>
        /// Gets the page event data.
        /// </summary>
        /// <param name="args">The arguments.</param>
        /// <returns>The page event data.</returns>
        protected override Dictionary<string, object> GetPageEventData(Pipelines.ServicePipelineArgs args)
        {
            Sitecore.Diagnostics.Assert.ArgumentNotNull(args, "args");

            var data = base.GetPageEventData(args) ?? new Dictionary<string, object>();
            var request = args.Request as VisitedCategoryPageRequest;
            if (request != null)
            {
                data.Add(Constants.PageEventDataNames.CategoryName, request.CategoryName);
                data.Add(Constants.PageEventDataNames.CatalogName, request.CatalogName ?? string.Empty);
            }

            return data;
        }
    }
}