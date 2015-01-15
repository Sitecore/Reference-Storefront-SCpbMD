$(document).ready(function () {
    $('#rsf-error-delivery').hide();

    $("#ShipAllItemsInput-Country").change(function () {
        UpdateAvailableStates($(this).val());
    });

    $("#orderGetShippingMethods").click(function () {

        $("#orderGetShippingMethods").button('loading');

        var party = {
            'Name': $('#ShipAllItemsInput-Name').val(),
            'Address1': $('#ShipAllItemsInput-Address').val(),
            'Country': $('#ShipAllItemsInput-Country').val(),
            'City': $('#ShipAllItemsInput-City').val(),
            'State': $('#ShipAllItemsInput-State').val(),
            'ZipPostalCode': $('#ShipAllItemsInput-Zipcode').val(),
            'ExternalId': $('#orderShippingAddress_ExternalId').val(),
            'PartyId': $('#orderShippingAddress_ExternalId').val()
        };

        var data = "{ 'ShippingAddress' :" + JSON.stringify(party) + ", 'ShippingPreferenceType' : '" + $('#orderShippingPreference').val() + "', 'Lines':null}";

        AJAXPost(StorefrontUri("api/sitecore/checkout/GetShippingMethodsJson"), data, getShippingMethodsResponse, $(this));
    });

    function getShippingMethodsResponse(data, success, sender) {
        if (data.Errors.length > 0) {
            DisplayErrors(data.Errors);
        } else {
            var methods = "";
            checkoutDataViewModel.shippingMethods.removeAll();
            $.each(data.ShippingMethods, function (i, v) {  
                checkoutDataViewModel.shippingMethods.push(new method(v.Description, v.ExternalId));
            });
            $('#rsf-error-delivery').hide();
        }
        $("#orderGetShippingMethods").button('reset');
    }

    
});

function DisplayErrors(data) {
    $('#errorsSummary').html('');
     if (data.length > 0) {
            $.each(data, function (i, v) {
                $('#errorsSummary').append('<p class="text-error">' + data[i] + '</p>');
            });
            $('#rsf-error-delivery').slideDown();
            $("#errorsSummary").focus();
            $("#shippingMethodsContainer").html('');
            return true;
        }

    if (isString(data) && data.indexOf('div id="errorsSummary"') > 0) {
        $('#errorsSummary').html(data);
        $("#shippingMethodsContainer").html('');
        $('#rsf-error-delivery').slideDown();
        $("#errorsSummary").focus();
      
        return true;
    }

    return false;
}

function DisplayLineErrors(data, lineId) {
    $('#errorsSummary-'+lineId).html('');
    if (data.length > 0) {
        $.each(data, function (i, v) {
            $('#errorsSummary-' + lineId).append('<p class="text-error">' + data[i] + '</p>');
        });
        $('#rsf-error-delivery-'+lineId).slideDown();
        $("#errorsSummary-"+lineId).focus();
        $("#shippingMethodsContainer-"+lineId).html('');
        return true;
    }

    return false;
}

function InitDeliveryPage() {
    $(document).ready(function () {
        $('#btn-delivery-next').show();
        $('#btn-delivery-prev').show();
        $('#orderShippingPreference').attr('disabled', 'disabled');

        $("#deliveryMethodSet").val(false);
        $('#addedCreditCard').val(false);
        $("#ShipAllItemsInput-ExternalId").val(0);

        $("body").on('click', ".nav li.disabled a", function (e) {
            $(this).parent().removeClass("active");
            e.preventDefault(); 
            return false;
        });

        initShippingOptions();
        $("#deliveryMethodSet").val(false);

        $("#checkoutNavigation2").parent().addClass("disabled");
        $("#checkoutNavigation3").parent().addClass("disabled");

        BlockBillingFields();

        switchingCheckoutStep("shipping");
        initObservables();

        

        initCurrency('$');
    });
};

// ----- CHECKOUT ----- //

