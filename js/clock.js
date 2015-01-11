function addZero(i){
   if(i < 10) {
     i = "0" + i;
   }
   return i;
}

function getTime(){
   var x = document.getElementById("clock");
   var d= new Date();
   var h = addZero(d.getHours());
   var m = addZero(d.getMinutes());
   var s = addZero(d.getSeconds());
   x.innerHTML = h + ":" + m + ":" + s;
   setTimeout(getTime, 1000);
}
