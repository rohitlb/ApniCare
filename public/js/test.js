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
                        $('#password1').attr('disabled','disabled');
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
                        $('#password1').removeAttr('disabled');

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



    $('#edu_special').hide();
    $('#basic_details').click(function () {
        var title = $('#title').val();
        var name = $('#name').val();
        var gender = $("input[type='radio'][name='gender']:checked").val();
        var city = $('#city').val();
        var experience = $('#year_of_experience').val();
        var about = $('#about_you').val();
        var data = {
            title: title,
            name: name,
            gender : gender,
            city: city,
            experience : experience,
            about: about
        }
        $.ajax({
            url: '/basic',
            type: 'POST',
            data : JSON.stringify(data),
            contentType : 'application/json',
            success: function (result) {
                if(result.success === 'success')
                {
                    Materialize.toast(result.message,1000);
                }
                else
                {
                    Materialize.toast(result.message,1000);
                }
            }
            //window.location = '/health_care_provider?page=profile_pharmacist';
            // $('#profile3').hide();
            // $('#main_profile_pharmacist').show();
        });
        //$('#tab2').focus();
        //$('#main_profile_doctor ul.tabs li.tab a').hover(function() {
        $('#tab2').focus();
        $('#basic_detail').hide();
        $('#edu_special').show();
    });

    $('#education').click(function () {
        var qualification = $('#qualification').val();
        var college = $('#college').val();
        var completion_year = $('#completion_year').val();
        var specialization = $('#specialization').val();
        var data = {
            qualification : qualification,
            college : college,
            completion : completion_year,
            specialization : specialization
        }
        $.ajax({
            url: '/education',
            type: 'POST',
            data : JSON.stringify(data),
            contentType : 'application/json',
            success: function (result) {
                if(result.success === 'success')
                {
                    Materialize.toast(result.message,1000);
                }
                else
                {
                    Materialize.toast(result.message,1000);
                }
            }
        });
        $('#tab3').focus();
        // $('#main_profile_doctor ul.tabs li.tab a').hover(function() {
        //     $('#tab3').addClass('active').find('li.tab').show().css({'background-color':'lavender'});
        // });

        $('#edu_special').hide();
        $('#register_doc').show();

    $('#submitButton').click(function () {

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
                url: "/register",
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {

                    if (result.status === "success") {
                        window.location = '/profiles';

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
    $('#OTPforForgot').click(function () {



    $('.upload_image1').submit(function () {
        var council_number = $('#council_reg_no').val();
        var council_name = $('#council_name').val();
        var council_year = $('#council_year').val();
        alert(council_number);
        alert(council_name);
        alert(council_year);
        // var name = $('#name').val();
        var number = $('#registeredMOB').val();

        var data = {
            //name: name,
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

                        $('#OTPforForgot').hide();
                        $('#pass1').show();
                        $('#healthCare').hide();
                        $('#Customer').hide();
                        $('#password3').attr('disabled','disabled');
                    }
                    else {
                        Materialize.toast(result.message, 2000);
                        //$('#change').click(function () {
                        //  $('#number').removeAttr('disabled');
                        //$('#password').attr('disabled','disabled');

                        //});
                    }

                },
                error: function (err) {

                }
            }


        )});
    //for verification
    $('#verify1').click(function () {
        var otp = $('#otp1').val();

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
                        window.location = '/profiles';

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


    //- ..............Disease data form.. name of disease to be changed on entry..................
    $('#disease_name').change(function () {
        var disease_name = $('#disease_name').val();

    });
    $('#file').change(function () {
        filePreview(this);
    });
});
function filePreview(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#uploadImage + img').remove();
            $('#uploadImage').after('<img src="'+e.target.result+'" width="150" height="150"/>');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

