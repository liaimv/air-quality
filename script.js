//Skyline
const skylineFront = document.getElementById("front");
const buildingIds = [1, 2, 3, 4, 5, 6];
let lastBuildingRight = window.innerWidth;

function getRandomGrayscaleColor(min, max) {
    const g = Math.floor(Math.random() * (max - min + 1)) + min;
    return `rgb(${g}, ${g}, ${g})`;
}

//Create random building
function createBuilding(initialLeft) {
    const id = buildingIds[Math.floor(Math.random() * buildingIds.length)];
    const template = document.querySelector(`#building-templates #building-${id}`);
    const building = template.cloneNode(true);

    building.style.position = 'absolute';
    building.style.left = initialLeft;
    building.style.bottom = '0';
    building.classList.add('moving');

    //Random width and height
    const minWidth = 4;  
    const maxWidth = 10; 
    const randomWidth = Math.random() * (maxWidth - minWidth) + minWidth;
    building.style.width = randomWidth + '%';

    const minHeight = 50;
    const maxHeight = 100;
    const randomHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    building.style.height = randomHeight + '%';

    //Random colors
    const darkGray = getRandomGrayscaleColor(0, 60);  
    const lightGray = getRandomGrayscaleColor(150, 180);    

    building.style.setProperty('--building-color', darkGray);
    building.style.setProperty('--window-color', lightGray);

    return building;
}

//Move buildings from right to left
function animateBuildings() {
    const buildings = document.querySelectorAll(".moving");

    buildings.forEach((bld) => {
        const currentLeft = parseFloat(bld.style.left);
        if (currentLeft < -200) {
            bld.remove(); 
        } else {
            bld.style.left = currentLeft - 1 + "px";
        }
    });

    lastBuildingRight -= 1; 
}

//Add buildings by intervals
function checkAndAddBuildingByDistance() {
    const minGap = 20;  
    const maxGap = 80; 

    if (lastBuildingRight < window.innerWidth + 200) {
        const newBuilding = createBuilding(lastBuildingRight + Math.random() * (maxGap - minGap) + minGap + 'px');
        skylineFront.appendChild(newBuilding);

        const widthPercent = parseFloat(newBuilding.style.width);
        const widthPx = (widthPercent / 100) * window.innerWidth;

        lastBuildingRight += widthPx + Math.random() * (maxGap - minGap) + minGap;
    }
}

//Show initial buildings
function addInitialBuildings() {
    const numInitialBuildings = 10; 
    const viewportWidth = window.innerWidth;
    const spacing = viewportWidth / numInitialBuildings;

    for (let i = 0; i < numInitialBuildings; i++) {
        const initialLeft = i * spacing;
        const newBuilding = createBuilding(initialLeft + 'px');
        skylineFront.appendChild(newBuilding);
    }
}

addInitialBuildings();

function loop() {
    animateBuildings();
    checkAndAddBuildingByDistance(); 
    requestAnimationFrame(loop);
}
loop(); 

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

        const fogImages = document.querySelectorAll(".fog-img")

        //Show AQI values
        switch (current) {
            case 1:
                aqiText = 'Excellent';
                recommendation = 'Air quality is satisfactory, and air pollution poses little or no risk.';
                fogImages.forEach(img => {
                    img.style.filter = 'invert(0%) brightness(100%) contrast(0%)';
                });
                document.documentElement.style.setProperty('--sky-top', '#78f4ff');
                document.documentElement.style.setProperty('--sky-bottom', '#004466');
                break;
            case 2:
                aqiText = 'Good';
                recommendation = 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.';
                fogImages.forEach(img => {
                    img.style.filter = 'invert(40%) brightness(100%) contrast(100%)';
                });
                document.documentElement.style.setProperty('--sky-top', '#beebe7');
                document.documentElement.style.setProperty('--sky-bottom', '#488094');
                break;
            case 3:
                aqiText = 'Moderate';
                recommendation = 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.';
                fogImages.forEach(img => {
                    img.style.filter = 'invert(60%) brightness(130%) contrast(200%)';
                });
                document.documentElement.style.setProperty('--sky-top', '#cedbda');
                document.documentElement.style.setProperty('--sky-bottom', '#536663');
                break;
            case 4:
                aqiText = 'Poor';
                recommendation = 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.';
                fogImages.forEach(img => {
                    img.style.filter = 'invert(80%) brightness(150%) contrast(250%)';
                });
                document.documentElement.style.setProperty('--sky-top', '#b9c9c1');
                document.documentElement.style.setProperty('--sky-bottom', '#3f4542');
                break;
            case 5:
                aqiText = 'Very Poor';
                recommendation = 'Health warnings of emergency conditions. The entire population is more likely to be affected.';
                fogImages.forEach(img => {
                    img.style.filter = 'invert(100%) brightness(200%) contrast(300%)';
                });
                document.documentElement.style.setProperty('--sky-top', '#d6bd98');
                document.documentElement.style.setProperty('--sky-bottom', 'black');
                break;
            default:
                aqiText = 'Unknown';
                recommendation = 'Unable to determine air quality level.';
        }

        //Show pollutant levels
        const pollutantInfo = `
            <div id="pollutants">
                ${generatePollutantLine("CO", pollutants.co)}
                ${generatePollutantLine("NO", pollutants.no)}
                ${generatePollutantLine("NO₂", pollutants.no2)}
                ${generatePollutantLine("O₃", pollutants.o3)}
                ${generatePollutantLine("SO₂", pollutants.so2)}
                ${generatePollutantLine("NH₃", pollutants.nh3)}
                ${generatePollutantLine("PM2.5", pollutants.pm2_5)}
                ${generatePollutantLine("PM10", pollutants.pm10)}
            </div>
        `;

        function generatePollutantLine(label, value) {
            return `
              <div class="pollutant-line">
                <span class="label">${label}</span>
                <span class="value">${value ?? 'N/A'} μg/m³</span>
              </div>
            `;
          }

        //Mask recommendation Text
        const maskRecommendationText = current >= 3 ? '<p>Consider wearing a mask if you are sensitive to air pollution or engaging in outdoor activities.<br>An N95 or similar mask can offer better protection.</p>' : '<p>A mask is not necessary for the general public at this air quality level.</p>';

        //Add all information in HTML
        airQualityDiv.innerHTML = `
            <p id="source"><em>Source: OpenWeather Air Pollution API</em></p>
            <h3>Current Air Quality</h3>
            <p id="level">${aqiText}</p>
            <p>${recommendation}</p>
            <p>${maskRecommendationText}</p>
            <p id="pollutant-title"><strong>Pollutant Concentration</strong></p>
            ${pollutantInfo}
        `;

    } else {
        airQualityDiv.innerHTML = `<p class="error-message">No air quality data available for your location.</p>`;
    }
}