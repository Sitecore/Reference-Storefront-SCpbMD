//-----------------------------------------------------------------------
// <copyright file="WishListsJsonResult.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the WishListsJsonResult class.</summary>
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
    using Sitecore.Commerce.Entities.WishLists;
    using Sitecore.Diagnostics;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    /// <summary>
    /// Json result for wish lists operations.
    /// </summary>
    public class WishListsJsonResult : BaseJsonResult
    {
        private List<WishListHeaderItemJsonResult> _wishLists = new List<WishListHeaderItemJsonResult>();

        /// <summary>
        /// Initializes a new instance of the <see cref="WishListsJsonResult"/> class.
        /// </summary>
        /// <param name="wishLists">The list of whish lists.</param>
        public WishListsJsonResult(IEnumerable<WishListHeader> wishLists)
        {
            Assert.ArgumentNotNull(wishLists, "wishLists");

            foreach (var wishList in wishLists)
            {
                this._wishLists.Add(new WishListHeaderItemJsonResult(wishList));
            }
        }

        /// <summary>
        /// The wish lists.
        /// </summary>
        public List<WishListHeaderItemJsonResult> WishLists 
        { 
            get 
            { 
                return this._wishLists; 
            } 
        }
    }
}