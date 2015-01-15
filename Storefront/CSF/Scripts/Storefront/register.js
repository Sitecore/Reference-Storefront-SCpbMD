function RegisterSuccess(cntx) {
    $("#registerFail").addClass("alert-success").html("RegisterSuccess");

    var errors = "";
    for (var i = 0; i < cntx.Errors.length; i++) {
        errors = errors + cntx.Errors[i] + "*<br/>";
    }

    if (cntx.Errors.length == 0) {
        $("#registerSuccess").show().fadeOut(4000);
        window.location.href = StorefrontUri("AccountManagement");
    }
    else {
        $("#registerFail").addClass("alert-error").html(errors);
        $("#registerFail").show();
    }

    $("#registerButton").button('reset');
}

function RegisterFailure(cntx) {
    $("#registerFail").show();

    $("#registerButton").button('reset');
}

function SetLoadingButton(cntx){
$(document).ready(function () {
$("#registerButton").button('loading');
});
}
