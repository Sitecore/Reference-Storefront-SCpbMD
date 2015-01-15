var wishlistsListViewModel = null;
var wishlistViewModel = null;

function initWishLists(sectionId) {
    $("#wishListsSection").hide();

    manageWisListActions();

    AJAXGet(StorefrontUri("api/sitecore/wishlist/activeWishLists"), null, function (data, success, sender) {
        wishlistsListViewModel = new WishListsViewModel(data);
        ko.applyBindings(wishlistsListViewModel, document.getElementById(sectionId));
        $("#wishListsSection").show();

        if ($("#wishlistChange").length > 0) {
            var wishlistId = getUrlParameter(document.URL, 'id');
            $("#wishlistChange").val(wishlistId);
        }
    });
}

function initWishList(sectionId) {
    $("#" + sectionId).hide();
    var wishlistId = getUrlParameter(document.URL, 'id');
    AJAXGet(StorefrontUri("api/sitecore/wishlist/getWishList?Id=" + wishlistId), null, function (data, success, sender) {
        wishlistViewModel = new WishListViewModel(data);
        ko.applyBindings(wishlistViewModel, document.getElementById(sectionId));
        $("#" + sectionId).show();
    });
}

function createWishList() {
    if ($('#createWishListClose').length > 0) {
        $('#createWishListClose').trigger('click');
    }

    AJAXPost('/api/sitecore/wishlist/createWishList', '{"Name":"' + $("#wishlist-name").val() + '"}', createWishListResponse, this);
}

function createWishListResponse(data, success, sender) {
    $('#wishlist-name').val('');
    wishlistsListViewModel.reload(data);
    $("#wishListsEmpty").hide();
    $("#wishListsSection").show();
    $("#wishLists").show();
}

function manageWisListActions() {
    $(document).ready(function () {
        $('#wishlist-name').keyup(function () {
            if ($(this).val().trim().length > 0) {
                $('#createWishList').removeAttr('disabled');
            } else {
                $('#createWishList').attr('disabled', 'disabled');
            }
        });
    });
}

function selectAllItems(element) {
    var isChecked = $(element).is(':checked');
    $('.item-to-selected').prop('checked', isChecked);
    $('#addWishListItemsToCart').prop("disabled", !isChecked);
}

function enableAddItemsToCart() {
    $('#addWishListItemsToCart').prop("disabled", $('.item-to-selected').filter(':checked').length == 0);
}

function changeWishList(element) {
    wishlistViewModel.load($(element).find(':selected').attr('id'));
}

function addWishListsToCart() {
    var ids = [];

    $('.item-to-selected').each(function () {
        if ($(this).is(':checked')) {
            ids.push($(this).attr('name'));
        }
    });

    AJAXPost('/api/sitecore/wishlist/addWishListsToCart', '{"Ids":"' + ids + '"}', addwishListsToCartResponse, this);
}

function addwishListsToCartResponse(data, success, sender) {
    $('.item-to-selected').removeAttr('checked');
    $('#addWishListItemsToCart').attr('disabled', 'disabled');
    initShoppingCart();
}

function updateWishListLine(element) {
    var lineQuantity = $(element).val();
    var lineProductId = $(element).attr('id');
    var lineVariantd = $(element).attr('data-variantId');
    var listId = $('#wishlistChange').val();
    AJAXPost(StorefrontUri('api/sitecore/wishlist/updateLineItem'), '{"WishListId":"' + listId + '", "ProductId":"' + lineProductId + '", "VariantId":"' + lineVariantd + '", "Quantity":"' + lineQuantity + '"}', updateWishListLineResponse, this);
}

function updateWishListLineResponse(data, success, sender) {
    wishlistViewModel.reload(data);
}

function addWishListItemsToCart() {
    if ($('.item-to-selected').filter(':checked').length == 0) {
        return;
    }

    var data = [];
    $('.item-to-selected').filter(':checked').each(function () {
        var productId = $(this).attr('data-productId');
        data.push({ "ProductId": productId, "VariantId": $(this).attr('data-variantId'), "CatalogName": $(this).attr('data-catalog'), "Quantity": $('#'+ productId).val() });
    });

    AJAXPost(StorefrontUri('api/sitecore/cart/addCartLines'), JSON.stringify(data), addWishListItemsToCartResponse, this);
}

function addWishListItemsToCartResponse(data, success, sender) {
    $('.item-to-selected').removeAttr('checked');
    $('#selectAllItems').removeAttr('checked');
    $('#addWishListItemsToCart').attr('disabled', 'disabled');
    UpdateMiniCart();
}