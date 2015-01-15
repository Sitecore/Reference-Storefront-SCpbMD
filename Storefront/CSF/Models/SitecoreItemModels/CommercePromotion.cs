//-----------------------------------------------------------------------
// <copyright file="CommercePromotion.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the CommercePromotion class.</summary>
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

namespace Sitecore.Commerce.Storefront.Models.SitecoreItemModels
{
    using Sitecore.Commerce.Storefront.Managers;
    using Sitecore.Links;
    using System.Collections.Generic;
    using Sitecore.Data.Fields;
    using Sitecore.Data.Items;

    /// <summary>
    /// CommercePromotion class
    /// </summary>
    public class CommercePromotion : SitecoreItemBase
    {
        private List<MediaItem> _images;
        private readonly UrlOptions _options = new UrlOptions
        {
            AddAspxExtension = false,
            LanguageEmbedding = LanguageEmbedding.Never
        };

        /// <summary>
        /// Initializes a new instance of the <see cref="CommercePromotion"/> class.
        /// </summary>
        /// <param name="item">The item.</param>
        public CommercePromotion(Item item)
        {
            Item = item; 
        }

        /// <summary>
        /// Gets the images.
        /// </summary>
        /// <value>
        /// The images.
        /// </value>
        public List<MediaItem> Images
        {
            get
            {
                if (_images != null)
                {
                    return _images;
                }

                _images = new List<MediaItem>();
                MultilistField field = Item.Fields["Images"];

                if (field != null)
                {
                    foreach (var id in field.TargetIDs)
                    {
                        MediaItem mediaItem = Item.Database.GetItem(id);
                        _images.Add(mediaItem);
                    }
                }

                return _images;
            }
        }

        /// <summary>
        /// Gets the landing page.
        /// </summary>
        /// <value>
        /// The landing page.
        /// </value>
        public string LandingPage
        {
            get
            {
                var landingPageId = Item["Landing Page"];
                var item = Item.Database.GetItem(landingPageId);
                if (item == null)
                {
                    return StorefrontManager.StorefrontHome;
                }
                return LinkManager.GetItemUrl(item, _options);
            }
        }
    }
}