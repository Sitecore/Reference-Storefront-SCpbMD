
// AJAX Extensions
// -
function AJAXGet(url, data, responseFunction, sender) {
    AJAXCall("GET", url, data, responseFunction, sender);
}

function AJAXPost(url, data, responseFunction, sender) {
    AJAXCall("POST", url, data, responseFunction, sender);
}

function AJAXCall(callType, url, data, responseFunction, sender) {
    $.ajax({
        type: callType,
        url: url,
        data: data,
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            dontBlockUI = false;
            if (responseFunction != null) {
                responseFunction(data, true, sender);
            }
        },
        error: function (data) {
            if (responseFunction != null) {
                responseFunction(data, false, sender);
            }
        }
    });
}

// General helper methods
// -
function StorefrontUri(route) {
    //var currentLocation = window.location;
    //var localpathArray = currentLocation.pathname.split("/");

    //var storefrontRouteKey = localpathArray[2];
    ////Check if our storefronts key is the route key
    ////This means that a localization key is in the URL
    //if (storefrontRouteKey.toLowerCase() == "storefronts") {
    //    //If it has an additional key in the route then slide one over
    //    storefrontRouteKey = localpathArray[3];
    //    return "/" + localpathArray[2] + "/" + storefrontRouteKey + "/" + route;
    //}

    //return "/" + localpathArray[1] + "/" + storefrontRouteKey + "/" + route;
    return "/" + route;
}


var toString = Object.prototype.toString;
isString = function (obj) {
    return toString.call(obj) == '[object String]';
}

//
// - 
function productRecommendationClick(e) {
    e.preventDefault();
    var clickedElement = $(this);

    clickedElement.closest("ul").find(".active").removeClass("active");
    clickedElement.closest("li").addClass('active');

    var selector = clickedElement.attr('data-carousel-id');
    var carousel = $('#'+ selector);
    var parent = carousel.parent();
    parent.find(".product-slider").each(function () {
        $(this).attr("style", "display:none");
    });
    carousel.attr("style", "");
    $(".product-controls").closest("div").find("a").each(function () {
        $(this).attr("href", '#' + selector);
    });
};

function resetUrl() {
    var url = new Uri(window.location.href)
        .deleteQueryParam(queryStringParamerterSort)
        .deleteQueryParam(queryStringParamerterSortDirection)
        .deleteQueryParam(queryStringParamerterPage)
        .deleteQueryParam(queryStringParamerterPageSize)
        .toString();

    window.location.href = url;
}

var queryStringParamerterSort = "s";
var queryStringParamerterSortDirection = "sd";
var queryStringParamerterSortDirectionAsc = "asc";
var queryStringParamerterSortDirectionAscShort = "+";
var queryStringParamerterSortDirectionDesc = "desc";
var queryStringParamerterPage = "pg";
var queryStringParamerterPageSize = "ps";

$(document).ready(function () {
    $('.product-recommendation-click').on('click', productRecommendationClick);

    $(".sortDropdown").change(function () {
        var val = $(this).find("option:selected").attr("value");

        if (val != null && val != "") {
            var fieldName = val.substr(0, val.length - 1);
            var direction = val.charAt(val.length - 1) == queryStringParamerterSortDirectionAscShort ? queryStringParamerterSortDirectionAsc : queryStringParamerterSortDirectionDesc;

            var url = new Uri(window.location.href)
                .deleteQueryParam(queryStringParamerterSort)
                .deleteQueryParam(queryStringParamerterSortDirection)
                .addQueryParam(queryStringParamerterSort, fieldName)
                .addQueryParam(queryStringParamerterSortDirection, direction)
                .deleteQueryParam(queryStringParamerterPage)
                .toString();

            window.location.href = url;
        }
        else {
            resetUrl();
        }
    });

    $(".changePageSize").change(function () {
        var val = $(this).find("option:selected").attr("value");

        if (val != null && val != "") {
            var url = new Uri(window.location.href)
                .deleteQueryParam(queryStringParamerterPageSize)
                .addQueryParam(queryStringParamerterPageSize, val)
                .deleteQueryParam(queryStringParamerterPage)
                .toString();

            window.location.href = url;
        }
        else {
            resetUrl();
        }
    });

    $(".thumbnails li a").on('click', function (e) {
        e.preventDefault();
        var activeThumb = $(this);

        activeThumb.closest("ul").find(".selected-thumb").removeClass("selected-thumb");
        activeThumb.closest("li").toggleClass("selected-thumb");

        $('#prod-large-view').attr('src', $(this).attr('href'));
    });
});

//function UpdateMiniCart(updateCart) {
//    dontBlockUI = true;

//    var data = null;
//    if (updateCart != undefined && updateCart) {
//        data = '{ "updateCart" : true}';
//    }

