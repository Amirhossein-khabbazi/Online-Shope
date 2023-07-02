$('#name').on('keyup change', function () {
    let name = $('#name').val()
    if (name.length == 0) {
        $('#nameError').fadeIn()
    } else {
        $('#nameError').fadeOut()
    }
})

$('#family').on('keyup change', function () {
    let family = $('#family').val()
    if (family.length == 0) {
        $('#familyError').fadeIn()
    } else {
        $('#familyError').fadeOut()
    }
})

$('#phone').on('keyup change', function () {
    let phone = $('#phone').val()
    if (phone.length != 11) {
        $('#phoneError').fadeIn()
    } else {
        $('#phoneError').fadeOut()
    }
})

$('#brand').on('keyup change', function () {
    let brand = $('#brand').val()
    if (brand.length == 0) {
        $('#brandError').fadeIn()
    } else {
        $('#brandError').fadeOut()
    }
})


//
$('#peresentPassword').on('keyup change', function () {
    let peresentPassword = $('#peresentPassword').val()
    if (peresentPassword.length == 0) {
        $('#peresentPasswordError').fadeIn()
    } else {
        $('#peresentPasswordError').fadeOut()
    }
})

$('#newPassword').on('keyup change', function () {
    let newPassword = $('#newPassword').val()
    if (newPassword.length == 0) {
        $('#newPasswordError').fadeIn()
    } else {
        $('#newPasswordError').fadeOut()
    }
})

$('#repeadNewPassword').on('keyup change', function () {
    let repeadNewPassword = $('#repeadNewPassword').val()
    if (repeadNewPassword.length == 0) {
        $('#repeadNewPasswordError').fadeIn()
        $('#matchError').fadeOut()
    } else {
        $('#repeadNewPasswordError').fadeOut()
    }
})

$('#repeadNewPassword').on('change', function () {
    let newPassword = $('#newPassword').val()
    let repeadNewPassword = $('#repeadNewPassword').val()
    if (newPassword != repeadNewPassword) {
        $('#matchError').fadeIn()
    } else {
        $('#matchError').fadeOut()
    }
})

//online check UserName
$('#userName').on('keyup change', function () {
    let userName = $('#userName').val()
    if (userName.length< 3) {
        $('#userNameEmpty').fadeIn(0.3)
        $('#userNameExist').fadeOut(0)
        $('#userNameError').fadeOut(0)
        return;
    }
    $('#userNameEmpty').fadeOut(0)
    $.ajax({
        type: "post",
        url: "/sellerPanel/checkUserName",
        data: { userName: userName },
        dataType: "json",
        success: function (response) {
            if (response.s && !response.n) {
                $('#userNameError').fadeOut(0)
                $('#userNameExist').fadeIn(0.3)
            }
            if (!response.s && !response.n) {
                $('#userNameExist').fadeOut(0)
                $('#userNameError').fadeIn(0.3)
            }
            if (!response.s && response.n) {
                $('#userNameExist').fadeOut(0.3)
                $('#userNameError').fadeOut(0.3)
            }

        }
    })




})