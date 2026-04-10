const url = "https://docs.google.com/spreadsheets/d/1m2V6q2xVZ0e2UP-XETuEZC9om58S21KiGZoWwpUi59Q/gviz/tq?tqx=out:json";

const DAY_SKY_ICON = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="Day cloudy icon">
    <circle cx="36" cy="36" r="20" fill="#fcd34d"/>
    <g stroke="#fbbf24" stroke-width="4" stroke-linecap="round">
      <line x1="36" y1="8" x2="36" y2="0"/>
      <line x1="36" y1="72" x2="36" y2="80"/>
      <line x1="8" y1="36" x2="0" y2="36"/>
      <line x1="72" y1="36" x2="80" y2="36"/>
      <line x1="15" y1="15" x2="9" y2="9"/>
      <line x1="57" y1="57" x2="63" y2="63"/>
      <line x1="57" y1="15" x2="63" y2="9"/>
      <line x1="15" y1="57" x2="9" y2="63"/>
    </g>
    <g>
      <ellipse cx="64" cy="75" rx="30" ry="17" fill="#f8fafc"/>
      <ellipse cx="85" cy="77" rx="20" ry="13" fill="#ffffff"/>
      <ellipse cx="45" cy="79" rx="18" ry="12" fill="#eef2ff"/>
    </g>
  </svg>`
)}`;

const NIGHT_SKY_ICON = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="Night cloudy icon">
    <circle cx="84" cy="32" r="15" fill="#fde68a"/>
    <circle cx="90" cy="28" r="15" fill="#0f172a"/>
    <g fill="#f8fafc">
      <polygon points="22,20 24,26 30,28 24,30 22,36 20,30 14,28 20,26"/>
      <polygon points="50,18 51,22 55,23 51,24 50,28 49,24 45,23 49,22"/>
      <polygon points="99,52 100,56 104,57 100,58 99,62 98,58 94,57 98,56"/>
    </g>
    <g>
      <ellipse cx="60" cy="75" rx="30" ry="17" fill="#334155"/>
      <ellipse cx="82" cy="78" rx="20" ry="13" fill="#475569"/>
      <ellipse cx="42" cy="80" rx="18" ry="12" fill="#1e293b"/>
    </g>
  </svg>`
)}`;

const RAIN_WEATHER_ICON = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="Rain icon">
    <g>
      <ellipse cx="60" cy="46" rx="30" ry="17" fill="#e2e8f0"/>
      <ellipse cx="80" cy="49" rx="20" ry="13" fill="#f8fafc"/>
      <ellipse cx="42" cy="51" rx="18" ry="12" fill="#cbd5e1"/>
    </g>
    <g fill="#38bdf8">
      <path d="M42 70c4 6 4 12 0 16-4-4-4-10 0-16z"/>
      <path d="M60 72c4 6 4 12 0 16-4-4-4-10 0-16z"/>
      <path d="M78 70c4 6 4 12 0 16-4-4-4-10 0-16z"/>
    </g>
  </svg>`
)}`;

const CLEAR_WEATHER_ICON = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="Clear weather icon">
    <circle cx="60" cy="60" r="21" fill="#facc15"/>
    <g stroke="#f59e0b" stroke-width="5" stroke-linecap="round">
      <line x1="60" y1="14" x2="60" y2="0"/>
      <line x1="60" y1="120" x2="60" y2="106"/>
      <line x1="14" y1="60" x2="0" y2="60"/>
      <line x1="120" y1="60" x2="106" y2="60"/>
      <line x1="26" y1="26" x2="16" y2="16"/>
      <line x1="104" y1="104" x2="94" y2="94"/>
      <line x1="26" y1="94" x2="16" y2="104"/>
      <line x1="104" y1="16" x2="94" y2="26"/>
    </g>
  </svg>`
)}`;

