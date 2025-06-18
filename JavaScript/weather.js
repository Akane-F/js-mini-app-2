const apiKey = 'cc63308ea156443890d234905251106';

function fetchWeather () {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=auto:ip&days=1`)
    .then(response => {
        if (!response.ok) {
        throw new Error('Failed WeatherAPI forecast request.');
        }
        return response.json();
    })
    .then(data => {
        const nowStr = data.location.localtime;
        console.log('now:', data.location.localtime);

        const now = new Date(nowStr);
        const dateStr = nowStr.split(' ')[0];
    
        const sunriseStr = data.forecast.forecastday[0].astro.sunrise;
        const sunsetStr = data.forecast.forecastday[0].astro.sunset;

        // Convert to Date format
        const sunrise = new Date(`${dateStr} ${sunriseStr}`);
        const sunset = new Date(`${dateStr} ${sunsetStr}`);

        console.log('sunrise:', sunrise.toLocaleTimeString());
        console.log('sunset:', sunset.toLocaleTimeString());

        const nowTime = now.getTime();
        const sunriseTime = sunrise.getTime();
        const sunsetTime = sunset.getTime();

        const isDayTime = nowTime >= sunriseTime && nowTime < sunsetTime;
        console.log('isDayTime:', isDayTime ? 'TRUE' : 'FALSE');

        if (!isDayTime) {
            const main = document.querySelector('main');
            main.style.backgroundImage = 'url(./assets/backgound/Background_purple.png)';
        }    

        console.log('icon:', data.current.condition.icon);
        console.log('temp:', data.current.temp_c + '℃');

        const weather = document.getElementById('weather');

        const img = document.createElement('img');
        img.id = 'weather-icon';
        img.src = "https:" + data.current.condition.icon;
        weather.appendChild(img);

        img.addEventListener("click", () => {
            const weatherModal = document.getElementById("weather-modal");
            weatherModal.style.display = "flex";
        });

        const temp = document.createElement('p');
        temp.id = 'weather-tmp';
        temp.textContent = data.current.temp_c + "℃";
        if (!isDayTime) {
            temp.style.color = 'lightgrey';
        }
        weather.appendChild(temp);
    })
    .catch(error => {
        console.error('error:', error);
    });
}

function fetchForecast () {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=auto:ip&days=5`)
    .then(response => {
        if (!response.ok) {
        throw new Error('Failed WeatherAPI forecast request.');
        }
        return response.json();
    })
    .then(data => {
        const forecastsData = data.forecast.forecastday;
        const forecasts = document.getElementById('forecasts');

        forecastsData.forEach(day => {
            const dateForcast = document.createElement('div');
            dateForcast.classList.add('date-forcast');
            const date = document.createElement('p');
            date.classList.add('date');
            const dateData = new Date(day.date);
            date.textContent = `${dateData.getMonth() + 1}/${dateData.getDate()}`;
            dateForcast.appendChild(date);

            const icon = document.createElement('img');
            icon.classList.add('forecast-icon');
            icon.src = "https:" + day.day.condition.icon;
            dateForcast.appendChild(icon);
                
            const max = document.createElement('p');
            max.classList.add('date');
            max.textContent = day.day.maxtemp_c;
            dateForcast.appendChild(max);

            const min = document.createElement('p');
            min.classList.add('date');
            min.textContent = day.day.mintemp_c;
            dateForcast.appendChild(min);

            forecasts.appendChild(dateForcast);
          });
    })
    .catch(error => {
        console.error('error:', error);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
    fetchForecast();
});

const weatherModal = document.getElementById("weather-modal");
const closeWeatherModal = document.getElementById("weather-close");

closeWeatherModal.addEventListener("click", () => {
    weatherModal.style.display = "none";
});
  