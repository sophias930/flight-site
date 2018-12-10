var root = "http://comp426.cs.unc.edu:3001/";


$(document).ready(() => {
    // login button click
    $('#login').click(function () {
        let user = $('#username').val();
        let pass = $('#password').val();

        checkLogin(user, pass);

    });


});