const dom = {
  temp: document.getElementById("temp"),
  tempMood: document.getElementById("tempMood"),
  tempCard: document.getElementById("tempCard"),
  hum: document.getElementById("hum"),
  humBar: document.getElementById("humBar"),
  humBars: document.getElementById("humBars"),
  humValueIcon: document.getElementById("humValueIcon"),
  humLabel: document.getElementById("humLabel"),
  humEmoji: document.getElementById("humEmoji"),
  humCard: document.getElementById("humCard"),
  aqi: document.getElementById("aqi"),
  sunImg: document.getElementById("sunImg"),
  sunText: document.getElementById("sunText"),
  rainImg: document.getElementById("rainImg"),
  rainText: document.getElementById("rainText"),
  snapshotUpdated: document.getElementById("snapshotUpdated"),
  tempVizFill: document.getElementById("tempVizFill"),
  tempVizValue: document.getElementById("tempVizValue"),
  tempVizState: document.getElementById("tempVizState"),
  humVizFill: document.getElementById("humVizFill"),
  humVizValue: document.getElementById("humVizValue"),
  humVizState: document.getElementById("humVizState"),
  aqiVizFill: document.getElementById("aqiVizFill"),
  aqiVizValue: document.getElementById("aqiVizValue"),
  aqiVizState: document.getElementById("aqiVizState"),
  rainEffect: document.getElementById("rainEffect"),
  rainChanceVal: document.getElementById("rainChanceVal"),
  tempPredVal: document.getElementById("tempPredVal"),
  tempPredMood: document.getElementById("tempPredMood"),
  tempPredCard: document.getElementById("tempPredCard"),
  humPredVal: document.getElementById("humPredVal"),
  humPredBar: document.getElementById("humPredBar"),
  humPredBars: document.getElementById("humPredBars"),
  humPredValueIcon: document.getElementById("humPredValueIcon"),
  humPredLabel: document.getElementById("humPredLabel"),
  humPredCard: document.getElementById("humPredCard"),
  windPredVal: document.getElementById("windPredVal"),
  tChart: document.getElementById("tChart"),
  hChart: document.getElementById("hChart"),
  rainChance: document.getElementById("rainChance"),
  tempPred: document.getElementById("tempPred"),
  humPred: document.getElementById("humPred"),
  windPred: document.getElementById("windPred")
};

const charts = {
  tChart: null,
  hChart: null,
  rainChart: null,
  tempChart2: null,
  humChart2: null,
  windChart: null
};

let rainActive = false;
let isFetching = false;
let uiFrameQueued = false;
let pendingState = null;
let weatherMode = "";
const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const isMobileDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

function detectPerformanceMode() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowCpu = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2;
  const lowMemory = typeof navigator.deviceMemory === "number" && navigator.deviceMemory > 0 && navigator.deviceMemory <= 2;
  const saveData = typeof navigator.connection === "object" && navigator.connection?.saveData === true;

  return prefersReducedMotion || lowCpu || lowMemory || saveData;
}

const perfLite = detectPerformanceMode();
const mobileLite = isMobileDevice || perfLite;
const UPDATE_INTERVAL_MS = mobileLite ? 10000 : 5000;

