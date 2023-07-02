
$('#orderValid').prop('disabled', true)
$('#addToCard').prop('disabled', true)


$('#name').on('keyup change', function () {
    let nameVal = $('#name').val()
    if (nameVal.length < 3) {
        $('#nameError').fadeIn()
        $('#orderValid').prop('disabled', true)
    } else {
        $('#nameError').fadeOut()
        validation()
    }

});
function nameValidation() {
    let nameVal = $('#name').val()
    if (nameVal.length < 3) {
        $('#orderValid').prop('disabled', true)
        // $('#nameError').fadeIn()
        return false
    } else {
        // $('#nameError').fadeOut()
        return true
    }
}


$('#phone').on('keyup change', function () {
    let nameVal = $('#phone').val()
    if (nameVal.length < 11 || nameVal.length > 11) {
        $('#orderValid').prop('disabled', true)
        $('#phoneError').fadeIn()
    } else {
        $('#phoneError').fadeOut()
        validation()
    }

});

function phoneValidation() {
    let nameVal = $('#phone').val()
    if (nameVal.length < 11 || nameVal.length > 11) {
        $('#orderValid').prop('disabled', true)
        // $('#phoneError').fadeIn()
        return false
    } else {
        // $('#phoneError').fadeOut()
        return true
    }

}

$('#body').on('keyup change', function () {
    let nameVal = $('#body').val()
    if (nameVal.length < 5) {
        $('#orderValid').prop('disabled', true)
        $('#bodyError').fadeIn()
    } else {
        $('#bodyError').fadeOut()
        validation()
    }

});

function bodyValidation() {
    let nameVal = $('#body').val()
    if (nameVal.length < 5) {
        $('#orderValid').prop('disabled', true)
        // $('#bodyError').fadeIn()
        return false
    } else {
        // $('#bodyError').fadeOut()
        return true
    }
}

$('#address').on('keyup change', function () {
    let nameVal = $('#address').val()
    if (nameVal.length < 5) {
        $('#orderValid').prop('disabled', true)
        $('#addressError').fadeIn()
    } else {
        $('#addressError').fadeOut()
        validation()
    }

});

function addressValidation() {
    let nameVal = $('#address').val()
    if (nameVal.length < 5) {
        $('#orderValid').prop('disabled', true)
        // $('#addressError').fadeIn()
        return false
    } else {
        // $('#addressError').fadeOut()
        return true
    }
}

$('#number').on('keyup change', function () {
    let nameVal = parseInt($('#number').val())
    if (!nameVal || nameVal <= 0) {
        $('#orderValid').prop('disabled', true)
        $('#addToCard').prop('disabled', true)
        $('#numberErrorZero').fadeIn(250)
    } else {
        $('#numberErrorZero').fadeOut(0)
        $('#addToCard').prop('disabled', false)
        validation()
    }

    let exsist = $('#exsist').val()
    if (nameVal > exsist) {
        $('#orderValid').prop('disabled', true)
        $('#numberError').fadeIn(250)
    } else {
        $('#numberError').fadeOut(0)
        validation()
    }


});

function numberValidation() {
    let nameVal = parseInt($('#number').val())
    if (nameVal <= 0) {
        $('#orderValid').prop('disabled', true)
        $('#addToCard').prop('disabled', true)
        // $('#numberErrorZero').fadeIn()
        return false
    }

    let exsist = $('#exsist').val()
    if (nameVal > exsist) {
        $('#orderValid').prop('disabled', true)
        $('#addToCard').prop('disabled', true)
        // $('#numberError').fadeIn()
        return false
    }

    return true
}


function validation() {
    // nameValidation()
    // phoneValidation()
    // bodyValidation()
    // addressValidation()
    // numberValidation()
    // console.log('nameValidation() ' + nameValidation() + '\n' + 'phoneValidation() ' + phoneValidation() +'\n' + 'bodyValidation() '+ bodyValidation() + '\n' + 'numberValidation() ' + numberValidation() + '\n' + 'addressValidation() ' + addressValidation() + '\n');

    if (nameValidation() == true && phoneValidation() == true && bodyValidation() == true && addressValidation() == true && numberValidation() == true) {
        $('#orderValid').prop('disabled', false)

    }







};


$('#orderValid').click(function () {
    if (nameValidation() == true && phoneValidation() == true && bodyValidation() == true && addressValidation() == true && numberValidation() == true) {
        //send Ajax
        let slug = $('#ok').val()
        let name = $('#name').val()
        let phone = $('#phone').val()
        let body = $('#body').val()
        let address = $('#address').val()
        let number = $('#number').val()
        let userId = $('#userId').val()

        $.ajax({
            type: "post",
            url: '/product_details/getorder/' + slug,
            data: { name: name, phone: phone, body: body, address: address, number: number, userId: userId },
            dataType: "json",
            success: function (response) {
                if (response.err) {
                    Swal.fire(
                        response.msg,
                        '',
                        'error'
                    )
                }
                else if (!response.err) {
                    Swal.fire(
                        'سفارش شما با موفقیت ثبت شد',
                        'طی چند ساعت با شما تماس گرفته خواهد شد',
                        'success'
                    )
                }

            }
        });

        //update page not working
        let exist = parseInt($('#proExsist').val())
        let remiend = exist - number
        $('#exsist').html("<b>تعداد موجود</b>" + remiend)
        $('#number').val(0)



    }
});

function addToCard(id, exsist) {
    let number = parseInt($('#number-' + id).val())
    if (number <= 0) {
        // $('#addToCard').prop('disabled', true)
        Swal.fire(
            'تعداد محصول نمیتواند صفر ویا کمتر باشد',
            'لطفا دقت کنید!',
            'error'
        )
        return
    } else {
        $('#addToCard').prop('disabled', false)
    }

    if (!number) {
        Swal.fire(
            'لطفا تعداد را وارد کنید',
            '',
            'error'
        )
        return
    }
    if (number > exsist) {
        Swal.fire(
            'تعداد وارد شده بیشتر از تعداد محصول در انبار است',
            'لطفا دقت کنید!',
            'error'
        )
        return
    }


    // console.log('ok');
    $.ajax({
        type: "post",
        url: '/buyer/addToCard',
        data: { id: id, number: number },
        dataType: "json",
        success: function (response) {
            if (response.err) {
                Swal.fire(
                    response.msg,
                    'جهت ویرایش تعداد از داخل سبد خرید اقدام بفرمائید',
                    'error'
                )
            } else {
                Swal.fire(
                    'محصول با موفقیت به سبد خرید شما افزوده شد',
                    'میتوانید از طریق پنل کاربری ملاحضه بفرمائید',
                    'success'
                )
                setTimeout(function () {
                    location.reload();
                }, 500);

            }
        }
    });
}

function isInCard() {
    Swal.fire(
        'این محصول در سبد خرید شما موجود میباشد',
        'میتوانید از طریق پنل کاربری ملاحضه بفرمائید',
        'warning'
    )
}