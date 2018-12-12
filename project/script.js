var root = "http://comp426.cs.unc.edu:3001/";
var appname = "Taco Traveler";

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
    $('body').append('<div class="header jumbotron-fluid container-fluid"><img class="rounded float-right border border-dark" src="./resources/TB.jpg" alt="Sophia"><h1 class="display-4">' + appname + '</h1></div><div class="inputs container-fluid">');
    $('body').append('<div class="container-fluid"><blockquote>We&apos;ve all been there: You&apos;re trying to have the best vacation of your life, but something is wrong...  Where the hell is the Taco Bell in this stupid city??  Well worry no more because Taco Traveler is here for YOU.  Using FourSquare, we took all the manic searching out of your trip; simply start by entering the airports you plan to travel between and book your ticket!</blockquote></div>');
    $('body').append('To:  <input type="text" id="to" placeholder="Ex: RDU" onchange="buildTable();">&nbsp;&nbsp;From:<input type="text" id="from" placeholder="Ex: JFK" onchange="buildTable();">');
    $('body').append('<div class="drops"><div id="dropdownTo" class="dropdownTo"></div><div id="dropdownFrom" class="dropdownFrom"></div></div>');
    $('body').append('<br><input type="button" value="Submit" id="submit" class="btn btn-outline-primary btn-sm"></div><br><br><div class="flights"></div>');
    $('body').append('<br><div class="progress"><div class="progress-bar progress-bar-striped bg-info" role="progressbar" style="width: 20%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div></div>');
    $('body').append('<br><div id="reviews" class="rounded container-fluid"><div><h5 class="mt-0">Some Words from the Team</h5></div><div class="media container-fluid p-3 mb-2  bg-success text-white"><img class="mr-3 rounded-circle border border-light" src="./resources/Sophia.jpg" alt="Sophia"><div class="media-body">My family has always had some concerns about my love for Taco Bell, but this website has made it so much better (worse??)!  Now no matter where I go I can make sure I am well stocked in chalupas.  I think my friends are staging an intervention as we speak, but the joke is on them: no one can stop me from searching all my future travel destinations for Taco Bell with this convenient website! -Sophia Shaikh</div></div><br><div class="media container-fluid p-3 mb-2 bg-success text-white"><img class="mr-3 rounded-circle border border-light" src="./resources/Tiara.jpg" alt="Tiara"><div class="media-body rounded-circle">Yeah to be honest, Sophia scares the shit out of me.  I am way too scared to say anything against her chalupa addiction, so this site has been an amazing way to appease her when we travel together! -Tiara Mathur</div></div></div>');
    $('#submit').click(function() {
        buildTable();
    })

    $('#to').focusin(function() {
        $('.dropdownTo').toggle(true);
    });
    $('#to').focusout(function() {
        $('.dropdownTo').toggle(false);
    });

    $('#from').focusin(function() {
        $('.dropdownFrom').toggle(true);
    });
    $('#from').focusout(function() {
        $('.dropdownFrom').toggle(false);
    });


    $('#to').keyup(function() {
        buildDropDownTo();
    });
    $('#from').keyup(buildDropDownFrom);

}

function buildDropDownTo() {
    let menu = $('.dropdownTo');
    menu.empty();
    
    let to = $('#to').val();

    // get id of 'to' airport
    $.ajax(root + 'airports?filter[code_like]=' + to,
        {
            type: 'GET',
            xhrFields: { withCredentials: true },
            dataType: 'json',
            success: function (response) {
                for (let i = 0; i < response.length; i++) {
                    menu.append("<p>" + response[i].code + "</p>");
                }
            }
        });
    
}

function buildDropDownFrom() {
    let menu = $('.dropdownFrom');
    menu.empty();
    
    let from = $('#from').val();

    // get id of 'to' airport
    $.ajax(root + 'airports?filter[code_like]=' + from,
        {
            type: 'GET',
            xhrFields: { withCredentials: true },
            dataType: 'json',
            success: function (response) {
                for (let i = 0; i < response.length; i++) {
                    let cod = response[i].code;
                    let item = $("<p>" + response[i].code + "</p>");
                    menu.append(item);
                }
            }
        });
    
    
}

var to;
var from;

function buildTable() {

    // EDGE CASE: if a field is empty, return error message
    // do we need to worry about this if we have a drop down select
    // thing?? maybe we could have default options already selected


    $('.flights').empty();
    // getting airports and finding corresponding flights 
    to = $('#to').val();
    from = $('#from').val();
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
                            buildSecondPage(flightArray[i], departs[0]+":"+departs[1]);
                        })
                    }

                },
                error: () => {
                    alert('Check your connection and try again.');
                }
            });
    }
}

function buildSecondPage(flightObject, departTime) {
    $('body').empty();
    $('body').append('<div class="header"><h1>'+appname+'</h1></div>')
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
    $('body').append('You selected: ' + from + " to " + to + ", departing at " + departTime + '.<br><br>');
    $('body').append('Please fill out your information:<br>');
    $('body').append('First Name: ' + '<input type="text" id="fname"><br>');
    $('body').append('Last Name: ' + '<input type="text" id="lname"><br>');
    $('body').append('Age: ' + '<input type="text" id="age"><br>');
    $('body').append('Gender: ' + '<input type="text" id="gender"><br>');
    $('body').append('Email Address: ' + '<input type="text" id="email"><br>');
    $('body').append('<input type="button" id="submitTicket" value="Submit"><br>')
    $('body').append('<br><div class="progress"><div class="progress-bar progress-bar-striped bg-info" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div></div>');

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
                        $.ajax(root + 'tickets',
                            {
                                type: 'POST',
                                xhrFields: { withCredentials: true },
                                dataType: 'json',
                                data: {
                                    ticket: {
                                        first_name:   $('#fname').val(),
                                        last_name:    $('#lname').val(),
                                        age:          $('#age').val(),
                                        gender:       $('#gender').val(),
                                        is_purchased: true,
                                        instance_id:  itineraryID,
                                        seat_id:   seatID
                                      }
                                },
                                success: function (response) {
                                    console.log(response);
                                },
                                error: () => {
                                    alert('Check your connection and try again.');
                                }
                            }).done(function() {
                                buildTicketPage();
                            })
                    });
            });

    });
}

function buildTicketPage() {
    $('body').empty();
    $('body').append('<div class="header"><h1>'+appname+'</h1></div>')
    $('body').append('<input type="button" value="Home" id="home"><br><br>');
    $('body').append('<br><div class="progress"><div class="progress-bar progress-bar-striped bg-info" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div>');
    $('#home').click(function () {
        buildBasicFirstPage();
    })
    $('body').append("Thanks for buying a ticket!");
}