function setupCheckoutPage() {
    console.log("setupCheckoutPage");

    $('.temp-click').on('click', changeClass);

    $("#orderShippingPreference").change(function () {
 
        // Ship All Items -Value 1-
        if ($(this).val() == "1") {
            if ($("#IsShippingSelected_SendAll").val() == 'false') {
                $("#ToBillingButton").prop("disabled", true);
            } else {
                $("#ToBillingButton").prop("disabled", false);
            }
            $("#ShipAllItems").show();
            $("#SendByEmail").hide();
            $("#PickUpAtStore").hide();
            $("#DeliveryOptionsByItems").hide();
           
        }
        // Pick Items at Stores -Value 2-
        if ($(this).val() == "2") {
            if ($("#IsShippingSelected_Store").val() == 'false') {
                $("#ToBillingButton").prop("disabled", true);
            } else {
                $("#ToBillingButton").prop("disabled", false);
            }
            $("#ShipAllItems").hide();
            $("#SendByEmail").hide();
            $("#PickUpAtStore").show();
            $("#DeliveryOptionsByItems").hide();
            getMap('storesMap');
            setMyLocation();
        }
        // Select delivery options by item -Value 3-
        if ($(this).val() == "4") {
            if ($("#IsShippingSelected_ByItem").val() == 'false') {
                $("#ToBillingButton").prop("disabled", true);
            } else {
                $("#ToBillingButton").prop("disabled", false);
            }
            $("#ShipAllItems").hide();
            $("#SendByEmail").hide();
            $("#PickUpAtStore").hide();
            $("#DeliveryOptionsByItems").show();
        }
        //  Send by Email -Value 4-
        if ($(this).val() == "3") {
            if ($("#IsShippingSelected_Email").val() == 'false') {
                $("#ToBillingButton").prop("disabled", true);
            } else {
                $("#ToBillingButton").prop("disabled", false);
            }
            $("#ShipAllItems").hide();
            $("#SendByEmail").show();
            $("#PickUpAtStore").hide();
            $("#DeliveryOptionsByItems").hide();
        }
        // Select a delivery option -Value 0-
        if ($(this).val() == "0") {
            $("#ToBillingButton").prop("disabled", true);
            $("#ShipAllItems").hide();
            $("#SendByEmail").hide();
            $("#PickUpAtStore").hide();
            $("#DeliveryOptionsByItems").hide();
        }
    });

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

    $("body").on("click", ".toBilling", function () { switchingCheckoutStep('billing'); });
    $("body").on("click", ".toShipping", function () { switchingCheckoutStep('shipping'); });

    $("body").on("click", ".change-delivery", function () {
        var lineId = $(this).attr('id').replace('ChangeDelivery-', '');
        var selector = "#AccordionContent-"+lineId;
        if ($(selector).css('display') == 'none') {
            $(this).children(".openSign").hide();
            $(this).children(".closeSign").show();
            $("#AccordionContent-" + lineId).show();
        } else {
            $(this).children(".openSign").show();
            $(this).children(".closeSign").hide();
            $("#AccordionContent-" + lineId).hide();
        }

     
    });

    $("#ShippingAdressSelect").change(function () {
        var val = $(this).val();
       
        if (val == "UseOther") {
            $("#ShipAllItemsInput-Name").val(" ").prop('disabled', false);
            $("#ShipAllItemsInput-Address").val(" ").prop('disabled', false);
            $("#ShipAllItemsInput-City").val(" ").prop('disabled', false);
            $("#ShipAllItemsInput-Zipcode").val(" ").prop('disabled', false);
            $("#ShipAllItemsInput-Country").val(" ").prop('disabled', false);
            $("#ShipAllItemsInput-State").val(" ").prop('disabled', false);
            $("#ShipAllItemsInput-ExternalId").val(0);
        } else
        {
            if (checkoutDataViewModel != null) {
                var match = ko.utils.arrayFirst(checkoutDataViewModel.userAddresses(), function (item) {
                    return item.id === val;
                });
                $("#ShipAllItemsInput-Name").val(match.info.Name).prop('disabled', false);
                $("#ShipAllItemsInput-Address").val(match.info.Address1).prop('disabled', false);
                $("#ShipAllItemsInput-City").val(match.info.City).prop('disabled', false);
                $("#ShipAllItemsInput-Zipcode").val(match.info.ZipPostalCode).prop('disabled', false);
                $("#ShipAllItemsInput-Country").val(match.info.Country).prop('disabled', false);
                $("#ShipAllItemsInput-State").val(match.info.State).prop('disabled', false);
                $("#ShipAllItemsInput-ExternalId").val(match.info.ExternalId)

            }

        }
    }).change();

    $("body").on('change', "#BillingAddressSelect", function () {
        var val = $(this).val();
        if (val == "UseShipping") {
            $("#billingAddress_Name").val($("#ShipAllItemsInput-Name").val()).prop('disabled', true);
            $("#billingAddress_Address1").val($("#ShipAllItemsInput-Address").val()).prop('disabled', true);
            $("#billingAddress_City").val($("#ShipAllItemsInput-City").val()).prop('disabled', true);
            $("#billingAddress_ZipPostalCode").val($("#ShipAllItemsInput-Zipcode").val()).prop('disabled', true);
            $("#billingAddress_Country").val($("#ShipAllItemsInput-Country").val()).prop('disabled', true);
            $("#billingAddress_State").val($("#ShipAllItemsInput-State").val()).prop('disabled', true);
            $("#billingAddress_ExternalId").val(1);
        }
        else if (val == "UseOther") {
            $("#billingAddress_Name").val(" ").prop('disabled', false);
            $("#billingAddress_Address1").val(" ").prop('disabled', false);
            $("#billingAddress_City").val(" ").prop('disabled', false);
            $("#billingAddress_ZipPostalCode").val(" ").prop('disabled', false);
            $("#billingAddress_Country").val(" ").prop('disabled', false);
            $("#billingAddress_State").val(" ").prop('disabled', false);
            $("#billingAddress_ExternalId").val('');
        } else {
            if (checkoutDataViewModel != null) {
                var match = ko.utils.arrayFirst(checkoutDataViewModel.userAddresses(), function (item) {
                    return item.id === val;
                });
                $("#billingAddress_Name").val(match.info.Name).prop('disabled', true);
                $("#billingAddress_Address1").val(match.info.Address1).prop('disabled', true);
                $("#billingAddress_City").val(match.info.City).prop('disabled', true);
                $("#billingAddress_ZipPostalCode").val(match.info.ZipPostalCode).prop('disabled', true);
                $("#billingAddress_Country").val(match.info.Country).prop('disabled', true);
                $("#billingAddress_State").val(match.info.State).prop('disabled', true);
                $('#billingAddress_ExternalId').val(match.info.ExternalId);

                
            }
        }
    });
        

    $("body").on("change", ".lineShippingPreference", function () {
        var lineId = $(this).attr('id').replace('lineShippingPreference-', '');
        var seletedOption = $(this).val();
        switch (parseInt(seletedOption)) {
            case 1:
                $("#ShippAll-" + lineId).show();
                $("#PickStore-" + lineId).hide();
                $("#Email-" + lineId).hide();
                $("#ChangeDelivery-" + lineId).children(".openSign").hide();
                $("#ChangeDelivery-" + lineId).children(".closeSign").show();
                $("#AccordionContent-" + lineId).show();
                break;
            case 2:
                $("#ShippAll-" + lineId).hide();
                $("#PickStore-" + lineId).show();
                $("#Email-" + lineId).hide();
                getMap('lineStoresMap-' + lineId);
                $("#ChangeDelivery-" + lineId).children(".openSign").hide();
                $("#ChangeDelivery-" + lineId).children(".closeSign").show();
                $("#AccordionContent-" + lineId).show();
                break;
            case 3:
                $("#ShippAll-" + lineId).hide();
                $("#PickStore-" + lineId).hide();
                $("#Email-" + lineId).show();
                if (lineId != '') {
                    $("#selectedDeliveryLabel-" + lineId).text('Email').text();
                    shippingMethodsArray.push(lineId);
                }
                $("#ChangeDelivery-" + lineId).children(".openSign").hide();
                $("#ChangeDelivery-" + lineId).children(".closeSign").show();
                $("#AccordionContent-" + lineId).show();
                break;
            case 0:
                $("#ShippAll-" + lineId).hide();
                $("#PickStore-" + lineId).hide();
                $("#Email-" + lineId).hide();
                $("#ChangeDelivery-" + lineId).children(".openSign").hide();
                $("#ChangeDelivery-" + lineId).children(".closeSign").show();
                $("#AccordionContent-" + lineId).show();
                break;
        }

        $('#errorsSummary').html('');
    });

    $('.cancelLineShippingMethods').click(function () {
        var lineId = $(this).attr('id').replace('cancelLineShippingMethods-', '');
        $('#lineShipping-' + lineId).hide();
        $('.changeLineShipping').show();
        $('#lineShippingSelected-' + lineId).show();

        $('#errorsSummary').html('');
    });

    $('.setLineShippingMethods').click(function () {
        var lineId = $(this).attr('id').replace('setLineShippingMethods-', '');
        var lineShippingPreference = $('#lineShippingPreference-' + lineId).val();
        var lineShipping = $('#lineShipping-' + lineId);
        lineShipping.hide();
        $('.changeLineShipping').show();

        var party;
        var method;
        if (lineShippingPreference == 2) {
            party = GetCurrentLineNewAddress(lineId);
            var selectedMethod = $('input[name="lineShippingMethodId-' + lineId + '"]:checked');
            method = {
                "Id": selectedMethod.val(),
                "Name": selectedMethod.attr('data-ajax-name')
            };
        } else if (lineShippingPreference == 1) {
            var selectedStore = lineShipping.children().find('.store-Selected');
            var storeId = selectedStore.children().find('span[pid="storeId-'+lineId+ '"]').text();
            party = {
                "Name": selectedStore.children().find('span[pid="storeName-' + lineId + '"]').text(),
                "Address1": selectedStore.children().find('span[pid="storeAddress1-' + lineId + '"]').text(),
                "Country": selectedStore.children().find('span[pid="storeCountry"-' + lineId + ']').text(),
                "City": selectedStore.children().find('span[pid="storeCity-' + lineId + '"]').text(),
                "State": selectedStore.children().find('span[pid="storeState-' + lineId + '"]').text(),
                "ZipPostalCode": selectedStore.children().find('span[pid="storeZipCode-' + lineId + '"]').text(),
                "ExternalId": storeId
            };

            method = {
                "Id": $('#storeDeliveryMethodId').val(),
                "Name": $('#storeDeliveryMethodId').attr('data-ajax-name')
            };
        } else if (lineShippingPreference == 3) {
            method = {
                "Id": $('#emailDeliveryMethodId').val(),
                "Name": $('#emailDeliveryMethodId').attr('data-ajax-name'),
                "Email": $('#lineShippingEmailAddress-' + lineId).val(),
                "EmailContent": $('#lineShippingEmailMessage-' + lineId).val()
            };
        }

        if (method != undefined) {
            $('#lineShippingSelectedMethodId-' + lineId).text(method.Id);
            $('#lineShippingSelectedMethodName-' + lineId).text(method.Name);
            $('#lineShippingSelectedEmail-' + lineId).text(method.Email);
            $('#lineShippingSelectedEmailContent-' + lineId).text(method.EmailContent);
        }

        if (party != undefined) {
            $('#lineShippingSelectedExternalId-' + lineId).text(party.ExternalId);
            $('#lineShippingSelectedAddressName-' + lineId).text(party.Name);
            $('#lineShippingSelectedLine1-' + lineId).text(party.Address1);
            $('#lineShippingSelectedCity-' + lineId).text(party.City);
            $('#lineShippingSelectedState-' + lineId).text(party.State);
            $('#lineShippingSelectedZipCode-' + lineId).text(party.ZipPostalCode);
            $('#lineShippingSelectedCountry-' + lineId).text(party.Country);
        }

        $('#lineShippingSelected-' + lineId).show();
        $('#errorsSummary').html('');
    });

    $("body").on('click','.lineGetShippingMethods',function () {
        var lineId = $(this).attr('id').replace('lineGetShippingMethods-', '');
        $("#lineGetShippingMethods-" + lineId).button('loading');
        var party = GetCurrentLineNewAddress(lineId);
        var lines = [{
            'ExternalCartLineId': lineId
        }];

        var data = "{ 'ShippingAddress' :" + JSON.stringify(party) + ", 'ShippingPreferenceType' : '" + $('#orderShippingPreference').val() + "', 'Lines':" + JSON.stringify(lines) + "}";
        AJAXPost(StorefrontUri("api/sitecore/checkout/GetShippingMethodsJson"), data, getLineShippingMethodsResponse, $(this));
    });

    $('body').on('click','.lineSearchStores',function () {
        var lineId = $(this).attr('id').replace('lineSearchStores-', '');
        searchStores($('#lineStoreSearchResultsContainer-' + lineId), $('#lineStoreAddressSearch-' + lineId), 'lineStoresMap-' + lineId);
    });

    $('body').on('keypress','.lineStoreAddressSearch', function (e) {
        var lineId = $(this).attr('id').replace('lineStoreAddressSearch-', '');
        var keycode = (e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode));
        if (keycode == 13) {
            $('#lineSearchStores-' + lineId).trigger('click');
        }
    });

    $('input[id^="orderShippingAddress_"]').change(function () {
        $('#shippingMethodsContainer').children().remove();
        $('#errorsSummary').html('');
    });

    $('select[id^="orderShippingAddress_"]').change(function () {
        $('#shippingMethodsContainer').children().remove();
        $('#errorsSummary').html('');
    });

   

    $('#sendEmailToMe').click(function () {
        if ($(this).prop("checked")) {
            $('#shippingEmailAddress').val($(this).attr('data-ajax-email'));
            return;
        }

        $('#shippingEmailAddress').val('');
    });

    $('.sendEmailToMe').click(function () {
        var lineId = $(this).attr('id').replace('sendEmailToMe-', '');
        if ($(this).prop("checked")) {
            $('#lineShippingEmailAddress-' + lineId).val($(this).attr('data-ajax-email'));
            return;
        }

        $('#lineShippingEmailAddress-' + lineId).val('');
    });

    $('#SearchStores').click(function () {
        searchStores($('#StoreSearchResultsContainer'), $('#StoreAddressSearch'), 'storesMap');
    });

    $('form').submit(function (e) {
        e.preventDefault();
        return false;
    });

    $('#StoreAddressSearch').keypress(function (e) {
        var keycode = (e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode));
        if (keycode == 13) {
            $('#SearchStores').trigger('click');
        }
    });

    $("#setShippingMethods").click(function () {
        setShippingMethods();
    });

    $('#backToShipping, #editShippingAddress').click(function () {
        showShippingStep();
    });

    $('#nextToReview').click(function () {
        showReviewStep();
    });

    $('#backToPayment, #editBillingAddress, #editPayment').click(function () {
        showPaymentStep();
    });

    $("body").on('change', "#PaymentMethods", function () {
        if ($(this).val() != 0) {
            $('input[id="billingAddress_ExternalId"]').val(1);
            $('#addedCreditCard').val(true);
            $('#confirmCreditCard').text($(this).val());
            UnblockBillingFields();
           
        } else {
            $('input[id="billingAddress_ExternalId"]').val('');
            $('#addedCreditCard').val(false);
            $('#confirmCreditCard').text('');
            BlockBillingFields();
        } 
        updatePaymentAmount();
    });

    $('body').on('click', '#giftCardPayment_Button', function () {
        if ($('#giftCardPayment_PaymentMethodID').val() != "") {
            $('#giftCardPayment_Status').show();
            $('#giftCardPayment_Number').text($('#giftCardPayment_PaymentMethodID').val());         
            $('#giftCardPayment_AppliedAmount').autoNumeric('set', $('#giftCardPayment_Amount').val());
            $('#billingGiftCardNumber').text($('#giftCardPayment_PaymentMethodID').val());         
            $('#billingGiftCardAmount').autoNumeric('set', $('#giftCardPayment_Amount').val());
            $('#billingGiftCardNumber_Confirm').text($('#giftCardPayment_PaymentMethodID').val());
            $('#billingGiftCardAmount_Confirm').autoNumeric('set', $('#giftCardPayment_Amount').val());
            $('#confirmGiftCard').text($('#giftCardPayment_PaymentMethodID').val());
            $('#addedGiftCard').val(true);
            $('#giftCardPayment_PaymentMethodID').val('');
            $('#giftCardPayment_Amount').val('');
           
            updatePaymentAmount();

        }
    });

    $('body').on('click', '#removeGiftCard', function () {
        $('#giftCardPayment_Status').hide();
        $('#giftCardPayment_Number').text('');
        $('#giftCardPayment_AppliedAmount').text('');
        $('#addedGiftCard').val(false);
        $('#giftCardPayment_PaymentMethodID').val('');
        $('#giftCardPayment_Amount').val('');
        $('#billingGiftCardNumber').text('');
        $('#billingGiftCardAmount').text('');
        $('#billingGiftCardNumber_Confirm').text('');
        $('#billingGiftCardAmount_Confirm').text('');
        $('#confirmGiftCard').text('');
        updatePaymentAmount();

    });

    $('body').on('click', '#loyaltyCardPayment_Button', function () {
        if ($('#loyaltyCardPayment_PaymentMethodID').val() != "") {
            $('#loyaltyCardPayment_Status').show();
            $('#loyaltyCardPayment_Number').text($('#loyaltyCardPayment_PaymentMethodID').val());
            $('#loyaltyCardPayment_AppliedAmount').autoNumeric('set', $('#loyaltyCardPayment_Amount').val());
            $('#billingLoyaltyCardNumber').text($('#loyaltyCardPayment_PaymentMethodID').val());
            $('#billingLoyaltyCardAmount').autoNumeric('set', $('#loyaltyCardPayment_Amount').val());
            $('#billingLoyaltyCardNumber_Confirm').text($('#loyaltyCardPayment_PaymentMethodID').val());
            $('#billingLoyaltyCardAmount_Confirm').autoNumeric('set', $('#loyaltyCardPayment_Amount').val());
            $('#addedLoyaltyCard').val(true);
            $('#loyaltyCardPayment_PaymentMethodID').val('');
            $('#loyaltyCardPayment_Amount').val('');
            updatePaymentAmount();

        }
    });

    $('body').on('click', '#removeLoyaltyCard', function () {
        $('#loyaltyCardPayment_Status').hide();
        $('#loyaltyCardPayment_Number').text('');
        $('#loyaltyCardPayment_AppliedAmount').text('');
        $('#addedLoyaltyCard').val(false);
        $('#loyaltyCardPayment_PaymentMethodID').val('');
        $('#loyaltyCardPayment_Amount').val('');
        updatePaymentAmount();

    });

    $('body').on('click','#addLoyaltyCard_Confirm', function () {
        if ($('#LoyalityCardNumber_Confirm').val() != "") {
            $('#LoyaltyCardStatus_Confirm').show();
            $('#loyaltyCardNumber_Confirm_Added').text($('#LoyalityCardNumber_Confirm').val());
            $('#addedLoyaltyCard_Confirm').val(true);
            $('#LoyalityCardNumber_Confirm').val('');
            updatePaymentAmount();
        }     
       
    });

    $('body').on('click','#removeLoyaltyCard_Confirm',function () {
        $('#LoyaltyCardStatus_Confirm').hide();
        $('#loyaltyCardNumber_Confirm_Added').text('');
        $('#addedLoyaltyCard_Confirm').val(false);
        updatePaymentAmount();

    });

    $('body').on("change", "input[type='radio'][name='shippingMethodId']", function () {
        $("#IsShippingSelected_SendAll").val(true);
        $("#ToBillingButton").prop("disabled", false);
        $("#ToConfirmButton").prop("disabled", false);
        $("#PlaceOrderButton").prop("disabled", false);
    });

    $('body').on("change", "input[type='radio'][name^='shippingMethodId-']", function () {
        var lineId = $(this).attr('name').replace('shippingMethodId-', '');

        shippingMethodsArray.push(lineId);
        $("#selectedDeliveryLabel-" + lineId).text($(this).attr('data-name'));
        if (AreAllShippingItemsSet()) {
            $("#ToBillingButton").prop("disabled", false);
            $("#ToConfirmButton").prop("disabled", false);
            $("#PlaceOrderButton").prop("disabled", false);
        }
    });

    $('.paymentAmount').change(function () {
        updatePaymentAmount();
    });

    $("#useShippingAddressForBillingAddress").click(function () {
        if ($(this).is(":checked") == true) {
            $('#billingAddress_Name').val($('#orderShippingAddress_Name').val());
            $('#billingAddress_Address1').val($('#orderShippingAddress_Address1').val());
            $('#billingAddress_Country').val($('#orderShippingAddress_Country').val());
            $('#billingAddress_City').val($('#orderShippingAddress_City').val());
            $('#billingAddress_State').val($('#orderShippingAddress_State').val());
            $('#billingAddress_ZipPostalCode').val($('#orderShippingAddress_ZipPostalCode').val());
        }
        else {
            $("input[id^='billingAddress_']").val('');
        }

        $('#errorsSummary').html('');
    });

    $('#giftCardPayment_PaymentMethodID').change(function () {
        $('#errorsSummary').html('');
        $('#giftCardBalanceCurrency').hide();
        $('#giftCardBalance').text('');
    });

    $('#getGiftCardBalance').click(function () {
        $('#errorsSummary').html('');
        $('#giftCardBalanceCurrency').hide();
        $('#giftCardBalance').text('');
        $('#giftCardPayment_Amount').val(0);

        var balance = $('#giftCardPayment_PaymentMethodID').val();
        if (balance.trim().length == 0) {
            return;
        }

        var data = "{'giftCardId': '" + balance + "'}";
        AJAXPost("/checkout/GetGiftCardBalance", data, getGiftCardBalanceResponse, $(this));
    });

    $('#applyGiftCardFullAmount').click(function () {
        if ($('#giftCardBalance').text().trim().length > 0) {
            var balance = parseFloat($('#giftCardBalance').text());
            if (balance <= 0) {
                return;
            }

            var orderTotal = parseFloat($('#total').val());
            if (balance > orderTotal) {
                $('#giftCardPayment_Amount').val(orderTotal.toFixed(2));
            }
            else if (balance <= orderTotal) {
                $('#giftCardPayment_Amount').val(balance.toFixed(2));
            }

            updatePaymentAmount();
        }
    });

    $("#applyDiscount_checkout").click(function () {
        AJAXPost("/checkout/ApplyDiscount", "{'promoCode':'" + $('#discountCode_checkout').val() + "'}", reviewStepResponse, $(this));
    });

    $(".removeDiscount_checkout").click(function () {
        var code = $(this).attr("data-ajax-code");
        AJAXPost("/checkout/RemoveDiscount", "{'promoCode':'" + code + "'}", reviewStepResponse, $(this));
    });

    $(".removeCheckoutLine").click(function () {
        AJAXPost("/checkout/DeleteLineItem", "{'ExternalCartLineId':'" + $(this).attr("data-ajax-id") + "'}", reviewStepResponse, $(this));
    });

    $(".refreshCheckoutLine").click(function () {
        var lineItem = $(this);
        var lineItemId = lineItem.attr("data-ajax-id");
        var quantity = $('#quantity_' + lineItemId).val();

        AJAXPost("/checkout/UpdateLineItem", "{'ExternalCartLineId':'" + lineItemId + "', 'Quantity': " + quantity + "}", reviewStepResponse, lineItem);
    });

    $('#editLoyaltyCard').click(function () {
        $('#loyaltydialog').show();
        $('#noLoyaltyCard').hide();
        $('#rewardCards').hide();
        $('#errorsSummary').html('');
    });

    $('#cancelUpdateLoyaltyCardNumber').click(function () {
        $('#loyaltydialog').hide();
        if ($('#rewardCards').children().length > 0) {
            $('#rewardCards').show();
        } else {
            $('#noLoyaltyCard').show();
        }

        $('#errorsSummary').html('');
    });

    $("body").on('click', '#addLoyaltyCard_Confirm', function () {
        $(this).button("loading");
        AJAXPost("/checkout/UpdateLoyaltyCardJson", "{'loyaltyCardNumber':'" + $('#LoyalityCardNumber_Confirm').val() + "'}", updateLoyaltyCardResponse, $(this));
    });

    $("#submitOrder").click(function () {
        submitOrder();
    });
}

