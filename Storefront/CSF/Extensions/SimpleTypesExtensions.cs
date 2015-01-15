//---------------------------------------------------------------------
// <copyright file="SimpleTypesExtensions.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Extensions for dealing with Commerce Server entities.</summary>
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

namespace Sitecore.Commerce.Storefront.Extensions
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Web;

    /// <summary>
    /// Some utility extension methods for simple types
    /// </summary>
    public static class SimpleTypesExtensions
    {
        /// <summary>
        /// Turns a decimal value into a currency string
        /// </summary>
        /// <param name="currency">The decimal objet to act on</param>
        /// <returns>A decimal formatted as a string</returns>
        public static string ToCurrency(this decimal? currency)
        {
            return string.Format(CultureInfo.CurrentCulture, "{0:C}", currency.HasValue ? currency : 0);
        }

        /// <summary>
        /// Turns a decimal value into a currency string
        /// </summary>
        /// <param name="currency">The decimal objet to act on</param>
        /// <returns>A decimal formatted as a string</returns>
        public static string ToCurrency(this decimal currency)
        {
            return string.Format(CultureInfo.CurrentCulture, "{0:C}", currency);
        }
    }
}