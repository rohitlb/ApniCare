$(document).ready(function() {

//for user Login----------------------------------
    //for register or sign up
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
                        //testing
                        $('.doc').hide();
                        $('.phar').hide();
                        $('.use').show();
                        $('.basic').hide();
                        $('#common').hide();
                        $('#change').show();
                        $('#pass').show();
                        $('#number').attr('disabled', 'disabled');
                        $('#password1').attr('disabled', 'disabled');
                        $('#submitButton').show();
                        //testing
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
    //for verification of OTP
    $('#verify').click(function () {
        $('#password1').removeAttr('disabled');
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

                    if (result.status === "success") {
                        Materialize.toast(result.message, 2000);
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
    //for registering the data
    $('#submitButton').click(function () {

        var name = $('#name').val();
        var email = $('#email').val();
        var number = $('#number').val();
        var password = $('#password1').val();

        var data = {
            name: name,
            email: email,
            number: number,
            password: password
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


//for user/doctor/pharmacist login -------------------------------


    $('#loginButton1').click(function () {

        // $('#preloader').show();

        var number = $('#number2').val();
        var password = $('#password2').val();
        //alert(number);
        //alert(password);

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
    //otp sent
    $('#OTPforForgot').click(function () {
        var number = $('#registeredMOB').val();


        var data = {
            number: number
        };

        $.ajax(
            {
                url: "/checkforgotpassword",
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {

                    if (result.status === "success") {
                        Materialize.toast(result.message, 2000);
                        //testing
                        $('#forgot_description').hide();
                        $('#OTPforForgot').hide();
                        $('#pass1').show();
                        $('#password3').attr('disabled', 'disabled');
                        $('#registeredMOB').attr('disabled', 'disabled');
                        //testing
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
    //for verification
    $('#verify1').click(function () {
        var otp = $('#otp1').val();
        $('#password3').removeAttr('disabled');

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

                    if (result.status === "success") {
                        Materialize.toast(result.message, 2000);
                        $('#password3').removeAttr('disabled');

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


    $('#againLogin').click(function () {

        //$('#preloader').show();

        //var number = $('#registeredMOB').val();
        var password = $('#password3').val();

        var data1 = {

            //number: number,
            password: password
        };

        $.ajax(
            {
                url: "/updatepassword",
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
            });
    });
//for doctor-----------------------------------------------------
    //for otp request
    $('#Dsend').click(function () {


        var name = $('#name').val();
        var number = $('#number').val();

        var data = {
            name: name,
            number: number
        };

        $.ajax(
            {
                url: "/DoctorsendOTP",
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {

                    if (result.status === "success") {
                        Materialize.toast(result.message, 2000);
                        //testing
                        $('.use').hide();
                        $('.phar').hide();
                        $('.basic').hide();
                        $('#common').hide();
                        $('#change').show();
                        $('#pass').show();
                        $('#number').attr('disabled', 'disabled');
                        $('#password1').attr('disabled', 'disabled');
                        $('.doc').show();


                        //testing

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
    //verify OTP is same as user's
    //register doctor--------------|
    $('#DsubmitButton').click(function () {

        var name = $('#name').val();
        var email = $('#email').val();
        var number = $('#number').val();
        var password = $('#password1').val();
        //var otp = $('#otp').val();

        var data = {
            name: name,
            email: email,
            number: number,
            password: password
            //  otp: otp
        };

        $.ajax(
            {
                url: "/doctorregister",
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {

                    if (result.status === "success") {
                        window.location = '/health_care_provider/occupation';

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


//for Pharmacist------------------------------------------------
    //for otp request
    $('#Psend').click(function () {

        var name = $('#name').val();
        var number = $('#number').val();

        var data = {
            name: name,
            number: number
        };

        $.ajax(
            {
                url: "/DoctorsendOTP",
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {

                    if (result.status === "success") {
                        Materialize.toast(result.message, 2000);
                        //testing
                        $('.use').hide();
                        $('.doc').hide();
                        $('.basic').hide();
                        $('#common').hide();
                        $('#change').show();
                        $('#pass').show();
                        $('#number').attr('disabled', 'disabled');
                        $('#password1').attr('disabled', 'disabled');
                        $('.phar').show();


                        //testing

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
    //verify otp same as user's
    //for pharmacist register------------|
    $('#PsubmitButton').click(function () {

        var name = $('#name').val();
        var email = $('#email').val();
        var number = $('#number').val();
        var password = $('#password1').val();
        //var otp = $('#otp').val();

        var data = {
            name: name,
            email: email,
            number: number,
            password: password
            //  otp: otp
        };

        $.ajax(
            {
                url: "/pharma",
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {

                    if (result.status === "success") {
                        window.location = 'health_care_provider/occupation';

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

    //needhelp without login
    $('#submitbutt').click(function () {
        var issue = $('#fdropdown').val();
        var email = $('#n_email').val();
        var name = $('#name').val();
        var number = $('#number').val();
        var description = $('#n_description').val();
        var data = {
            subject: issue,
            name: name,
            number: number,
            email: email,
            contact_message: description
        };
        $.ajax({
            url: "/needhelpWL",
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {

                if (result.status === "success") {
                    Materialize.toast(result.message, 2000);
                }
                else {
                    Materialize.toast(result.message, 2000);
                }

            },
            error: function (err) {

                console.log(err);
            }
        })
    });
    //needhelp with login
    //feedback
});