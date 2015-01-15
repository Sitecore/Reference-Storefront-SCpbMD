//-----------------------------------------------------------------------
// <copyright file="LoyaltyController.cs" company="Sitecore Corporation">
//     Copyright (c) Sitecore Corporation 1999-2015
// </copyright>
// <summary>Defines the LoyaltyController class.</summary>
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

namespace Sitecore.Commerce.Storefront.Controllers
{
    using Sitecore;
    using Sitecore.Commerce.Storefront.Managers.Storefront;
    using Sitecore.Diagnostics;
    using System.Web.Mvc;
    using LoyaltyRewardPoint = Sitecore.Commerce.Connect.DynamicsRetail.Entities.LoyaltyPrograms.LoyaltyRewardPoint;
    using Sitecore.Commerce.Contacts;
    using System.Collections.Generic;
    using System.Linq;
    using Sitecore.Commerce.Entities.LoyaltyPrograms;
    using Sitecore.Commerce.Storefront.Models.JsonResults;

    /// <summary>
    /// Controller for the Loyalty program
    /// </summary>
    public class LoyaltyController : BaseController
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="LoyaltyController" /> class.
        /// </summary>
        /// <param name="loyaltyProgramManager">The loyalty program manager.</param>
        /// <param name="cartManager">The cart manager.</param>
        /// <param name="accountManager">The account manager.</param>
        /// <param name="contactFactory">The contact factory.</param>
        public LoyaltyController([NotNull] LoyaltyProgramManager loyaltyProgramManager,
            [NotNull] CartManager cartManager,
            [NotNull] AccountManager accountManager,
            [NotNull] ContactFactory contactFactory)
            : base(contactFactory)
        {
            Assert.ArgumentNotNull(loyaltyProgramManager, "loyaltyProgramManager");
            Assert.ArgumentNotNull(cartManager, "cartManager");
            Assert.ArgumentNotNull(accountManager, "accountManager");
            Assert.ArgumentNotNull(contactFactory, "contactFactory");

            this.LoyaltyProgramManager = loyaltyProgramManager;
            this.CartManager = cartManager;
            this.AccountManager = accountManager;

            if (Context.User.IsAuthenticated)
            {
                CurrentVisitorContext.ResolveCommerceUser(accountManager);
            }
        }

        /// <summary>
        /// Gets or sets the loyalty program manager.
        /// </summary>
        /// <value>
        /// The loyalty program manager.
        /// </value>
        public LoyaltyProgramManager LoyaltyProgramManager { get; protected set; }

        /// <summary>
        /// Gets or sets the cart manager.
        /// </summary>
        /// <value>
        /// The cart manager.
        /// </value>
        public CartManager CartManager { get; protected set; }

        /// <summary>
        /// Gets or sets the account manager.
        /// </summary>
        /// <value>
        /// The account manager.
        /// </value>
        public AccountManager AccountManager { get; set; }

        /// <summary>
        ///  Main controller action
        /// </summary>
        /// <returns>My loyalty cards view</returns>
        public override ActionResult Index()
        {
            return View("~/Views/Storefront/Account/LoyaltyCards.cshtml");
        }

        /// <summary>
        /// Gets the loyalty cards.
        /// </summary>
        /// <returns>A list of loyalty cards</returns>
        [HttpGet]
        [Authorize]
        public JsonResult GetLoyaltyCards()
        {
            var commerceUser = this.AccountManager.GetUser(Context.User.Name).Result;
            var loyaltyCards = new List<LoyaltyCard>();

            if (commerceUser != null)
            {
                loyaltyCards = this.AllCards();
                foreach (var card in loyaltyCards)
                {
                    foreach (var loyaltyRewardPoint in card.RewardPoints)
                    {
                        var point = (LoyaltyRewardPoint)loyaltyRewardPoint;
                        var transactionHistory = this.LoyaltyProgramManager.GetLoyaltyCardTransactions(card.ExternalId, point.RewardPointId, 50).Result;
                        point.SetPropertyValue("Transactions", transactionHistory.ToList());
                    }
                }
            }

            var result = new LoyaltyCardsJsonResult(loyaltyCards);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Retrieves the active Loyalty cards for the current user
        /// </summary>
        /// <returns>Returns json result for user's loyalty cards</returns>
        [HttpGet]
        [Authorize]
        public JsonResult ActiveLoyaltyCards()
        {
            var commerceUser = this.AccountManager.GetUser(Context.User.Name).Result;
            var loyaltyCards = new List<LoyaltyCard>();

            if (commerceUser != null)
            {
                loyaltyCards = this.AllCards().Take(5).ToList();
            }

            var result = new LoyaltyCardsJsonResult(loyaltyCards);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Activates the account.
        /// </summary>
        /// <returns>Status of acitvate action - success of failure</returns>
        [HttpPost]
        [Authorize]
        public JsonResult ActivateAccount()
        {
            var commerceUser = this.AccountManager.GetUser(Context.User.Name).Result;
            var loyaltyCards = new List<LoyaltyCard>();

            if (commerceUser != null)
            {
                var response = this.LoyaltyProgramManager.ActivateAccount(this.CurrentStorefront, this.CurrentVisitorContext);
                if (response.ServiceProviderResult.Success && response.Result != null && !string.IsNullOrEmpty(response.Result.CardNumber))
                {
                    loyaltyCards = this.AllCards();
                }
            }

            var result = new LoyaltyCardsJsonResult(loyaltyCards);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        private List<LoyaltyCard> AllCards()
        {
            var getResponse = this.LoyaltyProgramManager.GetLoyaltyCards(this.CurrentStorefront, this.CurrentVisitorContext.UserId);
            return getResponse.ServiceProviderResult.Success ? getResponse.Result.ToList() : new List<LoyaltyCard>();
        }
    }
}