async function loadChartLibraryIfNeeded() {
  if (mobileLite) {
    return false;
  }

  if (typeof Chart !== "undefined") {
    return true;
  }

  return new Promise((resolve) => {
    const existing = document.querySelector('script[data-chartjs-loader="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.async = true;
    script.dataset.chartjsLoader = "true";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

function initLiquidGlass() {
  if (mobileLite || !canTilt) {
    return;
  }

  const glassElements = document.querySelectorAll(".top-nav, .dashboard-section, .card, .side-drawer");

  glassElements.forEach((element) => {
    const isCard = element.classList.contains("card");
    let rafId = 0;
    let pendingEvent = null;

    element.style.setProperty("--pointer-x", "50%");
    element.style.setProperty("--pointer-y", "50%");
    if (isCard) {
      element.style.setProperty("--tilt-x", "0deg");
      element.style.setProperty("--tilt-y", "0deg");
    }

    const paintPointer = () => {
      if (!pendingEvent) {
        rafId = 0;
        return;
      }

      const rect = element.getBoundingClientRect();
      const x = ((pendingEvent.clientX - rect.left) / rect.width) * 100;
      const y = ((pendingEvent.clientY - rect.top) / rect.height) * 100;

      element.style.setProperty("--pointer-x", `${x}%`);
      element.style.setProperty("--pointer-y", `${y}%`);

      if (isCard && canTilt) {
        const tiltX = ((50 - y) / 50) * 4;
        const tiltY = ((x - 50) / 50) * 4;
        element.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
        element.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
      }

      pendingEvent = null;
      rafId = 0;
    };

    element.addEventListener(
      "pointermove",
      (event) => {
        pendingEvent = event;
        if (!rafId) {
          rafId = requestAnimationFrame(paintPointer);
        }
      },
      { passive: true }
    );

    element.addEventListener("pointerleave", () => {
      pendingEvent = null;
      element.style.setProperty("--pointer-x", "50%");
      element.style.setProperty("--pointer-y", "50%");
      if (isCard) {
        element.style.setProperty("--tilt-x", "0deg");
        element.style.setProperty("--tilt-y", "0deg");
      }
    });
  });
}

function initCursorZoom() {
  if (!canTilt) {
    return;
  }

  const zoomTargets = document.querySelectorAll(".hero h1, .section-head h2, .switch-btn, .side-link, .feedback-form button");

  zoomTargets.forEach((element) => {
    const isHeading = element.matches(".hero h1");
    let rafId = 0;
    let pendingEvent = null;

    element.style.setProperty("--cursor-x", "50%");
    element.style.setProperty("--cursor-y", "50%");
    if (isHeading) {
      element.style.setProperty("--heading-tilt-x", "0deg");
      element.style.setProperty("--heading-tilt-y", "0deg");
    }

    const paintPointer = () => {
      if (!pendingEvent) {
        rafId = 0;
        return;
      }

      const rect = element.getBoundingClientRect();
      const x = ((pendingEvent.clientX - rect.left) / rect.width) * 100;
      const y = ((pendingEvent.clientY - rect.top) / rect.height) * 100;

      element.style.setProperty("--cursor-x", `${x}%`);
      element.style.setProperty("--cursor-y", `${y}%`);

      if (isHeading) {
        const tiltX = ((50 - y) / 50) * 3;
        const tiltY = ((x - 50) / 50) * 5;
        element.style.setProperty("--heading-tilt-x", `${tiltX.toFixed(2)}deg`);
        element.style.setProperty("--heading-tilt-y", `${tiltY.toFixed(2)}deg`);
      }

      pendingEvent = null;
      rafId = 0;
    };

    element.addEventListener(
      "pointermove",
      (event) => {
        pendingEvent = event;
        if (!rafId) {
          rafId = requestAnimationFrame(paintPointer);
        }
      },
      { passive: true }
    );

    element.addEventListener("pointerleave", () => {
      pendingEvent = null;
      element.style.setProperty("--cursor-x", "50%");
      element.style.setProperty("--cursor-y", "50%");
      if (isHeading) {
        element.style.setProperty("--heading-tilt-x", "0deg");
        element.style.setProperty("--heading-tilt-y", "0deg");
      }
    });
  });
}

function initSidebar() {
  const toggle = document.getElementById("sidebarToggle");
  const closeBtn = document.getElementById("sidebarClose");
  const overlay = document.getElementById("sideOverlay");
  const links = document.querySelectorAll(".side-link");
  const topLinks = document.querySelectorAll(".nav-split-link");

  if (!toggle || !closeBtn || !overlay) {
    return;
  }

  const setActiveLinkByHash = (hash) => {
    if (!hash) {
      return;
    }

    links.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === hash);
    });

    topLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === hash);
    });
  };

  const openDrawer = () => {
    document.body.classList.add("drawer-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  const closeDrawer = () => {
    document.body.classList.remove("drawer-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const toggleDrawer = () => {
    if (document.body.classList.contains("drawer-open")) {
      closeDrawer();
      return;
    }
    openDrawer();
  };

  toggle.addEventListener("click", toggleDrawer);
  closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  links.forEach((link) => {
    link.addEventListener("click", () => {
      setActiveLinkByHash(link.getAttribute("href"));
      closeDrawer();
    });
  });

  const sections = Array.from(document.querySelectorAll("section[id]"));
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        setActiveLinkByHash(`#${entry.target.id}`);
      });
    },
    {
      threshold: 0.52,
      rootMargin: "-10% 0px -35% 0px"
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  setActiveLinkByHash(window.location.hash || "#live-data");

  window.addEventListener("hashchange", () => {
    setActiveLinkByHash(window.location.hash || "#live-data");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawer();
    }
  });
}

