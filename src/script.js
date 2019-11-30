document.addEventListener('DOMContentLoaded', function() {
  var x = localStorage["currentTime"] || new Date().getTime()+3600500;

  function backTimer() {
    var hours = document.getElementsByClassName('time-area__number')[0],
      minutes = document.getElementsByClassName('time-area__number')[1],
      seconds = document.getElementsByClassName('time-area__number')[2],
      i = new Date().getTime();
    if(i < x) {
      hours.innerHTML = new Date(x - i - 10800000).getHours();
      minutes.innerHTML = new Date(x - i).getMinutes();
      seconds.innerHTML = new Date(x - i).getSeconds();
      localStorage["currentTime"] = x-1;
      setTimeout(backTimer, 1000);
    } else {
      hours.innerHTML = "0";
      minutes.innerHTML = "0";
      seconds.innerHTML = "0";
    }
  }
  backTimer();
});