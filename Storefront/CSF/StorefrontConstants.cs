//-----------------------------------------------------------------------
// <copyright file="StorefrontConstants.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Storefront constant definition.</summary>
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

namespace Sitecore.Commerce.Storefront
{
    using Sitecore.Data;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    /// <summary>
    /// Defines the StorefrontConstants class.
    /// </summary>
    public static class StorefrontConstants
    {
        /// <summary>
        /// Know template item IDs.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1034:NestedTypesShouldNotBeVisible")]
        public static class KnownTemplateItemIds
        {
            /// <summary>
            /// The home template id
            /// </summary>
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2104:DoNotDeclareReadOnlyMutableReferenceTypes")]
            public static readonly ID Home = new ID("{FB9DBD60-CBA2-490D-9C72-997271D576A3}");
        }

        /// <summary>
        /// Known site context custom properties.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1034:NestedTypesShouldNotBeVisible")]
        public static class KnownSiteContextProperties
        {
            /// <summary>
            /// The shop name
            /// </summary>
            public static readonly string ShopName = "shopName";
        }

        /// <summary>
        /// Known storefront field names.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1034:NestedTypesShouldNotBeVisible")]
        public static class KnownFieldNames
        {
            /// <summary>
            /// The cancel field.
            /// </summary>
            public static readonly string Cancel = "Cancel";

            /// <summary>
            /// The create user field.
            /// </summary>
            public static readonly string CreateUser = "Create user";

            /// <summary>
            /// The customer message1 field.
            /// </summary>
            public static readonly string CustomerMessage1 = "Customer Message 1";

            /// <summary>
            /// The customer message2
            /// </summary>
            public static readonly string CustomerMessage2 = "Customer Message 2";

            /// <summary>
            /// The email
            /// </summary>
            public static readonly string Email = "Email";

            /// <summary>
            /// The email address placeholder field.
            /// </summary>
            public static readonly string EmailAddressPlaceholder = "Email Address Placeholder";

            /// <summary>
            /// The email missing message
            /// </summary>
            public static readonly string EmailMissingMessage = "Email Missing Message";

            /// <summary>
            /// The facebook button field.
            /// </summary>
            public static readonly string FacebookButton = "Facebook Button";

            /// <summary>
            /// The facebook text field.
            /// </summary>
            public static readonly string FacebookText = "Facebook Text";

            /// <summary>
            /// The first name
            /// </summary>
            public static readonly string FirstName = "First Name";

            /// <summary>
            /// The first name placeholder field.
            /// </summary>
            public static readonly string FirstNamePlaceholder = "First Name Placeholder";

            /// <summary>
            /// The fill form message
            /// </summary>
            public static readonly string FillFormMessage = "Fill Form Message";

            /// <summary>
            /// The guest checkout button
            /// </summary>
            public static readonly string GuestCheckoutButton = "Guest Checkout Button";

            /// <summary>
            /// The last name
            /// </summary>
            public static readonly string LastName = "Last Name";

            /// <summary>
            /// The last name placeholder field.
            /// </summary>
            public static readonly string LastNamePlaceholder = "Last Name Placeholder";

            /// <summary>
            /// The password
            /// </summary>
            public static readonly string Password = "Password";

            /// <summary>
            /// The passwords do not match message field.
            /// </summary>
            public static readonly string PasswordsDoNotMatchMessage = "Passwords Do Not Match Message";

            /// <summary>
            /// The password length message field.
            /// </summary>
            public static readonly string PasswordLengthMessage = "Password Length Message";

            /// <summary>
            /// The password missing message field.
            /// </summary>
            public static readonly string PasswordMissingMessage = "Password Missing Message";

            /// <summary>
            /// The password again field.
            /// </summary>
            public static readonly string PasswordAgain = "Password Again";

            /// <summary>
            /// The password placholder field.
            /// </summary>
            public static readonly string PasswordPlaceholder = "Password Placeholder";

            /// <summary>
            /// The sign in button field.
            /// </summary>
            public static readonly string SignInButton = "Sign In Button";

            /// <summary>
            /// The show always field.
            /// </summary>
            public static readonly string ShowAlways = "Show Always";

            /// <summary>
            /// The show when autenticated field.
            /// </summary>
            public static readonly string ShowWhenAuthenticated = "Show when Authenticated";

            /// <summary>
            /// The use ax checkout control field.
            /// </summary>
            public static readonly string UseAXCheckoutControl = "Use AX Checkout Control";
        }
    }
}