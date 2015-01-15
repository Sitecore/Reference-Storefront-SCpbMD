
function SubmitAddTo(id) {
    var form = $("#AddToCartForm");
    states('AddToCartButton', 'loading'); // Update Button State

    // Prepare form to submit
    if (!$("input[name=ProductUrl]").length) {
        $('<input>').attr({
            type: 'hidden',
            id: 'ProductUrl',
            name: 'ProductUrl',
            value: window.location.href
        }).appendTo('#AddToCartForm');
    }

    form.attr("action", "/api/sitecore/cart/AddCartLine");
    form.attr("data-ajax-success", "AddToCartSuccess");
    form.attr("data-ajax-failure", "AddToCartFailure").submit();
}

function AddToCartSuccess(cntx) {
    if (cntx == "True") {
        $("#addToCartSuccess").show().fadeOut(4000);
        UpdateMiniCart();
    }
    else {
        showErrorMessage(); //Which error messages are we using?
        $("#addToCartFail").show().fadeOut(4000);
    }
    // Update Button State
    $('#AddToCartButton').button('reset');
}

function AddToCartFailure(cntx) {
    $("#addToCartFail").show().fadeOut(4000);
    // Update Button State
    $('#AddToCartButton').button('reset');
}

function AddVariantCombination(size, productColor, id) {
    if (!window.variantCombinationsArray) {
        window.variantCombinationsArray = new Array();
    }

    window.variantCombinationsArray[size + '_' + productColor] = id;
}

function VariantSelectionChanged() {
    var size = '';
    var color = '';

    var variantSizeDropDown = document.getElementById("variantSize");
    var variantProductColorDropDown = document.getElementById("variantColour");

    if (variantSizeDropDown) {
        size = variantSizeDropDown.value;
    }

    if (variantProductColorDropDown) {
        color = variantProductColorDropDown.value;
    }

    document.getElementById('VariantId').value = GetVariantIdByCombination(size, color);
}

function GetVariantIdByCombination(size, productColor) {
    if (!window.variantCombinationsArray || !window.variantCombinationsArray[size + '_' + productColor]) {
        return -1;
    }

    return window.variantCombinationsArray[size + '_' + productColor];
}

function CheckGiftCardBalance() {
    var form = $("#CheckGiftCardBalanceForm");
    states('CheckGiftCardBalanceButton', 'loading'); // Update Button State

    form.attr("action", "/api/sitecore/checkout/CheckGiftCardBalance");
    form.attr("data-ajax-success", "CheckGiftCardBalanceSuccess");
    form.attr("data-ajax-failure", "CheckGiftCardBalanceFailure").submit();
}

function CheckGiftCardBalanceSuccess(cntx) {
    $("#balance-value").html('');
    $("#balance-errors").html('');

    var errors = "";
    for (var i = 0; i < cntx.Errors.length; i++) {
        errors = errors + cntx.Errors[i] + "*<br/>";
    }

    if (cntx.Errors.length == 0) {
        var giftCard = cntx.GiftCard;
        $("#balance-value").html((parseFloat(giftCard.Balance)).toFixed(2) + ' ' + giftCard.CurrencyCode);
    }
    else {
        $("#balance-errors").addClass("alert-error").html(errors);
    }

    // Update Button State
    $('#CheckGiftCardBalanceButton').button('reset');
}

function CheckGiftCardBalanceFailure(cntx) {
    // Update Button State
    $('#CheckGiftCardBalanceButton').button('reset');
}

function addToWishList(id) {
    var form = $("#AddToCartForm");

    if (id == "new") {
        $('#createWishListClose').trigger('click');
        if ($("input[name=WishListName]").length) {
            $("input[name=WishListName]").val($("#wishlist-name").val());
        } else {
            $('<input>').attr({
                type: 'hidden',
                id: 'WishListName',
                name: 'WishListName',
                value: $("#wishlist-name").val()
            }).appendTo('#AddToCartForm');
        }
        $("#wishlist-name").val("");
    } else {
        if ($("input[name=WishListId]").length) {
            $("input[name=WishListId]").val(id.id);
        } else {
            $('<input>').attr({
                type: 'hidden',
                id: 'WishListId',
                name: 'WishListId',
                value: id.id
            }).appendTo('#AddToCartForm');
        }
    }

    form.attr("action", "/api/sitecore/WishList/AddToWishList");
    form.attr("data-ajax-success", "addToListSuccess");
    form.attr("data-ajax-failure", "addToListFailure").submit();
}

function addToListSuccess(cntx) {
    if (cntx == "True") {
        wishlistsListViewModel.load();
        $("#addToWishListSuccess").show().fadeOut(4000);
    }
    else {
        $("#addToWishListFail").how().fadeOut(4000);
    }
}

function addToListFailure(cntx) {
    $("#addToWishListFail").show().fadeOut(4000);
}