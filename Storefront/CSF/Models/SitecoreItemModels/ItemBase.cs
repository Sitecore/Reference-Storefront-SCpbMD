//-----------------------------------------------------------------------
// <copyright file="SitecoreItemBase.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the SitecoreItemBase class.</summary>
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
    using System.Web;
    using System.Linq;
    using Sitecore.Data.Items;
    using Sitecore.Mvc;
    using Sitecore.Mvc.Presentation;
    using Sitecore.ContentSearch.Linq.Extensions;

    /// <summary>
    /// Base class for Sitecore Item wrappers
    /// </summary>
    public class SitecoreItemBase
    {
        /// <summary>
        /// The _item
        /// </summary>
        protected Item Item;

        /// <summary>
        /// Gets the inner item.
        /// </summary>
        /// <value>
        /// The inner item.
        /// </value>
        public Item InnerItem { get { return Item; } }

        /// <summary>
        /// The Id for this Item
        /// </summary>
        public string Id
        {
            get { return Item.ID.ToShortID().ToString(); }
        }

        /// <summary>
        /// General purpose field renderer
        /// </summary>
        /// <param name="fieldName">the field to render</param>
        /// <returns></returns>
        public HtmlString RenderField(string fieldName)
        {
            return PageContext.Current.HtmlHelper.Sitecore().Field(fieldName, Item);
        }

        /// <summary>
        /// Gets the field.
        /// </summary>
        /// <param name="fieldName">Name of the field.</param>
        /// <returns></returns>
        public string GetField(string fieldName)
        {
            return Item[fieldName];
        }

        /// <summary>
        /// Gets the field with default.
        /// </summary>
        /// <param name="fieldName">Name of the field.</param>
        /// <param name="defaultValue">The default value.</param>
        /// <returns></returns>
        public string GetFieldWithDefault(string fieldName, string defaultValue)
        {
            return Item == null ? defaultValue : Item[fieldName];
        }

    }
}