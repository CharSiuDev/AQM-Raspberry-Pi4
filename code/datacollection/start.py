#!/usr/bin/env python3
import json
import requests
import time
import math
from datetime import datetime
import colorsys
import sys
import ST7735
try:
    from ltr559 import LTR559
    ltr559 = LTR559()
except ImportError:
    import ltr559
from bme280 import BME280
from pms5003 import PMS5003, ReadTimeoutError as pmsReadTimeoutError
from enviroplus import gas

# BME280 temperature/pressure/humidity sensor
bme280 = BME280()
# PMS5003 particulate sensor
pms5003 = PMS5003()


nodeName = "sensor_data_1"

def get_cpu_temp():
    with open("/sys/class/thermal/thermal_zone0/temp", "r") as f:
        temp = f.read()
        temp = int(temp) / 1000.0
    return temp

factor = 0.7
cpu_temps = [get_cpu_temp()] * 5
delay = 0.5
last_page = 0
light = 1
node_ID = 1
def get_compensated_cpu_temp(cpu_temps):
        cpu_temp = get_cpu_temp()
        cpu_temps = cpu_temps[1:] + [cpu_temp]
        avg_cpu_temp = sum(cpu_temps) / float(len(cpu_temps))
        raw_temp = bme280.get_temperature()
        temperature_data = raw_temp - ((avg_cpu_temp - raw_temp) / factor)
        return round(temperature_data,2)

def getpressure():
    pressure_data = round(bme280.get_pressure(),2)
    return pressure_data

def get_humidity():
    humidity_data = round(bme280.get_humidity(),2)
    return humidity_data

def get_light(proximity):
        if proximity < 10:
            light_data = round(ltr559.get_lux(),2)
            return light_data
        else:
            light_data = 1
            return light_data

def get_oxidised():
        data = gas.read_oxidising()
        oxi_ppm = round(math.pow(10, math.log10(data/38957)+0.64),2)
        return oxi_ppm

def get_reduced():
        data = gas.read_reducing()
        red_ppm = round(math.pow(10, -1.25 * math.log10(data/598448) - 0.8129),2)
        return red_ppm

def get_nh3():
        data = gas.read_nh3()
        nh3_ppm = round(math.pow(10, -1.8 * math.log10(data/462191) - 0.163),2)
        return nh3_ppm

def get_pm1():
        data = pms5003.read()
        pm1_data = data.pm_ug_per_m3(1.0)
        return pm1_data

def get_pm25():
        data = pms5003.read()
        pm25_data = data.pm_ug_per_m3(2.5)
        return pm25_data

def get_pm10():
        data = pms5003.read()
        pm10_data = data.pm_ug_per_m3(10),
        return pm10_data

def collect_data():
    proximity = ltr559.get_proximity()
    temperature_data = get_compensated_cpu_temp(cpu_temps)
    pressure_data = getpressure()
    humidity_data = get_humidity()
    light_data = get_light(proximity)
    oxidised_data = get_oxidised()
    reduced_data = get_reduced()
    nh3_data = get_nh3()
    pm1_data = get_pm1()
    pm25_data = get_pm25()
    pm10_data = get_pm10()
    currtime = datetime.now().strftime("%H:%M:%S")

    data = {
        "nodeName": nodeName,
        "time": currtime,
        "temperature": temperature_data,
        "pressure": pressure_data,
        "humidity": humidity_data,
        "light": light_data,
        "oxidised": oxidised_data,
        "reduced": reduced_data,
        "nh3": nh3_data,
        "pm1": pm1_data,
        "pm25": pm25_data,
        "pm10": pm10_data
    }

    return data

def send_data(data):
    url = 'http://192.168.0.59:3000/store'
    headers = {'Content-type': 'application/json'}
    response = requests.post(url, data=json.dumps(data), headers=headers)
    if response.status_code == 200:
        print('Success')
    else:
        print('Error')

def run():
    while True:
        data = collect_data()
        send_data(data)
        time.sleep(10)

if __name__ == '__main__':
    try:
        run()
    except KeyboardInterrupt:
        sys.exit(0)
