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
        outDuration: 200,
        padding: '0px'
    });


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
                        $('#divider').hide();
                        $('#healthCare').hide();
                        $('#send').hide();
                        $('#loginButton12').hide();
                        //$('#change').show();

                        $('#pass').show();

                        $('#name').attr('disabled','disabled');
                        $('#number').attr('disabled','disabled');
                        $('#password').attr('disabled','disabled');
                    }
                    else {
                        Materialize.toast(result.message, 2000);
<<<<<<< HEAD
                            //$('#number').removeAttr('disabled');
                            //$('#password').attr('disabled','disabled');


=======

                            $('#number').removeAttr('disabled');
                            $('#password').attr('disabled','disabled');
>>>>>>> 716d1db4ee5e5f6639cff4bd6ac4e612d2ccde5d
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
            var password = $('#password1').val();
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

       // $('#preloader').show();

        var number = $('#number2').val();
        var password = $('#password2').val();

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
    //for forgot password
    $('#resetOTP').click(function () {


        // var name = $('#name').val();
        var number = $('#registeredMOB').val();

        var data = {
            //name: name,
            number: number
        };

        $.ajax(
            {
                url: "/forgotpassword",
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {

                    if (result.status === "success") {
                        Materialize.toast(result.message, 2000);

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

    $('#againLogin').click(function () {

        //$('#preloader').show();

        var number = $('#registeredMOB').val();
        var password = $('#password2').val();

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