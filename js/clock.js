window.onload = function() {
    window.setInterval(getTime, 1000);
    getTemp();
    getAllAlarms();
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
   var url = "https://api.forecast.io/forecast/39367ea36c638ee65a9097bd2253fb04/35.300399,-120.662362?callback=?";
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

   alarmObject.save({"hours": hours, "mins": mins, "ampm": ampm, "alarmName": alarmName}, {
      success: function(object) {
         insertAlarm(hours, mins, ampm, alarmName);
         hideAlarmPopup();
      }   
    }); 
}
