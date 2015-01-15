﻿//---------------------------------------------------------------------
// <copyright file="InputModelExtension.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Extensions for dealing with the translation of action requests .</summary>
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
    using Sitecore.Commerce.Connect.CommerceServer.Orders.Models;
    using Sitecore.Commerce.Connect.DynamicsRetail.Entities.Carts;
    using Sitecore.Commerce.Entities.GiftCards;
    using Sitecore.Commerce.Entities.LoyaltyPrograms;
    using Sitecore.Commerce.Entities.Shipping;
    using Sitecore.Commerce.Storefront.Models.InputModels;
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;

    /// <summary>
    /// Define the InputModelExtension class.
    /// </summary>
    public static class InputModelExtension
    {
        #region PartyInputModelItem => Sitecore.Commerce.Connect.DynamicsRetail.Models.CommerceParty

        /// <summary>
        /// To the parties.
        /// </summary>
        /// <param name="items">The items.</param>
        /// <returns>The translated list of CommerceParty objects.</returns>
        public static List<Sitecore.Commerce.Connect.DynamicsRetail.Entities.CommerceParty> ToParties(this IEnumerable<PartyInputModelItem> items)
        {
            return (from PartyInputModelItem item in items select item.ToParty()).ToList();
        }

        /// <summary>
        /// To the party.
        /// </summary>
        /// <param name="item">The item.</param>
        /// <returns>The CommerceParty instance.</returns>
        // TODO: Move the translators into another area as they can be shared with other managers.
        public static Sitecore.Commerce.Connect.DynamicsRetail.Entities.CommerceParty ToParty(this PartyInputModelItem item)
        {
            var party = new Sitecore.Commerce.Connect.DynamicsRetail.Entities.CommerceParty
            {
                Address1 = item.Address1,
                City = item.City,
                Country = item.Country,
                ExternalId = item.ExternalId,
                Name = item.Name,
                PartyId = item.PartyId,
                State = item.State,
                ZipPostalCode = item.ZipPostalCode
            };

            return party;
        }

        #endregion

        #region ShippingMethodInputModelItem => <Sitecore.Commerce.Connect.DynamicsRetail.Models.CommerceShippingInfo

        /// <summary>
        /// To the shipping infos.
        /// </summary>
        /// <param name="items">The items.</param>
        /// <returns>A list of CommerceShippingInfo.</returns>
        public static List<CommerceShippingInfo> ToShippingInfoList(this List<ShippingMethodInputModelItem> items)
        {
            return (from ShippingMethodInputModelItem item in items select item.ToShippingInfo()).ToList();
        }

        /// <summary>
        /// To the shipping information.
        /// </summary>
        /// <param name="item">The item.</param>
        /// <returns>A CommerceShippingInfo.</returns>
        public static CommerceShippingInfo ToShippingInfo(this ShippingMethodInputModelItem item)
        {
            var shippingInfo = new  CommerceShippingInfo
            {
                PartyID = item.PartyID,
                ShippingMethodID = item.ShippingMethodID,
                ShippingMethodName = item.ShippingMethodName,
                ShippingOptionType = GetShippingOptionType(item.ShippingPreferenceType),
                ElectronicDeliveryEmail = item.ElectronicDeliveryEmail,
                ElectronicDeliveryEmailContent = item.ElectronicDeliveryEmailContent,
                LineIDs = item.LineIDs != null ? item.LineIDs.AsReadOnly() : new List<string>().AsReadOnly()
            };

            return shippingInfo;
        }

        #endregion

        /// <summary>
        /// To the commerce cart lines.
        /// </summary>
        /// <param name="items">The items.</param>
        /// <returns>The list of translated cart lines.</returns>
        public static List<CommerceCartLine> ToCommerceCartLines(this IEnumerable<CartLineInputModelItem> items)
        {
            return items.Select(item => new CommerceCartLine {ExternalCartLineId = item.ExternalCartLineId}).ToList();
        }

        /// <summary>
        /// To the credit card payment information.
        /// </summary>
        /// <param name="item">The item.</param>
        /// <returns>The CommerceCreditCardPaymentInfo instance.</returns>
        // TODO: Move the translators into another area as they can be shared with other managers.
        public static CommerceCreditCardPaymentInfo ToCreditCardPaymentInfo(this CreditCardPaymentInputModelItem item)
        {
            var paymentInfo = new CommerceCreditCardPaymentInfo
            {
                Amount = item.Amount,
                CreditCardNumber = item.CreditCardNumber,
                CustomerNameOnPayment = item.CustomerNameOnPayment,
                ExpirationMonth = item.ExpirationMonth,
                ExpirationYear = item.ExpirationYear,
                PartyID = item.PartyID,
                PaymentMethodID = item.PaymentMethodID,
                ValidationCode = item.ValidationCode
            };

            return paymentInfo;
        }

        /// <summary>
        /// To the gift card payment information.
        /// </summary>
        /// <param name="item">The item.</param>
        /// <returns>The CommerceGiftCardPaymentInfo instance.</returns>
        // TODO: Move the translators into another area as they can be shared with other managers.
        public static GiftCardPaymentInfo ToGiftCardPaymentInfo(this GiftCardPaymentInputModelItem item)
        {
            var paymentInfo = new GiftCardPaymentInfo
            {
                Amount = item.Amount,
                PaymentMethodID = item.PaymentMethodID
            };

            return paymentInfo;
        }

        /// <summary>
        /// To the loyalty card payment information.
        /// </summary>
        /// <param name="item">The item.</param>
        /// <returns>The CommerceLoyaltyCardPaymentInfo instance.</returns>
        // TODO: Move the translators into another area as they can be shared with other managers.
        public static LoyaltyCardPaymentInfo ToLoyaltyCardPaymentInfo(this LoyaltyCardPaymentInputModelItem item)
        {
            var paymentInfo = new LoyaltyCardPaymentInfo
            {
                Amount = item.Amount,
                PaymentMethodID = item.PaymentMethodID
            };

            return paymentInfo;
        }

        // TODO: Move at a better location!
        /// <summary>
        /// Gets the type of the shipping preference.
        /// </summary>
        /// <param name="optionType">Type of the option.</param>
        /// <returns>
        /// The ShippingPreferenceType enum representation.
        /// </returns>
        public static ShippingOptionType GetShippingOptionType(string optionType)
        {
            if (optionType.Equals(ShippingOptionType.ShipToAddress.Value.ToString(CultureInfo.InvariantCulture), StringComparison.OrdinalIgnoreCase))
            {
                return ShippingOptionType.ShipToAddress;
            }

            if (optionType.Equals(ShippingOptionType.PickupFromStore.Value.ToString(CultureInfo.InvariantCulture), StringComparison.OrdinalIgnoreCase))
            {
                return ShippingOptionType.PickupFromStore;
            }

            if (optionType.Equals(ShippingOptionType.ElectronicDelivery.Value.ToString(CultureInfo.InvariantCulture), StringComparison.OrdinalIgnoreCase))
            {
                return ShippingOptionType.ElectronicDelivery;
            }

            if (optionType.Equals(Sitecore.Commerce.Connect.DynamicsRetail.Entities.Shipping.ShippingOptionType.DeliverItemsIndividually.Value.ToString(CultureInfo.InvariantCulture), StringComparison.OrdinalIgnoreCase))
            {
                return Sitecore.Commerce.Connect.DynamicsRetail.Entities.Shipping.ShippingOptionType.DeliverItemsIndividually;
            }

            return ShippingOptionType.None;
        }
    }
}