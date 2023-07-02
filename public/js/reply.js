let id = '';
let product = '';
let body = '';
function getId(index, name ,pro) {
    id = index
    $('#answer').text('پاسخ به ' + name)
    product = pro
}

$('#answerButton').prop('disabled', true)


$('#answerBody').on('keyup change', function () {
    let value = $('#answerBody').val()
    if (value.length <= 1) {
        $('#answerBodyError').fadeIn()
        $('#answerButton').prop('disabled', true)
    } else {
        $('#answerBodyError').fadeOut()
        $('#answerButton').prop('disabled', false)
    }

})

$('#answerButton').click(function () {
    let reply = $('#answerBody').val()
    $.ajax({
        type: "post",
        url: '/sellerPanel/comments',
        data: { body : reply  ,id : id , product : product},
        dataType: "dataType",
        success: function (response) {

        }
    });

    Swal.fire(
        'پاسخ با موفقیت ثبت شد ',
        'درصورت بروز هرگونه مشکل به پشتیبانی پیام دهید',
        'success'
    )
})