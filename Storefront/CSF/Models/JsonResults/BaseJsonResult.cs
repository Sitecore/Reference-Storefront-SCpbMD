//-----------------------------------------------------------------------
// <copyright file="BaseJsonResult.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the BaseJsonResult class.</summary>
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
    using Sitecore.Commerce.Services;
    using System.Collections.Generic;
    using System.Web.Mvc;
    using System.Linq;

    /// <summary>
    /// Defines the BaseJsonResult class.
    /// </summary>
    public class BaseJsonResult : JsonResult
    {
        private readonly List<string> _errors = new List<string>();

        /// <summary>
        /// Initializes a new instance of the <see cref="BaseJsonResult"/> class.
        /// </summary>
        public BaseJsonResult()
            : this(null)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="BaseJsonResult"/> class.
        /// </summary>
        /// <param name="result">The service provider result.</param>
        public BaseJsonResult(ServiceProviderResult result)
        {
            if (result != null)
            {
                this.SetErrors(result);
            }
        }

        /// <summary>
        /// Gets the errors.
        /// </summary>
        /// <value>
        /// The errors.
        /// </value>
        public List<string> Errors
        {
            get { return _errors; }
        }

        /// <summary>
        /// Sets the errors.
        /// </summary>
        /// <param name="result">The result.</param>
        public void SetErrors(ServiceProviderResult result)
        {
            this.Errors.AddRange(result.SystemMessages.Select(m => m.Message));
        }
    }
}