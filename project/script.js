

$(document).ready(() => {
    // login button click
    $('#login').click(function () {
        let user = $('#username').val();
        let pass = $('#password').val();

        checkLogin(user, pass);

    });


});