$(document).ready(function() {
    $('.modal').modal({
        dismissible:false,
        opacity: .15,
        inDuration: 300,
        outDuration: 200,
        padding: '0px'
    });
    //***************************************

$('.initial').click(function () {
   $('.initial').focus()
});


//*************************************8
    /*var $fixed_element = $("#mol_row1_subrow4")
    if($fixed_element.length){
        var $offset = $(".footer123").position().top,
            $wh = $(window).innerHeight(),
            $diff = $offset - $wh,
            $scrolled = $(window).scrollTop();
        $fixed_element.css("bottom", Math.max(0, $scrolled-$diff));
    }*/
    $(window).scroll(function(){
        $("#mol_row1_subrow4").css("margin-bottom",Math.max(700,500-$(this).scrollPaddingBottom()));
    });







    //----------------------------------------------------------------------------------------------------------------
    //$('#input2').hide();
    //$('#searchfields').click(function () {
    //    $('#input2').show();
    //});
    $('#col4').hide();
    $('#find_doctor').hide();
    $('.a').hide();
    $('.b').hide();
    $('#drugInformation').hover(function () {
        $('.c').hide();
        $('.a').hide();
        $('#crousel1').show();
        $('.b').hide();
        $('#drugdivider').show();

    });
    $('#diseaseInformation').hover(function () {
        $('.a').hide();
        $('.c').hide();
        $('#crousel2').show();
        $('.b').hide();
        $('#diseasedivider').show();

    });
    $('#moleculeInformation').hover(function () {
        $('.a').hide();
        $('.c').hide();
        $('#crousel3').show();
        $('.b').hide();
        $('#moleculedivider').show();

    });
    $('#find_a_right_doctor').hover(function () {
        $('.a').hide();
        $('.c').hide();
        $('#crousel4').show();
        $('.b').hide();
        $('#doctordivider').show();

    });


    $('.carousel').carousel();
    $('.carousel.carousel-slider.abc').carousel({fullWidth: true});
    $('.slide-prev').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('.carousel.abc').carousel('prev')
    });
    $('.slide-next').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('.carousel.abc').carousel('next')
    });

    // $('.share-btn').click(function (e) {
    //     var win = window.open('http://google.com', '_blank');
    //     win.focus();
    // });

    $('.carousel.carousel-slider.xyz').carousel({fullWidth: true});
    $('#diseaseInformation').click(function (e) {
        e.priventDefault();
        e.stopPropagation();
        $('.carousel.xyz').carousel('next')
    });
});