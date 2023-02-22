import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime
import start


class TestStart(unittest.TestCase):

    @patch('start.get_cpu_temp')
    def test_get_compensated_cpu_temp(self, mock_get_cpu_temp):
        mock_get_cpu_temp.side_effect = [70, 65, 68, 67, 70]
        cpu_temps = [70, 70, 70, 70, 70]
        temperature_data = sensor_data_1.get_compensated_cpu_temp(cpu_temps)
        self.assertEqual(temperature_data, 66.54)

    @patch('start.bme280.get_pressure')
    def test_getpressure(self, mock_get_pressure):
        mock_get_pressure.return_value = 1000.2
        pressure_data = sensor_data_1.getpressure()
        self.assertEqual(pressure_data, 1000.2)

    @patch('start.bme280.get_humidity')
    def test_get_humidity(self, mock_get_humidity):
        mock_get_humidity.return_value = 50.2
        humidity_data = sensor_data_1.get_humidity()
        self.assertEqual(humidity_data, 50.2)

    @patch('start.ltr559.get_lux')
    def test_get_light(self, mock_get_lux):
        mock_get_lux.return_value = 200.2
        light_data = sensor_data_1.get_light(5)
        self.assertEqual(light_data, 200.2)

    def test_get_light_proximity(self):
        light_data = sensor_data_1.get_light(15)
        self.assertEqual(light_data, 1)

    @patch('start.gas.read_oxidising')
    def test_get_oxidised(self, mock_read_oxidising):
        mock_read_oxidising.return_value = 25000
        oxidised_data = sensor_data_1.get_oxidised()
        self.assertEqual(oxidised_data, 129.58)

    @patch('start.gas.read_reducing')
    def test_get_reduced(self, mock_read_reducing):
        mock_read_reducing.return_value = 200000
        reduced_data = sensor_data_1.get_reduced()
        self.assertEqual(reduced_data, 0.21)

    @patch('start.gas.read_nh3')
    def test_get_nh3(self, mock_read_nh3):
        mock_read_nh3.return_value = 100000
        nh3_data = sensor_data_1.get_nh3()
        self.assertEqual(nh3_data, 0.1)

    @patch('start.pms5003.read')
    def test_get_pm1(self, mock_pms_read):
        mock_pms_read.return_value.pm_ug_per_m3.return_value = 10
        pm1_data = sensor_data_1.get_pm1()
        self.assertEqual(pm1_data, 10)

    @patch('start.pms5003.read')
    def test_get_pm25(self, mock_pms_read):
        mock_pms_read.return_value.pm_ug_per_m3.return_value = 25
        pm25_data = sensor_data_1.get_pm25()
        self.assertEqual(pm25_data, 25)

    @patch('start.pms5003.read')
    def test_get_pm10(self, mock_pms_read):
        mock_pms_read.return_value.pm_ug_per_m3.return_value = 100
        pm10_data = sensor_data_1.get_pm10()
        self.assertEqual(pm10_data, (100,))

    def test_get_current_time(self):
        currtime = datetime.now().strftime("%H:%M:%S")
        self.assertEqual(len(currtime), 8)

    @patch('start.requests.post')
    def test_post_data_to_server(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_post.return_value = mock_response

        data = {
            "nodeName": "sensor_data_1",
            "time": "12:34:56",
            "temperature": 25.0,
            "pressure": 1013.25,
            "humidity": 40.0,
            "light": 50.0,
            "oxidised": 20.0,
            "reduced": 30.0,
            "nh3": 10.0,
            "pm1": 5.0,
            "pm25": 10.0,
            "pm10": (20.0,)
        }

        start.post_data_to_server(data)

        mock_post.assert_called_once_with(
            'http://192.168.0.59:3000/store',
            data='{"nodeName": "sensor_data_1", "time": "12:34:56", "temperature": 25.0, "pressure": 1013.25, "humidity": 40.0, "light": 50.0, "oxidised": 20.0, "reduced": 30.0, "nh3": 10.0, "pm1": 5.0, "pm25": 10.0, "pm10": [20.0]}',
            headers={'Content-type': 'application/json'}
        )

if __name__ == '__main__':
    unittest.main()