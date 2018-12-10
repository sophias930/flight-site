var root = "http://comp426.cs.unc.edu:3001/";


$(document).ready(() => {
    checkLogin();

    $('#submit').click(function() {
        buildBasicFirstPage();
    })    
});

function checkLogin() {
    var data = { user: { username: "sophiass", password: "Foofa123!" }};
    $.ajax(root + 'sessions',
        {
            type: 'POST',
            xhrFields: { withCredentials: true },
            dataType: 'json',
            data: { 
                user: { 
                    username: "sophiass", 
                    password: "Foofa123!" 
                }
            },
            success: (response) => {
                // debugging purposes
            },
            error: () => {
                alert('Check your connection and try again.');
            }
        });

}

function buildBasicFirstPage() {
    // TODO build this page!!!! 
        // make api calls and whatever
    $('body').append("congrats you clicked a button!<br>");
}