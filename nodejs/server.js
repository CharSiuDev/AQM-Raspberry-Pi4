const express = require('express')
const app = express()
const sqlite3 = require('sqlite3')
const bodyParser = require('body-parser')
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('pages/index');
  });

  app.get('/about', function(req, res) {
    res.render('pages/about');
  });


app.get('/data', (req, res) => {
    let tableName = `sensor_data_${req.query.id}`
    let conn = new sqlite3.Database('data.db')
    conn.all(`SELECT * FROM ${tableName}`, (err,rows) => {
        if (err) {
          console.error(err.message);
        }
        res.render('data', {data: rows});
    });
    conn.close()
});

app.use(bodyParser.json())

app.get('/data', (req, res) => {
    let tableName = `sensor_data_${req.query.id}`
    let conn = new sqlite3.Database('data.db')
    conn.all(`SELECT * FROM ${tableName}`, (err,rows) => {
        if (err) {
          console.error(err.message);
        }
        res.render('data', {data: rows});
    });
    conn.close()
});

app.post('/store', (req, res) => {
    let data = req.body
    let tableName = `sensor_data_${data.id}`
    // store data in SQLite3 database
    let conn = new sqlite3.Database('data.db')
    conn.run(`CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, temperature REAL, pressure REAL, humidity REAL, light REAL, oxidised REAL, reduced REAL, nh3 REAL, pm1 REAL, pm25 REAL, pm10 REAL)`, (err) => {
        if(err){
            console.log("error creating table")
        }
    })
    conn.run(`INSERT INTO ${tableName} (temperature, pressure, humidity, light, oxidised, reduced, nh3, pm1, pm25, pm10) VALUES (?,?,?,?,?,?,?,?,?,?)`, [data.temperature, data.pressure, data.humidity, data.light, data.oxidised, data.reduced, data.nh3, data.pm1, data.pm25, data.pm10], (err) => {
        if(err){
            console.log("error inserting data")
        }
    })
    conn.all(`SELECT count(*) as count FROM ${tableName}`, (err,rows) => {
        if (err) {
          console.error(err.message);
        }
        if(rows[0].count > 20)
        conn.run(`DELETE FROM ${tableName} WHERE id = (SELECT id FROM ${tableName} ORDER BY id LIMIT 1)`)
    });
    console.log(`Data stored in ${tableName}`)
    conn.close()
    res.send("Data stored in SQLite3 database")
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})