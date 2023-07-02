$(document).ready(function () {
    let Swidth;
    Swidth = $(window).width();
    if (Swidth < 1192)
        $(".table").addClass('table-responsive')
    if (Swidth > 1192)
        $(".table").removeClass('table-responsive')
});
$(window).resize(function () {
    let Swidth;
    Swidth = $(window).width();
    if (Swidth < 1192)
        $(".table").addClass('table-responsive')
    if (Swidth > 1192)
        $(".table").removeClass('table-responsive')
});

function ifCheck() {
    if ($('#Dremember:checkbox:checked').length == 1){
        $("#inputPhone").fadeOut()
        $("#inputName").fadeOut()
    }
    else{
        $("#inputPhone").fadeIn()
        $("#inputName").fadeIn()
    }
}


