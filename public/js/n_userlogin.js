$(document).ready(function() {
//-----------------------------login---------------------------
//for user/doctor/pharmacist login -------------------------------

    $('#loginButton1').click(function () {
        alert("otp has been sent");
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
                        if(result.value === 'user'){
                            window.location = '/profile';
                        }
                        if(result.value === 'doctor'){
                            window.location = '/health_care_provider'
                        }
                        if(result.value === 'pharma'){
                            window.location = '/health_care_provider';
                        }

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
        alert("otp for forgot password has been sent");
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
        alert("verify password");
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
        alert("update password ");
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

//------------------register----------------
    //for user Login----------------------------------
        //for otp request
        $('#send').click(function () {
<<<<<<< HEAD
            alert("otp for user has been sent");
            var name = $('#name').val();
=======
>>>>>>> 93e4985dc96e7dab83f23df96db7528d39d1f39f
            var number = $('#number').val();
            var data = {
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
            alert("verify otp");
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
            alert("user-sign-up");
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
                    url: "/userregister",
                    method: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    success: function (result) {

                        if (result.status === "success") {
                            Materialize.toast(result.message, 2000);
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

    //for doctor-----------------------------------------------------
        //for otp request
        $('#Dsend').click(function () {

            var number = $('#number').val();

            var data = {
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
                            $('.use').hide();
                            $('.phar').hide();
                            $('.basic').hide();
                            $('#common').hide();
                            $('#change').show();
                            $('#pass').show();
                            $('#number').attr('disabled', 'disabled');
                            $('#password1').attr('disabled', 'disabled');
                            $('.doc').show();

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
                            window.location = '/health_care_provider?page=doctor_registered'
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

            var number = $('#number').val();

            var data = {
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
                    url: "/pharmaregister",
                    method: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    success: function (result) {

                        if (result.status === "success") {
                            Materialize.toast(result.message, 2000);
                            window.location = '/health_care_provider?page=pharma_registered';

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
                url: "/needhelpWL" ,
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
    $('#submitbutt1').click(function () {
        alert("nidhi");
        var issue = $('#fdropdown').val();
        var description = $('#n_description').val();

        var data = {
            subject: issue,
            contact_message: description
        };


        $.ajax({
            url: "/needhelp",
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
    //feedback
});