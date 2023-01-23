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

fetch('http://local-ip-address/store', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(response => console.log('Success:', response))
.catch(error => console.error('Error:', error));
