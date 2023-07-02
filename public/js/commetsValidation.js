
$('#commentSubmit').prop('disabled', true)

$('#nameComment').on('keyup change', function () {
    let nameVal = $('#nameComment').val()
    if (nameVal.length < 3) {
        $('#nameCommentError').fadeIn()
        $('#commentSubmit').prop('disabled', true)
    } else {
        $('#nameCommentError').fadeOut()
        validationErrors()
    }

});
function nameValidationError() {
    let nameVal = $('#nameComment').val()
    if (nameVal.length < 3) {
        $('#commentSubmit').prop('disabled', true)
        // $('#nameError').fadeIn()
        return false
    } else {
        // $('#nameError').fadeOut()
        return true
    }
}


$('#phoneComment').on('keyup change', function () {
    let nameVal = $('#phoneComment').val()
    if (nameVal.length < 11 || nameVal.length > 11) {
        $('#commentSubmit').prop('disabled', true)
        $('#phoneCommentError').fadeIn()
    } else {
        $('#phoneCommentError').fadeOut()
        validationErrors()
    }

});

function phoneValidationError() {
    let nameVal = $('#phoneComment').val()
    if (nameVal.length < 11 || nameVal.length > 11) {
        $('#commentSubmit').prop('disabled', true)
        // $('#phoneError').fadeIn()
        return false
    } else {
        // $('#phoneError').fadeOut()
        return true
    }

}

$('#bodyComment').on('keyup change', function () {
    let nameVal = $('#bodyComment').val()
    if (nameVal.length < 2) {
        $('#commentSubmit').prop('disabled', true)
        $('#bodyCommentError').fadeIn()
    } else {
        $('#bodyCommentError').fadeOut()
        validationErrors()
    }

});

function bodyValidationError() {
    let nameVal = $('#bodyComment').val()
    if (nameVal.length < 2) {
        $('#commentSubmit').prop('disabled', true)
        // $('#bodyError').fadeIn()
        return false
    } else {
        // $('#bodyError').fadeOut()
        return true
    }
}






function validationErrors() {

    if (nameValidationError() == true && phoneValidationError() == true && bodyValidationError() == true) {
        $('#commentSubmit').prop('disabled', false)

    }
};


$('#commentSubmitButton').click(async function () {
    //send Ajax
    let name = $('#nameComment').val()
    let phone = $('#phoneComment').val()
    let body = $('#bodyComment').val()
    let product = $('#product').val()

    $.ajax({
        type: "post",
        url: '/product_details/create/' + product,
        data: { fullName: name, phone: phone, body: body, product: product, url: $(location).attr('href') },
        dataType: "dataType",
        success: function (response) {

        }
    });


    // const rawResponse = await fetch('/product_details/create/' + product , {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({fullName: name, phone: phone, body: body, product: product })
    //   });


    
    let timerInterval
    Swal.fire({
        title: 'نظر شما با موفقیت ثبت شد',
        text :'پس از تایید از طرف مدیریت در سایت قرار خواهد گرفت.',
        icon :'success',
        showCloseButton: true,
        // html: 'I will close in <b></b> milliseconds.',
        timer: 4000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
                const content = Swal.getHtmlContainer()
                if (content) {
                    const b = content.querySelector('b')
                    if (b) {
                        b.textContent = Swal.getTimerLeft()
                    }
                }
            }, 100)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
        }
    })



});