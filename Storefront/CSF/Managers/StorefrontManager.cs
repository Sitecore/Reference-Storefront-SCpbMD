//-----------------------------------------------------------------------
// <copyright file="StorefrontManager.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the StorefrontManager class.</summary>
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

namespace Sitecore.Commerce.Storefront.Managers
{
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;

    using Sitecore.Data.Items;
    using Sitecore.Collections;

    using Sitecore.Commerce.Connect.CommerceServer;

    using Sitecore.Commerce.Storefront.Models.SitecoreItemModels;


    /// <summary>
    /// The manager for storefronts
    /// </summary>
    public static class StorefrontManager
    {
        const string separator = "/";

        const string _storefrontUrlKey = "storefronts";

        private static readonly List<CommerceStorefront> _storefronts = new List<CommerceStorefront>();

        /// <summary>
        /// Known Storefronts
        /// </summary>
        public static List<CommerceStorefront> Storefronts
        {
            get
            {
                if (_storefronts.Count == 0)
                {
                    var storefrontsItem = Sitecore.Context.Database.GetItem("/sitecore/content/Home/Storefronts");
                    var storefrontItems = storefrontsItem.GetChildren(ChildListOptions.AllowReuse);

                    foreach (Item storefrontItem in storefrontItems)
                    {
                        var storefront = new CommerceStorefront(storefrontItem);
                        _storefronts.Add(storefront);
                    }
                }
                return _storefronts;
            }
        }

        /// <summary>
        /// The current sitecontext
        /// </summary>
        public static ISiteContext CurrentSiteContext
        {
            get
            {
                return CommerceTypeLoader.CreateInstance<ISiteContext>();
            }
        }

        /// <summary>
        /// Gets a value indicating whether this instance is in new storefront.
        /// </summary>
        /// <value>
        /// <c>true</c> if this instance is in new storefront; otherwise, <c>false</c>.
        /// </value>
        public static bool IsInStorefront
        {
            get
            {
                string path = Sitecore.Context.Site.RootPath + Sitecore.Context.Site.StartItem;
                Item item = Sitecore.Context.Database.GetItem(path);
                if (item != null && item.TemplateID == StorefrontConstants.KnownTemplateItemIds.Home)
                {
                    // TODO: There must be some utility in SC to verify if an item is ultimitely derived from a template.  Above code is not adequate.
                    return true;
                }

                return false;
            }
        }


        /// <summary>
        /// Returns a URL for the current storefronts home page
        /// </summary>
        public static string StorefrontHome
        {
            get
            {
                if (IsInStorefront)
                {
                    return "/"; // Context.Site.RootPath + Context.Site.StartItem;
                }

                return "";
            }
        }

        /// <summary>
        /// Returns a proper local URI for a route
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1055:UriReturnValuesShouldNotBeStrings")]
        public static string StorefrontUri(string route)
        {
            return route;
        }

        /// <summary>
        /// The Current Storefront being accessed
        /// </summary>
        public static CommerceStorefront CurrentStorefront
        {
            get
            {
                if (IsInStorefront)
                {
                    string path = Sitecore.Context.Site.RootPath + Sitecore.Context.Site.StartItem;
                    return new CommerceStorefront(Sitecore.Context.Database.GetItem(path));
                }

                //If We are not under a storefront node then use the default storefront
                return new CommerceStorefront();
            }
        }
    }
}