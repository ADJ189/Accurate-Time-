const WMO: Record<number, [string, string]> = {
  0:['☀️','Clear'], 1:['🌤','Mostly clear'], 2:['⛅','Partly cloudy'], 3:['☁️','Overcast'],
  45:['🌫','Foggy'], 48:['🌫','Icy fog'],
  51:['🌦','Light drizzle'], 53:['🌦','Drizzle'], 55:['🌧','Heavy drizzle'],
  61:['🌧','Light rain'], 63:['🌧','Rain'], 65:['🌧','Heavy rain'],
  71:['🌨','Light snow'], 73:['🌨','Snow'], 75:['🌨','Heavy snow'],
  80:['🌦','Showers'], 81:['🌧','Rain showers'], 82:['🌧','Heavy showers'],
  95:['⛈','Thunderstorm'], 96:['⛈','Thunderstorm+hail'], 99:['⛈','Heavy thunderstorm'],
};

let refreshTimer = 0;

export async function initWeather(
  iconEl: HTMLElement,
  textEl: HTMLElement,
  pillEl: HTMLElement,
  privacyCheck: () => boolean = () => false,
) {
  if (privacyCheck()) return;

  const show = (icon: string, text: string, title = '') => {
    iconEl.textContent = icon;
    textEl.textContent = text;
    if (title) pillEl.title = title;
    pillEl.classList.add('loaded');
  };

  const fetchWeather = () => {
    if (privacyCheck()) return;
    if (!navigator.geolocation) { show('🌡', '—', 'No geolocation'); return; }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude: lat, longitude: lon } }) => {
        try {
          const url = `https://api.open-meteo.com/v1/forecast`
            + `?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}`
            + `&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m`
            + `&temperature_unit=celsius&windspeed_unit=kmh&timezone=auto`;
          const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
          const data = await res.json();
          const cur = data.current;
          const [icon, desc] = WMO[cur.weathercode as number] ?? ['🌡', 'Unknown'];
          const temp = Math.round(cur.temperature_2m);
          const feels = Math.round(cur.apparent_temperature);
          const wind = Math.round(cur.windspeed_10m);
          // Main display: icon + temp
          show(icon, `${temp}°`, `${desc} · Feels ${feels}° · Wind ${wind} km/h`);
        } catch {
          show('🌡', '—', 'Weather unavailable');
        }
      },
      () => show('🌡', '—', 'Location denied'),
      { timeout: 10000, maximumAge: 300_000 },
    );
  };

  fetchWeather();
  // Refresh every 15 minutes
  clearInterval(refreshTimer);
  refreshTimer = window.setInterval(() => {
    if (!privacyCheck()) fetchWeather();
  }, 15 * 60_000);
}

export function stopWeather() {
  clearInterval(refreshTimer);
}
