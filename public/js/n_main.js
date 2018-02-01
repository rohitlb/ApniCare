$(document).ready(function() {
    /*$('.modal').modal({
        dismissible:true,
        opacity: .15,
        inDuration: 300,
        outDuration: 200,
        padding: '0px'
    });*/
//for more than 1 dosage form
    $('.description').hide();
    $(".dosage_form").click(function () {
        var dose = $('.dosage_form').text();
        alert(dose);
        $('.description').show();
    });
//for arranging alphabets-------------------------------
    $(".drug_alphabets a").on("click", function () {
        var type = $(this).attr("type");
        if (type) {
            if (type == 'all') {
                $(".brands a").show();//show all

            } else if (type == 'other') {
                $(".brands a").hide();//hide all
                $(".brands a").each(function () {
                    var brandName = $(this).attr("name");
                    if (!brandName.toLowerCase()[0].match(/[a-z]/i))//if name not starts with letter
                        $(this).show();
                });
            }
            return;
        }
        var clickedLetter = $(this).text();
        $(".brands a").each(function () {
            var brandName = $(this).attr("name");
            if (brandName.toLowerCase()[0] == clickedLetter.toLowerCase()) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

//for scrollspy------------------------------------
    $('.scrollspy').scrollSpy();

//modal-----------------------
    $('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: 0.7, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '20%', // Starting top style attribute
        endingTop: '10%' // Ending top style attribute
        //maxHeight:'90%',

    });

    $('#loginbut').click(function (a) {
        $("input").val('');
    });
    $('#signupbut').click(function (a) {
        $("input").val('');
    });
//***************************************

    $('.initial').click(function () {
        $('.initial').focus();
    });
//for needhelp, contact us and feedback---------------------
    $('ul.tabs').tabs('select_tab', '#test-swipe-1');
    $('select').material_select();

//***************************************************
    /*var $fixed_element = $("#mol_row1_subrow4")
    if($fixed_element.length){
        var $offset = $(".footer123").position().top,
            $wh = $(window).innerHeight(),
            $diff = $offset - $wh,
            $scrolled = $(window).scrollTop();
        $fixed_element.css("bottom", Math.max(0, $scrolled-$diff));
    }*/
    $(window).scroll(function () {
        $("#mol_row1_subrow4").css("margin-bottom", Math.max(700, 500 - $(this).scrollPaddingBottom()));
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