window.onload = function() {
    document.getElementById("button1").addEventListener("click", getID);
}
var mymap = L.map("locmap", {
    center: [50, 0.1],
    zoom: 12
});
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoicHI2OCIsImEiOiJjamIyMXpkZXc4dDE5MndxZW44czVhaXBkIn0.0sfaLuXhICPEABMRJjc2Pw'
            }).addTo(mymap);

function getID() {
    var full_location = document.getElementById("loc").value.split(",");
    var location = full_location[0];
    var base_url = "http://interview.toumetisanalytics.com/location/";
    var url = base_url + location;
    var woeid;
    var xhttp = new XMLHttpRequest();
    xhttp.responseType = "json";
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.response);
            
            woeid = this.response[0].woeid;
            getWeather(woeid);
        }
    }
    
    xhttp.open("GET", url, true);
    xhttp.send();
}

function getWeather(id) {
    var base_url = "http://interview.toumetisanalytics.com/weather/";
    var url = base_url + id;
    var xhttp = new XMLHttpRequest;
    xhttp.responseType = "json";
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.response);
           
            document.getElementById("t").innerHTML = this.response.consolidated_weather[0].the_temp;
            document.getElementById("w").innerHTML = this.response.consolidated_weather[0].weather_state_name;

            var ctime = new Date(this.response.time);
            var stime = new Date(this.response.sun_set);

            var minutes = (stime - ctime) / 60000;
            var hours = Math.trunc(minutes/60);
            var mins = Math.round(minutes % 60);
            document.getElementById("s").innerHTML = hours + " hours, " + mins + " minutes";

            var maxt = [];
            var mint = [];
            var meant = [];
            var dates = [];
            
            for (let i = 0; i < 6; i++) {
                maxt.push(this.response.consolidated_weather[i].max_temp);
                mint.push(this.response.consolidated_weather[i].min_temp);
                meant.push(this.response.consolidated_weather[i].the_temp);
                dates.push(this.response.consolidated_weather[i].applicable_date);
            }

            Highcharts.chart("container", {
                chart: {
                    type: "column",
                    style: {
                        fontFamily: "Arial"
                    }
                },
                title: {
                    text: "Six Day Forecast"
                },
                xAxis: {
                    categories: dates
                },
                yAxis: {
                    title: {
                        text: "Temperature (C)"
                    }
                },
                series: [{
                    name: "Max temp",
                    data: maxt
                }, {
                    name: "Mean temp",
                    data: meant
                }, {
                    name: "Min temp",
                    data: mint
                }]
            });

            var coords = this.response.latt_long.split(",")
            mymap.setView(coords, 12);

            var marker = L.marker(coords).addTo(mymap);
            document.getElementById("locmap").style.visibility = "visible";
            document.getElementById("locmap").style.height = "320px";
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}