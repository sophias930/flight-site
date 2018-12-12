var root = "http://comp426.cs.unc.edu:3001/";


$(document).ready(() => {
    checkLogin();
    buildBasicFirstPage();
  
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
        // make api calls and whatever; 
    $('body').empty();
    $('body').append('<div class="header"><h1>Cool App Name</h1></div><div class="inputs">');
    $('body').append('To:  <input type="text" id="to">&nbsp;&nbsp;From:<input type="text" id="from">');
    $('body').append('<br><input type="button" value="Submit" id="submit"></div><br><br><div class="flights"></div>');
    $('#submit').click(function() {
        buildTable();
    })  
            
}

function buildTable() {
// EDGE CASE: if a field is empty, return error message
        // do we need to worry about this if we have a drop down select
        // thing?? maybe we could have default options already selected


    $('.flights').empty();
    // getting airports and finding corresponding flights 
    let to = $('#to').val(); 
    let from = $('#from').val();
    let toID = 0;
    let toSet = false;
    let fromID = 0;
    let fromSet = false;

    // get id of 'to' airport
    $.ajax(root + 'airports?filter[code]='+to,
    {
        type: 'GET',
        xhrFields: { withCredentials: true },
        dataType: 'json',
        success: function(response) {
            toID = response[0].id;
            setTo(response);
            toSet = true;

        },
        error: () => {
            alert('Check your connection and try again.');
        }
    });

    // then id of 'from' airport
    $.ajax(root + 'airports?filter[code]='+from,
    {
        type: 'GET',
        xhrFields: { withCredentials: true },
        dataType: 'json',
        success: function(response) {
            fromID = response[0].id;
            setFrom(response);
            fromSet = true;

        },
        error: () => {
            alert('Check your connection and try again.');
        }
    });

    function setTo(response) {
        toID = response[0].id;
        toSet = true;
    }

    function setFrom(response) {
        fromID = response[0].id;
        fromSet = true;
        getFlights();
    }


    function getFlights() {
        $.ajax(root + 'flights?filter[arrival_id]='+toID+'&filter[departure_id]='+fromID,
        {
            type: 'GET',
            xhrFields: { withCredentials: true },
            dataType: 'json',
            success: (response) => {
                console.log(response);
                let flightArray = response;
                // now to print out all the flights in a ..nice way 

                for (let i = 0; i < flightArray.length; i++) {
                    let thisFlight = "flight"+i;
                    $('.flights').append('<div class="flight" id="'+thisFlight+'"></div>');
                    $('#'+thisFlight).append(from + "  -->  " + to+"&nbsp;&nbsp;&nbsp;");

                    // get times from the flights 
                    let arrives_at = flightArray[i].arrives_at;
                    let departs_at = flightArray[i].departs_at;

                    // parse through to get time
                    var arrivesArray = arrives_at.split("T");
                    var departsArray = departs_at.split("T");
                    var arrivesFull = arrivesArray[1];
                    var departsFull = departsArray[1];
                    var arrives = arrivesFull.split(":");
                    var departs = departsFull.split(":");

                    $('#'+thisFlight).append(departs[0]+":"+departs[1] + " to " + arrives[0]+":"+arrives[1]);

                    // post price
                    $('#'+thisFlight).append("&nbsp;&nbsp;&nbsp;$"+Math.floor((Math.random() * 1000) + 100));

                    // button to purchase
                    $('#'+thisFlight).append('&nbsp;&nbsp;&nbsp;<input type="button" class="choose" id="button'+
                        i+'" value="Select">');
                    $('#button'+i).click(function() {
                        buildSecondPage(flightArray[i]);
                    })
                }
    
            },
            error: () => {
                alert('Check your connection and try again.');
            }
        });
    }
}

function buildSecondPage(flightObject) {
    $('body').empty();
    $('body').append('<div class="header"><h1>Cool App Name</h1></div>')
    $('body').append('<input type="button" value="Back" id="back"><br><br>');
    $('#back').click(function() {
        buildBasicFirstPage();
    })
    let airline_id = flightObject.airline_id;

    $.ajax(root + 'airlines?filter[id]='+airline_id,
    {
        type: 'GET',
        xhrFields: { withCredentials: true },
        dataType: 'json',
        success: function(response) {
            let airlineArray = response;
            for (let i = 0; i < airlineArray.length; i++) {
                if (airlineArray[i].id == airline_id) {
                    $('body').append('<div class="airline"><h2>You will riding with '+airlineArray[i].name+'!</h2></div');
                }
            }
            console.log(response);
        },
        error: () => {
            alert('Check your connection and try again.');
        }
    });

    $('body').append('Please fill out your information:<br>');
    $('body').append('First Name: ' + '<input type="text" id="fname"><br>');
    $('body').append('Last Name: '+'<input type="text" id="lname"><br>');
    $('body').append('Age: '+'<input type="text" id="age"><br>');
    $('body').append('Gender: '+'<input type="text" id="gender"><br>');
    $('body').append('Email Address: '+'<input type="text" id="email"><br>');

}