function syncSwitchWithHash(hash) {
  const livePanel = document.getElementById("live-data");
  const forecastPanel = document.getElementById("forecasting");
  const switchButtons = document.querySelectorAll(".switch-btn");

  if (!livePanel || !forecastPanel || !switchButtons.length) {
    return;
  }

  const target = hash === "#forecasting" ? "forecasting" : "live-data";
  livePanel.classList.toggle("is-hidden", target !== "live-data");
  forecastPanel.classList.toggle("is-hidden", target !== "forecasting");

  switchButtons.forEach((button) => {
    const isActive = button.dataset.target === target;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function initViewSwitch() {
  const switchButtons = document.querySelectorAll(".switch-btn");
  if (!switchButtons.length) {
    return;
  }

  const applyFromHash = () => {
    const currentHash = window.location.hash || "#live-data";
    syncSwitchWithHash(currentHash);
  };

  switchButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const target = button.dataset.target;
      if (!target) {
        return;
      }

      const nextHash = `#${target}`;
      if (history.pushState) {
        history.pushState(null, null, nextHash);
        syncSwitchWithHash(nextHash);
      } else {
        window.location.hash = nextHash;
      }
    });
  });

  applyFromHash();

  window.addEventListener("hashchange", applyFromHash);
}

function initModernAnimations() {
  if (mobileLite) {
    return;
  }

  const cards = document.querySelectorAll(".card");
  if (!cards.length) {
    return;
  }

  document.body.classList.add("js-motion");

  cards.forEach((card, index) => {
    card.style.setProperty("--card-delay", `${Math.min(index * 55, 420)}ms`);
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  cards.forEach((card) => observer.observe(card));
}

async function getData() {
  const res = await fetch(url, { cache: "no-store" });
  const txt = await res.text();
  const json = JSON.parse(txt.substring(47, txt.length - 2));
  return json.table.rows || [];
}

function gauge(ctx, val, max, color) {
  if (typeof Chart === "undefined" || !ctx) {
    return null;
  }

  return new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [val, max - val],
          backgroundColor: [color, "#222"],
          borderWidth: 0
        }
      ]
    },
    options: {
      animation: false,
      cutout: "70%",
      plugins: { legend: { display: false } }
    }
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toNumber(value, fallback = 0) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.+-]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : fallback;
  }

  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function updateTextDiff(el, text) {
  if (!el) {
    return false;
  }

  const next = String(text);
  if (el.textContent !== next) {
    el.textContent = next;
    return true;
  }

  return false;
}

function updateSrcDiff(el, src) {
  if (!el || el.src === src) {
    return false;
  }
  el.src = src;
  return true;
}

function updateBorderDiff(el, border) {
  if (!el || el.style.border === border) {
    return;
  }
  el.style.border = border;
}

function triggerAnimationClass(el, className) {
  if (!el) {
    return;
  }

  el.classList.remove(className);
  requestAnimationFrame(() => {
    el.classList.add(className);
  });
}

function resolveWeatherMode(state) {
  if (state.rain === "Raining") {
    return "rainy";
  }

  if (state.sun === "Bright") {
    return "sunny";
  }

  if (state.sun === "Dark") {
    return "night";
  }

  return "cloudy";
}

function applyWeatherMode(state) {
  const nextMode = resolveWeatherMode(state);
  if (weatherMode === nextMode) {
    return;
  }

  weatherMode = nextMode;
  document.body.dataset.weather = nextMode;
}

