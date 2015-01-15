// INDEX

$(document).ready(function () {
    $('.temp-click').on('click', changeClass);



$('.toggle-cart').hover(function () {
    $('.minicart').slideDown(500);
    return false;
});


$('.minicart').mouseleave(function () {
    $(this).slideUp(500);
    return false;
});

});


// PRODUCT LIST

function changeClass(e) {
    e.preventDefault();
    var clickedElement = $(this);

    clickedElement.closest("li").toggleClass("active");
};

$(document).ready(function () {
    $('.colors li').on("click", changeClass);
    $(".brands li").on("click", changeClass);
    $(".sizes li").on("click", changeClass);
});


// PRODUCT PRESENTATION


function changeClass(e) {
    e.preventDefault();
    var clickedElement = $(this);

    clickedElement.closest("li").toggleClass("active");
};

$(document).ready(function () {
    $('.colors li').on("click", changeClass);
    $(".brands li").on("click", changeClass);
    $(".sizes li").on("click", changeClass);
});


function changeNavbar(e) {
    e.preventDefault();
    var clickedElement = $(this);

    clickedElement.closest("ul").find(".active").removeClass("active");
    clickedElement.closest("li").toggleClass("active");
};

$(document).ready(function () {
    $('.temp-click').on('click', changeNavbar);
});




$(".thumbnails li a").on('click', function (e) {
    e.preventDefault();
    var activeThumb = $(this);

    activeThumb.closest("ul").find(".selected-thumb").removeClass("selected-thumb");
    activeThumb.closest("li").toggleClass("selected-thumb");

    $('#prod-large-view').attr('src', $(this).attr('href'));
});






// DELIVERY
function changeClass(e) {
    e.preventDefault();
    var clickedElement = $(this);

    clickedElement.closest("ul").find(".active").removeClass("active");
    clickedElement.closest("li").addClass('active');
};

$(document).ready(function () {
    $('.temp-click').on('click', changeClass);
});


$(document).ready(function () {
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
});


$(document).ready(function ($) {

    LoadMap();

    $(".DeliverySelector").change(function () {
        var sText = $(":selected", this).text()
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
        var text = $(":selected", this).text()

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
    })
});


$(document).ready(function () {
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



// BILLING

$(document).ready(function () {
    $("#PaymentMethod").change(function () {
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
});


$(document).ready(function () {
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
});

$(document).ready(function (event) {
    $('.accordion-toggle').on('click', function (event) {
        event.preventDefault();

        console.log("YO!");

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


// ERROR DIV
function closeErrorMessage() {
    $('.wrap-error').slideUp();

};

function showErrorMessage() {
    $('.wrap-error').slideDown();

};