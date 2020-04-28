// create a function that is triggered on page-load
// said function should reference the search button with the weather search function 
// clear input box
// make sure all other js functions reside within this main document. ready funtion
$(document).ready(function () {
    $("#searchButton").on("click", function () {
        var weatherSearch = $("#weatherSearch").val();

        $("#weatherSearch").val("");

        searchWeather(weatherSearch);
    });

    $("#citiesStored").on("click", "li", function () {
        searchWeather($(this).text());
    });

    function makeRow(text) {
        var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
        $("#citiesStored").append(li);
    }

    // create a function that calls data from the weather API and excecutes a search and supplies search results
    // make an ajax call for the weather data API
    // save history link for search results
    // clear content
    // create HTML content for current weather
    // merge/append data to page
    // call data (searchWeather & uvIndex) to page
    function searchWeather(weatherSearch) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + weatherSearch + "&APPID=2f9e7f26dcfd6bda6f042ab892b64ad8",
            dataType: "json",
            success: function (data) {
                console.log(data)
                if (history.indexOf(weatherSearch) === -1) {
                    var a = JSON.parse(localStorage.getItem("history")) || [];
                    a.push(weatherSearch);
                    window.localStorage.setItem("history", JSON.stringify(a));
                    makeRow(weatherSearch);
                }

                $("#today").empty();

                var cityName = $("<h3>").addClass("card-title").text(data.city.name + " (" + new Date().toLocaleDateString() + ")");
                var card = $("<div>").addClass("card");
                var windSpeed = $("<p>").addClass("card-text").text("Wind Speed: " + data.list[0].wind.speed + " MPH");
                console.log(data.list[0].wind.speed)
                var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.list[0].main.humidity + "%");
                var temperature = $("<p>").addClass("card-text").text("Temperature: " + data.list[0].main.temperature + " °F");
                var cardBody = $("<div>").addClass("card-body");
                var img = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + ".png");

                cityName.append(img);
                cardBody.append(cityName, temperature, humidity, windSpeed);
                card.append(cardBody);
                $("#today").append(card);

                getForcast(weatherSearch)
                // getUVIndex(data.coord.lat, data.coord.lon)
            }
        });
    }

    // create a function that calls data from the forecast API and displays data to user in specific format
    // make an ajax call for the forecast API
    // clear existing title content, empty rows
    // create a for loop for forecasts
    // set time to look at forecasts
    // create more HTML content for BS cards
    // merge & append to page
    function getForcast(weatherSearch) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + weatherSearch + "&APPID=2f9e7f26dcfd6bda6f042ab892b64ad8&units=imperial",
            dataType: "json",
            success: function (data) {
                $("#forecast").html("<h4 class=\"mt3\">Five-Day Forecast:</h4>").append("<div class=\"row\">");

                for (var i = 0; i < data.list.length; i++) {
                    if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                        var card = $("<div>").addClass("card bg-primary text-white");
                        var body = $("<div>").addClass("card-body p-2");
                        var column = $("<div>").addClass("col-md-2");
                        var title = $("<h4>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                        var img = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png");
                        var p1 = $("<p>").addClass("card-text").text("Tempurature: " + data.list[i].main.tempurature_max + " °F");
                        var p2 = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");

                        column.append(card.append(body.append(title, img, p1, p2)));
                        $("#forecast .row").append(column);
                    }
                }
            }
        });
    }

    // create a function that 
    // make the colors change depending on the value of the uv index
    function getUVIndex(latitude, longitude) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=2f9e7f26dcfd6bda6f042ab892b64ad8" + latitude + "&longitude=" + longitude,
            dataType: "json",
            success: function (data) {
                var uv = $("<p>").text("UV Index: ");
                var btn = $("<span>").addClass("btn btn-sm").text(data.value);

                if (data.value < 3) {
                    btn.addClass("btn-success");
                } else if (data.value < 6) {
                    btn.addClass("btn-warning");
                }
            else {
                    btn.addClass("btn-danger");
                }
                $("#today .card-body").append(uv.append(btn));
            }
        });
    }

    // pull/get current history (if applicable)
    var history = JSON.parse(window.localStorage.getItem("history")) || [];

    if (history.length > 0) {
        searchWeather(history[history.length - 1]);
    }

    for (var i = 0; i < history.length; i++) {
        makeRow(history[i]);
    }
});

