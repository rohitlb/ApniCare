$(function () {

    $('#openbutton').click(function () {

        $('#registerform').show();

    });

    $('#registerform').hide();

    $('#submitbutton').click(function () {

        var name = $('#name').val();
        var number = $('#number').val();
        var password = $('#password').val();

        var data = {
            name : name,
            number : number,
            password: password
        };

        $.ajax({
            url: "/registration",
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                if(result) {
                    result = JSON.parse(result);
                    Materialize.toast(result.message,5000);
                }
                else {
                    window.location  = "/profile";

                }
            },
            error : function (err) {

                console.log(err);
            }
        })

    });
});