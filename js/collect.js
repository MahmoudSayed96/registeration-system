
$(function(){
    /*
     ======================================================= 
     == Web Course Project #2 ==
     = 
     ======================================================= 
     */

    'use strict';//For check errors in js

    //Create The Objects Prototype
    //Person Template
    function Person(username,password,email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    //Event Template
    function Event(type,target,time) {
        this.type = type;
        this.target = target;
        this.time = time;
    }
    /*
     ======================================================= 
            == Store Data ==
     ======================================================= 
    */
    //Make empty array for store the events for send to MySQL
    var events = Array();
    //Linkes Events
    $('a').on('click',function() {
        //Show Div Content and hide others
        $('#'+$(this).data('id')).addClass('active').siblings('div').removeClass('active');

        var link_name = $(this).attr('name');
        var event = new Event('click',link_name,getDateTime());
        //Store new object in array
        events.push(event);
        if(link_name == 'retrieve_events') {
            getEvents();
        }
        if(link_name == 'retrieve_data') {
            getUsers();
        }
    });
    //Input Events
    $('input').on('focus',function(){
        var event = new Event('focus',$(this).attr('name'),getDateTime());
        events.push(event);
    });
    $('input').on('blur',function(){
        var event = new Event('blur',$(this).attr('name'),getDateTime());
        events.push(event);
    });
    //Function to get the current datetime
    function getDateTime() {
        var now     = new Date(); 
        var year    = now.getFullYear();
        var month   = now.getMonth()+1; 
        var day     = now.getDate();
        var hour    = now.getHours();
        var minute  = now.getMinutes();
        var second  = now.getSeconds(); 
        if(month.toString().length == 1) {
            var month = '0'+month;
        }
        if(day.toString().length == 1) {
            var day = '0'+day;
        }   
        if(hour.toString().length == 1) {
            var hour = '0'+hour;
        }
        if(minute.toString().length == 1) {
            var minute = '0'+minute;
        }
        if(second.toString().length == 1) {
            var second = '0'+second;
        }   
        var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
         return dateTime;
    }

    //Send events to database after 10 seconds
    var sendEvent = setInterval(function(){
        //Check there is event action
        if(events.length>0) {
            $.ajax({
                type:'POST',
                url:'server.php',
                data:{event:JSON.stringify(events)},
                success:function(response){
                    console.log(response);
                    //Make Array Empty
                    events = [];
                }
            });
        }
    },10000);

    //Submit the Person data
    $('form').on('submit',function(e){
        e.preventDefault();
        //Convert the form inputs data to Associative Array{key => value}
        var form_data = $(this).serializeArray();
        var user_error = true;
        var pass_error = true;
        var email_error = true;
        //Form validation
        if(form_data[0].value == '') {
            user_error = false;
            alert("Username can't be empty");
        }
        if(form_data[1].value == '') {
            pass_error = false;
            alert("Password can't be empty");
        }
        if(form_data[2].value == '') {
            email_error = false;
            alert("Email can't be empty");
        }
        //Create new person object
        if(user_error == true && pass_error == true && email_error == true) {
            var personObj = new Person(form_data[0].value,form_data[1].value,form_data[2].value);
        }
        
        $.ajax({
            type:'POST',
            url:'server.php',
            data:{person:JSON.stringify(personObj)},
            success:function(response) {
                alert(response);
            }
        });
    });

   /*
     ======================================================= 
            == Retrieve Data Functions ==
     ======================================================= 
    */
    function getEvents(){
        $.ajax({
            type:'GET',
            url:'server.php',
            data:{events:''},
            success:function(response){
                if(response) {
                    var data = JSON.parse(response);
                    var output = "";
                    output += "<h2>Logged Events</h2>";
                    output += "<table id='tbl_event'>";
                    output += "<tr><th>Type</th><th>Target</th><th>Time</th></tr>";
                    for(var index = 0; index < data.length; index++) {
                        output += "<tr>"
                        for(var prop in data[index]) {
                            output+="<td>"+data[index][prop]+"</td>";
                        } 
                        output += "</tr>";
                    }
                    output += "</table>";
                    $('#events').html(output);
                }
            }
        });
    }

    function getUsers(){
        $.ajax({
            type:'GET',
            url:'server.php',
            data:{users:''},
            success:function(response){
                if(response) {
                    //Return to json object
                    var data = JSON.parse(response);
                    var output = "";
                    output += "<h2>Stored Users</h2>";
                    output += "<table id='tbl_data'>";
                    output += "<tr><th>Username</th><th>Password</th><th>Email</th></tr>";
                    for(var index = 0; index < data.length; index++) {
                        output += "<tr>"
                        for(var prop in data[index]) {
                            output+="<td>"+data[index][prop]+"</td>";
                        } 
                        output += "</tr>";
                    }
                    output += "</table>";
                    $('#data').html(output);
                }
            }
        });
    }
});