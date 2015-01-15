//-----------------------------------------------------------------------
// <copyright file="LoyaltyCardsJsonResult.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the LoyaltyCardsJsonResult class.</summary>
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
    using Sitecore.Commerce.Entities.LoyaltyPrograms;

    /// <summary>
    /// Json result for loyalty cards operations.
    /// </summary>
    public class LoyaltyCardsJsonResult : BaseJsonResult
    {
        private readonly List<LoyaltyCardItemJsonResult> _cards = new List<LoyaltyCardItemJsonResult>();

        /// <summary>
        /// Initializes a new instance of the <see cref="LoyaltyCardsJsonResult" /> class.
        /// </summary>
        /// <param name="loyaltyCards">The loyalty cards.</param>
        public LoyaltyCardsJsonResult(IEnumerable<LoyaltyCard> loyaltyCards)
        {
            Assert.ArgumentNotNull(loyaltyCards, "loyaltyCards");

            foreach (var card in loyaltyCards)
            {
                this._cards.Add(new LoyaltyCardItemJsonResult(card));
            }
        }

        /// <summary>
        /// The loyalty cards.
        /// </summary>
        public List<LoyaltyCardItemJsonResult> LoyaltyCards 
        { 
            get 
            {
                return this._cards; 
            } 
        }
    }
}