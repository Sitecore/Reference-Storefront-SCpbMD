var loyaltyCardListViewModel = null;

function initActiveLoyaltyCards(sectionId) {
    $("#" + sectionId).hide();

    AJAXGet(StorefrontUri("api/sitecore/loyalty/activeLoyaltyCards"), null, function (data, success, sender) {
        loyaltyCardListViewModel = new LoyaltyCardsListViewModel(data);
        ko.applyBindings(loyaltyCardListViewModel, document.getElementById(sectionId));
        $("#" + sectionId).show();
    });
}

function initLoyaltyCards(sectionId) {
    $("#" + sectionId).hide();

    AJAXGet(StorefrontUri("api/sitecore/loyalty/getLoyaltyCards"), null, function (data, success, sender) {
        loyaltyCardListViewModel = new LoyaltyCardsListViewModel(data);
        ko.applyBindings(loyaltyCardListViewModel, document.getElementById(sectionId));
        $("#" + sectionId).show();
    });
}

function joinLoyaltyProgram() {
    AJAXPost(StorefrontUri('api/sitecore/loyalty/activateAccount'), null, function (data, success, sender) {
        loyaltyCardListViewModel.reload(data);
        $("#loyaltyCards").show();
        $("#loyaltyCardsEmpty").hide();
    }, this);
}