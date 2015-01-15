//-----------------------------------------------------------------------
// <copyright file="GetGiftCardJsonResult.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the GetGiftCardJsonResult class.</summary>
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
    using Sitecore.Commerce.Entities.GiftCards;
    using Sitecore.Commerce.Services.GiftCards;

    /// <summary>
    /// The Json result of a request to retrieve nearby store locations.
    /// </summary>
    public class GetGiftCardJsonResult : BaseJsonResult
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GetGiftCardJsonResult"/> class.
        /// </summary>
        public GetGiftCardJsonResult()
            : base()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="GetGiftCardJsonResult"/> class.
        /// </summary>
        /// <param name="result">The service provider result.</param>
        public GetGiftCardJsonResult(GetGiftCardResult result)
            : base(result)
        {
            if (result != null)
            {
                this.GiftCard = result.GiftCard;
            }
        }

        /// <summary>
        /// Gets or sets the gift card.
        /// </summary>
        public GiftCard GiftCard { get; set; }
    }
}