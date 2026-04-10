/**
 * WeatherOS — Enterprise Dashboard Script v2.1
 *
 * Uses pure SVG for all charts (no canvas sizing issues).
 * All data fetched from /api/live and /api/history (Django backend).
 */
"use strict";

(function WeatherOS() {

  // ─── CONFIG ────────────────────────────────────────────────────────
  const CFG = {
    LIVE_ENDPOINT:    "/api/live/",
    HISTORY_ENDPOINT: "/api/history/?limit=20",
    REFRESH_MS:       10_000,
    HISTORY_MS:       60_000,
    RAIN_DROPS_FULL:  60,
    RAIN_DROPS_LITE:  22,
  };

  // ─── STATE ─────────────────────────────────────────────────────────
  const state = {
    latest:             null,
    historyRows:        [],
    isFetchingLive:     false,
    isFetchingHistory:  false,
    rainActive:         false,
    weatherMode:        "",
    hasEverSucceeded:   false,
    consecutiveFailures: 0,    // only show error after 2+ failures
    historyChart:       null,
  };

  // ─── PERFORMANCE DETECTION ─────────────────────────────────────────
  const reducedMotion  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowCpu         = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 2;
  const lowMemory      = typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 2;
  const saveData       = navigator.connection?.saveData === true;
  const LITE_MODE      = reducedMotion || lowCpu || lowMemory || saveData;
  const RAIN_DROPS     = LITE_MODE ? CFG.RAIN_DROPS_LITE : CFG.RAIN_DROPS_FULL;

  // ─── DOM CACHE ─────────────────────────────────────────────────────
  const dom = {
    topbar:        document.getElementById("topbar"),
    statusDot:     document.getElementById("statusDot"),
    statusLabel:   document.getElementById("statusLabel"),
    eyebrowDot:    document.getElementById("eyebrowDot"),
    snapTempVal:   document.getElementById("snapTempVal"),
    snapHumVal:    document.getElementById("snapHumVal"),
    snapAqiVal:    document.getElementById("snapAqiVal"),
    updateTime:    document.getElementById("updateTime"),
    tempValue:     document.getElementById("tempValue"),
    tempBar:       document.getElementById("tempBar"),
    tempBadge:     document.getElementById("tempBadge"),
    cardTemp:      document.getElementById("card-temp"),
    humValue:      document.getElementById("humValue"),
    humBar:        document.getElementById("humBar"),
    humBadge:      document.getElementById("humBadge"),
    aqiValue:      document.getElementById("aqiValue"),
    aqiBar:        document.getElementById("aqiBar"),
    aqiBadge:      document.getElementById("aqiBadge"),
    dayNightIcon:  document.getElementById("dayNightIcon"),
    dayNightLabel: document.getElementById("dayNightLabel"),
    rainIcon:      document.getElementById("rainIcon"),
    rainLabel:     document.getElementById("rainLabel"),
    rainLayer:     document.getElementById("rainLayer"),
    rainChanceVal: document.getElementById("rainChanceVal"),
    tempPredVal:   document.getElementById("tempPredVal"),
    tempPredBadge: document.getElementById("tempPredBadge"),
    humPredVal:    document.getElementById("humPredVal"),
    humPredBadge:  document.getElementById("humPredBadge"),
    windVal:       document.getElementById("windVal"),
    cHistory:      document.getElementById("historyChart"),
    hamburger:     document.getElementById("hamburger"),
    mobileMenu:    document.getElementById("mobileMenu"),
    mobileClose:   document.getElementById("mobileClose"),
    menuBackdrop:  document.getElementById("menuBackdrop"),
    navLinks:      document.querySelectorAll(".topbar-link"),
    mobileLinks:   document.querySelectorAll(".mobile-link"),
    feedbackForm:  document.getElementById("feedbackForm"),
    formSuccess:   document.getElementById("formSuccess"),
    fbSubmit:      document.getElementById("fbSubmit"),
  };

  // ──────────────────────────────────────────────────────────────────
  // UTILITIES
  // ──────────────────────────────────────────────────────────────────
  function clamp(v, min, max)  { return Math.min(Math.max(v, min), max); }
  function round(v, d = 0)     { return +v.toFixed(d); }
  function fmt1(v)             { return round(v, 1); }
  function setText(el, txt)    { if (el && el.textContent !== String(txt)) el.textContent = txt; }
  function setAttr(el, k, v)   { if (el) el.setAttribute(k, v); }

  function animateValue(el) {
    if (!el || LITE_MODE) return;
    el.classList.remove("val-anim");
    requestAnimationFrame(() => el.classList.add("val-anim"));
  }

  // ──────────────────────────────────────────────────────────────────
  // STATUS
  // ──────────────────────────────────────────────────────────────────
  function setStatus(type, label) {
    if (dom.statusDot)  dom.statusDot.className  = `status-dot ${type}`;
    if (dom.statusLabel) setText(dom.statusLabel, label);
  }

  function showError(msg) {
    console.warn("[WeatherOS] fetch error:", msg);
  }

  function hideError() {
  }

  // ──────────────────────────────────────────────────────────────────
  // PROFILES
  // ──────────────────────────────────────────────────────────────────
  function getTempProfile(t) {
    if (t >= 36) return { label: "🔥 Hot",       cls: "card-hot",      color: "#fb7185" };
    if (t >= 28) return { label: "☀️ Warm",      cls: "card-warm",     color: "#fbbf24" };
    if (t >= 20) return { label: "😊 Moderate",  cls: "card-moderate", color: "#38bdf8" };
    return             { label: "🧊 Cool",       cls: "card-cool",     color: "#93c5fd" };
  }

  function getHumProfile(h) {
    if (h < 35)  return { label: "🏜 Dry",          color: "#fb923c" };
    if (h <= 65) return { label: "🌿 Comfortable",  color: "#34d399" };
    return              { label: "🌫 Humid",         color: "#38bdf8" };
  }

  function getAqiProfile(a) {
    if (a <= 50)  return { label: "✅ Good",            color: "#34d399" };
    if (a <= 100) return { label: "⚠️ Moderate",       color: "#fbbf24" };
    if (a <= 200) return { label: "🚫 Unhealthy",      color: "#f87171" };
    return               { label: "☠️ Very Unhealthy", color: "#a78bfa" };
  }

  // ──────────────────────────────────────────────────────────────────
  // WEATHER MODE
  // ──────────────────────────────────────────────────────────────────
  function applyWeatherMode(dayNight, rain) {
    let mode = "cloudy";
    if (rain === "Raining")      mode = "rainy";
    else if (dayNight === "Bright") mode = "sunny";
    else if (dayNight === "Dark")   mode = "night";
    if (mode !== state.weatherMode) {
      state.weatherMode = mode;
      document.body.dataset.weather = mode;
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // RAIN DROPS
  // ──────────────────────────────────────────────────────────────────
  function syncRain(isRaining) {
    if (!dom.rainLayer || isRaining === state.rainActive) return;
    state.rainActive = isRaining;
    if (isRaining && !LITE_MODE) {
      const frag = document.createDocumentFragment();
      for (let i = 0; i < RAIN_DROPS; i++) {
        const d = document.createElement("div");
        d.className = "raindrop";
        d.style.left             = `${Math.random() * 100}%`;
        d.style.height           = `${10 + Math.random() * 14}px`;
        d.style.animationDuration  = `${0.6 + Math.random() * 0.7}s`;
        d.style.animationDelay     = `${-Math.random() * 2}s`;
        frag.appendChild(d);
      }
      dom.rainLayer.appendChild(frag);
      dom.rainLayer.classList.add("active");
    } else {
      dom.rainLayer.classList.remove("active");
      setTimeout(() => { dom.rainLayer.innerHTML = ""; }, 650);
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // FORECAST COMPUTATION
  // ──────────────────────────────────────────────────────────────────
  function computeForecast(temp, hum, rain) {
    const baseRainChance = rain === "Raining" ? 82 : clamp(38 + hum * 0.5, 5, 92);
    return {
      rainChance: round(baseRainChance),
      tempPred:   round(temp + (Math.random() * 1.6 - 0.8), 1),
      humPred:    round(clamp(hum + (Math.random() * 6 - 3), 0, 100), 1),
      wind:       round(Math.random() * 28, 1),
    };
  }

  // ──────────────────────────────────────────────────────────────────
  // SVG DONUT GAUGE  (no canvas, no sizing issues)
  // ──────────────────────────────────────────────────────────────────
  const SVG_NS = "http://www.w3.org/2000/svg";
  const GAUGE_R = 52;    // radius
  const GAUGE_CX = 64;   // centre x
  const GAUGE_CY = 64;   // centre y
  const GAUGE_STROKE = 12;
  const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_R;
  const GAUGE_GAP_DEG = 70;   // gap at bottom
  const GAUGE_ARC_FRAC = (360 - GAUGE_GAP_DEG) / 360;   // fraction of circle used

  /**
   * Create an SVG donut gauge inside containerId.
   * Returns { svgEl, arcEl, labelEl } for updates.
   */
  function createDonut(containerId, color) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 128 128");
    svg.setAttribute("width",   "128");
    svg.setAttribute("height",  "128");
    svg.style.display = "block";
    svg.style.margin  = "0 auto";

    // Rotation so the gap is at the bottom centre
    const rotate = `rotate(${90 + GAUGE_GAP_DEG / 2} ${GAUGE_CX} ${GAUGE_CY})`;

    // Track arc (background)
    const track = document.createElementNS(SVG_NS, "circle");
    track.setAttribute("cx", GAUGE_CX);
    track.setAttribute("cy", GAUGE_CY);
    track.setAttribute("r",  GAUGE_R);
    track.setAttribute("fill", "none");
    track.setAttribute("stroke", "rgba(255,255,255,0.07)");
    track.setAttribute("stroke-width", GAUGE_STROKE);
    track.setAttribute("stroke-linecap", "round");
    track.setAttribute("stroke-dasharray", `${GAUGE_CIRCUMFERENCE * GAUGE_ARC_FRAC} ${GAUGE_CIRCUMFERENCE}`);
    track.setAttribute("transform", rotate);
    svg.appendChild(track);

    // Value arc (foreground)
    const arc = document.createElementNS(SVG_NS, "circle");
    arc.setAttribute("cx", GAUGE_CX);
    arc.setAttribute("cy", GAUGE_CY);
    arc.setAttribute("r",  GAUGE_R);
    arc.setAttribute("fill", "none");
    arc.setAttribute("stroke", color);
    arc.setAttribute("stroke-width", GAUGE_STROKE);
    arc.setAttribute("stroke-linecap", "round");
    arc.setAttribute("stroke-dasharray", `0 ${GAUGE_CIRCUMFERENCE}`);
    arc.setAttribute("transform", rotate);
    if (!LITE_MODE) {
      arc.style.transition = "stroke-dasharray 0.6s cubic-bezier(0.4,0,0.2,1)";
    }
    svg.appendChild(arc);

    container.insertBefore(svg, container.firstChild);

    return { svgEl: svg, arcEl: arc };
  }

  function setDonut(handle, value, maxVal) {
    if (!handle) return;
    const fraction = clamp(value / maxVal, 0, 1);
    const len = fraction * GAUGE_CIRCUMFERENCE * GAUGE_ARC_FRAC;
    const gap = GAUGE_CIRCUMFERENCE - len;
    handle.arcEl.setAttribute("stroke-dasharray", `${len.toFixed(2)} ${gap.toFixed(2)}`);
  }

  // ──────────────────────────────────────────────────────────────────
  // SVG SPARKLINE
  // ──────────────────────────────────────────────────────────────────
  function createSparklineSVG(containerId, color) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 200 40");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.style.width  = "100%";
    svg.style.height = "40px";
    svg.style.display = "block";
    svg.style.marginTop = "8px";

    // Gradient fill
    const defs = document.createElementNS(SVG_NS, "defs");
    const gradId = `sg-${containerId}`;
    const grad = document.createElementNS(SVG_NS, "linearGradient");
    grad.setAttribute("id", gradId);
    grad.setAttribute("x1", "0"); grad.setAttribute("y1", "0");
    grad.setAttribute("x2", "0"); grad.setAttribute("y2", "1");
    const stop1 = document.createElementNS(SVG_NS, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", color);
    stop1.setAttribute("stop-opacity", "0.3");
    const stop2 = document.createElementNS(SVG_NS, "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", color);
    stop2.setAttribute("stop-opacity", "0");
    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);
    svg.appendChild(defs);

    const area = document.createElementNS(SVG_NS, "path");
    area.setAttribute("fill", `url(#${gradId})`);
    svg.appendChild(area);

    const line = document.createElementNS(SVG_NS, "polyline");
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", "1.5");
    line.setAttribute("stroke-linejoin", "round");
    line.setAttribute("stroke-linecap", "round");
    svg.appendChild(line);

    container.appendChild(svg);
    return { svgEl: svg, lineEl: line, areaEl: area };
  }

  function updateSparklineSVG(handle, values) {
    if (!handle || !values || values.length < 2) return;
    const n   = values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const W = 200, H = 40, pad = 2;
    const toX = i => ((i / (n - 1)) * (W - pad * 2) + pad).toFixed(1);
    const toY = v => (H - pad - ((v - min) / range) * (H - pad * 2)).toFixed(1);

    const pts = values.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
    handle.lineEl.setAttribute("points", pts);

    // closed path for area fill
    const areaPath = `M ${toX(0)},${H - pad} ` +
      values.map((v, i) => `L ${toX(i)},${toY(v)}`).join(" ") +
      ` L ${toX(n - 1)},${H - pad} Z`;
    handle.areaEl.setAttribute("d", areaPath);
  }

  // ──────────────────────────────────────────────────────────────────
  // HISTORY CHART  (Chart.js — needs explicit parent height)
  // ──────────────────────────────────────────────────────────────────
  function initHistoryChart() {
    if (!dom.cHistory) return;
    if (state.historyChart) return;
    if (typeof Chart === "undefined") {
      console.warn("[WeatherOS] Chart.js not available for history chart");
      return;
    }

    Chart.defaults.color = "#4a5880";
    Chart.defaults.font  = { family: "'Inter', sans-serif", size: 11 };

    state.historyChart = new Chart(dom.cHistory, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Temperature (°C)",
            data: [],
            borderColor: "#38bdf8",
            backgroundColor: "rgba(56,189,248,0.08)",
            borderWidth: 2,
            pointRadius: 2.5,
            pointBackgroundColor: "#38bdf8",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Humidity (%)",
            data: [],
            borderColor: "#34d399",
            backgroundColor: "rgba(52,211,153,0.06)",
            borderWidth: 2,
            pointRadius: 2.5,
            pointBackgroundColor: "#34d399",
            tension: 0.4,
            fill: true,
          },
          {
            label: "AQI",
            data: [],
            borderColor: "#f472b6",
            backgroundColor: "rgba(244,114,182,0.06)",
            borderWidth: 2,
            pointRadius: 2.5,
            pointBackgroundColor: "#f472b6",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        animation: LITE_MODE ? false : { duration: 500 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(13,16,32,0.92)",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            titleColor: "#f0f4ff",
            bodyColor: "#8896b3",
            padding: 12,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(255,255,255,0.04)" },
            ticks: { color: "#4a5880", maxTicksLimit: 8, font: { size: 10 } },
          },
          y: {
            grid: { color: "rgba(255,255,255,0.04)" },
            ticks: { color: "#4a5880", font: { size: 10 } },
          },
        },
      },
    });
  }

  function updateHistoryChart(rows) {
    if (!state.historyChart) return;
    const labels = rows.map(r => {
      const ts = r.timestamp;
      if (!ts) return "";
      const d = new Date(ts);
      return isNaN(d) ? "" : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    });
    state.historyChart.data.labels           = labels;
    state.historyChart.data.datasets[0].data = rows.map(r => r.temperature);
    state.historyChart.data.datasets[1].data = rows.map(r => r.humidity);
    state.historyChart.data.datasets[2].data = rows.map(r => r.aqi);
    state.historyChart.update(LITE_MODE ? "none" : "active");
  }

  // ──────────────────────────────────────────────────────────────────
  // INIT SVG WIDGETS (called once after DOM is ready)
  // ──────────────────────────────────────────────────────────────────
  const svgWidgets = {
    donuts: {
      rainChance: null,
      tempPred:   null,
      humPred:    null,
      wind:       null,
    },
    sparklines: {
      temp: null,
      hum:  null,
      aqi:  null,
    },
  };

  function initSvgWidgets() {
    svgWidgets.donuts.rainChance = createDonut("donut-rain-chance", "#818cf8");
    svgWidgets.donuts.tempPred   = createDonut("donut-temp-pred",   "#38bdf8");
    svgWidgets.donuts.humPred    = createDonut("donut-hum-pred",    "#34d399");
    svgWidgets.donuts.wind       = createDonut("donut-wind",        "#fbbf24");

    svgWidgets.sparklines.temp   = createSparklineSVG("sparkline-temp", "#38bdf8");
    svgWidgets.sparklines.hum    = createSparklineSVG("sparkline-hum",  "#34d399");
    svgWidgets.sparklines.aqi    = createSparklineSVG("sparkline-aqi",  "#f472b6");
  }

  // ──────────────────────────────────────────────────────────────────
  // RENDER LIVE DATA
  // ──────────────────────────────────────────────────────────────────
  function renderLive(reading) {
    const { temperature: temp, humidity: hum, aqi, day_night: dn, rain } = reading;

    applyWeatherMode(dn, rain);
    syncRain(rain === "Raining");

    setText(dom.updateTime, new Date().toLocaleTimeString([], {
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    }));

    // ── Hero snapshot ──
    const prevTemp = dom.snapTempVal?.textContent;
    setText(dom.snapTempVal, `${fmt1(temp)}°C`);
    setText(dom.snapHumVal,  `${round(hum)}%`);
    setText(dom.snapAqiVal,  `${round(aqi)}`);
    if (prevTemp !== dom.snapTempVal?.textContent) {
      animateValue(dom.snapTempVal);
      animateValue(dom.snapHumVal);
      animateValue(dom.snapAqiVal);
    }

    // ── Temp card ──
    const tProfile = getTempProfile(temp);
    setText(dom.tempValue, fmt1(temp));
    setText(dom.tempBadge, tProfile.label);
    if (dom.tempBar) dom.tempBar.style.width = `${clamp((temp / 50) * 100, 0, 100)}%`;
    animateValue(dom.tempValue);
    if (dom.cardTemp) {
      dom.cardTemp.classList.remove("card-hot", "card-warm", "card-moderate", "card-cool");
      dom.cardTemp.classList.add(tProfile.cls);
    }

    // ── Humidity card ──
    const hProfile = getHumProfile(hum);
    setText(dom.humValue, round(hum));
    setText(dom.humBadge, hProfile.label);
    if (dom.humBar) dom.humBar.style.width = `${clamp(hum, 0, 100)}%`;
    animateValue(dom.humValue);

    // ── AQI card ──
    const aProfile = getAqiProfile(aqi);
    setText(dom.aqiValue, round(aqi));
    setText(dom.aqiBadge, aProfile.label);
    if (dom.aqiBar) {
      dom.aqiBar.style.width      = `${clamp((aqi / 300) * 100, 0, 100)}%`;
      dom.aqiBar.style.background = `linear-gradient(90deg, ${aProfile.color}88, ${aProfile.color})`;
    }
    animateValue(dom.aqiValue);

    // ── Day/Night ──
    if (dom.dayNightIcon) dom.dayNightIcon.textContent  = dn === "Bright" ? "☀️" : "🌙";
    if (dom.dayNightLabel) dom.dayNightLabel.textContent = dn === "Bright" ? "Daytime" : "Night";

    // ── Rain ──
    if (dom.rainIcon)  dom.rainIcon.textContent  = rain === "Raining" ? "🌧" : "☀️";
    if (dom.rainLabel) dom.rainLabel.textContent = rain === "Raining" ? "Raining" : "Clear";

    // ── Forecast ──
    const f = computeForecast(temp, hum, rain);
    setText(dom.rainChanceVal, `${f.rainChance}%`);
    setText(dom.tempPredVal,   `${fmt1(f.tempPred)}`);
    setText(dom.tempPredBadge, getTempProfile(f.tempPred).label);
    setText(dom.humPredVal,    `${round(f.humPred)}`);
    setText(dom.humPredBadge,  getHumProfile(f.humPred).label);
    setText(dom.windVal,       `${f.wind}`);

    // ── SVG Donuts ──
    setDonut(svgWidgets.donuts.rainChance, f.rainChance, 100);
    setDonut(svgWidgets.donuts.tempPred,   f.tempPred,   50);
    setDonut(svgWidgets.donuts.humPred,    f.humPred,    100);
    setDonut(svgWidgets.donuts.wind,       f.wind,       50);

    // ── Accumulated sparkline data ──
    state.historyRows.push(reading);
    if (state.historyRows.length > 20) state.historyRows.shift();
    updateSparklineSVG(svgWidgets.sparklines.temp, state.historyRows.map(r => r.temperature));
    updateSparklineSVG(svgWidgets.sparklines.hum,  state.historyRows.map(r => r.humidity));
    updateSparklineSVG(svgWidgets.sparklines.aqi,  state.historyRows.map(r => r.aqi));
  }

  // ──────────────────────────────────────────────────────────────────
  // DATA FETCHING
  // ──────────────────────────────────────────────────────────────────
  async function fetchLive() {
    if (state.isFetchingLive || document.visibilityState === "hidden") return;
    state.isFetchingLive = true;
    setStatus("loading", "Fetching…");

    try {
      const res  = await fetch(CFG.LIVE_ENDPOINT, { cache: "no-store" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      if (!json.data) throw new Error("Empty data from server.");

      state.latest = json.data;
      state.hasEverSucceeded = true;
      state.consecutiveFailures = 0;
      hideError();
      setStatus("online", "Live · Connected");
      renderLive(json.data);

    } catch (err) {
      state.consecutiveFailures++;
      console.error("[WeatherOS] fetchLive error:", err);
      showError(err.message || "Connection issue. Retrying…");
    } finally {
      state.isFetchingLive = false;
    }
  }

  async function fetchHistory() {
    if (state.isFetchingHistory) return;
    state.isFetchingHistory = true;
    try {
      const res  = await fetch(CFG.HISTORY_ENDPOINT, { cache: "no-store" });
      if (!res.ok) { console.warn("[WeatherOS] history HTTP", res.status); return; }
      const json = await res.json();
      if (!Array.isArray(json.data) || !json.data.length) return;
      updateHistoryChart(json.data);
      // Also warm up sparklines with real history data
      updateSparklineSVG(svgWidgets.sparklines.temp, json.data.map(r => r.temperature));
      updateSparklineSVG(svgWidgets.sparklines.hum,  json.data.map(r => r.humidity));
      updateSparklineSVG(svgWidgets.sparklines.aqi,  json.data.map(r => r.aqi));
    } catch (err) {
      console.warn("[WeatherOS] fetchHistory error:", err);
    } finally {
      state.isFetchingHistory = false;
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // NAVIGATION
  // ──────────────────────────────────────────────────────────────────
  function setActiveNav(section) {
    dom.navLinks.forEach(a  => a.classList.toggle("active", a.dataset.section === section));
    dom.mobileLinks.forEach(a => a.classList.toggle("active", a.dataset.section === section));
  }

  function initNav() {
    [...dom.navLinks, ...dom.mobileLinks].forEach(link => {
      link.addEventListener("click", () => {
        const s = link.dataset.section;
        if (s) setActiveNav(s);
        closeMobileMenu();
      });
    });

    const sections = document.querySelectorAll("section[id]");
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveNav(e.target.id); }),
      { threshold: 0.4, rootMargin: "-10% 0px -40% 0px" }
    );
    sections.forEach(s => io.observe(s));

    window.addEventListener("scroll", () => {
      dom.topbar?.classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });
  }

  // ──────────────────────────────────────────────────────────────────
  // MOBILE MENU
  // ──────────────────────────────────────────────────────────────────
  function openMobileMenu() {
    dom.mobileMenu?.classList.add("open");
    dom.menuBackdrop?.classList.add("visible");
    dom.hamburger?.classList.add("open");
    setAttr(dom.hamburger, "aria-expanded", "true");
  }
  function closeMobileMenu() {
    dom.mobileMenu?.classList.remove("open");
    dom.menuBackdrop?.classList.remove("visible");
    dom.hamburger?.classList.remove("open");
    setAttr(dom.hamburger, "aria-expanded", "false");
  }
  function initMobileMenu() {
    dom.hamburger?.addEventListener("click", () =>
      dom.mobileMenu?.classList.contains("open") ? closeMobileMenu() : openMobileMenu()
    );
    dom.mobileClose?.addEventListener("click", closeMobileMenu);
    dom.menuBackdrop?.addEventListener("click", closeMobileMenu);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeMobileMenu(); });
  }

  // ──────────────────────────────────────────────────────────────────
  // FEEDBACK FORM
  // ──────────────────────────────────────────────────────────────────
  function initFeedbackForm() {
    const form = dom.feedbackForm;
    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = dom.fbSubmit;
      if (btn) { btn.disabled = true; btn.querySelector(".submit-text").textContent = "Sending…"; }
      try {
        const res = await fetch(form.action, { method: "POST", body: new FormData(form) });
        if (res.ok) {
          form.reset();
          if (dom.formSuccess) dom.formSuccess.hidden = false;
        } else {
          alert("Failed to send. Please try again.");
        }
      } catch {
        alert("Network error. Please check your connection.");
      } finally {
        if (btn) { btn.disabled = false; btn.querySelector(".submit-text").textContent = "Send Feedback"; }
      }
    });
  }

  // ──────────────────────────────────────────────────────────────────
  // ERROR DISMISS
  // ──────────────────────────────────────────────────────────────────
  function initErrorDismiss() {
  }

  // ──────────────────────────────────────────────────────────────────
  // ENTRY POINT
  // ──────────────────────────────────────────────────────────────────
  async function init() {
    initNav();
    initMobileMenu();
    initErrorDismiss();
    initFeedbackForm();

    // Create all SVG widgets (no canvas sizing issues)
    initSvgWidgets();

    // Init history chart (needs Chart.js)
    initHistoryChart();

    // First live fetch
    await fetchLive();

    // Load historical data for history chart + warm up sparklines
    fetchHistory();

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") fetchLive();
    });

    setInterval(fetchLive,    CFG.REFRESH_MS);
    setInterval(fetchHistory, CFG.HISTORY_MS);
  }

  init();

})();
