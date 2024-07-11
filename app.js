async function getCoordinates(city) {
    const apiKey = '8bc04cb172b24106540453c13e66f282';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            return {
                lat: data.coord.lat,
                lon: data.coord.lon
            };
        } else {
            throw new Error('City not found');
        }
    } catch (error) {
        throw new Error('Error fetching coordinates');
    }
}

async function getWeather() {
    const apiKey = '8bc04cb172b24106540453c13e66f282';
    const city = document.getElementById('city').value;
    let coordinates;

    try {
        coordinates = await getCoordinates(city);
    } catch (error) {
        document.getElementById('weather').innerHTML = `<p>${error.message}</p>`;
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.daily) {
            let weatherReport = '';
            data.daily.slice(0, 15).forEach((day, index) => {
                const date = new Date(day.dt * 1000);
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = date.toLocaleDateString(undefined, options);

                weatherReport += `
                    <div class="day">
                        <h3>Day ${index + 1} - ${formattedDate}</h3>
                        <p>Temperature: ${day.temp.day}°C</p>
                        <p>Night Temperature: ${day.temp.night}°C</p>
                        <p>Humidity: ${day.humidity}%</p>
                        <p>Weather: ${day.weather[0].description.charAt(0).toUpperCase() + day.weather[0].description.slice(1)}</p>
                    </div>
                `;
            });

            document.getElementById('weather').innerHTML = weatherReport;
        } else {
            document.getElementById('weather').innerHTML = `<p>Unable to fetch weather data</p>`;
        }
    } catch (error) {
        document.getElementById('weather').innerHTML = `<p>Error fetching weather data</p>`;
    }
}
