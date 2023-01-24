const data = {
    id: 1,
    temperature: 20,
    pressure: 1013,
    humidity: 40,
    light: 400,
    oxidised: 2,
    reduced: 3,
    nh3: 0.5,
    pm1: 12,
    pm25: 34,
    pm10: 56
}

// Get a reference to the table cells
const id = document.getElementById("id");
const temperature = document.getElementById("temperature");
const pressure = document.getElementById("pressure");
const humidity = document.getElementById("humidity");
const light = document.getElementById("light");
const oxidised = document.getElementById("oxidised");
const reduced = document.getElementById("reduced");
const nh3 = document.getElementById("nh3");
const pm1 = document.getElementById("pm1");
const pm25 = document.getElementById("pm25");
const pm10 = document.getElementById("pm10");

// Insert the data into the table cells
id.innerHTML = data.id;
temperature.innerHTML = data.temperature;
pressure.innerHTML = data.pressure;
humidity.innerHTML = data.humidity;
light.innerHTML = data.light;
oxidised.innerHTML = data.oxidised;
reduced.innerHTML = data.reduced;
nh3.innerHTML = data.nh3;
pm1.innerHTML = data.pm1;
pm25.innerHTML = data.pm25;
pm10.innerHTML = data.pm10;

/*
let idSum = 0;
let temperatureSum = 0;
let pressureSum = 0;
let humiditySum = 0;
let lightSum = 0;
let oxidisedSum = 0;
let reducedSum = 0;
let nh3Sum = 0;
let pm1Sum = 0;
let pm25Sum = 0;
let pm10Sum = 0;
let idCount = 0;
let temperatureCount = 0;
let pressureCount = 0;
let humidityCount = 0;
let lightCount = 0;
let oxidisedCount = 0;
let reducedCount = 0;
let nh3Count = 0;
let pm1Count = 0;
let pm25Count = 0;
let pm10Count = 0;

for (let i = 0; i < data.length; i++) {
  idSum += data[i].id;
  temperatureSum += data[i].temperature;
  pressureSum += data[i].pressure;
  humiditySum += data[i].humidity;
  lightSum += data[i].light;
  oxidisedSum += data[i].oxidised;
  reducedSum += data[i].reduced;
  nh3Sum += data[i].nh3;
  pm1Sum += data[i].pm1;
  pm25Sum += data[i].pm25;
  pm10Sum += data[i].pm10;
  idCount++;
  temperatureCount++;
  pressureCount++;
  humidityCount++;
  lightCount++;
  oxidisedCount++;
  reducedCount++;
  nh3Count++;
  pm1Count++;
  pm25Count++;
  pm10Count++;
}
const idAverage = idSum / idCount;
const temperatureAverage = temperatureSum / temperatureCount;
const pressureAverage = pressureSum / pressureCount;
const humidityAverage = humiditySum / humidityCount;
const lightAverage = lightSum / lightCount;
const oxidisedAverage = oxidisedSum / oxidisedCount;
const reducedAverage = reducedSum / reducedCount;
const nh3Average = nh3Sum / nh3Count;
const pm1Average = pm1Sum / pm1Count;
const pm25Average = pm25Sum / pm25Count;
const pm10Average = pm10Sum / pm10Count;

document.getElementById("id-average").textContent = idAverage;
document.getElementById("temperature-average").textContent = temperatureAverage;
document.getElementById("pressure-average").textContent = pressureAverage;
document.getElementById("humidity-average").textContent = humidityAverage;
document.getElementById("light-average").textContent = lightAverage;
document.getElementById("oxidised-average").textContent = oxidisedAverage;
document.getElementById("reduced-average").textContent = reducedAverage;
document.getElementById("nh3-average").textContent = nh3Average;
document.getElementById("pm1-average").textContent = pm1Average;
document.getElementById("pm25-average").textContent = pm25Average;
document.getElementById("pm10-average").textContent = pm10Average;
*/
fetch('http://local-ip-address/store', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(response => console.log('Success:', response))
.catch(error => console.error('Error:', error)); 

