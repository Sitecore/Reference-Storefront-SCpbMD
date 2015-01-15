//-----------------------------------------------------------------------
// <copyright file="ProfileJsonResult.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Emits the Json result of a profile details request.</summary>
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
    using Sitecore.Commerce.Services.Customers;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using System.Web;

    /// <summary>
    /// Defines the ProfileJsonResult class.
    /// </summary>
    public class ProfileJsonResult : BaseJsonResult
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ProfileJsonResult"/> class.
        /// </summary>
        public ProfileJsonResult()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ProfileJsonResult"/> class.
        /// </summary>
        /// <param name="result">The result.</param>
        public ProfileJsonResult(UpdateUserResult result)
        {
            this.SetResult(result);
        }

        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>
        /// The email.
        /// </value>
        [Display(Name = "Email")]
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the first name.
        /// </summary>
        /// <value>
        /// The first name.
        /// </value>
        [Display(Name = "First name")]
        public string FirstName { get; set; }

        /// <summary>
        /// Gets or sets the last name
        /// </summary>
        [Display(Name = "Last name")]
        public string LastName { get; set; }

        /// <summary>
        /// Gets or sets the telephone
        /// </summary>
        [Display(Name = "Telephone")]
        public string TelephoneNumber { get; set; }

        /// <summary>
        /// Sets the result.
        /// </summary>
        /// <param name="result">The result.</param>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1011:ConsiderPassingBaseTypesAsParameters")]
        public void SetResult(UpdateUserResult result)
        {
            if (result.CommerceUser != null)
            {
                this.Email = result.CommerceUser.Email;
                this.FirstName = result.CommerceUser.FirstName;
                this.LastName = result.CommerceUser.LastName;
                this.TelephoneNumber = result.Properties["Phone"] as string;
            }

            this.SetErrors(result);
        }
    }
}