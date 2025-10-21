const timeElement = document.getElementById('user-time');

function updateTime() {
  timeElement.textContent = Date.now();
}

// Set once on load
updateTime();

// update every second
setInterval(updateTime, 1000);


