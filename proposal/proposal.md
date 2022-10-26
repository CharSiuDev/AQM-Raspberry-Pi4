# School of Computing 
# CA326 Year 3 Project Proposal Form
# SECTION A
## Project Title: Indoor Air Quality Monitor for DCU Lecture Rooms
Student 1 Name: Ronghui Lin    ID Number: 19354553 
<br>
Student 2 Name: Vaidas Buzas    ID Number: 19322426 
<br>
Student 3 Name: N/A    ID Number: N/A 
<br>
(A third team member is exceptional and requires detailed justification.) 
<br>
Staff Member Consulted: Renaat Verbruggen

### Description: 
This indoor air quality monitoring project will be based off of a Raspberry Pi with an Enviro + Air Quality Addon and a PMS5003 PM Sensor, these sensors will provide data on multiple metrics such as temperature, pressure, humidity, light and noise level. The included gas sensor will also allow us to make qualitative measurements of the change of gas concentrations in each room (Exact measurement numbers will not be accurate unless calibrated with laboratory equipment). This project will ideally have the scalability to accommodate the hundreds of lecture rooms DCU has. 
<br><br>
This idea came to mind as lecture rooms may get extremely humid depending on many factors such as the amount of people in the room or ventilation and currently there isn’t a publicly accessible way for students and lecturers to find out the room conditions. Through this we wish to provide an economical solution to that problem.
<br><br>
The data will be collected by the sensors and sent by the raspberry pi towards a server which hosts the website. Ideally it will be similar to the opentimetable.dcu.ie website where you search for the location and lecture room and shows you the data it has collected.
<br><br>
The data will be graphed and will allow a refresh function to grab the latest information. Ideally we will implement a top down view for the DCU Campus with building floors filtered by layers in order to improve the ease of use.
<br><br>
The Enviro + Air Quality and PMS5003 sensors are readily available via official Raspberry Pi vendors such as pimoroni.com or thepihut.com, which we’ve experienced using before. The Regular Raspberry Pi models are often available as they’re regularly restocked. However an alternative, the more economical Pi Zero 2W has manufacturer’s lead times into 2023.

### Division of Work:
Ronghui Lin: Sourcing required hardware, implementing sensors + raspberry pi, sending data to server, implementing frontend.<br>
Vaidas Buzas: Backend, creating the server and database management.

### Programming language(s):
- Python3/MicroPython
- ReactJS
- HTML
- CSS
### Programming tool(s):
- React(Or Bootstrap)
- SQL
- Gitlab
- Django(?)
- nginx web server
### Learning Challenges: 
- Data retrieval
- Hardware and Software Integration
- Data Visualization
- Learning the react framework
- Learning nginx web server
- Learn about networking - transferring data across networks.
- Utilising libraries from sensors.
### Hardware / software platform:
- PC 
- Raspberry Pi OS.
### Special hardware / software requirements:
For this project, it will be using a *Raspberry Pi 4 Model B 8GB* as it is the current one we have on hand
<br>
An alternative and much more economical 15 euro *Raspberry Pi Zero 2 W* would suffice for our requirements, however manufacturer lead times stretch into July 2023.
<br><br>
In order to get air quality data, an *Enviro + Air Quality* add-on chip for Raspberry Pi is required to monitor various environmental data. 
<br>
A *PMS5003 Particulate Matter Sensor* is also required in order to monitor Particular Matter (PM) levels in the room.
