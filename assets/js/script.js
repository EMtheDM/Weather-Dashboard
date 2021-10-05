var cities = [];

var cityFormEl = document.querySelector("#city-search");
var cityInputEl = document.querySelector("#city");
var citySearchEl = document.querySelector("#searched-city");
var weatherEl = document.querySelector("#current-weather");
var forcastEl = document.querySelector("#forcast");
var fiveDayEl = document.querySelector("#five-day-container");
var pastSearchEl = document.querySelector("#past-search-buttons");

var submitForm = function(event) {
    event.preventDefault();
    var city = cityInputEl.ariaValueMax.trim();
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
}

var saveSearch = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getCityWeather = function(city) {
    var apiKey = "00fa8b03126daafdd49a1dd442af1554";
    var apiURL = "api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}";

    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data) {
            displayWeather(data, city);
        });
    });
};

