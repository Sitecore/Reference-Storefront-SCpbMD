//-----------------------------------------------------------------------
// <copyright file="AddressViewModel.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
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

namespace Sitecore.Commerce.Storefront.Models
{
    using System;

    /// <summary>
    /// Partial class for working with Order system addresses in Commerce Server.
    /// </summary>
    public partial class AddressViewModel : Mvc.Presentation.RenderingModel
    {
            // private string modelName = "Address";
            #region Entity Properties

            /// <summary>
            /// Gets or sets the ProfileAddressId property.
            /// </summary>
            /// <value>
            /// The ProfileAddressId property from the property collection.
            /// </value>
            public virtual string ProfileAddressId
            {
                get;
                set;
            }

            /// <summary>
            /// Gets or sets the City property.
            /// </summary>
            /// <value>
            /// The City property from the property collection.
            /// </value>
            public virtual string City
            {
                get;
                set;
            }

            /// <summary>
            /// Gets or sets the Telephone property.
            /// </summary>
            /// <value>
            /// The Telephone property from the property collection.
            /// </value>
            public virtual string Telephone
            {
                get;
                set;
            }

            /// <summary>
            /// Gets or sets the ZipPostalCode property.
            /// </summary>
            /// <value>
            /// The ZipPostalCode property from the property collection.
            /// </value>
            public virtual string ZipPostalCode
            {
                get;
                set;
            }

            /// <summary>
            /// Gets or sets the State property.
            /// </summary>
            /// <value>
            /// The State property from the property collection.
            /// </value>
            public virtual string State
            {
                get;
                set;
            }

            /// <summary>
            /// Gets or sets the Organization property.
            /// </summary>
            /// <value>
            /// The Organization property from the property collection.
            /// </value>
            public virtual string Organization
            {
                get;
                set;
            }

            /// <summary>
            /// Gets or sets the EveningPhoneNumber property.
            /// </summary>
            /// <value>
            /// The EveningPhoneNumber property from the property collection.
            /// </value>
            public virtual string EveningPhoneNumber
            {
                get;
                set;
            }

            /// <summary>
            /// Gets or sets the FaxNumber property.
            /// </summary>
            /// <value>
            /// The FaxNumber property from the property collection.
            /// </value>
            public virtual string FaxNumber
            {
                get;
                set;
            }

            /// <summary>
            /// Gets or sets the FirstName property.
            /// </summary>
            /// <value>
            /// The FirstName property from the property collection.
            /// </value>
            public virtual string FirstName
            {
                get;
                set;
            }

            /// <summary>
            /// Gets or sets the CountryRegionName property.
            /// </summary>
            /// <value>
            /// The CountryRegionName property from the property collection.
            /// </value>
            public virtual string CountryRegionName
            {
                get;
                set;
            }

            /// <summary>
            /// Gets or sets the StateProvinceCode property.
            /// </summary>
            /// <value>
            /// The StateProvinceCode property from the property collection.
            /// </value>
            public virtual string StateProvinceCode
            {
                get;
                set;
            }

            /// <summary>
            /// Gets or sets the Line1 property.
            /// </summary>
            /// <value>
            /// The Line1 property from the property collection.
            /// </value>
            public virtual string Line1
            {
                get;
                set;
            }

            /// <summary>
            /// Gets or sets the Line2 property.
            /// </summary>
            /// <value>
            /// The Line2 property from the property collection.
            /// </value>
            public virtual string Line2
            {
                get;
                set;
            }

            /// <summary>
            /// Gets or sets the LastName property.
            /// </summary>
            /// <value>
            /// The LastName property from the property collection.
            /// </value>
            public virtual string LastName
            {
                get;
                set;
            }

            /// <summary>
            /// Gets or sets the OrderGroupId property.
            /// </summary>
            /// <value>
            /// The OrderGroupId property from the property collection.
            /// </value>
            public virtual Guid? OrderGroupId
            {
                get;
                set;
            }

            /// <summary>
            /// Gets or sets the CountryRegionCode property.
            /// </summary>
            /// <value>
            /// The CountryRegionCode property from the property collection.
            /// </value>
            public virtual string CountryRegionCode
            {
                get;
                set;
            }

            /// <summary>
            /// Gets or sets the StateProvinceName property.
            /// </summary>
            /// <value>
            /// The StateProvinceName property from the property collection.
            /// </value>
            public virtual string StateProvinceName
            {
                get;
                set;
            }

            /// <summary>
            /// Gets or sets the Email property.
            /// </summary>
            /// <value>
            /// The Email property from the property collection.
            /// </value>
            public virtual string Email
            {
                get;
                set;
            }

            /// <summary>
            /// Gets or sets the AddressName property.
            /// </summary>
            /// <value>
            /// The AddressName property from the property collection.
            /// </value>
            public virtual string AddressName
            {
                get;
                set;
            }

            #endregion

            #region CommerceEntity Properties
        
            /// <summary>
            /// Gets or sets the Id Property.
            /// </summary>
            public string Id
            {
                get;
                set;
            }

            #endregion
    }
}