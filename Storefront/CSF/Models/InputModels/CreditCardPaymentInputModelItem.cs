//-----------------------------------------------------------------------
// <copyright file="CreditCardPaymentInputModelItem.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2014
// </copyright>
// <summary>InputModel item parameter accepting credit card payment information.</summary>
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

namespace Sitecore.Commerce.Storefront.Models.InputModels
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    /// <summary>
    /// Defines the CreditCardPaymentInputModelItem class.
    /// </summary>
    public class CreditCardPaymentInputModelItem
    {
        /// <summary>
        /// Gets or sets the credit card number.
        /// </summary>
        /// <value>
        /// The credit card number.
        /// </value>
        public string CreditCardNumber { get; set; }

        /// <summary>
        /// Gets or sets the payment method identifier.
        /// </summary>
        /// <value>
        /// The payment method identifier.
        /// </value>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "ID")]
        public string PaymentMethodID { get; set; }

        /// <summary>
        /// Gets or sets the validation code.
        /// </summary>
        /// <value>
        /// The validation code.
        /// </value>
        public string ValidationCode { get; set; }

        /// <summary>
        /// Gets or sets the expiration month.
        /// </summary>
        /// <value>
        /// The expiration month.
        /// </value>
        public int ExpirationMonth { get; set; }

        /// <summary>
        /// Gets or sets the expiration year.
        /// </summary>
        /// <value>
        /// The expiration year.
        /// </value>
        public int ExpirationYear { get; set; }

        /// <summary>
        /// Gets or sets the customer name on payment.
        /// </summary>
        /// <value>
        /// The customer name on payment.
        /// </value>
        public string CustomerNameOnPayment { get; set; }

        /// <summary>
        /// Gets or sets the amount.
        /// </summary>
        /// <value>
        /// The amount.
        /// </value>
        public decimal Amount { get; set; }

        /// <summary>
        /// Gets or sets the party identifier.
        /// </summary>
        /// <value>
        /// The party identifier.
        /// </value>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "ID")]
        public string PartyID { get; set; }
    }
}