function applyAqiEffect(aqi) {
  if (!dom.aqi) {
    return;
  }

  dom.aqi.classList.toggle("aqi-warning", aqi >= 100 && aqi < 200);
  dom.aqi.classList.toggle("aqi-critical", aqi >= 200);
}

function applyAqiColorScale(aqi) {
  if (!dom.aqi) {
    return;
  }

  const safeAqi = clamp(aqi, 0, 300);
  const hue = 120 - (safeAqi / 300) * 120;
  const ringColor = `hsl(${hue.toFixed(0)} 88% 52%)`;
  const glowColor = `hsla(${hue.toFixed(0)}, 92%, 58%, 0.46)`;

  dom.aqi.style.border = `3px solid ${ringColor}`;
  dom.aqi.style.background = `radial-gradient(circle at 34% 28%, hsla(${hue.toFixed(0)}, 95%, 62%, 0.34), rgba(0, 0, 0, 0.45) 66%)`;
  dom.aqi.style.boxShadow = `inset 0 0 20px rgba(0,0,0,0.5), 0 0 16px ${glowColor}, 0 6px 16px rgba(0,0,0,0.32)`;
}

function getTempProfile(temp) {
  if (temp >= 34) {
    return { emoji: "🔥", label: "Hot", className: "temp-hot" };
  }

  if (temp >= 22) {
    return { emoji: "😎", label: "Moderate", className: "temp-moderate" };
  }

  return { emoji: "🧊", label: "Cool", className: "temp-cool" };
}

function applyTempProfile(temp, moodEl, cardEl) {
  const profile = getTempProfile(temp);

  if (updateTextDiff(moodEl, `${profile.emoji} ${profile.label}`)) {
    triggerAnimationClass(moodEl, "value-bounce");
  }

  if (!cardEl) {
    return;
  }

  cardEl.classList.remove("temp-hot", "temp-moderate", "temp-cool");
  cardEl.classList.add(profile.className);
}

function getHumidityProfile(humidity) {
  if (humidity < 35) {
    return { emoji: "🏜", label: "Dry", className: "humidity-dry" };
  }

  if (humidity <= 65) {
    return { emoji: "🌿", label: "Comfort", className: "humidity-comfort" };
  }

  return { emoji: "🌫", label: "Humid", className: "humidity-humid" };
}

function getAqiProfile(aqi) {
  if (aqi <= 50) {
    return { label: "Good", accent: "#22c55e", fill: "linear-gradient(90deg, #22c55e, #4ade80)" };
  }

  if (aqi <= 100) {
    return { label: "Moderate", accent: "#f59e0b", fill: "linear-gradient(90deg, #f59e0b, #fbbf24)" };
  }

  if (aqi <= 200) {
    return { label: "Unhealthy", accent: "#ef4444", fill: "linear-gradient(90deg, #ef4444, #fb7185)" };
  }

  return { label: "Very Unhealthy", accent: "#a855f7", fill: "linear-gradient(90deg, #a855f7, #c084fc)" };
}

function setSnapshotRow(fillEl, valueEl, stateEl, options) {
  if (fillEl) {
    fillEl.style.width = `${options.percent}%`;
    fillEl.style.background = options.fill;
  }

  if (valueEl) {
    valueEl.textContent = options.valueText;
  }

  if (stateEl) {
    stateEl.textContent = options.stateText;
    stateEl.style.borderColor = `${options.accent}80`;
    stateEl.style.background = `${options.accent}26`;
    stateEl.style.color = options.accent;
  }
}

