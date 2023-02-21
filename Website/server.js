const express = require('express')
const app = express()
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser')
const session = require('express-session');
const bcrypt = require('bcrypt');
require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendEmail(recipient, subject, body) {
  // create a nodemailer transporter using SMTP
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.EMAIL_USERNAME, // sender address
    to: recipient, // list of receivers
    subject: subject, // Subject line
    text: body, // plain text body
  });

  console.log(`Message sent: ${info.messageId}`);
}

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  if (req.session.username && req.session.isAdmin) {
    res.render('pages/index', { 
      loggedIn: true,
      isAdmin: true
    });
  }
    else if (req.session.username) {
      res.render('pages/index', {
        loggedIn: true,
        isAdmin: false});
    } else {
      res.render('pages/index', {
        loggedIn: false,
        isAdmin: false});
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
  let email = req.body.email;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error encrypting password');
    }
    // Store the username and encrypted password in a database
    let conn = new sqlite3.Database('data.db');
    let sql = `INSERT INTO users (username, email, password) VALUES (?,?,?)`;
    conn.run(sql, [username, email, hash], (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error registering user');
      } else {
        res.redirect('/');
      }
      conn.close();
    });
  });
});

// Admin registration page
app.get('/admin-register', function(req, res) {
  if (req.session.username) {
    res.render('pages/admin-register', {loggedIn: true});
  } else {
    res.render('pages/admin-register', {loggedIn: false});
  }
});

app.post('/admin-register', function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let code = req.body.code;

  // Check that the registration code is correct
  if (code !== process.env.ADMIN_REGISTRATION_CODE) {
    return res.status(400).send('Invalid registration code');
  }

  // Check that the username is unique
  let conn = new sqlite3.Database('data.db');
  let sql = 'SELECT COUNT(*) AS count FROM admin_users WHERE username = ?';
  conn.get(sql, [username], function(err, row) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error checking username');
    }

    if (row.count > 0) {
      return res.status(400).send('Username already exists');
    }

    // Hash the password
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) {
        console.error(err);
        return res.status(500).send('Error encrypting password');
      }

      // Insert the new admin user into the database
      let sql = 'INSERT INTO admin_users (username, password, email) VALUES (?, ?, ?)';
      conn.run(sql, [username, hash, email], function(err) {
        if (err) {
          console.error(err);
          return res.status(500).send('Error registering user');
        }

        // Redirect to the login page
        res.redirect('/login');
      });
    });
  });
});

app.get('/login', (req, res) => {
    if (req.session.username) {
        res.render('pages/login', {loggedIn: true});
      } else {
        res.render('pages/login', {loggedIn: false});
      }
});

app.get('/about', function(req, res) {
  if (req.session.username) {
      res.render('pages/about', {loggedIn: true});
    } else {
      res.render('pages/about', {loggedIn: false});
    }
});


app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  // Check if the user is an admin
  let conn = new sqlite3.Database('data.db');
  let sql = `SELECT * FROM admin_users WHERE username = ?`;
  conn.get(sql, [username], (err, row) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error retrieving user');
          return;
      }
      if (!row) {
          // If the user is not an admin, check if they are a regular user
          sql = `SELECT email, password FROM users WHERE username = ?`;
          conn.get(sql, [username], (err, row) => {
              if (err) {
                  console.error(err);
                  res.status(500).send('Error retrieving user');
                  return;
              }
              if (!row) {
                  res.status(401).send('User not found');
                  return;
              }
              let hash = row.password;
              let email = row.email;

              // Compare the provided password with the encrypted password
              bcrypt.compare(password, hash, (err, result) => {
                  if (err) {
                      console.error(err);
                      res.status(500).send('Error checking password');
                      return;
                  }
                  if (result) {
                      // Store the username, email, and admin flag in a session
                      req.session.username = username;
                      req.session.email = email;
                      req.session.isAdmin = false;
                      res.redirect('/');
                  } else {
                      res.status(401).send('Incorrect password');
                  }
              });
          });
      } else {
          let hash = row.password;

          // Compare the provided password with the encrypted password
          bcrypt.compare(password, hash, (err, result) => {
              if (err) {
                  console.error(err);
                  res.status(500).send('Error checking password');
                  return;
              }
              if (result) {
                  // Store the username and admin flag in a session
                  req.session.username = username;
                  req.session.email = email;
                  req.session.isAdmin = true;
                  res.redirect('/');
              } else {
                  res.status(401).send('Incorrect password');
              }
          });
      }
      conn.close();
  });
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
    if (req.session.username && req.session.isAdmin) {
        const tableName = req.query.tableName;
        let conn = new sqlite3.Database('data.db')
        conn.all(`SELECT * FROM ${tableName}`, (err, rows) => {
            if (err) {
                console.error(err.message);
            }
            let data = rows;
            res.render('pages/data', {data: data,
                                    loggedIn: true,
                                    isAdmin: true});
        });
        conn.close();
    } else if (req.session.username){
      tableName = req.query.tableName;
        let conn = new sqlite3.Database('data.db')
        conn.all(`SELECT * FROM ${tableName}`, (err, rows) => {
            if (err) {
                console.error(err.message);
            }
            let data = rows;
            res.render('pages/data', {data: data,
                                    loggedIn: true,
                                    isAdmin: false});
        });
        conn.close();
    }
    else {
      tableName = req.query.tableName;
        let conn = new sqlite3.Database('data.db')
        conn.all(`SELECT * FROM ${tableName}`, (err, rows) => {
            if (err) {
                console.error(err.message);
            }
            let data = rows;
            res.render('pages/data', {data: data,
                                    loggedIn: false,
                                    isAdmin: false});
        });
        conn.close();
    }
});

