//-----------------------------------------------------------------------
// <copyright file="InstallPostStep.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the InstallPostStep class.</summary>
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
    using System.Collections.Specialized;
    using Sitecore.Install.Framework;

    /// <summary>
    /// A class used for post step work after installing packages.  
    /// </summary>
    public class InstallPostStep : IPostStep
    {
        /// <summary>
        /// The default localized content folder which will be found in the website\Temp folder
        /// </summary>
        private const string DefaultLocalizationFolder = "DynamicsRetail.Storefront";

        /// <summary>
        /// Runs the specified output.
        /// </summary>
        /// <param name="output">the output</param>
        /// <param name="metadata">the metadata</param>
        public void Run(ITaskOutput output, NameValueCollection metadata)
        {
            var postStep = new Sitecore.Commerce.Connect.CommerceServer.InstallPostStep(DefaultLocalizationFolder);
            postStep.Run(output, metadata);
        }
    }
}