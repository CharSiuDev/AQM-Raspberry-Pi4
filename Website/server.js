const express = require('express')
const app = express()
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser')
const session = require('express-session');
const bcrypt = require('bcrypt');

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    if (req.session.username) {
      res.render('pages/index', {loggedIn: true});
    } else {
      res.render('pages/index', {loggedIn: false});
    }
});

app.get('/about', function(req, res) {
    if (req.session.username) {
        res.render('pages/about', {loggedIn: true});
      } else {
        res.render('pages/about', {loggedIn: false});
      }
});

app.get('/register', (req, res) => {
    if (req.session.username) {
        res.render('pages/register', {loggedIn: true});
      } else {
        res.render('pages/register', {loggedIn: false});
      }
});  

app.post('/register', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
  
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error encrypting password');
      }
      // Store the username and encrypted password in a database
      let conn = new sqlite3.Database('data.db');
      let sql = `INSERT INTO users (username, password) VALUES (?,?)`;
      conn.run(sql, [username, hash], (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error registering user');
        }
        res.send('User registered successfully');
        res.redirect('/');
      });
      conn.close();
    });
});

app.get('/login', (req, res) => {
    if (req.session.username) {
        res.render('pages/login', {loggedIn: true});
      } else {
        res.render('pages/login', {loggedIn: false});
      }
});

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
  
    // Retrieve the encrypted password from the database
    let conn = new sqlite3.Database('data.db');
    let sql = `SELECT password FROM users WHERE username = ?`;
    conn.get(sql, [username], (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error retrieving user');
      }
      if (!row) {
        res.status(401).send('User not found');
        return;
      }
      let hash = row.password;
  
      // Compare the provided password with the encrypted password
      bcrypt.compare(password, hash, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error checking password');
        }
        if (result) {
          // Store the username in a session
          req.session.username = username;
          res.redirect('/');
        } else {
          res.status(401).send('Incorrect password');
        }
      });
    });
    conn.close();
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).send('Error logging out');
        }
        res.redirect('/');
    });
});

app.use(bodyParser.json())

app.get('/data', (req, res) => {
    if (req.session.username) {
        let tableName = `sensor_data_1`
        let conn = new sqlite3.Database('data.db')
        conn.all(`SELECT * FROM ${tableName}`, (err, rows) => {
            if (err) {
                console.error(err.message);
            }
            let data = rows;
            res.render('pages/data', {data: data,
                                    loggedIn: true});
        });
        conn.close();
    } else {
        let tableName = `sensor_data_1`
        let conn = new sqlite3.Database('data.db')
        conn.all(`SELECT * FROM ${tableName}`, (err, rows) => {
            if (err) {
                console.error(err.message);
            }
            let data = rows;
            res.render('pages/data', {data: data,
                                    loggedIn: false});
        });
        conn.close();
    }
});

app.post('/store', (req, res) => {
    let data = req.body
    let tableName = `sensor_data_1`
    // store data in SQLite3 database
    let conn = new sqlite3.Database('data.db')
    conn.run(`CREATE TABLE IF NOT EXISTS ${tableName} (time REAL, temperature REAL, pressure REAL, humidity REAL, light REAL, oxidised REAL, reduced REAL, nh3 REAL, pm1 REAL, pm25 REAL, pm10 REAL)`, (err) => {
        if(err){
            console.log("error creating table")
        }
    })
    conn.run(`INSERT INTO ${tableName} (time, temperature, pressure, humidity, light, oxidised, reduced, nh3, pm1, pm25, pm10) VALUES (?,?,?,?,?,?,?,?,?,?,?)`, [data.time, data.temperature, data.pressure, data.humidity, data.light, data.oxidised, data.reduced, data.nh3, data.pm1, data.pm25, data.pm10], (err) => {
        if(err){
            console.log("error inserting data")
        }
    })
    conn.all(`SELECT count(*) as count FROM ${tableName}`, (err,rows) => {
        if (err) {
          console.error(err.message);
        }
        if(rows[0].count > 20)
        conn.run(`DELETE FROM ${tableName} WHERE time = (SELECT time FROM ${tableName} ORDER BY time LIMIT 1)`)
    });
    console.log(`Data stored in ${tableName}`)
    conn.close()
    res.send("Data stored in SQLite3 database")
})
app.listen(3000, () => {
    console.log("Server running on port 3000")});