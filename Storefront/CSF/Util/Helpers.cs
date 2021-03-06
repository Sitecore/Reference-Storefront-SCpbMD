﻿//---------------------------------------------------------------------
// <copyright file="Helpers.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Helper for the site template.</summary>
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

namespace Sitecore.Commerce.Storefront
{
    using System;
    using System.Collections.Generic;
    using Sitecore.Commerce.Services;

    /// <summary>
    /// Simple static methods for use in the MVC application.
    /// </summary>
    public static class Helpers
    {
        /// <summary>
        /// Items to skip when paging.
        /// </summary>
        /// <param name="page">Page requested.</param>
        /// <param name="itemsPerPage">Number of items per page.</param>
        /// <returns>Number of items to skip in subsequent query.</returns>
        public static int ItemsToSkip(string page, int itemsPerPage)
        {
            int pageAsInt;
            if (int.TryParse(page, out pageAsInt))
            {
                return (pageAsInt - 1) * itemsPerPage;
            }

            return 0;
        }

        /// <summary>
        /// Gets the image base URL and ensures that it has the correct protocol.
        /// </summary>
        /// <returns>Url as string for the base image path.</returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2234:PassSystemUriObjectsInsteadOfStrings", Justification = "I want to use them as strings.")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1055:UriReturnValuesShouldNotBeStrings", Justification = "I want to use them as strings.")]
        public static string GetImageBaseUrl()
        {
            return "http://lorempixel.com/";
        }

        /// <summary>
        /// This method returns a querystring parameter's value from within a View
        /// </summary>        
        /// <param name="parameterName">The name of the parameter</param>
        /// <returns>The value if found, null if not</returns>
        public static string GetQueryStringValue(string parameterName)
        {
            return Sitecore.Context.Request.GetQueryString(parameterName);
        }

        /// <summary>
        /// Logs the errors.
        /// </summary>
        /// <param name="messages">The messages.</param>
        /// <param name="owner">The owner.</param>
        public static void LogSystemMessages(IEnumerable<SystemMessage> messages, object owner)
        {
            foreach (var message in messages)
            {
                Sitecore.Diagnostics.Log.Error(message.Message, owner);
            }
        }

        /// <summary>
        /// Logs the exception.
        /// </summary>
        /// <param name="exception">The exception.</param>
        /// <param name="owner">The owner.</param>
        public static void LogException(Exception exception, object owner)
        {
            Sitecore.Diagnostics.Log.Error(exception.Message, exception, owner);
        }
    }
}