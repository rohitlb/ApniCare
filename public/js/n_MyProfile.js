$(document).ready(function() {

//===========================for UserDropdown=========================
    $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrainWidth: true, //Does not change width of dropdown to that of the activator
            hover:true, // Activate on hover
            gutter: 2, // Spacing from edge
            belowOrigin: false,
            alignment: 'left',
            stopPropagation: true
        }
    );
//*************************for pictures********************************
    $('.carousel.carousel-slider').carousel({fullWidth: true});
//****************************for datepicker************************************
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 50, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: true // Close upon selecting a date,
    });
//**************************disabling personal information***************************************************
    $('#p_UPcancel').hide();
    $('#p_EmergencyContactSubmit').hide();
    $('#p_ContactUsSubmit').hide();
    $('#p_PersonalDetailsSubmit').hide();
    $('#p_ConfidentialInfoSubmit').hide();
    $('#p_AddressSubmit').hide();
    $('#p_InfoForm :input').prop('disabled',true);

    //*****************************on click on EDIT....enabling the fields******************************************
    $('#p_UPedit').click(function () {
        //enabling the functions
        $('#p_UPcancel').show();
        $('#p_UPedit').hide();
        $('#p_EmergencyContactSubmit').show();
        $('#p_ContactUsSubmit').show();
        $('#p_ConfidentialInfoSubmit').show();
        $('#p_PersonalDetailsSubmit').show();
        $('#p_AddressSubmit').show();
        $('#p_InfoForm :input').prop('disabled',false);
    });
    //***************************on click on cancel*****************************************
    $('#p_UPcancel').click(function () {
        $('#p_UPedit').show();
        $('#p_UPcancel').hide();
        $('#p_EmergencyContactSubmit').hide();
        $('#p_ContactUsSubmit').hide();
        $('#p_PersonalDetailsSubmit').hide();
        $('#p_ConfidentialInfoSubmit').hide();
        $('#p_AddressSubmit').hide();
        $('#p_InfoForm :input').prop('disabled',true);

    });


//******************************showing the submitbutton and sending details to server***********************************
    $('#p_PersonalDetailsSubmit').click(function(){
        $('#p_UPedit').show();
        $('#p_UPcancel').hide();
        $('#p_InfoForm :input').prop('disabled',true);
        var dob = $('#p_datepicker').val();
        var gender = $("input[type='radio'][name='gender']:checked").val();
        var bloodgroup = $('#p_Pbox').val();
        var maritalstatus = $("input[type='radio'][name='marital']:checked").val();
        var height = $('#p_Pheight').val();
        var weight = $('#p_Pweight').val();
        var data = {
            dob: dob,
            gender: gender,
            blood_group: bloodgroup,
            marital_status: maritalstatus,
            height: height,
            weight: weight
        };

        $.ajax(
            {
                url: "/users/userpersonalinfo",
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {

                    if (result.status === "success") {
                        Materialize.toast(result.message, 2000);
                        //$('#p_change').show();
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
//============================for contact details=========================================
    $('#p_ContactUsSubmit').click(function(){
        $('#p_UPedit').show();
        $('#p_UPcancel').hide();
        $('#p_InfoForm :input').prop('disabled',true);
        var name = $('#p_Pfirstname').val();
        var number = $('#p_Pphone').val();
        var email = $('#p_Pemail').val();
        var data = {
            name: name,
            email: email
        };
        $.ajax(
            {
                url: "/users/updatenameandemail",
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {

                    if (result.status === "success") {
                        Materialize.toast(result.message, 2000);
                        //$('#p_change').show();
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

//========================================confidentialInformation====================================
    $('#p_ConfidentialInfoSubmit').click(function(){
        $('#p_UPedit').show();
        $('#p_UPcancel').hide();
        $('#p_InfoForm :input').prop('disabled',true);
        var Aadhar = $('#p_Aadhar').val();
        var income = $('#p_Pbox').val();
        var data = {
            aadhaar_number: Aadhar,
            income: income
        };

        $.ajax(
            {
                url: "/users/editconfidential",
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {

                    if (result.status === "success") {
                        Materialize.toast(result.message, 2000);
                        //$('#p_change').show();
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
//============================================EmergencyContactDetails===========================================
    $('#p_EmergencyContactSubmit').click(function(){
        $('#p_UPedit').show();
        $('#p_UPcancel').hide();
        $('#p_InfoForm :input').prop('disabled',true);
        var names = $('#p_names').val();
        var relation = $('#p_relation').val();
        var phone = $('#p_Pphone').val();
        var data = {
            rel_name : names,
            relation : relation,
            rel_contact : phone
        };

        $.ajax(
            {
                url: "/users/useremergency",
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {

                    if (result.status === "success") {
                        Materialize.toast(result.message, 2000);
                        //$('#p_change').show();
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

//******************************************************Address********************************************************************

    $('#p_AddressSubmit').click(function(){
        $('#p_UPedit').show();
        $('#p_UPcancel').hide();
        $('#p_InfoForm :input').prop('disabled',true);
        var address = $('#p_address').val();
        var pincode = $('#p_pincode').val();
        var landmark = $('#p_landmark').val();
        var city = $('#p_city').val();
        var state = $('#p_state').val();

        var data = {
            addresses : address,
            pincodes : pincode,
            landmarks : landmark,
            city : city,
            state : state
        };

        $.ajax(
            {
                url: "/users/useraddress",
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




//**********************************************************************8

    $('#p_upload').click(function () {
        var upload=$('#p_images').val();
        var data={
            upload1 :upload
        };
        $.ajax(
            {
                url:"/users/upload",
                method: 'POST',
                data: JSON.stringify(data),
                contentType:'application/json',
                success:function (result) {

                },
                error:function (err) {
                    console.log(err);

                }
            }
        )

    })

//***********************************for uploading images********************************************************
    $('#p_file').change(function () {
        filePreview(this);
    });
    function filePreview(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#p_uploadImage + img').remove();
                $('#p_uploadImage').after('<img src="' + e.target.result + '" width="150" height="150"/>');
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

});


