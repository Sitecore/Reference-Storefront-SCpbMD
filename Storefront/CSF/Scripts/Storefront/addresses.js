var addressListViewModel = null;

function initAddressList(sectionId) {
    $("#" + sectionId).hide();

    AJAXGet(StorefrontUri("api/sitecore/account/addressList"), null, function (data, success, sender) {
        addressListViewModel = new AddressListViewModel(data);
        ko.applyBindings(addressListViewModel, document.getElementById(sectionId));

        $("#" + sectionId).show();
    });
}