var cities = [];

var cityFormEl = document.querySelector("#city-search");
var cityInputEl = document.querySelector("#city");
var citySearchEl = document.querySelector("#searched-city");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastTitleEl = document.querySelector("#forecast");
var fiveDayContainerEl = document.querySelector("#five-day-container");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");

var submitForm = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if (city) {
        getCityWeather(city);
        getFiveDay(city);
        cities.unshift({city});
        cityInputEl.value = "";
    } else {
        alert("Please enter a City");
    }
    saveSearch();
    pastSearch();
};

var saveSearch = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getCityWeather = function(city) {
    var apiKey = "584e10a58c618d4c5f31c6397c232f50";
    var apiURL = `api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data) {
            displayWeather(data, city);
        });
    });
};

// Current Weather
var displayWeather = function(weather, searchCity) {
    currentWeatherEl.textContent = "";
    citySearchEl.textContent = searchCity;

    var currentDate = document.createElement("span");
    currentDate.textContent = "(" + moment(weather.dt.value).format("MMM D, YYYY" + ")");
    citySearchEl.appendChild(currentDate);

    // Weather Image
    var weatherImg = document.createElement("img");
    weatherImg.setAttribute("src", 'https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png');
    citySearchEl.appendChild(weatherImg);

    // Temperature
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item";

    // Humidity
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item";

    // Wind Conditions
    var windEl = document.createElement("span");
    windEl.textContent = "Wind Conditions: " + weather.wind.speed + " mph";
    windEl.classList = "list-group-item";

    currentWeatherEl.appendChild(temperatureEl);
    currentWeatherEl.appendChild(humidityEl);
    currentWeatherEl.appendChild(windEl);

    // UV Index
    var latitude = weather.coord.lat;
    var longitude = weather.coord.lon;
    getUvIndex(latitude, longitude);
}

// UV Index Function
var displayUvIndex = function(index) {
    uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: ";
    uvIndexEl.classList = "list-group-item";

    uvIndexValue = document.createElement("span");
    uvIndexValue.textContent = index.value;

    if (index.value <= 2) {
        uvIndexValue.classList = "favorable";
    } else if (index.value > 2 && index.value <= 8) {
        uvIndexValue.classList = "moderate";
    } else if (index.value > 8) {
        uvIndexValue.classList = "severe";
    };

    uvIndexEl.appendChild(uvIndexValue);

    currentWeatherEl.appendChild(uvIndexEl);
};
