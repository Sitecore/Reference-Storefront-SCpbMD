//-----------------------------------------------------------------------
// <copyright file="ResetPasswordJsonResult.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Emits the Json result of a reset password.</summary>
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
    using System.Linq;
    using System.Web;

    /// <summary>
    /// Defines the RegisterJsonResult class.
    /// </summary>
    public class ResetPasswordJsonResult : BaseJsonResult
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="RegisterJsonResult" /> class.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <param name="result">The result.</param>
        public ResetPasswordJsonResult(string userName, UpdatePasswordResult result)
            : base(result)
        {
            this.UserName = userName;
        }

        /// <summary>
        /// Gets the name of the user.
        /// </summary>
        /// <value>
        /// The name of the user.
        /// </value>
        public string UserName { get; set; }
    }
}