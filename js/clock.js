window.onload = function() {
    window.setInterval(getTime, 1000);
    getTemp();
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