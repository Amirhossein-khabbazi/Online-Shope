let error = false
function upgradeCard(id, proId) {
    let count = $('#count-' + id).val()
    if(count <= 0){
        $('#err-' + id).text('تعداد سفارش نمیتوانت کمتر از 1 باشد، درصورت وارد نکردن تعداد بیش از1، تعداد سفارش 1 در نظر گرفته میشود')
        count = 1
    }
    let Id = id
    $.ajax({
        type: "post",
        url: '/buyer/upgradeCard',
        data: { id: Id, count: count, proId: proId },
        dataType: "json",
        success: function (response) {
            if(response.fire){
                Swal.fire(
                    response.msg,
                    'درصورت مشکل حتما به پشتیبانی پیام دهید',
                    'error'
                )
            }
            else if(response.err) {
                error = true
                $('#err-' + id).text(response.msg)
            }else{
                $('#err-' + id).text('')
                error = false
            }
        }
    });
}

function refresh(){
    if(!error){
        location.reload()
    }
}