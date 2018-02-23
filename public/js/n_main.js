$(document).ready(function () {
    //modal-----------------------
    $('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: 0.5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '10%', // Starting top style attribute
        endingTop: '3%' // Ending top style attribute
    });

    $(".collapsible-header").click(

        function() {
            $("#readMore").toggle();
        }

    );

    //for scrollspy------------------------------------
    $('.scrollspy').scrollSpy();

//for needhelp, contact us and feedback---------------------
    $('ul.tabs').tabs('select_tab', '#test-swipe-1');
    $('select').material_select();

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


});