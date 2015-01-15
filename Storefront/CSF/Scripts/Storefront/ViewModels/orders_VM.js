var ordersListViewModel = null;

function OrderHeaderViewModel(externalId, status, lastModified, detailsUrl) {
    var self = this;

    self.ExternalId = externalId;
    self.Status = status;
    self.LastModified = lastModified;
    self.DetailsUrl = detailsUrl;
}

function OrdersViewModel(data) {
    var self = this;

    self.Orders = data.Orders;
}

function initRecentOrders(sectionId) {
    $("#" + sectionId).hide();

    AJAXGet(StorefrontUri("api/sitecore/account/recentOrders"), null, function (data, success, sender) {
        if (data.Orders.length > 0) {
            $("#" + sectionId).show();

            ordersListViewModel = new OrdersViewModel(data);
            ko.applyBindings(ordersListViewModel, document.getElementById(sectionId));
        }
    });
}