var toString = Object.prototype.toString;
isString = function (obj) {
    return toString.call(obj) == '[object String]';
}

function GetCurrentLineNewAddress(lineId) {
    var party = {
        'Name': $('input[id="lineShipAllItemsInput-Name-'+lineId+'"]').val(),
        'Address1': $('input[id="lineShipAllItemsInput-Address-' + lineId + '"]').val(),
        'Country': $('select[id="lineShipAllItemsInput-Country-' + lineId + '"]').val(),
        'City': $('input[id="lineShipAllItemsInput-City-' + lineId + '"]').val(),
        'State': $('input[id="lineShipAllItemsInput-State-' + lineId + '"]').val(),
        'ZipPostalCode': $('input[id="lineShipAllItemsInput-Zipcode-' + lineId + '"]').val(),
        'ExternalId': $('input[id="lineShipAllItemsInput-ExternalId-' + lineId + '"]').val(),
        'PartyId': $('input[id="lineShipAllItemsInput-ExternalId-' + lineId + '"]').val()
    };

    return party;
}

function getLineShippingMethodsResponse(data, success, sender) {
    var lineId = sender.attr('id').replace('lineGetShippingMethods-', '');
    if (data.Errors.length > 0) {
        DisplayLineErrors(data.Errors, lineId);
    } else {     
        if (checkoutDataViewModel != null) {
            var match = ko.utils.arrayFirst(checkoutDataViewModel.lineItemListViewModel.cartlines(), function (item) {
                return item.externalCartlineId === lineId;
            });
            match.shippingMethods.removeAll();
            $.each(data.LineShippingMethods[0].ShippingMethods, function (i, v) {
                match.shippingMethods.push(new method(v.Description, v.ExternalId));
            });
            $('#rsf-error-delivery-' + lineId).hide();
        }
        $("#lineGetShippingMethods-"+lineId).button('reset');
    }
}



