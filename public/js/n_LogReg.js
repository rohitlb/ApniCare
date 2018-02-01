$(document).ready(function() {
    //new
    //#div1 for login //#div2 for register //#closebutton
    // .provide #providers back arrow and for health care provider
    //#doctorPharmacist contains doctor and pharmacist
    //#form contains form of login register and forgot password
    //for register .register //#register for main body //#pass for otp one
    //for login .login
    //for forget .forgot //#forgot_description for description //#pass1 for otp


    $('#change').hide();
   //on click on login button
    $('#loginbut').click(function () {
            $('#div2').hide();
            $('.provide').hide();
            $('#doctorPharmacist').hide();
            $('.register').hide();
            $('.forgot').hide();
            $('#div1').show();
            $('.login').show();

            //$('#forgetTab').hide();
        });
    //if clicked on signup button
    $('#signupbut').click(function () {
        $('.doctor').hide();
        $('.pharmacist').hide();
        $('#div1').hide();
        $('.login').hide();
        $('.forgot').hide();
        $('.provide').hide();
        $('#pass').hide();
        $('#healthCare').show();
        $('#div2').show();
        $('.register').show();
        $('#register').show();
        $('#common').show();
        $('.user').show();
    });
        //on click on (r u a healthCare provide?)
    $('#healthCare').click(function(){
        $('.register').hide();
        $('.login').hide();
        $('.forgot').hide();
        $('#healthCare').hide();
        $('.provide').show();
        $('#doctorPharmacist').show();
    });
            //on click on (doctor option)
    $('#imdoctor').click(function(){
        $('#number').removeAttr('disabled');
        $('#doctorPharmacist').hide();
        $('.basic').show();
        $('#pass').hide();
        $('.login').hide();
        $('.forgot').hide();
        $('#healthCare').hide();
        $('.user').hide();
        $('.pharmacist').hide();
        $('#common').show();
        $('.doctor').show();
        $('.register').show();
    });
            //on click on (Pharmacist option)
    $('#impharmacist').click(function(){
        $('#number').removeAttr('disabled');
        $('#doctorPharmacist').hide();
        $('.basic').show();
        $('#pass').hide();
        $('.login').hide();
        $('.forgot').hide();
        $('#healthCare').hide();
        $('.user').hide();
        $('.doctor').hide();
        $('#common').show();
        $('.pharmacist').show();
        $('.register').show();
    });
        //on click on (existing user/doctor/pharmacist?log in)
    $('.existing').click(function(){
        $('#div2').hide();
        $('.provide').hide();
        $('.register').hide();
        $('.forgot').hide();
        $('#div1').show();
        $('.login').show();

    });
        //on click on (New to ApniCare?Sign Up)
    $('#NewtoApniCare').click(function(){
        $('#div1').hide();
        $('#password1').removeAttr('disabled');
        $('.basic').show();
        $('.provide').hide();
        $('.login').hide();
        $('.forgot').hide();
        $('.doctor').hide();
        $('.pharmacist').hide();
        $('#pass').hide();
        $('.user').show();

        $('#div2').show();
        $('.register').show();
        $('#healthCare').show();
    });
    //on click on ("<-" i.e back to user) [same as NewtoApniCare]
    $('#Customer').click(function(){
        $('#div1').hide();
        $('#number').removeAttr('disabled');
        $('.basic').show();
        $('.provide').hide();
        $('.login').hide();
        $('.forgot').hide();
        $('.doctor').hide();
        $('.pharmacist').hide();
        $('#pass').hide();
        $('#common').show();
        $('.user').show();
        $('#div2').show();
        $('.register').show();
        $('#healthCare').show();
    });
    //on click on (close button )
    $('#closebutton').click(function(){
        $('#div1').hide();
        $('.provide').hide();
        $('#number').removeAttr('disabled');
        $('.basic').show();
        $('.login').hide();
        $('.forgot').hide();
        $('#div2').hide();
        $('.register').hide();
    });
    //on click on forgot button
    $('#forgotButton').click(function(){
        $('#div2').hide();
        $('.provide').hide();
        $('.login').hide();
        $('#pass1').hide();
        $('.forgot').show();
        $('#div1').show();
        $('#forgot').show();
    });
    //on click on (back button) in forgot password section
    $('#arrow').click(function(){
        $('#div2').hide();
        $('.use').show();
        $('.provide').hide();
        $('.forgot').hide();
        $('.login').show();
        $('#div1').show();
    });



    //
  //   //older
  //   $('.doctor').hide();
  //   $('.pharmacist').hide();
  //   $('#submitButton').hide();
  // //buttons for doctor use
  //   $('#Dverify').hide();
  //   $('#DsubmitButton').hide();
  //   $('#Dsend').hide();
  //   $('#DloginButton1').hide();
  //   $('#DOTPforForgot').hide();
  //   $('#Dverify1').hide();
  //   $('#DagainLogin').hide();
  //
  //
  //       $('#doctorPhamacist').hide();
  //       $('#providers').hide();
  //   //if clicked on login button
  //   $('#loginbut').click(function () {
  //       $('#div2').hide();
  //       $('#register').hide();
  //       $('#div1').show();
  //       $('#log').show();
  //       $('#forgot').hide();
  //       //$('#forgetTab').hide();
  //   });
  //   // $('#loginbut').click(function () {
  //   //     $('#div2').hide();
  //   //     $('#register').hide();
  //   //     $('#forgot').hide();
  //   //     //$('#forgetTab').hide();
  //   // })
  //   $('#closebutton').click(function () {
  //       $('.doctor').hide();
  //       $('.pharmacist').hide();
  //       //buttons for doctor use
  //       $('#Dverify').hide();
  //       $('#DsubmitButton').hide();
  //       $('#Dsend').hide();
  //       $('#DloginButton1').hide();
  //       $('#DOTPforForgot').hide();
  //       $('.user').show();
  //       $('#Dverify1').hide();
  //       $('#DagainLogin').hide();
  //
  //
  //       $('#doctorPhamacist').hide();
  //       $('#providers').hide();
  //   });
  //                     //if clicked on NewtoApnicare
  //                     $('#NewtoApnicare').click(function () {
  //                         $('#pass').hide();
  //                         $('#healthCare').show();
  //                         $('#div2').show();
  //                         $('#register').show();
  //                         $('#div1').hide();
  //                         $('#log').hide();
  //                     });
  //
  //                     //if clicked on forgot?
  //                           $('#pass1').hide();
  //                       $('#forgotButton').click(function () {
  //                           $('#log').hide();
  //                           $('#forgot').show();
  //                           $('#forgot_description').show();
  //                           $('#OTPforForgot').show();
  //                           $('#registeredMOB').removeAttr('disabled');
  //                           $('#pass1').hide();
  //                           $('#divider').hide();
  //                           $('#healthCare').hide();
  //                           $('#Customer').hide();
  //                       });
  //                                    //on click on arrow
  //                                       $('#arrow').click(function () {
  //                                           $('#pass').hide();
  //                                           $('#forgot').hide();
  //                                           $('#log').show();
  //                                           $('#divider').show();
  //                                           $('#Customer').show();
  //
  //                                       });
  //                                    //on click on continue button
  //                                          //used while calling ajax for continue
  //   //if clicked on signup button
  //   $('#signupbut').click(function () {
  //       $('#healthCare').show();
  //       $('#div2').show();
  //       $('#register').show();
  //       $('#div1').hide();
  //       $('#log').hide();
  //       $('#pass').hide();
  //       $('#change').hide();
  //       $('#forgot').hide();
  //       //$('#forgetTab').hide();
  //   });
  //                //if clicked on existing user/login
  //               $('#loginButton12').click(function () {
  //                   $('.doctor').hide();
  //                   $('.pharmacist').hide();
  //                   $('#healthCare').hide();
  //                   $('#div2').hide();
  //                   $('#register').hide();
  //                   $('.user').hide();
  //                   $('#div1').show();
  //                   $('#log').show();
  //                   $('#forgot').hide();
  //                   $('#forgetTab').hide();
  //               });
  //                           $('#D_loginButton').click(function () {
  //                               $('.user').show();
  //                               $('#providers').hide();
  //                               $('.doctor').hide();
  //                               $('#number').removeAttr('disabled');
  //                               $('#pass').hide();
  //                               $('.pharmacist').hide();
  //                               $('#healthCare').hide();
  //                               $('#div2').hide();
  //                               $('#register').hide();
  //                               $('#div1').show();
  //                               $('#log').show();
  //                               $('#forgot').hide();
  //                               $('#forgetTab').hide();
  //                           });
  //                           $('#P_loginButton').click(function () {
  //                               $('.user').show();
  //                               $('#providers').hide();
  //                               $('.doctor').hide();
  //                               $('#number').removeAttr('disabled');
  //                               $('.pharmacist').hide();
  //                               $('#pass').hide();
  //                               $('#healthCare').hide();
  //                               $('#div2').hide();
  //                               $('#register').hide();
  //                               $('#div1').show();
  //                               $('#log').show();
  //                               $('#forgot').hide();
  //                               $('#forgetTab').hide();
  //                           });
  //
  //
  //                 //on click on health care provider
  //                 $('#healthCare').click(function () {
  //                                 $('#register').hide();
  //                                 $('#healthCare').hide();
  //                                 $('#Customer').show();
  //                                 $('#providers').show();
  //                                 $('#doctorPhamacist').show();
  //                                 $('#pass').hide();
  //                                 $('.user').hide();
  //                                 $('.doctor').hide();
  //                                 $('.pharmacist').hide();
  //
  //
  //
  //
  //
  //                     //$('#send').hide();
  //                                 //doctor register buttons
  //                                 //$('#Dsend').show();
  //                                 //$('#submitButton').hide();
  //                                 //$('#DsubmitButton').show();
  //                                 //$('#verify').hide();
  //                                 //$('#Dverify').show();
  //                                 //doctor login buttons
  //                                 //$('#loginButton1').hide();
  //                                 //$('#DloginButton1').show();
  //                                 //doctor forgotPassword buttons
  //                                 //$('#OTPforForgot').hide();
  //                                 //$('#DOTPforForgot').show();
  //                                 //$('#verify1').hide();
  //                                 //$('#Dverify1').show();
  //                                 //$('#againLogin').hide();
  //                                 //$('#DagainLogin').show();
  //                 });
  //                   //on click on Customer
  //                   $('#Customer').click(function () {
  //                       $('#pass').hide();
  //                       $('.doctor').hide();
  //                       $('.pharmacist').hide();
  //                       $('#providers').hide();
  //                       $('#number').removeAttr('disabled');
  //                       $('#doctorPhamacist').hide();
  //                       $('#submitButton').hide();
  //                       $('#healthCare').show();
  //                       $('.basic').show();
  //                       $('#register').show();
  //                       $('.user').show();
  //
  //                       // $('#send').show();
  //                       // $('#Dsend').hide();
  //                       // $('#submitButton').show();
  //                       // $('#DsubmitButton').hide();
  //                       // $('#verify').show();
  //                       // $('#Dverify').hide();
  //                       // $('#loginButton1').show();
  //                       // $('#DloginButton1').hide();
  //                       //
  //
  //                   });
  //   //for doctor------------------------------
  //   $('#imdoctor').click(function () {
  //       $('#doctorPhamacist').hide();
  //       $('#providers').show();
  //       $('#DsubmitButton').hide();
  //       $('#number').removeAttr('disabled');
  //       $('.user').hide();
  //       $('.pharmacist').hide();
  //       $('#register').show();
  //       $('.doctor').show();
  //   });
  //   $('#impharmacist').click(function () {
  //       $('#doctorPhamacist').hide();
  //       $('#providers').show();
  //       $('.user').hide();
  //       $('.doctor').hide();
  //       $('#PsubmitButton').hide();
  //       $('#number').removeAttr('disabled');
  //       $('#register').show();
  //       $('.pharmacist').show();
  //   });

    //for showing/hiding password
    $('#check1').click(function () {
        showPass();

    });
    $('#check2').click(function () {
        showPass();

    });
    $('#check3').click(function () {
        showPass();

    });
    function showPass()
    {
        var pass1=document.getElementById('password1');
        var pass2=document.getElementById('password2');
        var pass3=document.getElementById('password3');
        if(document.getElementById('check1').checked)
        {
            pass1.setAttribute('type','text');
        }
        else{
            pass1.setAttribute('type','password');
        }
        if(document.getElementById('check2').checked)
        {
            pass2.setAttribute('type','text');
        }
        else
        {
            pass2.setAttribute('type','password');
        }
        if(document.getElementById('check3').checked)
        {
            pass3.setAttribute('type','text');
        }
        else{
            pass3.setAttribute('type','password');
        }
    }



});