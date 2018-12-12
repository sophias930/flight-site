var root = "http://comp426.cs.unc.edu:3001/";


$(document).ready(() => {
    checkLogin();
    buildBasicFirstPage();

});

function checkLogin() {
    var data = { user: { username: "sophiass", password: "Foofa123!" } };
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
    // just set up the initial page 
    $('body').empty();
    $('body').append('<div class="header container-fluid"><h1>Cool App Name</h1></div><div class="inputs container-fluid">');
    $('body').append('To:  <input type="text" id="to" class="dropdown-toggle">&nbsp;&nbsp;From:<input type="text" id="from" class="dropdown-toggle">');
    $('body').append('<br><input type="button" value="Submit" id="submit" class="btn btn-outline-primary btn-sm"></div><div class="dropdown-menu" aria-labelledby="to"><a class="dropdown-item" href="#">Action</a></div><br><br><div class="flights"></div>');
    $('body').append('<div class="container-fluid"><h5 class="mt-0">Some Words from the Team</h5></div><div class="media container-fluid p-3 mb-2  bg-success text-white"><img class="mr-3 rounded-circle border border-light" src="https://scontent-iad3-1.xx.fbcdn.net/v/t1.0-1/p160x160/35922718_386881408464842_8619843468644057088_n.jpg?_nc_cat=111&_nc_ht=scontent-iad3-1.xx&oh=96d05b640d42f69bb84532bc069ad003&oe=5C9B95BC" alt="Sophia"><div class="media-body">My family has always had some concerns about my love for Taco Bell, but this website has made it so much better (worse??)!  Now no matter where I go I can make sure I am well stocked in chalupas.  I think my friends are staging an intervention as we speak, but the joke is on them: no one can stop me from searching all my future travel destinations for Taco Bell with this convenient website! -Sophia Shaikh</div></div><br>');
    $('body').append('<div class="media container-fluid p-3 mb-2 bg-success text-white"><img class="mr-3 rounded-circle border border-light" src="https://scontent-iad3-1.xx.fbcdn.net/v/t1.0-1/p160x160/45569168_321454448683763_6393970761912025088_n.jpg?_nc_cat=101&_nc_ht=scontent-iad3-1.xx&oh=2e85334f48ac3ab00e685434471b085b&oe=5C656D8B" alt="Tiara"><div class="media-body rounded-circle">Yeah to be honest, Sophia scares the shit out of me.  I am way too scared to say anything against her chalupa addiction, so this site has been an amazing way to appease her when we travel together! -Tiara Mathur</div></div>');
    $('#submit').click(function() {
        buildTable();
    })

    $('#to').keydown(buildTable);

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
    $.ajax(root + 'airports?filter[code]=' + to,
        {
            type: 'GET',
            xhrFields: { withCredentials: true },
            dataType: 'json',
            success: function (response) {
                toID = response[0].id;
                setTo(response);
                toSet = true;

            },
            error: () => {
                alert('Check your connection and try again.');
            }
        });

    // then id of 'from' airport
    $.ajax(root + 'airports?filter[code]=' + from,
        {
            type: 'GET',
            xhrFields: { withCredentials: true },
            dataType: 'json',
            success: function (response) {
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
        $.ajax(root + 'flights?filter[arrival_id]=' + toID + '&filter[departure_id]=' + fromID,
            {
                type: 'GET',
                xhrFields: { withCredentials: true },
                dataType: 'json',
                success: (response) => {
                    console.log(response);
                    let flightArray = response;
                    // now to print out all the flights in a ..nice way 

                    for (let i = 0; i < flightArray.length; i++) {
                        let thisFlight = "flight" + i;
                        $('.flights').append('<div class="flight" id="' + thisFlight + '"></div>');
                        $('#' + thisFlight).append(from + "  -->  " + to + "&nbsp;&nbsp;&nbsp;");

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

                        $('#' + thisFlight).append(departs[0] + ":" + departs[1] + " to " + arrives[0] + ":" + arrives[1]);

                        // post price
                        $('#' + thisFlight).append("&nbsp;&nbsp;&nbsp;$" + Math.floor((Math.random() * 1000) + 100));

                        // button to purchase
                        $('#' + thisFlight).append('&nbsp;&nbsp;&nbsp;<input type="button" class="choose" id="button' +
                            i + '" value="Select">');
                        $('#button' + i).click(function () {
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
    $('#back').click(function () {
        buildBasicFirstPage();
    })
    let airline_id = flightObject.airline_id;

    $.ajax(root + 'airlines?filter[id]=' + airline_id,
        {
            type: 'GET',
            xhrFields: { withCredentials: true },
            dataType: 'json',
            success: function (response) {
                let airlineArray = response;
                for (let i = 0; i < airlineArray.length; i++) {
                    if (airlineArray[i].id == airline_id) {
                        $('body').append('<div class="airline"><h2>You will be riding with ' + airlineArray[i].name + '!</h2></div');
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
    $('body').append('Last Name: ' + '<input type="text" id="lname"><br>');
    $('body').append('Age: ' + '<input type="text" id="age"><br>');
    $('body').append('Gender: ' + '<input type="text" id="gender"><br>');
    $('body').append('Email Address: ' + '<input type="text" id="email"><br>');
    $('body').append('<input type="button" id="submitTicket" value="Submit"><br>')
    $('#submitTicket').click(function () {
        // make calls to send the info to the correct places

        // make itinerary
        var itineraryID;
        var seatID;
        if ($('#email').val() == "") {
            alert("Please provide an email address!");
        }
        $.ajax(root + 'itineraries',
            {
                type: 'POST',
                xhrFields: { withCredentials: true },
                dataType: 'json',
                data: {
                    itinerary: {
                        email: $('#email').val(),
                    }
                },
                success: function (response) {
                    console.log(response);
                    itineraryID = response.id;
                },
                error: () => {
                    alert('Check your connection and try again.');
                }
            }).done(function () {
                // make seat
                $.ajax(root + 'seats',
                    {
                        type: 'POST',
                        xhrFields: { withCredentials: true },
                        dataType: 'json',
                        data: {
                            seat: {
                                plane_id: 5050,
                                row: Math.floor((Math.random() * 30) + 1),
                                number: "A",
                            }
                        },
                        success: function (response) {
                            console.log(response);
                            seatID = response.id;
                        },
                        error: () => {
                            alert('Check your connection and try again.');
                        }
                    }).done(function () {
                        // make ticket (include itinerary and seat!)
                        console.log(itineraryID + " " + seatID);
                        // check for blanks
                        if ($('#fname').val() == "" || $('#lname').val() == "" || $('#age').val() == ""
                            || $('#gender').val() == "") {
                        alert("Please fill all fields!"); 
                    }
                    });
            });

    });
}