function showUseShippingAddressAsBillingAddress() {
    if ($('#orderShippingPreference').val() != 2) {
        $('#useShippingAddressForBillingAddress').hide();
        $("label[for='useShippingAddressForBillingAddress']").hide();
    } else {
        $('#useShippingAddressForBillingAddress').show();
        $("label[for='useShippingAddressForBillingAddress']").show();
    }
}

function getMap(storesMapContainer) {
    if (map) {
        //map.dispose();
    }


        var mapOptions = {
            credentials: "AoDuh-y-4c57psY4ebQAurV-wFTFCfphVB_5TdyjFKv-eBiyU_bnUcMrAPT0BE1k", // TODO this has to be a settings
            zoom: 1,
            disableTouchInput: true
        };

        map = new Microsoft.Maps.Map(document.getElementById(storesMapContainer), mapOptions);
        Microsoft.Maps.loadModule('Microsoft.Maps.Search');
    

   
}

function searchStores(searchResultsContainer, addressToSearch, storesMapContainer) {
    $('#errorsSummary').html('');
    searchResultsContainer.children().remove('.toRemove');
    this.getMap(storesMapContainer);
    var searchManager = new Microsoft.Maps.Search.SearchManager(this.map);
    var geocodeRequest = {
        where: addressToSearch.val(),
        count: 1,
        callback: geocodeCallback,
        errorCallback: geocodeError,
        userData: searchResultsContainer
    };
    searchManager.geocode(geocodeRequest);
}

function setMyLocation() {
    var geoLocationProvider = new Microsoft.Maps.GeoLocationProvider(map);

    geoLocationProvider.getCurrentPosition({
    successCallback: displayCenter, showAccuracyCircle: false
});
}

var map = null;

function geocodeCallback(geocodeResult, userData) {
    // This function is called when a geocode query has successfully executed.
    // Report an error if the geocoding did not return any results.
    // This will be caused by a poorly formed location input by the user.
    if (!geocodeResult.results[0]) {
        alert('Sorry, we were not able to decipher the address you gave us.  Please enter a valid Address.');
        return;
    }

    searchLocation = geocodeResult.results[0].location;

    // Center the map based on the location result returned and a starting (city level) zoom
    // This will trigger the map view change event that will render the store plots
    map.setView({ zoom: 11, center: this.searchLocation });

    //Add a handler for the map change event. This event is used to render the store location plots each time the user zooms or scrolls to a new viewport
    Microsoft.Maps.Events.addHandler(this.mapStoreLocator, 'viewchanged', renderAvailableStores.bind(this));

    // Call the CRT to obtain a list of stores with a radius of the location provided.
    // Note that we request stores for the maximum radius we want to support (200).  The map control
    // is used to determine the "within" scope based on the users zoom settings at runtime.
    getNearbyStores(userData);
}