//    AJAXPost(StorefrontUri("api/sitecore/cart/basket"), data, function (data) { $("#B02-Basket").replaceWith(data); }, null);
//}

//function UpdateMiniCart(updateCart) {
//    dontBlockUI = true;

//    var data = null;
//    if (updateCart != undefined && updateCart) {
//        data = '{ "updateCart" : true}';
//    }

//    AJAXPost(StorefrontUri("api/sitecore/cart/basketupdate"), null, function (data) {
//        ko.applyBindings(new MiniCartViewModel(data.LineItemCount, data.Total));
//    }, null);
//}

function InitBillingPage() {
    $(document).ready(function () {
        $("#PaymentMethods").change(function () {
            var val = $(this).val();
            if (val == "0") {
                $("#PaymentMethodVisa").hide();
                $("#PaymentMethodMastercard").hide();
                $("#PaymentMethodPaypal").hide();
            }
            else if (val == "1") {
                $("#PaymentMethodVisa").show();
                $("#PaymentMethodMastercard").hide();
                $("#PaymentMethodPaypal").hide();
            }
            else if (val == "2") {
                $("#PaymentMethodVisa").hide();
                $("#PaymentMethodMastercard").show();
                $("#PaymentMethodPaypal").hide();
            }
            else if (val == "3") {
                $("#PaymentMethodVisa").hide();
                $("#PaymentMethodMastercard").hide();
                $("#PaymentMethodPaypal").show();
            }
        }).change();

        $("#BillingAddressSelect").change(function () {
            var val = $(this).val();
            if (val == "0") {
                $("#BillingAddressName").prop('disabled', true);
                $("#BillingAddressCity").prop('disabled', true);
                $("#BillingAddressCountry").prop('disabled', true);
                $("#BillingAddressState").prop('disabled', true);
                $("#BillingAddress").prop('disabled', true);
                $("#BillingAddressZipcode").prop('disabled', true);
            }
            else if (val == "1") {
                $("#BillingAddressState").prop('disabled', false);

                $("#BillingAddressName").val("Jesper Lidastein Carlsen").prop('disabled', true);
                $("#BillingAddress").val("Væbnerhatten 204").prop('disabled', true);
                $("#BillingAddressCity").val("Odense SØ").prop('disabled', true);
                $("#BillingAddressZipcode").val("5220").prop('disabled', true);
                $("#BillingAddressCountry").val("Denmark").prop('disabled', true);
                $("#BillingAddressState").prop('disabled', true);
            }
            else if (val == "2") {
                $("#BillingAddressName").val("Jesper Lidastein Carlsen").prop('disabled', true);
                $("#BillingAddress").val("Rugårdsvej 46").prop('disabled', true);
                $("#BillingAddressCity").val("Odense C").prop('disabled', true);
                $("#BillingAddressZipcode").val("5000").prop('disabled', true);
                $("#BillingAddressCountry").val("Denmark").prop('disabled', true);
                $("#BillingAddressState").prop('disabled', true);
            }
            else if (val == "3") {
                $("#BillingAddressName").val(" ").prop('disabled', false);
                $("#BillingAddressCity").val(" ").prop('disabled', false);
                $("#BillingAddressCountry").prop('disabled', false);
                $("#BillingAddressState").prop('disabled', false);
                $("#BillingAddress").val(" ").prop('disabled', false);
                $("#BillingAddressZipcode").val(" ").prop('disabled', false);
            }
        }).change();

        $('.accordion-toggle').on('click', function (event) {
            event.preventDefault();

            // create accordion variables
            var accordion = $(this);
            var accordionContent = accordion.closest('.accordion-container').find('.accordion-content');
            var accordionToggleIcon = $(this).children('.toggle-icon');

            // toggle accordion link open class
            accordion.toggleClass("open");

            // toggle accordion content
            accordionContent.slideToggle(250);

            // change plus/minus icon
            if (accordion.hasClass("open")) {
                accordionToggleIcon.html("<span class='glyphicon glyphicon-minus-sign'></span>");
            } else {
                accordionToggleIcon.html("<span class='glyphicon glyphicon-plus-sign'></span>");
            }
        });
    });
}

function changeClass(e) {
    e.preventDefault();
    var clickedElement = $(this);

    clickedElement.closest("ul").find(".active").removeClass("active");
    clickedElement.closest("li").addClass('active');
};

