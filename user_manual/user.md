# Air Quality Monitor User Manual

Welcome to Air Quality Monitor, a real time web application that displays information from sensors connected to a Raspberry Pi, allowing real time monitoring of indoor or outdoor air quality data. This user manual is designed to help you understand the system architecture, how it works and how to install it.

## Introduction
Air Quality Monitor is a web application that is built with Node.js and Express for server side handling while the front end is consisted of HTML, EJS and Bootstrap for styling. It utilises SQLite3 for database handling.

## System Architecture
The system architecture of Air Quality Monitor is divided into several components including Embedded Javascript (EJS), HTML & Bootstrap, ExpressJS Web Framework, NodeJS and Data Collection Layer.

### 2.1 Embedded Javascript (EJS)

EJS is used for templating in Air Quality Monitor to handle all the templates, different views for pages and management of the head, header and footers. This is to ensure uniformity across the web application so there is consistency across the site.

### 2.2 HTML & Bootstrap

The frontend website is written in HTML and styled with Bootstrap. Users when arriving at the site will be greeted by our site and this is where the main user interface appears. Unregistered users will be able to view the sensor data available, they may choose to login or register for an account. Once registered users login, they will be able to create notifications to monitor their selected node and their inputted thresholds for the data they want to monitor. They will also be able to export all the data out of the database for the specific node they have chosen to .CSV format. Administrator users will be able to manage notifications and sensor data on top of what registered users are able to do.

### 2.3 ExpressJS Web Framework

ExpressJS is used in our application to provide us with the ability to use middleware, routing and templating in addition to EJS. This framework speeds up the development time and allows us to link the frontend and backend processing. Another crucial component was that express allows us to create dynamic rendering of HTML pages, which is vital for showing multiple nodes dynamically as we add more nodes to the system.

### 2.4 NodeJS

NodeJS is the server that handles all the backend processing of data and requests, this is where the main functionality of the application is programmed. It uses SQLite3 to store the sensor data delivered into their own databases and also manages three other tables which include admin users, regular users and email notifications. Once the NodeJS backend receives a request, it sends a response usually in JSON form to allow the frontend to read it and display it to the user. It also handles all the email notifications, sending emails through SMTP through the use of nodemailer. User passwords are also encrypted through bcrypt’s hashing and salting, so passwords will be securely stored in the database.

### 2.5 Data Collection Layer

The data collection layer consists of the Raspberry Pi nodes with their sensors connected. The program to collect the data from the sensors and package them into a dictionary is written in python and is then sent to the NodeJS backend where it is stored according to the name set for the payload. Calibration of the data collected is also processed on the Pi, for example the compensated CPU temperature, this is required as the temperature sensor is close to the CPU, as such a maths calculation is required to take into account the current CPU temperature.

