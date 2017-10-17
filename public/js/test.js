$(document).ready(function() {
    $('.carousel.carousel-slider').carousel({fullWidth: false});
    $('.carousel').carousel();
    $('.carousel').carousel('next');
    $('.carousel').carousel('next', 3);
    $('.carousel').carousel('prev');
    $('.carousel').carousel('prev', 4);
    $('.carousel').carousel('set', 4);

    $('.modal').modal({
        dismissible: true,
        opacity: .15,
        inDuration: 300,
        maxWidth: '550px',
        //transform: 'scaleX(0.7)',
        outDuration: 200,
        startingTop: '3%',
        endingTop: '25%',
        padding: '0px'
    });


    $('ul.tabs').tabs('select_tab', '#test-swipe-2');


    $('#change').hide();
    $('#pass').hide();
    $('#pass1').hide();
    $('#forgot').hide();
    $('#forgotButton').click(function () {
        $('#log').hide();
        $('#forgot').show();

    })
    $('#arrow').click(function () {
        $('#pass').hide();
        $('#forgot').hide();
        $('#log').show();

    })

    $('#continue').click(function () {

        $('#field').hide();
        $('#pass1').show();
    })
    $('#cancel').click(function () {
        $('#forgot').hide();
        $('#log').show();
    })

    $('#send').click(function () {

        $('#pass').show();
        $('#send').hide();
        $('#change').show();
    })
        //for otp request
    $('#send').click(function () {


        var name = $('#name').val();
        var number = $('#number').val();

        var data = {
            name: name,
            number: number
        };

        $.ajax(
            {
                url: "/sendOTP",
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {

                    if (result.status === "success") {
                        Materialize.toast(result.message, 2000);

                        $('#name').attr('disabled','disabled');
                        $('#number').attr('disabled','disabled');
                        $('#password').attr('disabled','disabled');
                    }
                    else {
                        Materialize.toast(result.message, 2000);
                        $('#change').click(function () {
                            $('#number').removeAttr('disabled');
                            $('#password').attr('disabled','disabled');

                        });
                    }

                },
                error: function (err) {

                }
            }

        )

    });
    $('#continue').click(function () {


       // var name = $('#name').val();
        var number = $('#resetPassword').val();

        var data = {
            //name: name,
            number: number
        };

        $.ajax(
            {
                url: "/sendOTP",
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {

                    if (result.status === "success") {
                        Materialize.toast(result.message, 2000);

                        $('#name').attr('disabled','disabled');
                        $('#number').attr('disabled','disabled');
                        $('#password').attr('disabled','disabled');
                    }
                    else {
                        Materialize.toast(result.message, 2000);
                        $('#change').click(function () {
                            $('#number').removeAttr('disabled');
                            $('#password').attr('disabled','disabled');

                        });
                    }

                },
                error: function (err) {

                }
            }

        )

    });

    $('#verify').click(function () {
        var otp = $('#otp').val();

        var data = {
            number: otp
        };

        $.ajax(
            {
                url: "/VerifyOTP",
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {

                    if (result) {
                        Materialize.toast(result.message, 2000);
                        $('#password').removeAttr('disabled');

                    }
                    else {
                        Materialize.toast(result.message, 2000);
                        $('#change').click(function () {
                            $('#number').removeAttr('disabled');

                        });
                    }

                },
                error: function (err) {

                }
            }

        )

    });


        $('#submitButton').click(function () {

            var name = $('#name').val();
            var number = $('#number').val();
            var password = $('#password').val();
        //var otp = $('#otp').val();

        var data = {
            name: name,
            number: number,
            password: password
          //  otp: otp
        };

        $.ajax(
            {
                url: "/register",
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {

                    if (result.status === "success") {
                        window.location = '/profile';

                    }
                    else {
                        Materialize.toast(result.message, 2000);
                    }

                },
                error: function (err) {

                    console.log(err);
                }
            }
        )
    });




    //for login

    $('#loginButton1').click(function () {

        $('#preloader').show();

        var number = $('#number1').val();
        var password = $('#password1').val();

        var data1 = {

            number: number,
            password: password
        };

        $.ajax(
            {
                url: "/login",
                method: 'POST',
                data: JSON.stringify(data1),
                contentType: 'application/json',
                success: function (result) {

                    if (result.status === "success") {
                        window.location = '/profile';

                    }
                    else {
                        Materialize.toast(result.message, 2000);
                    }

                },
                error: function (err) {

                    console.log(err);
                }
            }
        )
    });
});