function geocodeError(request) {
    // This function handles an error from the geocoding service
    // These errors are thrown due to connectivity or system faults, not poorly formed location inputs. 
    alert("Sorry, something went wrong. An error has occured while looking up the address you provided. Please refresh the page and try again.");
}

function getNearbyStores(searchResultsContainer) {
    var data = "{'latitude': '" + searchLocation.latitude + "', 'longitude':" + searchLocation.longitude + "}";

    AJAXPost(StorefrontUri("api/sitecore/checkout/GetNearbyStoresJson"), data, renderAvailableStores, searchResultsContainer);
    return false;
}

function renderAvailableStores(data, success, sender) {
    map.entities.clear();
    sender.hide();

    var lineId = sender.selector.replace('#lineStoreSearchResultsContainer-', '');

    if (lineId == "#StoreSearchResultsContainer") {
        lineId = "";
    } else {
        lineId = "-" + lineId;
    }

    if (!success) {
        return;
    }

    var storeCount = 0;
    var pin;
    var pinInfoBox;
    var mapBounds = map.getBounds();
    var stores = data.Stores;

    // Display search location
    if (searchLocation != null && searchLocation != undefined && mapBounds.contains(searchLocation)) {
        // Plot the location to the map
        pin = new Microsoft.Maps.Pushpin(searchLocation, { draggable: false, text: "X" });
        map.entities.push(pin);
    }

    // If we have stores, plot them on the map
    if (stores.length > 0) {
        for (var i = 0; i < stores.length; i++) {
            var currentStoreLocation = stores[i];
            currentStoreLocation.location = { latitude: currentStoreLocation.Latitude, longitude: currentStoreLocation.Longitude };

            // Test each location to see if it is within the bounding rectangle
            if (mapBounds.contains(currentStoreLocation.location)) {
                sender.show();

                //  Increment the counter used to manage the sequential entity index
                storeCount++;
                currentStoreLocation.LocationCount = storeCount;

                // This is the html that appears when a push pin is clicked on the map
                var storeAddressText = '<div style="width:80%;height:100%;">\
                    <p style="background-color:gray;color:black;margin-bottom:5px;">\
                        <span style="padding-right:45px;">Store</span>\
                            <span style="font-weight:bold;">Distance</span>\
                                <p><p style="margin-bottom:0px;margin-top:0px;">\
                                    <span style="color:black;padding-right:35px;">'  
                                        + currentStoreLocation.Name + 
                '</span><span style="color:black;">' 
                + currentStoreLocation.Distance + 
                ' miles</span>\
                </p><p style="margin-bottom:0px;margin-top:0px;">' 
                + currentStoreLocation.Address.Address1 + 
                ' </p><p style="margin-bottom:0px;margin-top:0px;">' 
                + currentStoreLocation.Address.City + ', ' 
                + currentStoreLocation.Address.State + ' ' 
                + currentStoreLocation.Address.ZipPostalCode + 
                '</p></div>';

                // Plot the location to the map	
                pin = new Microsoft.Maps.Pushpin(currentStoreLocation.location, { draggable: false, text: "" + storeCount + "" });

                // Populating the Bing map push pin popup with store location data
                pinInfoBox = new Microsoft.Maps.Infobox(currentStoreLocation.location, { width: 225, offset: new Microsoft.Maps.Point(0, 10), showPointer: true, visible: false, description: storeAddressText });

                // Registering the event that fires when a pushpin on a Bing map is clicked
                Microsoft.Maps.Events.addHandler(pin, 'click', (function (pinInfoBox) {
                    return function () {
                        pinInfoBox.setOptions({ visible: true });
                    }
                })(pinInfoBox));

                map.entities.push(pin);
                map.entities.push(pinInfoBox);

                var storeResultText = '<div class="map-stores toRemove availableStore' + lineId + '"><strong class="badge pull-right" style="margin-left: 8px;">';
                if (storeCount == 1) {
                    storeResultText = '<div class="map-stores toRemove availableStore' + lineId + ' store-Selected"><strong class="badge pull-right" style="margin-left: 8px;">';

                    if (lineId == '') {
                        $("#IsShippingSelected_Store").val(true);
                        $("#ToBillingButton").prop("disabled", false);
                        $("#ToConfirmButton").prop("disabled", false);
                        $("#PlaceOrderButton").prop("disabled", false);
                    } else {
                        shippingMethodsArray.push(lineId.replace('-', ''));
                        if (AreAllShippingItemsSet()) {
                            $("#ToBillingButton").prop("disabled", false);
                            $("#ToConfirmButton").prop("disabled", false);
                            $("#PlaceOrderButton").prop("disabled", false);
                        }
                    }
                }

                sender.append(storeResultText + storeCount + '</strong><span pid="distance" class="store-distance">'
                    + currentStoreLocation.Distance + ' miles</span><div class="span3"><h2 class="muted" pid="storeName' + lineId + '">'
                    + currentStoreLocation.Name + '</h2><p class="muted" pid="storeAddress1' + lineId + '">'
                    + currentStoreLocation.Address.Address1 + '</p><span class="muted" pid="storeCity' + lineId + '">'
                    + currentStoreLocation.Address.City + '</span>, <span class="muted" pid="storeState' + lineId + '">'
                    + currentStoreLocation.Address.State + '</span>, <span class="muted" pid="storeZipCode' + lineId + '">'
                    + currentStoreLocation.Address.ZipPostalCode + '</span><span class="hide" pid="storeCountry' + lineId + '">'
                    + currentStoreLocation.Address.Country + '</span><span class="hide" pid="storeId' + lineId + '">'
                    //ADD IF DECIDE TO USE BUTTON <button type="button" class="btn btn-default btn-sm" data-bind="text:chooseStoreButtonLabel">' + 'Choose store' + '</button>
                    + currentStoreLocation.ExternalId + '</span></div><div class="clearfix"></div></div>');

    }
        }
    }


    $('.availableStore').click(function () {
        $('.availableStore').removeClass('store-Selected');
        $(this).addClass('store-Selected');
        $("#ToBillingButton").prop("disabled", false);
        $("#IsShippingSelected_Store").val(true);
    });

    $("body").on('click', "div[class^='availableStore-'],div[class*=' availableStore-']", function (s, e) {

        var classes = $(this).attr('class');
        var lineId = '';
        if (classes.indexOf('availableStore-') != -1) {           
            lineId = classes.slice(35, 67); // Get GUID32
        }

        $('.availableStore-' + lineId).removeClass('store-Selected');
        $(this).addClass('store-Selected');
       
        shippingMethodsArray.push(lineId);
        $("#selectedDeliveryLabel-"+lineId).text($('pid[storeAddress1-'+lineId+']').text());
        if (AreAllShippingItemsSet()) {
            $("#ToBillingButton").prop("disabled", false);
            $("#ToConfirmButton").prop("disabled", false);
            $("#PlaceOrderButton").prop("disabled", false);
        }
    });
}

function updatePaymentAmount() {
    var total = $("#billingOrderTotal").autoNumeric("get");
    var lcAmount = $("#loyaltyCardPayment_AppliedAmount").autoNumeric("get");
    var gcAmount = $("#giftCardPayment_AppliedAmount").autoNumeric("get");
    var ccAmount = $('#addedCreditCard').val() == 'true' ? total - gcAmount - lcAmount : total;

    $('#billingCreditCardAmount').autoNumeric("set", ccAmount);
    $('#billingCreditCardAmount_Confirm').autoNumeric("set", ccAmount);

    var paymentTotal = parseFloat(lcAmount != '' ? lcAmount : 0) + parseFloat(gcAmount != '' ? gcAmount : 0) + ccAmount;

    $('#paymentTotal').autoNumeric("set", paymentTotal);
    
}

function showShippingStep() {
    $('#shippingStep').show();
    $('#billingStep').hide();
    $('#reviewStep').hide();

    $("#orderShippingPreference").trigger('change');
    if ($('#userAddresses').length > 0 && $('#userAddresses').val() != "Select an address") {
        $('#userAddresses').trigger('change');
    }

    $('#errorsSummary').html('');
}

function showPaymentStep() {
    showUseShippingAddressAsBillingAddress();
    $('#orderTotal').text(parseFloat($('#total').val()).toFixed(2));
    updatePaymentAmount();

    $('#shippingStep').hide();
    $('#billingStep').show();
    $('#reviewStep').hide();

    $('#reviewBillingContainer').hide();
    $('#reviewCreditCard').hide();
    $('#reviewGiftCard').hide();
    $('#reviewLoyaltyCard').hide();
    $('#noLoyaltyCard').show();

    $('#errorsSummary').html('');
}

