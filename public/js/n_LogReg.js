$(document).ready(function() {
    $('.doctor').hide();
    $('.pharmacist').hide();
  //buttons for doctor use
    $('#Dverify').hide();
    $('#DsubmitButton').hide();
    $('#Dsend').hide();
    $('#DloginButton1').hide();
    $('#DOTPforForgot').hide();
    $('#Dverify1').hide();
    $('#DagainLogin').hide();


        $('#doctorPhamacist').hide();
        $('#providers').hide();
    //if clicked on login button
    $('#loginbut').click(function () {
        $('#div2').hide();
        $('#register').hide();
        $('#div1').show();
        $('#log').show();
        $('#forgot').hide();
        //$('#forgetTab').hide();
    })
    // $('#loginbut').click(function () {
    //     $('#div2').hide();
    //     $('#register').hide();
    //     $('#forgot').hide();
    //     //$('#forgetTab').hide();
    // })
                      //if clicked on NewtoApnicare
                      $('#NewtoApnicare').click(function () {
                          $('#pass').hide();
                          $('#healthCare').show();
                          $('#div2').show();
                          $('#register').show();
                          $('#div1').hide();
                          $('#log').hide();
                      })

                      //if clicked on forgot?
                            $('#pass1').hide();
                        $('#forgotButton').click(function () {
                            $('#log').hide();
                            $('#forgot').show();
                            $('#divider').hide();
                            $('#healthCare').hide();
                            $('#Customer').hide();
                        })
                                     //on click on arrow
                                        $('#arrow').click(function () {
                                            $('#pass').hide();
                                            $('#forgot').hide();
                                            $('#log').show();
                                            $('#divider').show();
                                            $('#Customer').show();

                                        })
                                     //on click on continue button
                                           //used while calling ajax for continue
    //if clicked on signup button
    $('#signupbut').click(function () {
        $('#div2').show();
        $('#register').show();
        $('#div1').hide();
        $('#log').hide();
        $('#pass').hide();
        $('#change').hide();
        $('#forgot').hide();
        //$('#forgetTab').hide();
    })
                 //if clicked on existing user/login
                $('#loginButton12').click(function () {
                    $('.doctor').hide();
                    $('.pharmacist').hide();
                    $('#healthCare').hide();
                    $('#div2').hide();
                    $('#register').hide();
                    $('.user').show();
                    $('#div1').show();
                    $('#log').show();
                    $('#forgot').hide();
                    $('#forgetTab').hide();
                });
                            $('#D_loginButton').click(function () {
                                $('.user').show();
                                $('#providers').hide();
                                $('.doctor').hide();
                                $('.pharmacist').hide();
                                $('#healthCare').hide();
                                $('#div2').hide();
                                $('#register').hide();
                                $('#div1').show();
                                $('#log').show();
                                $('#forgot').hide();
                                $('#forgetTab').hide();
                            });
                            $('#P_loginButton').click(function () {
                                $('.user').show();
                                $('#providers').hide();
                                $('.doctor').hide();
                                $('.pharmacist').hide();
                                $('#healthCare').hide();
                                $('#div2').hide();
                                $('#register').hide();
                                $('#div1').show();
                                $('#log').show();
                                $('#forgot').hide();
                                $('#forgetTab').hide();
                            });


                  //on click on health care provider
                  $('#healthCare').click(function () {
                                  $('#register').hide();
                                  $('#healthCare').hide();
                                  $('#Customer').show();
                                  $('#providers').show();
                                  $('#doctorPhamacist').show();



                                  //$('#send').hide();
                                  //doctor register buttons
                                  //$('#Dsend').show();
                                  //$('#submitButton').hide();
                                  //$('#DsubmitButton').show();
                                  //$('#verify').hide();
                                  //$('#Dverify').show();
                                  //doctor login buttons
                                  //$('#loginButton1').hide();
                                  //$('#DloginButton1').show();
                                  //doctor forgotPassword buttons
                                  //$('#OTPforForgot').hide();
                                  //$('#DOTPforForgot').show();
                                  //$('#verify1').hide();
                                  //$('#Dverify1').show();
                                  //$('#againLogin').hide();
                                  //$('#DagainLogin').show();
                  });
                    //on click on Customer
                    $('#Customer').click(function () {
                        $('#pass').hide();
                        $('.doctor').hide();
                        $('.pharmacist').hide();
                        $('#providers').hide();
                        $('#number').removeAttr('disabled');
                        $('#doctorPhamacist').hide();
                        $('#healthCare').show();
                        $('.basic').show();
                        $('#register').show();
                        $('.user').show();

                        // $('#send').show();
                        // $('#Dsend').hide();
                        // $('#submitButton').show();
                        // $('#DsubmitButton').hide();
                        // $('#verify').show();
                        // $('#Dverify').hide();
                        // $('#loginButton1').show();
                        // $('#DloginButton1').hide();
                        //

                    });
    //for doctor------------------------------
    $('#imdoctor').click(function () {
        $('#doctorPhamacist').hide();
        $('#providers').show();
        $('.user').hide();
        $('#register').show();
        $('.doctor').show();
    });
    $('#impharmacist').click(function () {
        $('#doctorPhamacist').hide();
        $('#providers').show();
        $('.user').hide();
        $('#register').show();
        $('.pharmacist').show();
    });



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