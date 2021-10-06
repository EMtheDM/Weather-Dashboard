var cities = [];

var cityFormEl = document.querySelector("#city-search");
var cityInputEl = document.querySelector("#city");
var currentWeatherEl = document.querySelector("#current-weather-container");
var citySearchEl = document.querySelector("#searched-city");
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
    pastSearch(city);
};

var saveSearch = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getCityWeather = function(city) {
    var apiKey = "00fa8b03126daafdd49a1dd442af1554";
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

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
    currentDate.textContent = " (" + moment(weather.dt.value).format("MMM DD, YYYY") + ") ";
    citySearchEl.appendChild(currentDate);

    // Weather Image
    var weatherImg = document.createElement("img");
    weatherImg.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`);
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
    windEl.textContent = "Wind Conditions: " + weather.wind.speed + " MPH";
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
var getUvIndex = function(latitude, longitude) {
    var apiKey = "00fa8b03126daafdd49a1dd442af1554";
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${latitude}&lon=${longitude}`
    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data) {
            displayUvIndex(data)
        });
    });
};

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

// 5 Day Forecast
var getFiveDay = function(city) {
    var apiKey = "00fa8b03126daafdd49a1dd442af1554";
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data) {
            displayFiveDay(data);
        });
    });
};

var displayFiveDay = function(weather) {
    fiveDayContainerEl.textContent = "";
    forecastTitleEl.textContent = "Five Day Forecast";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8) {
        var dailyForecast = forecast[i];

        var forecastEl = document.createElement("div");
        forecastEl.classList = "card text-light m2";

        var forecastDateEl = document.createElement("h4");
        forecastDateEl.textContent = moment.unix(dailyForecast.dt).format("MMM DD, YYYY");
        forecastDateEl.classList = "card-header text-center";
        
        forecastEl.appendChild(forecastDateEl);

        var weatherImg = document.createElement("img");
        weatherImg.classList = "card-body text-center";
        weatherImg.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@4x.png`);

        forecastEl.appendChild(weatherImg);

        forecastTemperatureEl = document.createElement("span");
        forecastTemperatureEl.classList = "card-body text-center";
        forecastTemperatureEl.textContent = "Temp: " + dailyForecast.main.temp + " °F";

        forecastEl.appendChild(forecastTemperatureEl);

        forecastHumidityEl = document.createElement("div");
        forecastHumidityEl.classList = "card-body text-center";
        forecastHumidityEl.textContent = "Humidity: " + dailyForecast.main.humidity + " %";

        forecastEl.appendChild(forecastHumidityEl);

        forecastWindEl = document.createElement("div");
        forecastWindEl.classList = "card-body text-center";
        forecastWindEl.textContent = "Wind: " + dailyForecast.wind.speed + " MPH";

        forecastEl.appendChild(forecastWindEl);

        fiveDayContainerEl.appendChild(forecastEl);
    };
};

var pastSearch = function(pastSearch) {
    pastSearchEl = document.createElement("button");
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.setAttribute("data-city", pastSearch);
    pastSearchEl.setAttribute("type", "submit");

    pastSearchButtonEl.prepend(pastSearchEl);
};

var pastSearchHandler = function(event) {
    event.preventDefault;
    var city = event.target.getAttribute("data-city");
    if (city) {
        getCityWeather(city);
        getFiveDay(city);
    };
};

// Past Search  
cityFormEl.addEventListener("submit", submitForm);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);