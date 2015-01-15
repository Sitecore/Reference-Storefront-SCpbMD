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
    using Sitecore.Commerce.Connect.CommerceServer;
    using Sitecore.Commerce.Connect.CommerceServer.Search;

    /// <summary>
    /// BaseManager class
    /// </summary> 
    public class BaseManager
    {
        private ICommerceSearchManager _currentSearchManager;
        private ISiteContext _siteContext;

        /// <summary>
        /// Gets the currently loaded Search Manager
        /// Instantiates a new one if one is not loaded
        /// </summary>
        public ICommerceSearchManager CurrentSearchManager
        {
            get {
                return _currentSearchManager ??
                       (_currentSearchManager = CommerceTypeLoader.CreateInstance<ICommerceSearchManager>());
            }
        }

        /// <summary>
        /// The current sitecontext
        /// </summary>
        public ISiteContext CurrentSiteContext
        {
            get { return _siteContext ?? (_siteContext = CommerceTypeLoader.CreateInstance<ISiteContext>()); }
        }
    }
}