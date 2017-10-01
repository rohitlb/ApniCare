$(document).ready(function(){

    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constraintWidth: true,
        hover: true,
        gutter: 0,
        belowOrigin: true,
        alignment: 'left',
        stopPropagation: false
    });


    $('.carousel').carousel();
    $('.carousel').carousel('next');
    $('.carousel').carousel('next',3);
    $('.carousel').carousel('prev');
    $('.carousel').carousel('prev',4);
    $('.carousel').carousel('set',4);



    $('.modal').modal({
        dismissible: true,
        opacity: .15,
        inDuration:300,
        outDuration:200,
        startingTop: '4%',
        endingTop: '10%'

    });



    //for register

    $('#submitButton').click(function() {

        var name = $('#name').val();
        var number = $('#number').val();
        var password = $('#passsword').val();

        var data = {
            name: name,
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
                    result = JSON.parse(result);
                    if(result.success ==="1")
                    {
                        Materialize.toast('registered',2000);
                        window.location= '/profile';
                    }
                    else
                    {
                        Materialize.toast('unable to Register',2000);
                    }


                   //  window.location="/profile";
                    //Materialize.toast(result.message,5000);
                },
                error: function (err) {

                    console.log(err);
                }
            }
        )

     });




    //for login

    $('#loginButton1').click(function() {


        var number = $('#number').val();
        var password = $('#passsword').val();

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
                    result = JSON.parse(result);
                    window.location = "/profile";
                    Materialize.toast(result.message, 5000);
                },
                error: function (err) {

                    console.log(err);
                }
            }
        )
    });



});