//-----------------------------------------------------------------------
// <copyright file="AddressListJsonResult.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the AddressListJsonResult class.</summary>
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
    using Sitecore.Diagnostics;
    using System.Collections.Generic;
    using Sitecore.Commerce.Connect.DynamicsRetail.Entities;
    using Sitecore.Mvc.Extensions;

    /// <summary>
    /// Json result for list of parties operations.
    /// </summary>
    public class AddressListItemJsonResult : BaseJsonResult
    {
        private readonly List<AddressItemJsonResult> _addresses = new List<AddressItemJsonResult>();
        private readonly Dictionary<string, string> _countries = new Dictionary<string, string>();

        /// <summary>
        /// Initializes a new instance of the <see cref="AddressListItemJsonResult" /> class.
        /// </summary>
        /// <param name="addresses">The addresses.</param>
        /// <param name="countries">The countries.</param>
        public AddressListItemJsonResult(IEnumerable<CommerceParty> addresses, Dictionary<string, string> countries)
        {
            Assert.ArgumentNotNull(addresses, "addresses");

            foreach (var address in addresses)
            {
                this._addresses.Add(new AddressItemJsonResult(address));
            }

            if (countries != null && countries.Count > 0)
            {
                this.Countries.AddRange(countries);
            }
        }

        /// <summary>
        /// The addresses.
        /// </summary>
        public List<AddressItemJsonResult> Addresses 
        { 
            get 
            { 
                return this._addresses; 
            } 
        }

        /// <summary>
        /// The available countries.
        /// </summary>
        public Dictionary<string, string> Countries 
        { 
            get 
            {
                return this._countries; 
            } 
        }
    }
}