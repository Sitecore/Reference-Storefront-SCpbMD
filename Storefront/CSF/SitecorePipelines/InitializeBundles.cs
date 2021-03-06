﻿//---------------------------------------------------------------------
// <copyright file="InitializeBundles.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>The route ininitialization</summary>
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
    using Sitecore.Pipelines;
    using System.Web.Optimization;

    /// <summary>
    /// The initialize routes.
    /// </summary>
    public class InitializeBundles
    {
        /// <summary>
        /// The process.
        /// </summary>
        /// <param name="args">
        /// The args.
        /// </param>
        public void Process(PipelineArgs args)
        {
            if (!Context.IsUnitTesting)
            {
                BundleTable.EnableOptimizations = true;
                BundleConfig.RegisterBundles(BundleTable.Bundles);
            }
        }
    }
}