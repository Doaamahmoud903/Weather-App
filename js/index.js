let links = document.querySelectorAll("#navbar .nav-link");
let mainNav = document.querySelector("#main-nav");
let mainNavCollapse = document.getElementById("navbarNav");
let searchInput = document.getElementById("searchInput");
let submitSearch = document.getElementById("submitSearch");
let searchLocation;
let mainContainer = document.getElementById('main-section');

// Default weather on page load
$(document).ready(() => {
    getWeather('cairo');
    searchInput.value = "";
});

// On search button click
submitSearch.addEventListener('click', () => {
    searchLocation = searchInput.value;
    if (searchLocation) {
        getWeather(searchLocation); 
        searchInput.value = "";
    } else {
        alert("Please enter a location");
    }
});

// Fetch weather data
async function getWeather(searchLocation) {
    try {
        let request = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=7a4c450b704c416d93a172557242109&q=${searchLocation}&days=3&aqi=no&alerts=no`);
        let response = await request.json();
        displayWeather(response);
        displayWheaterNext(response);
        console.log(response);
    } catch (error) {
        document.getElementById("searchError").classList.remove("d-none");
        document.getElementById("searchError").innerHTML ="Error fetching weather data: Retry enter location."
        console.error(error)
    }
}

// Format day of the week
function formatDateDay(fullDate) {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(fullDate);
    let day = weekday[date.getDay()];
    return day; 
}

// Format month and day
function formatDateMonth(fullDate) {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date(fullDate);
    let monthName = month[date.getMonth()];
    let monthDay = date.getDate();
    return monthDay + " " + monthName;
}
// Function to format time from 24-hour to 12-hour format
function formatTime12Hour(fullDate) {
    const date = new Date(fullDate);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes; 
    let timeStr = hours + ':' + minutes + ' ' + ampm;
    return timeStr;
}

// Display current weather
function displayWeather(response) {
    let localtime = response.location.localtime;
    let cartoona = ''; 

    cartoona += `
    <div class="col-md-4 card text-white bg-mainColor rounded-0 border-1 border-color mb-3">
        <div class="card-header d-flex justify-content-between">
            <p id="weather-day">${formatDateDay(localtime)}</p>
            <p id="weather-month">${formatDateMonth(localtime)}</p>
        </div>
        <div class="card-body">
             <h4 id="local-time">${formatTime12Hour(localtime)}</h4>
            <h4 class="card-title">${response.location.name}</h4>
            <div class=" d-flex justify-content-between align-item-center">
                <h5>${response.current.condition.text}</h5>
                <img src="https:${response.current.condition.icon}" alt="Weather Icon" />
            </div>
            <p class="card-text">Temperature: ${response.current.temp_c} °C</p>
            <p class="card-text">Humidity: ${response.current.humidity}%</p>
        </div>
    </div>`;

    mainContainer.innerHTML = cartoona; 
}

// Display weather forecast for next days
function displayWheaterNext(response) {
    let weatherNextContainer = ``;
    for (let i = 1; i < response.forecast.forecastday.length; i++) { // start from 1 to skip the current day
        weatherNextContainer += `
        <div class="col-md-4 card text-white bg-mainColor rounded-0 border-1 border-color mb-3">
            <div class="card-header d-flex justify-content-between">
                <p id="weather-day">${formatDateDay(response.forecast.forecastday[i].date)}</p>
                <p id="weather-month">${formatDateMonth(response.forecast.forecastday[i].date)}</p>
            </div>
            <div class="card-body mx-auto text-center">
            <img src="https:${response.forecast.forecastday[i].day.condition.icon}" alt="Weather Icon" />
                <h5>${response.forecast.forecastday[i].day.condition.text}</h5>  
                <p class="card-text">Max Temp: ${response.forecast.forecastday[i].day.maxtemp_c} °C</p>
                <p class="card-text">Min Temp: ${response.forecast.forecastday[i].day.mintemp_c} °C</p>
            </div>
        </div>
        `;
    }

    mainContainer.innerHTML += weatherNextContainer; 
}
