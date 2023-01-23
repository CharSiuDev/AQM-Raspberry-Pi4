// Fetch sensor data from the server
fetch('/sensor-data')
  .then(response => response.json())
  .then(data => {
    // Update the data div with the sensor data
    document.getElementById('data').innerHTML = data.value;
  })
  .catch(error => console.error(error));