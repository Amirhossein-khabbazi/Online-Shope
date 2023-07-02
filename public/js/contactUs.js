function sellerCheck() {
    let name = $('#sellerName').val();
    let phone = $('#sellerPhone').val();
    let message = $('#sellerMessage').val();

    if (!name || !phone || !message) {
        $("#sellerError").css("display", "block")
        $("#sellerRet").css("display", "none")
        $("#sellerSucssev").css("display", "none")
    }

    else if (name && phone && message) {
        $("#sellerError").css("display", "none")
        $.ajax({
            type: "post",
            url: '/contact_request',
            data: { name: name, phone: phone, message: message , type: "req"},
            dataType: "json",
            success: function (response) {
                if (response.msg) {
                    $("#sellerError").css("display", "block")
                    $("#sellerRet").css("display", "none")
                    $("#sellerSucssev").css("display", "none")
                }
                if (!response.msg && response.ret) {
                    $("#sellerRet").css("display", "block")
                    $("#sellerError").css("display", "none")
                    $("#sellerSucssev").css("display", "none")
                }
                else if (!response.msg) {
                    $("#sellerSucssev").css("display", "block")
                    $("#sellerRet").css("display", "none")
                    $("#sellerError").css("display", "none")
                }
            }
        });
    }

}
function Check() {
    let name = $('#Name').val();
    let phone = $('#Phone').val();
    let message = $('#Message').val();

    if (!name || !phone || !message) {
        $("#Error").css("display", "block")
        $("#Ret").css("display", "none")
        $("#Sucssev").css("display", "none")
    }

    else if (name && phone && message) {
        $("#Error").css("display", "none")
        $.ajax({
            type: "post",
            url: '/contact_request',
            data: { name: name, phone: phone, message: message , type : "con"},
            dataType: "json",
            success: function (response) {
                if (response.msg) {
                    $("#Error").css("display", "block")
                    $("#Ret").css("display", "none")
                    $("#Sucssev").css("display", "none")
                }
                if (!response.msg && response.ret) {
                    $("#Ret").css("display", "block")
                    $("#Error").css("display", "none")
                    $("#Sucssev").css("display", "none")
                }
                else if (!response.msg) {
                    $("#Sucssev").css("display", "block")
                    $("#Ret").css("display", "none")
                    $("#Error").css("display", "none")
                }
            }
        });
    }

}