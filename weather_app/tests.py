from unittest.mock import MagicMock, patch

from django.test import Client, TestCase, override_settings


@override_settings(ALLOWED_HOSTS=["testserver"])
class WeatherAppSmokeTests(TestCase):
    def setUp(self):
        self.client = Client()

    def _mock_sheet_response(self, row_count=2):
        rows = []
        base_rows = [
            [
                {"v": "Date(2026,3,11,12,30,0)"},
                {"v": 25.4},
                {"v": 61},
                {"v": 42},
                {"v": "Bright"},
                {"v": "Raining"},
            ],
            [
                {"v": "Date(2026,3,11,13,0,0)"},
                {"v": 26.1},
                {"v": 58},
                {"v": 40},
                {"v": "Bright"},
                {"v": "Clear"},
            ],
            [
                {"v": "Date(2026,3,11,13,30,0)"},
                {"v": 26.9},
                {"v": 55},
                {"v": 39},
                {"v": "Dark"},
                {"v": "Clear"},
            ],
        ]
        for row in base_rows[:row_count]:
            rows.append({"c": row})

        payload = (
            'google.visualization.Query.setResponse('
            '{"table":{"rows":' + str(rows).replace("'", '"') + '}});'
        )

        mock_response = MagicMock()
        mock_response.read.return_value = payload.encode("utf-8")
        mock_response.__enter__.return_value = mock_response
        mock_response.__exit__.return_value = False
        return mock_response

    def test_index_and_health_routes_work(self):
        root_response = self.client.get("/")
        health_response = self.client.get("/api/health/")

        self.assertEqual(root_response.status_code, 200)
        self.assertContains(root_response, "WeatherOS")
        self.assertEqual(health_response.status_code, 200)
        self.assertEqual(health_response.content.decode("utf-8"), "ok")

    @patch("urllib.request.urlopen")
    def test_live_api_returns_latest_reading(self, mock_urlopen):
        mock_urlopen.return_value = self._mock_sheet_response(row_count=2)

        response = self.client.get("/api/live/")
        data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["status"], "ok")
        self.assertEqual(data["data"]["temperature"], 26.1)
        self.assertEqual(data["data"]["rain"], "Clear")
        self.assertEqual(data["data"]["day_night"], "Bright")

    @patch("urllib.request.urlopen")
    def test_history_api_respects_limit(self, mock_urlopen):
        mock_urlopen.return_value = self._mock_sheet_response(row_count=3)

        response = self.client.get("/api/history/?limit=2")
        data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["status"], "ok")
        self.assertEqual(data["count"], 2)
        self.assertEqual(len(data["data"]), 2)
        self.assertEqual(data["data"][0]["temperature"], 26.1)
