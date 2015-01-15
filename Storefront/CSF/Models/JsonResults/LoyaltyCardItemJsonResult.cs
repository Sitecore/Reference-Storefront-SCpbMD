//-----------------------------------------------------------------------
// <copyright file="LoyaltyCardItemJsonResult.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the LoyaltyCardItemJsonResult class.</summary>
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
    using Sitecore.Commerce.Entities.LoyaltyPrograms;
    using Sitecore.Commerce.Storefront.Managers;
    using System.Collections.Generic;
    using Sitecore.Diagnostics;

    /// <summary>
    /// Json result for loyalty cards operations.
    /// </summary>
    public class LoyaltyCardItemJsonResult
    {
        private readonly List<LoyaltyRewardPointItemJsonResult> _points = new List<LoyaltyRewardPointItemJsonResult>();
        private readonly List<LoyaltyProgramItemJsonResult> _programs = new List<LoyaltyProgramItemJsonResult>();

        /// <summary>
        /// Initializes a new instance of the <see cref="LoyaltyCardItemJsonResult" /> class.
        /// </summary>
        /// <param name="loyaltyCard">The loyalty card.</param>
        public LoyaltyCardItemJsonResult(LoyaltyCard loyaltyCard)
        {
            Assert.ArgumentNotNull(loyaltyCard, "loyaltyCard");

            this.CardNumber = loyaltyCard.CardNumber;

            foreach (var point in loyaltyCard.RewardPoints)
            {
                this._points.Add(new LoyaltyRewardPointItemJsonResult(point));
            }

            foreach (var program in ((Sitecore.Commerce.Connect.DynamicsRetail.Entities.LoyaltyPrograms.LoyaltyCard)loyaltyCard).LoyaltyPrograms)
            {
                this._programs.Add(new LoyaltyProgramItemJsonResult(program));
            }
        }

        /// <summary>
        /// Gets or sets the card number.
        /// </summary>
        /// <value>
        /// The card number.
        /// </value>
        public string CardNumber { get; set; }

        /// <summary>
        /// Gets the programs.
        /// </summary>
        /// <value>
        /// The programs.
        /// </value>
        public List<LoyaltyProgramItemJsonResult> Programs
        {
            get
            {
                return this._programs;
            }
        }

        /// <summary>
        /// Gets the reward points.
        /// </summary>
        /// <value>
        /// The reward points.
        /// </value>
        public List<LoyaltyRewardPointItemJsonResult> RewardPoints
        {
            get
            {
                return this._points;
            }
        }
    }
}