function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let date = new Date(response.data.time * 1000);
  let iconElement = document.querySelector("#icon");

  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;

  cityElement.innerHTML = response.data.city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
  temperatureElement.innerHTML = Math.round(temperature);

  getForecast(response.data.city);
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "b984974777eta0e26ff2f6c4c3ob0f17";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "b984974777eta0e26ff2f6c4c3ob0f17";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 6) {
      forecastHtml =
        forecastHtml +
        `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${formatDay(day.time)} </div>  
        <img src="${day.condition.icon_url}"class="weather-forecast-icon"
        </div>
        <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature">
            <strong>${Math.round(day.temperature.maximum)}º</strong>
          </div>
          <div class="weather-forecast-temperature"> ${Math.round(
            day.temperature.minimum
          )}º </div>
        </div>
      </div>
    `;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let celsiusElement = document.querySelector("#celsius-link");
celsiusElement.addEventListener("click", convertTemperature);

let fahrenheitElement = document.querySelector("#fahrenheit-link");
fahrenheitElement.addEventListener("click", convertTemperature);

function convertTemperature() {
  let temperature = document.querySelector("#temperature");

  if (isCelsius) {
    // Convert Celsius to Fahrenheit
    let celsius = Number(temperature.innerHTML);
    let fahrenheit = (celsius * 9) / 5 + 32;

    temperature.innerHTML = fahrenheit;
    // document.querySelector("#celsius-link").innerHTML = "Convert to Celsius";
    isCelsius = false;
  } else {
    // Convert Fahrenheit to Celsius
    let fahrenheit = Number(temperature.innerHTML);
    let celsius = ((fahrenheit - 32) * 5) / 9;

    temperature.innerHTML = celsius;
    // document.querySelector("#fahrenheit-link").innerHTML =
    //   "Convert to Fahrenheit";
    isCelsius = true;
  }
}

function changeTheme() {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  if (currentHour >= 7 && currentHour < 18) {
    // Apply day theme
    document.body.classList.remove("night-theme");
    document.body.classList.add("day-theme");
  } else {
    // Apply night theme
    document.body.classList.remove("day-theme");
    document.body.classList.add("night-theme");
  }
}

// Trigger the theme change function every minute
setInterval(changeTheme, 60000);

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("London");
