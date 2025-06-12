const apiKey = 'cc63308ea156443890d234905251106';
const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=auto:ip`;

function fetchWeather () {
    fetch(url)
    .then(response => {
        if (!response.ok) {
        throw new Error('APIの呼び出しに失敗しました');
        }
        return response.json();
    })
    .then(data => {
        console.log('temp:', data.current.temp_c + '℃');
        console.log('icon:', data.current.condition.icon);

        const img = document.createElement('img');
        img.id = 'weather-icon';
        img.src = "https:" + data.current.condition.icon;
        document.getElementById('weather').appendChild(img);

        const temp = document.createElement('p');
        temp.id = 'weather-tmp';
        temp.textContent = data.current.temp_c + "℃";
        document.getElementById('weather').appendChild(temp);
    })
    .catch(error => {
        console.error('error:', error);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
});