function showReviewStep() {
    $('#shippingStep').hide();
    $('#billingStep').hide();
    $('#reviewStep').show();

    if ($('#addedCreditCard').val() == 'true') {
        $('#reviewBillingAddressLine1').text($('#billingAddress_Address1').val());
        $('#reviewBillingAddressCity').text($('#billingAddress_City').val());
        $('#reviewBillingAddressState').text($('#billingAddress_State').val());
        $('#reviewBillingAddressZipCode').text($('#billingAddress_ZipPostalCode').val());
        $('#reviewBillingAddressCountry').text($('#billingAddress_Country').val());
        $('#reviewBillingContainer').show();

        $('#reviewCreditCardName').text($('#creditCardPayment_CustomerNameOnPayment').val());
        $('#reviewCreditCardNumber').text($('#creditCardPayment_CreditCardNumber').val().slice(-4));
        $('#reviewCreditCardExpiration').text($('#creditCardPayment_ExpirationMonth').val() + ' / ' + $('#creditCardPayment_ExpirationYear').val());
        $('#reviewCreditCardAmount').text(parseFloat($('#creditCardPayment_Amount').val()).toFixed(2));
        $('#reviewCreditCard').show();
    }

    if ($('#addedGiftCard').val() == 'true') {
        $('#reviewGiftCardNumber').text($('#giftCardPayment_PaymentMethodID').val());
        $('#reviewGiftCardAmount').text(parseFloat($('#giftCardPayment_Amount').val()).toFixed(2));
        $('#reviewGiftCard').show();
    }

    if ($('#addedLoyaltyCard').val() == 'true') {
        var selectedCard = $('input[name="loyaltyCardPayment"]:checked');
        var loyaltyCardNumber = $('input[name="loyaltyCardPayment"]:checked').attr('value') == undefined ? $('#loyaltyCardPayment_PaymentMethodID').val() : selectedCard.val();
        $('#reviewLoyaltyCardNumber').text(loyaltyCardNumber);
        $('#reviewLoyaltyCardAmount').text(parseFloat($('#loyaltyCardPayment_Amount').val()).toFixed(2));
        $('#reviewLoyaltyCard').show();
    }

    var orderShippingPreference = $('#orderShippingPreference').val();
    if (orderShippingPreference == 2) {
        $('#reviewShippingAddressName').text($('#orderShippingAddress_Name').val());
        $('#reviewShippingAddressLine1').text($('#orderShippingAddress_Address1').val());
        $('#reviewShippingAddressCountry').text($('#orderShippingAddress_Country').val());
        $('#reviewShippingAddressCity').text($('#orderShippingAddress_City').val());
        $('#reviewShippingAddressState').text($('#orderShippingAddress_State').val());
        $('#reviewShippingAddressZipCode').text($('#orderShippingAddress_ZipPostalCode').val());

        $('.reviewLineShippingMethod').text($('input[name="shippingMethodId"]:checked').attr('data-ajax-name'));
        $('#reviewShippingAddress').show();
        $('.lineReviewShippingAddressContainer').hide();
    }
    else if (orderShippingPreference == 1) {
        var selectedStore = $('.store-Selected');
        $('#reviewShippingAddressName').text(selectedStore.children().find('span[pid="storeName"]').text());
        $('#reviewShippingAddressLine1').text(selectedStore.children().find('span[pid="storeAddress1"]').text());
        $('#reviewShippingAddressCountry').text(selectedStore.children().find('span[pid="storeCountry"]').text());
        $('#reviewShippingAddressCity').text(selectedStore.children().find('span[pid="storeCity"]').text());
        $('#reviewShippingAddressState').text(selectedStore.children().find('span[pid="storeState"]').text());
        $('#reviewShippingAddressZipCode').text(selectedStore.children().find('span[pid="storeZipCode"]').text());

        $('.reviewLineShippingMethod').text("Customer Pickup");
        $('#reviewShippingAddress').show();
        $('.lineReviewShippingAddressContainer').hide();
    }
    else if (orderShippingPreference == 4) {
        $.each($('div[id^="lineReviewShippingAddressContainer-"]'), function () {
            var lineId = $(this).attr('id').replace('lineReviewShippingAddressContainer-', '');
            $('#reviewShippingAddressName-' + lineId).text($('#lineShippingSelectedAddressName-' + lineId).text());
            $('#reviewShippingAddressLine1-' + lineId).text($('#lineShippingSelectedLine1-' + lineId).text());
            $('#reviewShippingAddressCountry-' + lineId).text($('#lineShippingSelectedCountry-' + lineId).text());
            $('#reviewShippingAddressCity-' + lineId).text($('#lineShippingSelectedCity-' + lineId).text());
            $('#reviewShippingAddressState-' + lineId).text($('#lineShippingSelectedState-' + lineId).text());
            $('#reviewShippingAddressZipCode-' + lineId).text($('#lineShippingSelectedZipCode-' + lineId).text());
            $('#reviewShippingAddressEmail-' + lineId).text($('#lineShippingSelectedEmail-' + lineId).text());
            $('#lineReviewShippingMethod-' + lineId).text($('#lineShippingSelectedMethodName-' + lineId).text());
            $(this).show();
        });

        $('#reviewShippingAddress').hide();
    } else if (orderShippingPreference == 3) {
        $('.reviewLineShippingMethod').text($('#emailDeliveryMethodId').attr('data-ajax-name'));
        $('.reviewShippingAddressEmail').text($('#shippingEmailAddress').val());
        $('#reviewShippingAddress').show();
        $('.lineReviewShippingAddressContainer').show();
    }

    $('#errorsSummary').html('');
}

function getGiftCardBalanceResponse(data, success, sender) {
    if (!success) {
        return;
    }

    var hasErrors = DisplayErrors(data);
    if (!hasErrors) {
        $('#giftCardBalanceCurrency').show();
        $('#giftCardBalance').text((parseFloat(data.balance)).toFixed(2));
    }
}

function reviewStepResponse(data, success, sender) {
    if (!success) {
        return;
    }

    var hasErrors = DisplayErrors(data);
    if (!hasErrors) {
        $("#reviewStep").html(data);
        setupCheckoutPage();
        UpdateMiniCart();
        $("#reviewStep").find("input[type='number']").inputNumber();
        showReviewStep();
    }
}

function updateLoyaltyCardResponse(data, success, sender) {
    if (!success) {
        $('#loyaltyCard-success').css("display", "none");
        $(this).button("reset");
        return;
    }

    var hasErrors = DisplayErrors(data);
    if (!hasErrors && data.wasUpdated) {
        $(this).button("reset");
        $('#loyaltyCard-success').css("display", "inline").delay(5000).fadeOut('slow');
        
        $('#rewardCards').children().remove();
        $('#rewardCards').show();
        $('#noLoyaltyCard').hide();
        $('#loyaltydialog').hide();
        $('#rewardCards').append('<span class="muted">' + $('#rewardCardNumber').val() + '</span>');
        $('#rewardCardNumber').val('');
    }
}

function submitOrder() {
    $('#errorsSummary').html('');

    var data = "{";
    data += "'userEmail': '" + $('#BillingInput-Email').val() + "'";

    if ($('#PaymentMethods').val() != '0') {
        var creditCard = {
            'CreditCardNumber': $('#creditCardPayment_CreditCardNumber').val(),
            'PaymentMethodID': $('#PaymentMethods').val(),
            'ValidationCode': $('#creditCardPayment_ValidationCode').val(),
            'ExpirationMonth': $('#creditCardPayment_ExpirationMonth').val(),
            'ExpirationYear': $('#creditCardPayment_ExpirationYear').val(),
            'CustomerNameOnPayment': $('#creditCardPayment_CustomerNameOnPayment').val(),
            'Amount': parseFloatMoney($('#creditCardPayment_Amount').text()).toString(),
            'PartyID':  $('#billingAddress_ExternalId').val(),
        };
        var billingAddress =
        {
            'Name': $('#billingAddress_Name').val(),
            'Address1': $('#billingAddress_Address1').val(),
            'Country': $('#billingAddress_Country').val(),
            'City': $('#billingAddress_City').val(),
            'State': $('#billingAddress_State').val(),
            'ZipPostalCode': $('#billingAddress_ZipPostalCode').val(),
            'ExternalId': $('#billingAddress_ExternalId').val(), 
            'PartyId': $('#billingAddress_ExternalId').val()
        };

        data += ",'CreditCardPayment':" + JSON.stringify(creditCard) + ",'BillingAddress':" + JSON.stringify(billingAddress);
    }

    if ($('#addedGiftCard').val() == 'true') {
        var giftCard = {
            'PaymentMethodID': $('#giftCardPayment_Number').text(),
            'Amount': $('#giftCardPayment_AppliedAmount').autoNumeric("get"),
        };

        data += ",'GiftCardPayment':" + JSON.stringify(giftCard);
    }

    if ($('#addedLoyaltyCard').val() == 'true') {
        var loyaltyCard = {
            'PaymentMethodID': $('#loyaltyCardPayment_Number').text(),
            'Amount': $('#loyaltyCardPayment_AppliedAmount').autoNumeric("get"),
        };

        data += ",'LoyaltyCardPayment':" + JSON.stringify(loyaltyCard);
    }

    data += "}";

    $("#PlaceOrderButton").button('loading');

    AJAXPost(StorefrontUri("api/sitecore/checkout/SubmitOrderJson"), data, submitOrderResponse, $(this));
}

