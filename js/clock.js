window.onload = function() {
    window.setInterval(getTime, 1000);
    getTemp();
};

function imgurCallback() {
  var access_token = localStorage.getItem('accessToken')
  var authorization = 'Bearer ' + access_token
  $.ajax({
     url: 'https://api.imgur.com/3/account/me',
      method: 'GET',
      headers: {
          Authorization: authorization,
          Accept: 'application/json'
      },
      success: function(result) {
        alert(result.data.url)
      }
  });
}
var user_id = null;
function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function (response) {
        var str ='Thanks for logging in, ' + response.name + '!';
        str += "<input type='button' value='Logout' onclick='Logout();'/>";
        document.getElementById("status").innerHTML = str;
        user_id = response.id;
        getAllAlarms();
    });
}

function Logout(){
    FB.logout(function () { document.location.reload(); });
}

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        testAPI();
    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        document.getElementById('status').innerHTML = 'Please log ' +
          'into this app.';
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        document.getElementById('status').innerHTML = 'Please log ' +
          'into Facebook.';
    }
}
function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : '371324049741658', // App ID
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true,  // parse XFBML
        version    : 'v2.1' // use version 2.1
    });
    
    FB.getLoginStatus(function(response) {
       statusChangeCallback(response);
   });
};

function addZero(i){
    if(i < 10) {
        i = "0" + i;
    }
    return i;
}

function getTime(){
    var x = document.getElementById("clock");
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    x.innerHTML = h + ":" + m + ":" + s;
}

function getTemp(){
    var latitude = "35.300399";
    var longitude = "-120.662362";
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(coord) {
            latitude = coord.coords.latitude;
            longitude = coord.coords.longitude;
            getTemperature(latitude, longitude);
        }, function errorFunc(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    document.getElementById("city").innerHTML = "User denied the request for Geolocation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    document.getElementById("city").innerHTML = "Location information is unavailable."
                    break;
                case error.TIMEOUT:
                    document.getElementById("city").innerHTML = "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    document.getElementById("city").innerHTML = "An unknown error occurred."
                    break;
            }
        });
    }
    else {

        getTemperature(latitude, longitude);
    }
}

function getTemperature(lat, longi){
    var url = "https://api.forecast.io/forecast/39367ea36c638ee65a9097bd2253fb04/" + lat + "," + longi + "?callback=?";
    var cityURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + longi + "&sensor=true";
   
    var getCity = function(data) {
        var city = data.results[0].address_components[2].long_name;
        document.getElementById("city").innerHTML = city;
    };
    $.getJSON(cityURL, getCity);

    var success = function(data){
        var icon = "img/" + data.daily.icon + ".png";
        var color = getColor(data.daily.data[0].temperatureMax)

        $("#forecastIcon").attr("src", icon);
        $("#forecastLabel").html(data.daily.summary);
        $("body").addClass(color);
    };

    $.getJSON(url, success);

    function getColor(temp) {
        var color;
        if (temp < 60) {
            color = "cold";
        }
        else if (temp < 70) {
            color = "chilly";
        }
        else if (temp < 80) {
            color = "nice";
        }
        else if (temp < 90) {
            color = "warm";
        }
        else {
            color = "hot";
        }
        return color;
    }
}
      
function hideAlarmPopup(){
    $("#mask").addClass("hide");
    $("#popup").addClass("hide");
}
function deleteAlarm(name, time){
    var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);
    query.equalTo("alarmName", name);
    query.find( {
        success: function(results) {
            results[0].destroy({});
            _gaq.push(['_trackEvent', 'Alarm', 'Delete']);
        }
    });
}

function insertAlarm(hours, min, ampm, alarmName){
    var n = $("<div></div>").addClass("flexible");
    var n1 = $("<div></div>").addClass("name");
    n1.html(alarmName);
    var n2 = $("<div></div>").addClass("time");
    n2.html(hours + ":" + min + ampm);
    n.append(n1);
    n.append(n2);
    n.click(function(){
        name = $(this).find(".name").text();
        time = $(this).find(".time").text();
        deleteAlarm(name, time);
        $(this).remove();
    });
    $("#alarms").append(n);
}

function showAlarmPopup(){
    $("#mask").removeClass("hide");
    $("#popup").removeClass("hide");
}

function getAllAlarms(){
    Parse.initialize("8ZXncMNhSNAaZd1ZKFcJLwPfWtByRasBKkKLNGPI", "TcuvXfgaLecf1VbaKD0gkI3GHFtRXPcl2DKwbLm1");
    var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);
    query.equalTo("user_id", user_id);
    query.find({
        success: function(results) {
            for (var i = 0; i < results.length; i++) { 
                insertAlarm(results[i].attributes.hours, results[i].attributes.mins, results[i].attributes.ampm, results[i].attributes.alarmName);
            }
        }
    });
}

function addAlarm(){
    var hours = $("#hours option:selected").text();
    var mins = $("#mins option:selected").text();
    var ampm = $("#ampm option:selected").text();
    var alarmName = $("#alarmName").val();
  
    var AlarmObject = Parse.Object.extend("Alarm");
    var alarmObject = new AlarmObject();

    alarmObject.save({"hours": hours, "mins": mins, "ampm": ampm, "alarmName": alarmName, "user_id": user_id}, {
        success: function(object) {
            insertAlarm(hours, mins, ampm, alarmName);
            _gaq.push(['_trackEvent', 'Alarm', 'Add']);
            hideAlarmPopup();
        }   
    }); 
}
