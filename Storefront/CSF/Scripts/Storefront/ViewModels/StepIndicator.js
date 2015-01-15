function setupStepIndicator() {
    $(document).ready(function () {
        $("#checkoutNavigation1").click(function (e) {
            switchingCheckoutStep("shipping");
            $("#checkoutNavigation1").parent().addClass("active");
            $("#checkoutNavigation2").parent().removeClass("active");
            $("#checkoutNavigation3").parent().removeClass("active");
        });
        $("#checkoutNavigation2").click(function (e) {
            if (!$("#ToBillingButton").prop("disabled")) {
                switchingCheckoutStep("billing");
                $("#checkoutNavigation2").parent().addClass("active");
                $("#checkoutNavigation1").parent().removeClass("active");
                $("#checkoutNavigation3").parent().removeClass("active");
            } else {
                $("#checkoutNavigation1").parent().addClass("active");
                $("#checkoutNavigation2").parent().removeClass("active");
                $("#checkoutNavigation3").parent().removeClass("active");
            }
        });
        $("#checkoutNavigation3").click(function (e) {
            if (!$("#ToBillingButton").prop("disabled")) {
                switchingCheckoutStep("confirm");
                $("#checkoutNavigation3").parent().addClass("active");
                $("#checkoutNavigation2").parent().removeClass("active");
                $("#checkoutNavigation1").parent().removeClass("active");
            } else {
                $("#checkoutNavigation1").parent().addClass("active");
                $("#checkoutNavigation2").parent().removeClass("active");
                $("#checkoutNavigation3").parent().removeClass("active");
            }
        });
    });
}