$(function () {

    $('#openbutton').click(function () {

        $('#loginform').show();

    });

    $('#loginform').hide();

    $('#loginbutton').click(function () {

        var number = $('#number').val();
        var password = $('#password').val();

        var data = {
            number : number,
            password: password
        };

        $.ajax(
            {
                url: "/login",
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {
                    if(result) {

                        result = JSON.parse(result);
                      //  window.location = "/profile";
                        Materialize.toast(result.message, 5000);
                    }
                    else {
                        window.location  = "/profile";

                    }
                },
                error : function (err) {

                    console.log(err);
                }
            }
        )

    });
});