function submitOrderResponse(data, success, sender) {
    $("#PlaceOrderButton").button('reset');

    if (!success) {
        return;
    }

    if (data.Errors.length == 0) {
        window.location.href = data.ConfirmUrl;
    } else {
        alert(JSON.stringify(data.Errors));
    }
}


function switchingCheckoutStep(step) {
    if (step == "billing") {
        if ($("#deliveryMethodSet").val() == 'false') {
            setShippingMethods();
        } else {
            $("#billingStep").show();
            $("#reviewStep").hide();
            $("#shippingStep").hide();
            shippingButtons(false);
            billingButtons(true);
            confirmButtons(false);
            $("#checkoutNavigation1").parent().removeClass("active");
            $("#checkoutNavigation2").parent().addClass("active");
            $("#checkoutNavigation3").parent().removeClass("active");
            return;
        }
    }
    if (step == "shipping") {
        $("#deliveryMethodSet").val(false);
        $("#billingStep").hide();
        $("#reviewStep").hide();
        $("#shippingStep").show();
        shippingButtons(true);
        billingButtons(false);
        confirmButtons(false);
        $("#checkoutNavigation1").parent().addClass("active");
        $("#checkoutNavigation2").parent().removeClass("active");
        $("#checkoutNavigation3").parent().removeClass("active");
        $("#checkoutNavigation2").parent().addClass("disabled");
        $("#checkoutNavigation3").parent().addClass("disabled");

    }
    if (step == "confirm") {
        if ($("#deliveryMethodSet").val() == 'true') {
            $("#billingStep").hide();
            $("#reviewStep").show();
            $("#shippingStep").hide();
            shippingButtons(false);
            billingButtons(false);
            confirmButtons(true);
            $("#checkoutNavigation1").parent().removeClass("active");
            $("#checkoutNavigation2").parent().removeClass("active");
            $("#checkoutNavigation3").parent().addClass("active");

            $('#confirmBillingddress1').text($('#billingAddress_Name').val());
            $('#confirmBillingddress2').text($('#billingAddress_Address1').val() + ", " + $('#billingAddress_City').val());
            $('#confirmBillingddress3').text($('#billingAddress_State').val() + ", " + $('#billingAddress_ZipPostalCode').val() + ", " + $('#billingAddress_Country').val());
        } else {
            $("#checkoutNavigation2").parent().addClass("disabled");
            $("#checkoutNavigation3").parent().addClass("disabled");
            return;
        }
       
    }
    if (step == "placeOrder") {
        $("#billingStep").hide();
        $("#reviewStep").hide();
        $("#shippingStep").hide();
        shippingButtons(false);
        billingButtons(false);
        confirmButtons(false);
        $("#checkoutNavigation1").parent().removeClass("active");
        $("#checkoutNavigation2").parent().removeClass("active");
        $("#checkoutNavigation3").parent().removeClass("active");
    }
}

function shippingButtons(show)
{
    if (!show) {
        $('#btn-delivery-next').hide();
        $('#btn-delivery-prev').hide();
    }
    else {
        $('#btn-delivery-next').show();
        $('#btn-delivery-prev').show();
    }
}

function billingButtons(show) {
    if (!show) {
        $('#btn-billing-next').hide();
        $('#btn-billing-prev').hide();
    }
    else {
        $('#btn-billing-next').show();
        $('#btn-billing-prev').show();
    }
}

function confirmButtons(show) {
    if (!show) {
        $('#btn-confirm-next').hide();
        $('#btn-confirm-prev').hide();
    }
    else {
        $('#btn-confirm-next').show();
        $('#btn-confirm-prev').show();
    }
}


function setShippingMethods() {

    if (!IsShippingSelected()) {
    return;
    }

    var parties = [];
    var shipping = [];
    var orderShippingPreference = $('#orderShippingPreference').val();
    $("#deliveryMethodSet").val(false);

    $("#ToBillingButton").button('loading');
    $("#BackToBillingButton").button('loading');

    if (orderShippingPreference == 1) {
        parties.push({
            "Name": $('#ShipAllItemsInput-Name').val(),
            "Address1": $('#ShipAllItemsInput-Address').val(),
            "Country": $('#ShipAllItemsInput-Country').val(),
            "City": $('#ShipAllItemsInput-City').val(),
            "State": $('#ShipAllItemsInput-State').val(),
            "ZipPostalCode": $('#ShipAllItemsInput-Zipcode').val(),
            "ExternalId": $('#ShipAllItemsInput-ExternalId').val(),
            "PartyId": $('#ShipAllItemsInput-ExternalId').val(),
        });

        var shippingMethod = $('input[name="shippingMethodId"]:checked');
        shipping.push({
            "ShippingMethodID": shippingMethod.val(),
            "ShippingMethodName": shippingMethod.attr('data-name'),
            "ShippingPreferenceType": orderShippingPreference,
            "PartyID": $('#ShipAllItemsInput-ExternalId').val()
        });

    }
    else if (orderShippingPreference == 2) {
        var selectedStore = $('.store-Selected');
        var storeId = selectedStore.children().find('span[pid="storeId"]').text();
        parties.push({
            "Name": selectedStore.children().find('span[pid="storeName"]').text(),
            "Address1": selectedStore.children().find('span[pid="storeAddress1"]').text(),
            "Country": selectedStore.children().find('span[pid="storeCountry"]').text(),
            "City": selectedStore.children().find('span[pid="storeCity"]').text(),
            "State": selectedStore.children().find('span[pid="storeState"]').text(),
            "ZipPostalCode": selectedStore.children().find('span[pid="storeZipCode"]').text(),
            "ExternalId": storeId,
            "PartyId": storeId
        });

        shipping.push({
            "ShippingMethodID": $('#storeDeliveryMethodId').val(),
            "ShippingMethodName": $('#storeDeliveryMethodId').attr('data-ajax-name'),
            "ShippingPreferenceType": orderShippingPreference,
            "PartyID": storeId
        });
    }
    else if (orderShippingPreference == 4) {
        $.each($('div[id^="AccordionContent-"]'), function () {
            var lineId = $(this).attr('id').replace('AccordionContent-', '');
            var lineDeliveryPreference = $('#lineShippingPreference-' + lineId).val();

            if (lineDeliveryPreference == 1) {
                parties.push({
                    "Name": $('#lineShipAllItemsInput-Name-' + lineId).val(),
                    "Address1": $('#lineShipAllItemsInput-Address-' + lineId).val(),
                    "Country": $('#lineShipAllItemsInput-Country-' + lineId).val(),
                    "City": $('#lineShipAllItemsInput-City-' + lineId).val(),
                    "State": $('#lineShipAllItemsInput-State-' + lineId).val(),
                    "ZipPostalCode": $('#lineShipAllItemsInput-Zipcode-' + lineId).val(),
                    "ExternalId": $('#lineShipAllItemsInput-ExternalId-' + lineId).val(),
                    "PartyId": $('#lineShipAllItemsInput-ExternalId-' + lineId).val(),
                });

                var shippingMethod = $('input[name="shippingMethodId-'+ lineId +'"]:checked');
                shipping.push({
                    "ShippingMethodID": shippingMethod.val(),
                    "ShippingMethodName": shippingMethod.attr('data-name'),
                    "ShippingPreferenceType": lineDeliveryPreference,
                    "PartyID": $('#ShipAllItemsInput-ExternalId-' + lineId).val(),
                    "LineIDs": [lineId]
                });
            }

            if (lineDeliveryPreference == 2) {
                var selectedStore = $('.store-Selected');
                var storeId = selectedStore.children().find('span[pid="storeId-' + lineId +'"]').text();
                parties.push({
                    "Name": selectedStore.children().find('h2[pid="storeName-' + lineId +'"]').text(),
                    "Address1": selectedStore.children().find('p[pid="storeAddress1-' + lineId + '"]').text(),
                    "Country": selectedStore.children().find('span[pid="storeCountry-' + lineId + '"]').text(),
                    "City": selectedStore.children().find('span[pid="storeCity-' + lineId + '"]').text(),
                    "State": selectedStore.children().find('span[pid="storeState-' + lineId + '"]').text(),
                    "ZipPostalCode": selectedStore.children().find('span[pid="storeZipCode-' + lineId + '"]').text(),
                    "ExternalId": storeId,
                    "PartyId": storeId
                });

                shipping.push({
                    "ShippingMethodID": $('#storeDeliveryMethodId').val(),
                    "ShippingMethodName": $('#storeDeliveryMethodId').attr('data-ajax-name'),
                    "ShippingPreferenceType": lineDeliveryPreference,
                    "PartyID": storeId,
                    "LineIDs": [lineId]
                });
            }

            if (lineDeliveryPreference == 3) {
                shipping.push({
                    "ShippingMethodID": $('#emailDeliveryMethodId').val(),
                    "ShippingMethodName": $('#emailDeliveryMethodId').attr('data-ajax-name'),
                    "ShippingPreferenceType": lineDeliveryPreference,
                    "ElectronicDeliveryEmail": $('#lineShippingSelectedEmail-' + lineId).val(),
                    "ElectronicDeliveryEmailContent": $('#lineShippingSelectedEmailContent-' + lineId).val(),
                    "LineIDs": [lineId]
                });
            }
        });
    }
    else if (orderShippingPreference == 3) {
        shipping.push({
            "ShippingMethodID": $('#emailDeliveryMethodId').val(),
            "ShippingMethodName": $('#emailDeliveryMethodId').attr('data-ajax-name'),
            "ShippingPreferenceType": orderShippingPreference,
            "ElectronicDeliveryEmail": $('#shippingEmailAddress').val(),
            "ElectronicDeliveryEmailContent": $('#shippingEmailMessage').val()
        });
    }

    $('#confirmShippingddress1').text($('#ShipAllItemsInput-Name').val());
    $('#confirmShippingddress2').text( $('#ShipAllItemsInput-Address').val() + ", " +  $('#ShipAllItemsInput-City').val());
    $('#confirmShippingddress3').text( $('#ShipAllItemsInput-State').val() + ", " + $('#ShipAllItemsInput-Zipcode').val() + ", " +   $('#ShipAllItemsInput-Country').val());

    var data = '{"OrderShippingPreferenceType": "' + orderShippingPreference + '", "ShippingMethods":' + JSON.stringify(shipping) + ', "ShippingAddresses":' + JSON.stringify(parties) + '}';
    AJAXPost(StorefrontUri("api/sitecore/checkout/SetShippingMethodsJson"), data, setShippingMethodsResponse, $(this));
    return false;
}

