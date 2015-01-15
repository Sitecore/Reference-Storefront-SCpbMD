// Global Vars
var miniCartItemListViewModel = null;
var miniCartUpdateViewModel = null;

//
//Jquery Actions and Functions
//
function manageMiniCartActions() {

    $(document).ready(function () {

        $('.toggle-cart').hover(function () {
            $('.minicart').slideDown(500);
            return false;
        });


        $('.minicart').mouseleave(function () {
            $(this).slideUp(500);
            return false;
        });

        $('.minicart-content').on('click', ".minicart-delete", function (event) {

            $(event.currentTarget).find(".glyphicon").removeClass("glyphicon-remove-circle");
            $(event.currentTarget).find(".glyphicon").addClass("glyphicon-refresh");
            $(event.currentTarget).find(".glyphicon").addClass("glyphicon-refresh-animate");
            var lineItem = $(event.currentTarget).parent();
            var lineItemId = lineItem.attr("data-ajax-lineitemid");

            AJAXPost("/cart/DeleteLineItem", "{'ExternalCartLineId':'" + lineItemId + "'}", removeItemResponse, lineItem);
            return false;
        });


    });

}

function removeItemResponse(data, success, sender) {
    $(sender).find(".glyphicon").removeClass("glyphicon-refresh");
    $(sender).find(".glyphicon").removeClass("glyphicon-refresh-animate");
    $(sender).find(".glyphicon").addClass("glyphicon-remove-circle");
    $(sender).slideUp(200);
    miniCartItemListViewModel.reload(data);
}

function initMiniShoppingCart(sectionId) {
    AJAXPost(StorefrontUri("api/sitecore/cart/getcurrentcart"), null, function (data, success, sender) {
        miniCartItemListViewModel = new MiniCartItemListViewModel(data);
        ko.applyBindings(miniCartItemListViewModel, document.getElementById(sectionId));
        manageMiniCartActions();
    });
}

function UpdateMiniCart(updateCart) {

    AJAXPost(StorefrontUri("api/sitecore/cart/getcurrentcart"), null, function (data, success, sender) {
        miniCartItemListViewModel.reload(data);
    });
}

function initCartAmount(updateAmount) {
    dontBlockUI = true;

    var data = null;
    if (updateAmount != undefined && updateAmount) {
        data = '{ "updateCart" : true}';
    }

    AJAXPost(StorefrontUri("api/sitecore/cart/basketupdate"), null, function (data) {
        miniCartUpdateViewModel = new MiniCartViewModel(data.LineItemCount, data.Total);
        ko.applyBindings(miniCartUpdateViewModel);
    }, null);
}

//
// ViewModel Definitions & ViewModel Logic
//
function basketitem() {
    var self = this;
    self.image = "http://placehold.it/80x80";
    self.displayName = "Empty Element";
    self.quantity = 100;
    self.linePrice = 999.00;
    self.productUrl = "#";
}

function MiniCartViewModel(count, total) {
    this.lineitemcount = count;
    this.total = total;
}


function MiniCartItemViewModel(image, displayName, quantity, linePrice, productUrl, externalCartlineId) {

    var self = this;

    self.image = image;
    self.displayName = displayName;
    self.quantity = quantity;
    self.linePrice = linePrice;
    self.productUrl = productUrl;
    self.externalCartlineId = externalCartlineId;
}

function MiniCartItemListViewModel(data) {

    if (data != null) {
        var self = this;

        self.miniCartItems = ko.observableArray();

        $(data.Lines).each(function () {
            self.miniCartItems.push(new MiniCartItemViewModel(this.Image, this.DisplayName, this.Quantity, this.LinePrice, this.ProductUrl, this.ExternalCartLineId));
        });

        self.lineitemcount = ko.observable(data.Lines.length);
        self.total = ko.observable(data.Total);

        self.reload = function (data) {
            self.miniCartItems.removeAll();

            $(data.Lines).each(function () {
                self.miniCartItems.push(new MiniCartItemViewModel(this.Image, this.DisplayName, this.Quantity, this.LinePrice, this.ProductUrl, this.ExternalCartLineId));
            });
            self.lineitemcount(data.Lines.length);
            self.total(data.Total);
            manageMiniCartActions();
        }
    }
}
