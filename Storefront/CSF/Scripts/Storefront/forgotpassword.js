function ResetPasswordSuccess(cntx) {
    $("#resetPasswordFail").addClass("alert-success").html("ResetPasswordSuccess");

    var errors = "";
    for (var i = 0; i < cntx.Errors.length; i++) {
        errors = errors + cntx.Errors[i] + "*<br/>";
    }

    if (cntx.Errors.length == 0) {
        $("#resetPasswordSuccess").show().fadeOut(4000);
        window.location.href = StorefrontUri("ResetPasswordConfirmation?username=" + cntx.UserName + "");
    }
    else {
        $("#resetPasswordFail").addClass("alert-error").html(errors);
        $("#resetPasswordFail").show();
        $("#forgotPasswordButton").button('reset');
    }
}

function ResetPasswordFailure(cntx) {
    $("#resetPasswordFail").show();

    $("#forgotPasswordButton").button('reset');
}

function SetResetPasswordProcessingButton(cntx) {
$(document).ready(function () {
$("#forgotPasswordButton").button('loading');
});
}
