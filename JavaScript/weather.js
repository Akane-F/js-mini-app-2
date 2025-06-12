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

window.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
});