function updateSnapshotMetrics(temp, hum, aqi) {
  const safeTemp = clamp(temp, 0, 50);
  const safeHum = clamp(hum, 0, 100);
  const safeAqi = clamp(aqi, 0, 300);

  const tempProfile = getTempProfile(safeTemp);
  const humProfile = getHumidityProfile(safeHum);
  const aqiProfile = getAqiProfile(safeAqi);

  setSnapshotRow(dom.tempVizFill, dom.tempVizValue, dom.tempVizState, {
    percent: Math.round((safeTemp / 50) * 100),
    valueText: `${Math.round(safeTemp)}°C`,
    stateText: tempProfile.label,
    fill: safeTemp >= 34 ? "linear-gradient(90deg, #fb7185, #ef4444)" : safeTemp >= 22 ? "linear-gradient(90deg, #facc15, #f59e0b)" : "linear-gradient(90deg, #38bdf8, #0ea5e9)",
    accent: safeTemp >= 34 ? "#fb7185" : safeTemp >= 22 ? "#f59e0b" : "#38bdf8"
  });

  setSnapshotRow(dom.humVizFill, dom.humVizValue, dom.humVizState, {
    percent: Math.round(safeHum),
    valueText: `${Math.round(safeHum)}%`,
    stateText: humProfile.label,
    fill: safeHum < 35 ? "linear-gradient(90deg, #fb923c, #f97316)" : safeHum <= 65 ? "linear-gradient(90deg, #2dd4bf, #14b8a6)" : "linear-gradient(90deg, #38bdf8, #2563eb)",
    accent: safeHum < 35 ? "#fb923c" : safeHum <= 65 ? "#2dd4bf" : "#38bdf8"
  });

  setSnapshotRow(dom.aqiVizFill, dom.aqiVizValue, dom.aqiVizState, {
    percent: Math.round((safeAqi / 300) * 100),
    valueText: `${Math.round(safeAqi)}`,
    stateText: aqiProfile.label,
    fill: aqiProfile.fill,
    accent: aqiProfile.accent
  });

  if (dom.snapshotUpdated) {
    const now = new Date();
    dom.snapshotUpdated.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
}

function updateHumidityBars(container, humidity) {
  if (!container) {
    return;
  }

  const bars = container.querySelectorAll("span");
  if (!bars.length) {
    return;
  }

  const activeCount = Math.max(1, Math.round((humidity / 100) * bars.length));
  bars.forEach((bar, index) => {
    bar.classList.toggle("active", index < activeCount);
  });
}

function applyHumidityProfile(humidity, options = {}) {
  const safeHumidity = clamp(humidity, 0, 100);
  const hue = 35 + (safeHumidity / 100) * 165;
  const startHue = Math.max(24, hue - 28);
  const profile = getHumidityProfile(safeHumidity);

  if (options.fillEl) {
    options.fillEl.style.width = `${safeHumidity}%`;
    options.fillEl.style.background = `linear-gradient(90deg, hsl(${startHue.toFixed(0)} 90% 58%), hsl(${hue.toFixed(0)} 88% 56%))`;
  }

  updateHumidityBars(options.barsEl, safeHumidity);

  if (options.labelEl && updateTextDiff(options.labelEl, `${profile.emoji} ${profile.label}`)) {
    triggerAnimationClass(options.labelEl, "value-bounce");
  }

  if (options.emojiEl && updateTextDiff(options.emojiEl, profile.emoji)) {
    triggerAnimationClass(options.emojiEl, "icon-pop");
  }

  if (!options.cardEl) {
    return;
  }

  options.cardEl.classList.remove("humidity-dry", "humidity-comfort", "humidity-humid");
  options.cardEl.classList.add(profile.className);
}

function applyForecastEffects(forecastData) {
  if (dom.windPredVal) {
    dom.windPredVal.classList.toggle("wind-alert", forecastData.wind >= 22);
  }

  if (dom.humPredVal) {
    dom.humPredVal.classList.toggle("humid-alert", forecastData.humPred >= 80);
  }
}

function setRainDrops(count) {
  if (!dom.rainEffect) {
    return;
  }

  const currentDrops = dom.rainEffect.children.length;
  if (currentDrops < count) {
    const fragment = document.createDocumentFragment();
    for (let i = currentDrops; i < count; i += 1) {
      const drop = document.createElement("div");
      drop.className = "drop";
      drop.style.left = `${Math.random() * 100}%`;
      fragment.appendChild(drop);
    }
    dom.rainEffect.appendChild(fragment);
  } else if (currentDrops > count) {
    while (dom.rainEffect.children.length > count) {
      dom.rainEffect.removeChild(dom.rainEffect.lastChild);
    }
  }
}

function setRainState(isRaining) {
  if (!dom.rainEffect || rainActive === isRaining) {
    return;
  }

  rainActive = isRaining;
  if (isRaining) {
    if (mobileLite) {
      setRainDrops(0);
      dom.rainEffect.style.opacity = "0";
      return;
    }

    setRainDrops(perfLite ? 18 : 60);
    dom.rainEffect.style.opacity = "1";
  } else {
    dom.rainEffect.style.opacity = "0";
    dom.rainEffect.textContent = "";
  }
}

function forecast(temp, hum, rain) {
  return {
    rainChance: rain === "Raining" ? 80 : Math.min(40 + hum / 2, 90),
    tempPred: temp + (Math.random() * 2 - 1),
    humPred: hum + (Math.random() * 5 - 2),
    wind: Math.random() * 30
  };
}

function updateGauge(chart, value, max) {
  if (!chart) {
    return;
  }

  const safeValue = clamp(value, 0, max);
  const next = [safeValue, max - safeValue];
  const current = chart.data.datasets[0].data;

  if (current[0] !== next[0] || current[1] !== next[1]) {
    chart.data.datasets[0].data = next;
    chart.update("none");
  }
}

function ensureCharts(temp, hum, f) {
  if (mobileLite || typeof Chart === "undefined") {
    return;
  }

  if (!charts.tChart) {
    charts.tChart = gauge(dom.tChart, clamp(temp, 0, 50), 50, "#ff6b6b");
    charts.hChart = gauge(dom.hChart, clamp(hum, 0, 100), 100, "#22d3ee");
    charts.rainChart = gauge(dom.rainChance, clamp(f.rainChance, 0, 100), 100, "#4ecdc4");
    charts.tempChart2 = gauge(dom.tempPred, clamp(f.tempPred, 0, 50), 50, "#ff6b6b");
    charts.humChart2 = gauge(dom.humPred, clamp(f.humPred, 0, 100), 100, "#22d3ee");
    charts.windChart = gauge(dom.windPred, clamp(f.wind, 0, 50), 50, "#a29bfe");
    return;
  }

  updateGauge(charts.tChart, temp, 50);
  updateGauge(charts.hChart, hum, 100);
  updateGauge(charts.rainChart, f.rainChance, 100);
  updateGauge(charts.tempChart2, f.tempPred, 50);
  updateGauge(charts.humChart2, f.humPred, 100);
  updateGauge(charts.windChart, f.wind, 50);
}

function renderState(state) {
  applyWeatherMode(state);

  if (updateTextDiff(dom.temp, `${state.temp}°C`)) {
    triggerAnimationClass(dom.temp, "value-bounce");
  }

  if (updateTextDiff(dom.hum, `${state.hum}%`)) {
    triggerAnimationClass(dom.hum, "value-bounce");
  }

  if (updateTextDiff(dom.aqi, state.aqi)) {
    triggerAnimationClass(dom.aqi, "value-bounce");
  }

  applyAqiEffect(state.aqi);
  applyAqiColorScale(state.aqi);
  updateSnapshotMetrics(state.temp, state.hum, state.aqi);

  applyTempProfile(state.temp, dom.tempMood, dom.tempCard);
  applyHumidityProfile(state.hum, {
    fillEl: dom.humBar,
    barsEl: dom.humBars,
    labelEl: dom.humLabel,
    emojiEl: dom.humEmoji,
    valueIconEl: dom.humValueIcon,
    cardEl: dom.humCard
  });

  if (state.sun === "Bright") {
    if (updateSrcDiff(dom.sunImg, DAY_SKY_ICON)) {
      triggerAnimationClass(dom.sunImg, "icon-pop");
    }
    if (updateTextDiff(dom.sunText, "Day")) {
      triggerAnimationClass(dom.sunText, "value-bounce");
    }
  } else {
    if (updateSrcDiff(dom.sunImg, NIGHT_SKY_ICON)) {
      triggerAnimationClass(dom.sunImg, "icon-pop");
    }
    if (updateTextDiff(dom.sunText, "Night")) {
      triggerAnimationClass(dom.sunText, "value-bounce");
    }
  }

  if (state.rain === "Raining") {
    if (updateSrcDiff(dom.rainImg, RAIN_WEATHER_ICON)) {
      triggerAnimationClass(dom.rainImg, "icon-pop");
    }
    if (updateTextDiff(dom.rainText, "Raining")) {
      triggerAnimationClass(dom.rainText, "value-bounce");
    }
    setRainState(true);
  } else {
    if (updateSrcDiff(dom.rainImg, CLEAR_WEATHER_ICON)) {
      triggerAnimationClass(dom.rainImg, "icon-pop");
    }
    if (updateTextDiff(dom.rainText, "Clear")) {
      triggerAnimationClass(dom.rainText, "value-bounce");
    }
    setRainState(false);
  }

  if (updateTextDiff(dom.rainChanceVal, `${Math.round(state.forecast.rainChance)}%`)) {
    triggerAnimationClass(dom.rainChanceVal, "value-bounce");
  }
  if (updateTextDiff(dom.tempPredVal, `${Math.round(state.forecast.tempPred)}°C`)) {
    triggerAnimationClass(dom.tempPredVal, "value-bounce");
  }
  applyTempProfile(state.forecast.tempPred, dom.tempPredMood, dom.tempPredCard);

  if (updateTextDiff(dom.humPredVal, `${Math.round(state.forecast.humPred)}%`)) {
    triggerAnimationClass(dom.humPredVal, "value-bounce");
  }
  applyHumidityProfile(state.forecast.humPred, {
    fillEl: dom.humPredBar,
    barsEl: dom.humPredBars,
    labelEl: dom.humPredLabel,
    valueIconEl: dom.humPredValueIcon,
    cardEl: dom.humPredCard
  });

  if (updateTextDiff(dom.windPredVal, `${Math.round(state.forecast.wind)} km/h`)) {
    triggerAnimationClass(dom.windPredVal, "value-bounce");
  }

  applyForecastEffects(state.forecast);

  ensureCharts(state.temp, state.hum, state.forecast);
}

function scheduleRender(state) {
  pendingState = state;
  if (uiFrameQueued) {
    return;
  }

  uiFrameQueued = true;
  requestAnimationFrame(() => {
    uiFrameQueued = false;
    if (!pendingState) {
      return;
    }
    renderState(pendingState);
    pendingState = null;
  });
}

async function update() {
  if (document.visibilityState === "hidden") {
    return;
  }

  if (isFetching) {
    return;
  }

  isFetching = true;
  try {
    const rows = await getData();
    if (!rows.length) {
      return;
    }

    const r = rows[rows.length - 1];
    const temp = toNumber(r.c?.[1]?.v, 0);
    const hum = toNumber(r.c?.[2]?.v, 0);
    const aqi = toNumber(r.c?.[3]?.v, 0);
    const sun = r.c?.[4]?.v || "Dark";
    const rain = r.c?.[5]?.v || "Clear";

    scheduleRender({
      temp,
      hum,
      aqi,
      sun,
      rain,
      forecast: forecast(temp, hum, rain)
    });
  } catch (error) {
    console.error("Failed to update weather dashboard", error);
  } finally {
    isFetching = false;
  }
}

async function bootstrap() {
  if (mobileLite) {
    document.body.classList.add("mobile-lite");
  }

  if (perfLite) {
    document.body.classList.add("perf-lite");
  }

  await loadChartLibraryIfNeeded();

  initLiquidGlass();
  initCursorZoom();
  initModernAnimations();
  initViewSwitch();
  initSidebar();

  update();

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      update();
    }
  });

  setInterval(update, UPDATE_INTERVAL_MS);
}

bootstrap();