app.post('/create-notification', (req, res) => {
  const notificationEmail = req.session.email;
  const { tableName, temperature, pressure, humidity, light, oxidised, reduced, nh3, pm1, pm25, pm10 } = req.body;

  const conn = new sqlite3.Database('data.db');
  const sql = `INSERT INTO email_notifications (email, temperature, pressure, humidity, light, oxidised, reduced, nh3, pm1, pm25, pm10, email_sent, node_name) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`;
  conn.run(sql, [notificationEmail, temperature, pressure, humidity, light, oxidised, reduced, nh3, pm1, pm25, pm10, tableName], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating notification');
      return;
    }

    res.redirect('/data?tableName=' + tableName);
  });

  conn.close();
});

app.get('/export', (req, res) => {
  if (!req.session.username) {
    res.status(401).send('Unauthorized');
    return;
  }

  const tableName = req.query.tableName;
  let conn = new sqlite3.Database('data.db');

  conn.all(`SELECT * FROM ${tableName}`, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error exporting data');
      // Display the error modal
      res.send(`<script>$('#exportErrorModal').modal('show');</script>`);
      return;
    }

    // Build a CSV string from the rows
    let csv = 'time,temperature,pressure,humidity,light,oxidised,reduced,nh3,pm1,pm25,pm10\n';
    for (let row of rows) {
      csv += `${row.time},${row.temperature},${row.pressure},${row.humidity},${row.light},${row.oxidised},${row.reduced},${row.nh3},${row.pm1},${row.pm25},${row.pm10}\n`;
    }

    // Send the CSV file to the client for download
    res.setHeader('Content-disposition', 'attachment; filename=sensor_data.csv');
    res.setHeader('Content-type', 'text/csv');
    res.status(200).send(csv);
  });

  conn.close();
});

app.get('/sensor-data-tables', (req, res) => {
  let conn = new sqlite3.Database('data.db');
  conn.all("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'sensor_data%'", (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      const sensorDataTables = rows.map(row => row.name);
      res.json(sensorDataTables);
    }
  });
});


app.post('/store', (req, res) => {
  let data = req.body;
  let nodeName = data.nodeName;

  // Store data in SQLite3 database
  let conn = new sqlite3.Database('data.db');
  conn.run(`CREATE TABLE IF NOT EXISTS ${nodeName} (time REAL, temperature REAL, pressure REAL, humidity REAL, light REAL, oxidised REAL, reduced REAL, nh3 REAL, pm1 REAL, pm25 REAL, pm10 REAL)`, (err) => {
    if (err) {
      console.log("error creating table")
    }
  });

  conn.run(`INSERT INTO ${nodeName} (time, temperature, pressure, humidity, light, oxidised, reduced, nh3, pm1, pm25, pm10) VALUES (?,?,?,?,?,?,?,?,?,?,?)`, [data.time, data.temperature, data.pressure, data.humidity, data.light, data.oxidised, data.reduced, data.nh3, data.pm1, data.pm25, data.pm10], (err) => {
    if (err) {
      console.log("error inserting data")
    }
  });

  conn.all(`SELECT * FROM email_notifications WHERE node_name = ?`, [nodeName], (err, rows) => {
    if (err) {
      console.error(err.message);
    }

    let notificationsToRemove = [];

    rows.forEach((row) => {
      let exceedData = [];

      if (row.temperature && data.temperature > row.temperature) {
        exceedData.push("Temperature");
      }
      if (row.pressure && data.pressure > row.pressure) {
        exceedData.push("Pressure");
      }
      if (row.humidity && data.humidity > row.humidity) {
        exceedData.push("Humidity");
      }
      if (row.light && data.light > row.light) {
        exceedData.push("Light");
      }
      if (row.oxidised && data.oxidised > row.oxidised) {
        exceedData.push("Oxidised");
      }
      if (row.reduced && data.reduced > row.reduced) {
        exceedData.push("Reduced");
      }
      if (row.nh3 && data.nh3 > row.nh3) {
        exceedData.push("NH3");
      }
      if (row.pm1 && data.pm1 > row.pm1) {
        exceedData.push("PM1");
      }
      if (row.pm25 && data.pm25 > row.pm25) {
        exceedData.push("PM25");
      }
      if (row.pm10 && data.pm10 > row.pm10) {
        exceedData.push("PM10");
      }

      // If any data exceeds the threshold, send email
      if (exceedData.length > 0) {
        let email = row.email;
        let subject = "Sensor Data Exceeds Threshold";
        let message = `The following data exceeds the threshold:\n${exceedData.join(', ')}\n\nSensor data:\n${JSON.stringify(data, null, 2)}`;

        sendEmail(email, subject, message);
        notificationsToRemove.push(row.id);
      }
    });

    // Remove the notification requests that have been sent
    notificationsToRemove.forEach((id) => {
      conn.run(`DELETE FROM email_notifications WHERE id = ?`, [id], (err) => {
        if (err) {
          console.error(err.message);
        }
      });
    });
  });


  conn.all(`SELECT count(*) as count FROM ${nodeName}`, (err,rows) => {
    if (err) {
      console.error(err.message);
    }
    if(rows[0].count > 20)
    conn.run(`DELETE FROM ${nodeName} WHERE time = (SELECT time FROM ${nodeName} ORDER BY time LIMIT 1)`)
});


  console.log(`Data stored in ${nodeName}`);
  conn.close();
  res.send("Data stored in SQLite3 database");
});
app.listen(3000, () => {
  console.log("Server running on port 3000")});