import json
import re
import urllib.request
import urllib.error
import logging

from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.views.decorators.cache import never_cache
from django.shortcuts import render

logger = logging.getLogger(__name__)

SHEET_URL = (
    "https://docs.google.com/spreadsheets/d/"
    "1m2V6q2xVZ0e2UP-XETuEZC9om58S21KiGZoWwpUi59Q"
    "/gviz/tq?tqx=out:json"
)

FETCH_TIMEOUT = 10  # seconds

# Matches Google Sheets gviz Date(year,month,day,h,m,s) format
_GVIZ_DATE_RE = re.compile(
    r"Date\((\d{4}),(\d{1,2}),(\d{1,2})(?:,(\d{1,2}),(\d{1,2}),(\d{1,2}))?\)"
)


def _parse_gviz_timestamp(raw) -> str:
    """Convert a gviz Date(...) string to an ISO-8601 string, or return raw."""
    if not isinstance(raw, str):
        return str(raw) if raw is not None else ""
    m = _GVIZ_DATE_RE.search(raw)
    if not m:
        return raw  # already a plain string / ISO
    year, month_0, day = int(m.group(1)), int(m.group(2)), int(m.group(3))
    hour   = int(m.group(4)) if m.group(4) else 0
    minute = int(m.group(5)) if m.group(5) else 0
    second = int(m.group(6)) if m.group(6) else 0
    # gviz months are 0-indexed
    month = month_0 + 1
    return f"{year:04d}-{month:02d}-{day:02d}T{hour:02d}:{minute:02d}:{second:02d}"


def _normalise_rain(val: str) -> str:
    """Normalise various rain condition strings to 'Raining' or 'Clear'."""
    if not val:
        return "Clear"
    v = val.strip().lower()
    if v in ("raining", "rain", "rainy", "yes", "1", "true"):
        return "Raining"
    return "Clear"


def _fetch_sheet_rows():
    """Fetch and parse rows from the public Google Sheet.

    Returns a list of row dicts with keys:
    timestamp, temperature, humidity, aqi, day_night, rain
    """
    req = urllib.request.Request(
        SHEET_URL,
        headers={"User-Agent": "WeatherDashboard/2.0"},
    )
    with urllib.request.urlopen(req, timeout=FETCH_TIMEOUT) as resp:
        raw = resp.read().decode("utf-8")

    # Google wraps the JSON in  google.visualization.Query.setResponse({...});
    start = raw.index("{")
    end = raw.rindex("}") + 1
    data = json.loads(raw[start:end])

    rows_raw = data.get("table", {}).get("rows", []) or []
    parsed = []
    for row in rows_raw:
        cells = row.get("c") or []

        def _val(idx, default=None):
            try:
                cell = cells[idx]
                return cell.get("v") if cell else default
            except IndexError:
                return default

        def _float(idx, default=0.0):
            v = _val(idx)
            try:
                return float(v) if v is not None else default
            except (TypeError, ValueError):
                return default

        parsed.append(
            {
                "timestamp": _parse_gviz_timestamp(_val(0)),
                "temperature": _float(1),
                "humidity": _float(2),
                "aqi": _float(3),
                "day_night": _val(4) or "Dark",
                "rain": _normalise_rain(_val(5) or ""),
            }
        )
    return parsed


def index(request):
    return render(request, "index.html")


@require_GET
@never_cache
def api_live(request):
    """Return the latest sensor reading as JSON."""
    try:
        rows = _fetch_sheet_rows()
        if not rows:
            return JsonResponse(
                {"error": "No data available from sensor"}, status=503
            )
        latest = rows[-1]
        return JsonResponse({"status": "ok", "data": latest})
    except urllib.error.URLError as exc:
        logger.exception("Network error fetching weather data: %s", exc)
        return JsonResponse(
            {"error": "Unable to reach data source. Please try again shortly."},
            status=502,
        )
    except (ValueError, KeyError) as exc:
        logger.exception("Parse error for weather data: %s", exc)
        return JsonResponse(
            {"error": "Received malformed data from sensor feed."},
            status=500,
        )
    except Exception as exc:  # noqa: BLE001
        logger.exception("Unexpected error in api_live: %s", exc)
        return JsonResponse({"error": "Internal server error."}, status=500)


@require_GET
@never_cache
def api_history(request):
    """Return the last N sensor readings for charting."""
    try:
        limit = min(int(request.GET.get("limit", 20)), 100)
    except (TypeError, ValueError):
        limit = 20

    try:
        rows = _fetch_sheet_rows()
        recent = rows[-limit:] if rows else []
        return JsonResponse({"status": "ok", "count": len(recent), "data": recent})
    except urllib.error.URLError as exc:
        logger.exception("Network error fetching weather history: %s", exc)
        return JsonResponse(
            {"error": "Unable to reach data source."}, status=502
        )
    except (ValueError, KeyError) as exc:
        logger.exception("Parse error for weather history: %s", exc)
        return JsonResponse(
            {"error": "Received malformed data from sensor feed."}, status=500
        )
    except Exception as exc:  # noqa: BLE001
        logger.exception("Unexpected error in api_history: %s", exc)
        return JsonResponse({"error": "Internal server error."}, status=500)