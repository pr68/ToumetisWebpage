window.onload = function() {
    document.getElementById("button1").addEventListener("click", getID);
}

function getID() {
    var location = document.getElementById("loc").value;
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
           
            var tpara = document.createElement("P");
            var t = document.createTextNode(this.response.consolidated_weather[0].the_temp);
            tpara.appendChild(t);
            document.getElementById("ctemp").appendChild(tpara);
            
            var wpara = document.createElement("P");
            var w = document.createTextNode(this.response.consolidated_weather[0].weather_state_name);
            wpara.appendChild(w);
            document.getElementById("cweather").appendChild(wpara);

            var ctime = new Date(this.response.time);
            var stime = new Date(this.response.sun_set);

            var minutes = (stime - ctime) / 60000;
            var hours = Math.trunc(minutes/60);
            var mins = Math.round(minutes % 60);
            
            var spara = document.createElement("P");
            var s = document.createTextNode(hours + " hours, " + mins + " minutes");
            spara.appendChild(s);
            document.getElementById("sdown").appendChild(spara);

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
            
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}