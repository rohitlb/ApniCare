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


<<<<<<< HEAD
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
=======
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
>>>>>>> 44f322b6361c9d1821747676a36f21879307c440
    });
    //for forgot password
    $('#OTPforForgot').click(function () {


<<<<<<< HEAD
    $('.upload_image1').submit(function () {
        var council_number = $('#council_reg_no').val();
        var council_name = $('#council_name').val();
        var council_year = $('#council_year').val();
        alert(council_number);
        alert(council_name);
        alert(council_year);
=======
        // var name = $('#name').val();
        var number = $('#registeredMOB').val();

>>>>>>> 44f322b6361c9d1821747676a36f21879307c440
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
<<<<<<< HEAD
        });
=======

        )

>>>>>>> 44f322b6361c9d1821747676a36f21879307c440
    });
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


<<<<<<< HEAD
    //- ..............Disease data form.. name of disease to be changed on entry..................
    $('#disease_name').change(function () {
        var disease_name = $('#disease_name').val();

    });

    // ...................FORM VALIDATION.......................

    // $('form[name="drug_form1"]').validate({
    //     //Materialize.toast('this is a test', 2000);
    //
    //         brand_name : "required",
    //         company_name : "required",
    //         categories : "required",
    //         strength : "required",
    //         potent_substances : "required",
    //         dosage_form : "required",
    //         packaging : "required",
    //         price : "required",
    //
    //
    //     messages : {
    //         brand_name : "Required!",
    //         company_name : "Required!",
    //         categories : "Required!",
    //         strength : "Required!",
    //         potent_substances : "Required!",
    //         dosage_form : "Required!",
    //         packaging : "Required!",
    //         price : "Required!"
    //     },
    //     submitHandler: function(form) {
    //         form.submit();
    //     }
    // });

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


// function readURL(input) {
//     if (input.files && input.files[0]) {
//         var reader = new FileReader();
//
//         reader.onload = function (e) {
//             $('#image_for_docs1').attr('src', e.target.result);
//             $('#image_for_docs2').attr('src', e.target.result);
//         };
//
//         reader.readAsDataURL(input.files[0]);
//     }
// }


// function validateForm() {
//     var brand_name = document.forms["drug_form1"]["brand_name"].value;
//     if (x == "") {
//         alert("Name must be filled out");
//         return false;
//     }
// }


// function validateForm() {
//     Materialize.toast('this is a test', 2000);
//
//     $('#drugs1').click(function () {
//             var brand_name = document.forms["drug_form1"]["brand_name"].value;
//             var categories = document.forms["drug_form1"]["brand_name"].value;
//             var company_name = document.forms["drug_form1"]["brand_name"].value;
//             var strength = document.forms["drug_form1"]["brand_name"].value;
//             var potent_substances = document.forms["drug_form1"]["brand_name"].value;
//             var dosage_form = document.forms["drug_form1"]["brand_name"].value;
//             var packaging = document.forms["drug_form1"]["brand_name"].value;
//             var price = document.forms["drug_form1"]["brand_name"].value;
//
//             if (brand_name == '' || categories == '' || company_name == '' || strength == '' || potent_substances == '' || dosage_form == '' || packaging == '' || price == '') {
//                 alert("All Fields must be filled out");
//                 return false;
//             }
//             return true;
//         }
//     );
// }
//         var prescription = $('#prescription').val;
//         var dose_taken = $('#dose_taken').val;
//         var dose_timing = $('#dose_timing').val;
//         var warnings = $('#warnings').val;
//         var primarily_used_for = $('#primarily_used_for').val;
//         var molecule_name = $('#molecule_name').val;
//         var drug_category = $('#drug_category').val;
//         var short_description = $('#short_description').val;
//         var absorption = $('#absorption').val;
//         var distribution = $('#distribution').val;
//         var metabolism = $('#metabolism').val;
//         var excretion = $('#excretion').val;
//         var side_effects = $('#side_effects').val;
//         var special_precautions = $('#special_precautions').val;
//         var other_drug_interactions = $('#other_drug_interactions').val;
//         var food_interaction = $('#food_interaction').val;
//         var oral_dosage = $('#oral_dosage').val;
//         var intravenous_dosage = $('#intravenous_dosage').val;
//         var food_before_after = $('#food_before_after').val;
//         var in_pregnancy = $('#in_pregnancy').val;
//         var in_lactation = $('#in_lactation').val;
//         var in_children = $('#in_children').val;
//         var storage = $('#storage').val;
//         var in_geriatric = $('#in_geriatric').val;
//         var other_contraindications = $('#other_contraindications').val;
//         var lab_interference = $('#lab_interference').val;
//         //var company_name = $('#').val;
//
//
//         alert("Name must be filled out");
//         return false;
//     });
//     return true;
// }

// function openNav() {
//     document.getElementById("mySidenav").style.width = "230px";
//     document.getElementById("main").style.marginLeft = "230px";
// }
// function closeNav() {
//     document.getElementById("mySidenav").style.width = "0";
//     document.getElementById("main").style.marginLeft= "0";
// }
=======
});
>>>>>>> 44f322b6361c9d1821747676a36f21879307c440