function setShippingMethodsResponse(data, success, sender) {
    if (!success) {
        return;
    }
    if (data.Errors.length == 0) {
        if (checkoutDataViewModel != null) {
            checkoutDataViewModel.shippingCost.discount(data.Discount);
            checkoutDataViewModel.shippingCost.lines(data.Lines);
            checkoutDataViewModel.shippingCost.shippingTotal(data.ShippingTotal);
            checkoutDataViewModel.shippingCost.subTotal(data.SubTotal);
            checkoutDataViewModel.shippingCost.taxTotal(data.TaxTotal);
            checkoutDataViewModel.shippingCost.total(data.Total);

        }

        $("#confirmShippingMethod").text($('#orderShippingPreference option:selected').text());
        
        $("#deliveryMethodSet").val(true);
        $("#billingStep").show();
        $("#reviewStep").hide();
        $("#shippingStep").hide();
        shippingButtons(false);
        billingButtons(true);
        confirmButtons(false);
        $("#checkoutNavigation1").parent().removeClass("active");
        $("#checkoutNavigation2").parent().addClass("active");
        $("#checkoutNavigation3").parent().removeClass("active");

        $("#checkoutNavigation2").parent().removeClass("disabled");
        $("#checkoutNavigation3").parent().removeClass("disabled");

        BlockBillingFields();


    } else {
        // Show Errors
    }

    $("#ToBillingButton").button('reset');
    $("#BackToBillingButton").button('reset');
}

function UnblockBillingFields() {
    $("#creditCardPayment_CustomerNameOnPayment").prop("disabled", false);
    $("#creditCardPayment_CreditCardNumber").prop("disabled", false);
    $("#creditCardPayment_ExpirationMonth").prop("disabled", false);
    $("#creditCardPayment_ExpirationYear").prop("disabled", false);
    $("#creditCardPayment_ValidationCode").prop("disabled", false);
    $("#creditCardPayment_CustomerNameOnPayment").prop("disabled", false);
}

function BlockBillingFields() {
    $("#creditCardPayment_CustomerNameOnPayment").prop("disabled", true);
    $("#creditCardPayment_CreditCardNumber").prop("disabled", true);
    $("#creditCardPayment_ExpirationMonth").prop("disabled", true);
    $("#creditCardPayment_ExpirationYear").prop("disabled", true);
    $("#creditCardPayment_ValidationCode").prop("disabled", true);
    $("#creditCardPayment_CustomerNameOnPayment").prop("disabled", true);
}


function IsShippingSelected() {

    var sendAll = $("#IsShippingSelected_SendAll").val();
    var sendStore = $("#IsShippingSelected_Store").val();
    var sendEmail = $("#IsShippingSelected_Email").val();
    var sendItems = $("#IsShippingSelected_ByItem").val();

    if (sendAll == 'true' || sendStore == 'true' || sendEmail == 'true' || sendItems == 'true') {
        return true;
    } else {
        return false;
    }
   

}

function initShippingOptions() {
    $("#IsShippingSelected_SendAll").val(false);
    $("#IsShippingSelected_Store").val(false);
    $("#IsShippingSelected_Email").val(false);
    $("#IsShippingSelected_ByItem").val(false);
}

function AreAllShippingItemsSet() {

    if (checkoutDataViewModel != null) {
        var IsSet = true;
         $.each(checkoutDataViewModel.lineItemListViewModel.cartlines(), function (i, v) {
            if (shippingMethodsArray.indexOf(v.externalCartlineId) == -1) {
                IsSet = false;
            }
        });

        $("#IsShippingSelected_ByItem").val(true);
        return IsSet;

    }
}

// ----- CHECKOUT ----- //

function parseFloatMoney(str) {
    str = (str + '').replace(/[^\d,.-]/g, '')
    var sign = str.charAt(0) === '-' ? '-' : '+'
    var minor = str.match(/[.,](\d+)$/)
    str = str.replace(/[.,]\d*$/, '').replace(/\D/g, '')
    return Number(sign + str + (minor ? '.' + minor[1] : ''))
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function initCurrency(currency) {
    currency = currency + ' ';
    $("#billingOrderTotal").autoNumeric("init", { aSign: currency });
    $('#paymentTotal').autoNumeric("init", { aSign: currency });
    $('#paymentTotal_Confirm').autoNumeric("init", { aSign: currency });
    $('#billingGiftCardAmount_Confirm').autoNumeric('init', { aSign: currency });
    $('#billingGiftCardAmount').autoNumeric('init', { aSign: currency });
    $('#giftCardPayment_AppliedAmount').autoNumeric('init', { aSign: currency });
    $('#loyaltyCardPayment_AppliedAmount').autoNumeric('init', { aSign: currency });
    $('#billingCreditCardAmount').autoNumeric('init', { aSign: currency });
    $('#billingCreditCardAmount_Confirm').autoNumeric('init', { aSign: currency });
    $('#billingLoyaltyCardAmount').autoNumeric('init', { aSign: currency });
    
}