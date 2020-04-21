$(document).ready(function(){
    $("#").on("click", function(){
        var x = $("#x").val ();

        $("#x").val("");

        searchWeather(x);
    });

    $(".#").on("click", "li", function(){
        searchWeather($(this).text()); 
    });
});

function searchWeather
function getForcast
function getUVIndex