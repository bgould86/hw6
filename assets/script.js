// variables
const searchCities = [];
// functions
//grabs coordinates
function handleCoords(searchCity) {
  const fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      handleCurrentWeather(data.coord, data.name);
    });
}
//uses coordinates to find city weather
function handleCurrentWeather(coordinates, city) {
  const lat = coordinates.lat;
  const lon = coordinates.lon;

  const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      displayCurrentWeather(data.current, city);
      displayFiveDayWeather(data.daily);
    });
}

//displays current weather
function displayCurrentWeather(currentCityData, cityName) {
  let weatherIcon = `https://openweathermap.org/img/wn/${currentCityData.weather[0].icon}.png`;

  document.querySelector("#currentWeather").innerHTML = `<h2><strong>${cityName} (${moment.unix(currentCityData.dt).format("l")})</strong> <img src="${weatherIcon}"></h2> <div class="mb-1">Temp: ${currentCityData.temp} \xB0F</div> <div class="mb-1 mt-1">Wind: ${currentCityData.wind_speed} MPH</div> <div class="mb-1 mt-1">Humidity: ${currentCityData.humidity}%</div> <div class="mb-1 mt-1">UV Index: <label id="uviDiv" class="p-1">${currentCityData.uvi}</label></div>`;

  let uvi = currentCityData.uvi;
  let uviElement = document.getElementById("uviDiv");
  if (uvi <= 3) {
    uviElement.classList.add("favorable");
  }
  if (uvi > 3 && uvi <= 5) {
    uviElement.classList.add("moderate");
  }
  if (uvi > 5) {
    uviElement.classList.add("high");
  }
}

//displays 5-day forecast
function displayFiveDayWeather(fiveDayCityData) {
  const cityData = fiveDayCityData.slice(1, 6);
  document.querySelector("#fiveDayWeather").innerHTML = "";

  cityData.forEach((day) => {
    let weatherIcon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
    document.querySelector("#fiveDayWeather").innerHTML += `<div id="cards" class="col-sm m-1 p-2 card"><div><strong>${moment.unix(day.dt).format("l")}</strong></div> <div><img src="${weatherIcon}"></div> <div class="mb-1">Temp: ${day.temp.day} \xB0F</div> <div class="mb-1 mt-1">Wind: ${day.wind_speed} MPH</div> <div class="mb-1 mt-1">Humidity: ${day.humidity}%</div> </div>`;
  });
}

//adds searched cities to history
function handleFormSubmit(event) {
  document.querySelector("#searchHistory").innerHTML = "";
  event.preventDefault();
  const city = document.querySelector("#searchInput").value.trim();
  searchCities.push(city);
  const filteredCities = searchCities.filter((city, index) => {
    return searchCities.indexOf(city) === index;
  });
  filteredCities.forEach((city) => {
    document.querySelector("#searchHistory").innerHTML += `<button data-city="${city}" class="w-100 d-block my-2">${city}</button>`;
  });

  handleCoords(city);
}

function handleHistory(event) {
  const city = event.target.getAttribute("data-city");
  handleCoords(city);
}

// listeners
document.querySelector("#searchForm").addEventListener("submit", handleFormSubmit);
document.querySelector("#searchHistory").addEventListener("click", handleHistory);
