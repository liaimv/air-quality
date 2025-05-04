//AQI API
document.addEventListener('DOMContentLoaded', function getAirQuality() {
    if ("geolocation" in navigator) {
        //Get user's location using geolocation
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const apiKey = '655015eefe6c711f9ddea07e1efcc8ef'; 
            const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

            //Get data from API 
            try {
                const response = await fetch(apiUrl); // Use await to pause the rest of the code until it gets the result
                const data = await response.json();
                displayAirQuality(data);
            } catch (error) {
                console.error("Error fetching air quality data:", error);
                airQualityDiv.innerHTML = `<p class="error-message">Failed to fetch air quality data.</p>`;
            }
        }, (error) => {
            console.error("Error getting geolocation:", error);
            airQualityDiv.innerHTML = `<p class="error-message">Failed to get your location.</p>`;
        });
    } else {
        airQualityDiv.innerHTML = `<p class="error-message">Geolocation is not supported by your browser.</p>`;
    }
});

function displayAirQuality(data) {
    const airQualityDiv = document.getElementById('airQualityInfo');

    if (data?.list?.length > 0) { //? used to make sure that it doesn't crash if data or data.list doesn't exist
        const current = data.list[0].main.aqi; //AQI data
        const pollutants = data.list[0].components; //Pollutant data

        let aqiText = '';
        let recommendation = '';

        //Show AQI values
        switch (current) {
            case 1:
                aqiText = 'Good';
                recommendation = 'Air quality is satisfactory, and air pollution poses little or no risk.';
                break;
            case 2:
                aqiText = 'Fair';
                recommendation = 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.';
                break;
            case 3:
                aqiText = 'Moderate';
                recommendation = 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.';
                break;
            case 4:
                aqiText = 'Poor';
                recommendation = 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.';
                break;
            case 5:
                aqiText = 'Very Poor';
                recommendation = 'Health warnings of emergency conditions. The entire population is more likely to be affected.';
                break;
            default:
                aqiText = 'Unknown';
                recommendation = 'Unable to determine air quality level.';
        }

        //Show pollutant levels
        const pollutantInfo = `
            <p><strong>Carbon Monoxide (CO):</strong> ${pollutants.co ?? 'N/A'} μg/m³</p> <!-- ?? used to make sure N/A only show up if the value is undefined or null  -->
            <p><strong>Nitrogen Monoxide (NO):</strong> ${pollutants.no ?? 'N/A'} μg/m³</p>
            <p><strong>Nitrogen Dioxide (NO₂):</strong> ${pollutants.no2 ?? 'N/A'} μg/m³</p>
            <p><strong>Ozone (O₃):</strong> ${pollutants.o3 ?? 'N/A'} μg/m³</p>
            <p><strong>Sulphur Dioxide (SO₂):</strong> ${pollutants.so2 ?? 'N/A'} μg/m³</p>
            <p><strong>Ammonia (NH₃):</strong> ${pollutants.nh3 ?? 'N/A'} μg/m³</p>
            <p><strong>PM2.5:</strong> ${pollutants.pm2_5 ?? 'N/A'} μg/m³</p>
            <p><strong>PM10:</strong> ${pollutants.pm10 ?? 'N/A'} μg/m³</p>
        `;

        //Mask recommendation Text
        const maskRecommendationText = current >= 3 ? '<p><strong>Consider wearing a mask if you are sensitive to air pollution or engaging in outdoor activities. An N95 or similar mask can offer better protection.</strong></p>' : '<p>Mask wearing is generally not necessary for the general public at this air quality level.</p>';

        //Add all information in HTML
        airQualityDiv.innerHTML = `
            <h3>Current Air Quality</h3>
            <p><strong>Level:</strong> ${aqiText}
            <p><strong>Recommendation:</strong> ${recommendation}</p>
            <p><strong>Mask Recommendation:</strong> ${maskRecommendationText}</p>
            <h4>Pollutant Levels (μg/m³)</h4>
            ${pollutantInfo}
            <p><em>Source: OpenWeather Air Pollution API</em></p>
        `;

    } else {
        airQualityDiv.innerHTML = `<p class="error-message">No air quality data available for your location.</p>`;
    }
}