//-----------------------------------------------------------------------
// <copyright file="VisitorContext.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the VisitorContext class.</summary>
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

namespace Sitecore.Commerce.Storefront.Managers
{
    using System;
    using System.Linq;
    using System.Web;
    using Sitecore.Analytics;
    using Sitecore.Commerce.Entities.Customers;
    using Sitecore.Diagnostics;
    using Sitecore.Commerce.Contacts;
    using Sitecore.Commerce.Storefront.Managers.Storefront;

    /// <summary>
    /// Context object to host any collected or calculated visitor information so it can be passed to service calls
    /// </summary>
    public class VisitorContext
    {
        private string _userId = string.Empty;
        private CommerceUser _commerceUser;
        private const string VisitorTrackingCookieName = "_visitor";
        private const string VisitorIdKeyName = "visitorId";
        private const int VisitorCookieExpiryInDays = 1;

        /// <summary>
        /// Initializes a new instance of the <see cref="VisitorContext"/> class.
        /// </summary>
        /// <param name="contactFactory">The contact factory.</param>
        public VisitorContext([NotNull] ContactFactory contactFactory)
        {
            Assert.ArgumentNotNull(contactFactory, "contactFactory");

            this.ContactFactory = contactFactory;
        }

        /// <summary>
        /// Resolve the CommerceUser from the Visitor
        /// </summary>
        /// <param name="accountManager">The accountService to use to retrieve the CommerceUser</param>
        /// <returns>
        /// A commerce user
        /// </returns>
        public CommerceUser ResolveCommerceUser([NotNull] AccountManager accountManager)
        {
            if (Tracker.Current == null || Tracker.Current.Contact == null || Tracker.Current.Contact.ContactId == Guid.Empty)
            {
                // This only occurs if we are authenticated but there is no ExternalUser assigned.
                // This happens in preview mode we want to supply the default user to use in Preview mode
                // Tracker.Visitor.ExternalUser = "1";
                return new CommerceUser { FirstName = "Test", LastName = "User" };
            }

            Assert.IsNotNull(this.ContactFactory, "this.ContactFactory should not be null.");

            var userName = this.ContactFactory.GetContact();
            this._commerceUser = accountManager.GetUser(userName).Result;

            Assert.IsNotNull(this._commerceUser, "The user '{0}' could not be found.", userName);
            Assert.IsNotNull(this._commerceUser.Customers, "The user '{0}' does not contain a Customers collection.", userName);

            this._userId = _commerceUser.Customers.FirstOrDefault();
            return this._commerceUser;
        }

        /// <summary>
        /// Gets or sets the contact factory.
        /// </summary>
        /// <value>
        /// The contact factory.
        /// </value>
        public ContactFactory ContactFactory { get; protected set; }

        /// <summary>
        /// Gets the user id.
        /// </summary>
        /// <value>The user id.</value>
        public string UserId
        {
            get
            {
                // Use the VisitorId if we have not set a UserId
                if (string.IsNullOrEmpty(this._userId))
                {
                    return this.VisitorId;
                }

                return this._userId;
            }
        }

        /// <summary>
        /// Gets the name of the user.
        /// </summary>
        /// <value>
        /// The name of the user.
        /// </value>
        public string UserName
        {
            get
            {
                return this.ContactFactory.GetContact();
            }
        }

        /// <summary>
        /// Gets the visitor id.
        /// </summary>
        /// <value>The visitor id.</value>
        public string VisitorId
        {
            get
            {
                if (Tracker.Current != null && Tracker.Current.Contact != null && Tracker.Current.Contact.ContactId != Guid.Empty)
                {
                    return Tracker.Current.Contact.ContactId.ToString();
                }

                // If we get to this point there are a couple of reasons this could happen.
                // 1. Analytics may be turned of so the Tracker.Visitor will be an empty visitor
                // 2. We have hit the site through page editor or preview mode
                // Lets create our own tracking cookie for this visitor
                return GetVisitorTrackingId();
            }
        }

        /// <summary>
        /// Gets the current customer Id
        /// </summary>
        /// <returns>the id</returns>
        public string GetCustomerId()
        {
            return this.UserId;
        }

        /// <summary>
        /// Gets a visitor tracking ID from a cookie
        /// </summary>
        /// <returns>the id of this visitor</returns>
        /// <remarks>
        /// <para>
        /// Disclaimer:
        /// </para>
        /// <para>
        /// WARNING!
        /// As this is only sample code used for demonstration only, the below method SHOULD NEVER be used in a 
        /// production environment as it is vulnerable to CSRF and/or cookie highjacking/spoofing.
        /// </para>
        /// <para>
        /// Please use a more secure way of tracking visitors in a production environment.
        /// </para>
        /// </remarks>
        private static string GetVisitorTrackingId()
        {
            var visitorCookie = HttpContext.Current.Request.Cookies[VisitorTrackingCookieName] ?? new HttpCookie(VisitorTrackingCookieName);

            if (string.IsNullOrEmpty(visitorCookie.Values[VisitorIdKeyName]))
            {
                visitorCookie.Values[VisitorIdKeyName] = Guid.NewGuid().ToString("D");
            }

            visitorCookie.Expires = DateTime.Now.AddDays(VisitorCookieExpiryInDays);
            HttpContext.Current.Response.SetCookie(visitorCookie);
            return visitorCookie.Values[VisitorIdKeyName];
        }
    }
}