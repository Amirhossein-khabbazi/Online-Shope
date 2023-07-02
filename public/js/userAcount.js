function checkUserAcount() {
    let phone = $('#phone').val();
    let address = $('#address').val();
    let name = $('#name').val();
    let family = $('#family').val();

    if(!name) {
        return $('#nameEmpty').css('display', 'block');
    }
    else {
        $('#nameEmpty').css('display', 'none');
    }
    if(!family) {
        return $('#familyEmpty').css('display', 'block');
    }
    else {
        $('#familyEmpty').css('display', 'none');
    }
    if(!phone) {
        return $('#phoneEmpty').css('display', 'block');
    }
    else {
        $('#phoneEmpty').css('display', 'none');
    }
    if(!address){
        return $('#addressEmpty').css('display', 'block');
    }
    else{
        $('#addressEmpty').css('display', 'none');
    }

    
    let password = $('#currentpwd').val();
    let newPassword = $('#newpwd').val();
    let configPassword = $('#confirmpwd').val();
    if(password || newPassword || configPassword){
        if (!password) {
            return $('#currentPasswordmEmpty').css('display', 'block');
        }
        else{
            $('#currentPasswordmEmpty').css('display', 'none');
        }
        if (!newPassword) {
            return $('#newPasswordmEmpty').css('display', 'block');
        }
        else{
            $('#newPasswordmEmpty').css('display', 'none');
        }
        if (!configPassword) {
            return $('#confirmEmpty').css('display', 'block');
        }
        else{
            $('#confirmEmpty').css('display', 'none');
        }
        if(newPassword){
            if(newPassword.length < 8){
                return  $('#newPasswordmLength').css('display', 'block');
            }
            else{
                $('#newPasswordmLength').css('display', 'none');
            }
        }
        if(newPassword && configPassword) {
            if(configPassword != newPassword){
                return $('#confirmNotMatch').css('display', 'block');
            }
            else{
                $('#confirmNotMatch').css('display', 'none');
            }
        }
        
        if(password){
            $.ajax({
                type: "post",
                url: '/buyer/checkPassword',
                data: {password: password },
                dataType: "json",
                success: function (response) {
                   if(response){
                    $('#currentPasswordmWrong').css('display', 'block');
                   }
                }
            });
        }
    }
   
    $('#updateUserAccountSubmit').submit();

}