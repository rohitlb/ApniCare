$(document).ready(function(){
    console.log('reaches');
    $.ajax
    ({
        type: 'GET',
        url: '/logout',
        dataType: 'json',
        data: 'data',
        success: function(response)
        {
            console.log(response);
            window.location = '/';
        },
        error: function (err) {
            console.log(err);
        }
    });
});