function InitDeliveryPage() {
    $(document).ready(function () {
        $('.temp-click').on('click', changeClass);

        $("#ChangeDelivery").change(function () {
            $("select option:selected").each(function () {
                if ($(this).attr("value") == "1") {
                    $("#ShipAllItems").show();
                    $("#SendByEmail").hide();
                    $("#PickUpAtStore").hide();
                    $("#DeliveryOptionsByItems").hide();
                }
                if ($(this).attr("value") == "2") {
                    $("#ShipAllItems").hide();
                    $("#SendByEmail").show();
                    $("#PickUpAtStore").hide();
                    $("#DeliveryOptionsByItems").hide();
                }
                if ($(this).attr("value") == "3") {
                    $("#ShipAllItems").hide();
                    $("#SendByEmail").hide();
                    $("#PickUpAtStore").show();
                    $("#DeliveryOptionsByItems").hide();
                }
                if ($(this).attr("value") == "4") {
                    $("#ShipAllItems").hide();
                    $("#SendByEmail").hide();
                    $("#PickUpAtStore").hide();
                    $("#DeliveryOptionsByItems").show();
                }
                if ($(this).attr("value") == "0") {
                    $("#ShipAllItems").hide();
                    $("#SendByEmail").hide();
                    $("#PickUpAtStore").hide();
                    $("#DeliveryOptionsByItems").hide();
                }
            });
        }).change();

        LoadMap();

        $(".DeliverySelector").change(function () {
            var sText = $(":selected", this).text();
            var value = $(this).val();
            var parent = $(this).closest(".accordion-row");

            parent.find(".ShipOption").hide();

            var option = parent.find("." + value);
            option.show();

            var content = parent.find(".accordionContent");

            $(".accordionContent").hide();

            content.show();

            if (value == "PickUp")
                LoadMapInAccordian(content);


            $(".delivery-content").text(sText);
            var text = $(":selected", this).text();

        });

        $(".ShipOption").hide();

        $(".change-delivery").on("click", function (e) {
            e.preventDefault();

            $(".accordionContent").hide();

            var parent = $(this).closest(".accordion-row");
            var content = parent.find(".accordionContent");
            content.show();

            var value = parent.find(".DeliverySelector").val();
            var option = parent.find("." + value);

            $(".ShipOption").hide();
            option.show();
        });

        $("#ShippingAdressSelect").change(function () {
            var val = $(this).val();
            if (val == "AddressBook-A") {
                $("#ShipAllItemsInput-Name").prop('disabled', false);
                $("#ShipAllItemsInput-City").prop('disabled', false);
                $("#ShipAllItemsInput-Country").prop('disabled', false);
                $("#ShipAllItemsInput-State").prop('disabled', false);
                $("#ShipAllItemsInput-Address").prop('disabled', false);
                $("#ShipAllItemsInput-Zipcode").prop('disabled', false);
            }
            else if (val == "AddressBook-B") {
                $("#ShipAllItemsInput").prop('disabled', false);
                $("#ShipAllItemsInput-Name").val("Jesper Lidastein Carlsen").prop('disabled', true);
                $("#ShipAllItemsInput-Address").val("Væbnerhatten 204").prop('disabled', true);
                $("#ShipAllItemsInput-City").val("Odense Sø").prop('disabled', true);
                $("#ShipAllItemsInput-Zipcode").val("5220").prop('disabled', true);
                $("#ShipAllItemsInput-Country").val("Denmark").prop('disabled', true);
                $("#ShipAllItemsInput-State").prop('disabled', true);
            }
            else if (val == "AddressBook-C") {
                $("#ShipAllItemsInput").prop('disabled', false);
                $("#ShipAllItemsInput-Name").val("Chainbizz A/S").prop('disabled', true);
                $("#ShipAllItemsInput-Address").val("Rugårdsvej 46").prop('disabled', true);
                $("#ShipAllItemsInput-City").val("Odense C").prop('disabled', true);
                $("#ShipAllItemsInput-Zipcode").val("5000").prop('disabled', true);
                $("#ShipAllItemsInput-Country").val("Denmark").prop('disabled', true);
                $("#ShipAllItemsInput-State").prop('disabled', true);
            }
            else if (val == "AddressBook-D") {
                $("#ShipAllItemsInput").prop('disabled', false);
                $("#ShipAllItemsInput-Name").val(" ").prop('disabled', false);
                $("#ShipAllItemsInput-Address").val(" ").prop('disabled', false);
                $("#ShipAllItemsInput-City").val(" ").prop('disabled', false);
                $("#ShipAllItemsInput-Zipcode").val(" ").prop('disabled', false);
                $("#ShipAllItemsInput-Country").val(" ").prop('disabled', false);
                $("#ShipAllItemsInput-State").prop('disabled', false);
            }
        }).change();
    });
}

function states(sender, event) {
    var $btn = $('#' + sender).button(event);
}

// ERROR DIV
function closeErrorMessage() {
    $('.wrap-error').slideUp();
};

function showErrorMessage() {
    $('.wrap-error').slideDown();
};

function getUrlParameter(url, param) {
    url = url.split('?');
    if (url.length == 1) {
        return null;
    }

    var pattern = new RegExp(param + '=(.*?)(;|&|$)', 'gi');
    return url[1].split(pattern)[1];
}