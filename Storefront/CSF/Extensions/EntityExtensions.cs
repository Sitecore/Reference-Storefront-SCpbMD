//---------------------------------------------------------------------
// <copyright file="EntityExtensions.cs" company="Sitecore Corporation">
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
    using Sitecore.Commerce.Entities.Customers;
    using System.ComponentModel;
    using System.Linq;
    using System.Reflection;

    /// <summary>
    /// Extensions for working with Commerce Entities in the MVC Site
    /// </summary>
    public static class EntityExtensions
    {
        /// <summary>
        /// Gets the value of the <see cref="T:System.ComponentModel.DescriptionAttribute"/> on an struct, including enums.  
        /// </summary>
        /// <typeparam name="T">The type of the struct.</typeparam>
        /// <param name="enumerationValue">A value of type <see cref="T:System.Enum"/></param>
        /// <returns>If the struct has a Description attribute, this method returns the description.  Otherwise it just calls ToString() on the struct.</returns>
        /// <remarks>Based on http://stackoverflow.com/questions/479410/enum-tostring/479417#479417, but useful for any struct.</remarks>
        public static string GetDescription<T>(this T enumerationValue) where T : struct
        {
            return enumerationValue.GetType().GetMember(enumerationValue.ToString())
                    .SelectMany(mi => mi.GetCustomAttributes<DescriptionAttribute>(false), (mi, ca) => ca.Description)
                    .FirstOrDefault() ?? enumerationValue.ToString();
        }

        /// <summary>
        /// Sets the property value.
        /// </summary>
        /// <param name="user">The customer to set the property in.</param>
        /// <param name="key">The key to access the property value.</param>
        /// <param name="value">The property value.</param>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1011:ConsiderPassingBaseTypesAsParameters", Justification = "by design")]
        public static void SetPropertyValue(this CommerceCustomer user, string key, object value)
        {
            user.Properties.Add(key, value);
        }

        /// <summary>
        /// Sets the property value.
        /// </summary>
        /// <param name="user">The user to set the property in.</param>
        /// <param name="key">The key value to add to list of CommerceModel properties.</param>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1011:ConsiderPassingBaseTypesAsParameters", Justification = "by design")]
        public static void SetPropertyValue(this CommerceCustomer user, string key)
        {
            user.Properties.Add(key, null);
        }

        /// <summary>
        /// Gets the property value.
        /// </summary>
        /// <param name="user">The user to get the property from.</param>
        /// <param name="key">The key value for the CommerceModel property.</param>
        /// <returns>
        /// CommerceModel property value.
        /// </returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1011:ConsiderPassingBaseTypesAsParameters", Justification = "by design")]
        public static object GetPropertyValue(this CommerceCustomer user, string key)
        {
            return user.Properties[key];
        }
    }
}
