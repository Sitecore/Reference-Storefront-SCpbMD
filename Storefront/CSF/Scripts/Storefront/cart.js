var lineItemListViewModel = null;

function manageCartActions() {
    $(document).ready(function () {
        $(".delete-item").click(function () {
            var lineItem = $(this);
            var lineItemId = lineItem.attr("data-ajax-lineitemid");
            $(this).find(".glyphicon").removeClass("glyphicon-remove-circle");
            $(this).find(".glyphicon").addClass("glyphicon-refresh");
            $(this).find(".glyphicon").addClass("glyphicon-refresh-animate");
            AJAXPost("/cart/DeleteLineItem", "{'ExternalCartLineId':'" + lineItemId + "'}", deleteLineItemResponse, lineItem);
            return false;
        });

        $(".form-control-quantity").blur(function () {
            var lineItem = $(this);
            var lineItemId = lineItem.attr("data-ajax-lineitemid");
            var previousQuantity = lineItem.attr("value");
            var currentQuantity = lineItem.val();

            if (previousQuantity != currentQuantity) {
                AJAXPost("/cart/UpdateLineItem", "{'ExternalCartLineId':'" + lineItemId + "', 'Quantity': " + currentQuantity + "}", updateLineItemResponse, lineItem);
            }
            return false;
        });

        $(".delete-promocode").click(function () {
            var adjustment = $(this)
            var adjustmentDescription = adjustment.attr("data-ajax-promocode");
            AJAXPost("/cart/RemoveDiscount", "{'promoCode':'" + adjustmentDescription + "'}", removePromoCodeResponse, $(this));
        });
    });
}

function manageCartDiscountActions() {
    $(".cart-applydiscount").click(function () {
        $(this).button('loading');
        AJAXPost("/cart/ApplyDiscount", "{'promoCode':'" + $('#discountcode_cart').val() + "'}", addPromoCodeResponse, $(this));
    });
}

function addPromoCodeResponse(data, success, sender) {
    $(sender).button('reset');
    lineItemListViewModel.reload(data);
}

function removePromoCodeResponse(data, success, sender) {
    lineItemListViewModel.reload(data);
}

function updateLineItemResponse(data, success, sender) {
    lineItemListViewModel.reload(data);
}

function deleteLineItemResponse(data, success, sender) {
    $(sender).find(".glyphicon").removeClass("glyphicon-refresh");
    $(sender).find(".glyphicon").removeClass("glyphicon-refresh-animate");
    $(sender).find(".glyphicon").addClass("glyphicon-remove-circle");
    lineItemListViewModel.reload(data);
}

function initShoppingCart() {
    AJAXPost(StorefrontUri("api/sitecore/cart/getcurrentcart"), null, function (data, success, sender) {
        lineItemListViewModel = new LineItemListViewModel(data);
        ko.applyBindings(lineItemListViewModel);
        manageCartActions();
        manageCartDiscountActions();
    });
}

function UpdateShoppingCartView() {
    AJAXPost(StorefrontUri("api/sitecore/cart/getcurrentcart"), null, function (data, success, sender) {
        lineItemListViewModel.reload(data);
    });
}
