function buildWidget(cssWeatherClass){


    console.log("Start to fetch data from Forecast.io website using Ajax");
//    wdgtSetIcon("widget-forecast-today-icon","rain");
    var xhr = $.ajax({
    url :  constructURL(),
    dataType :"jsonp",
    /*xhrFields: {
        withCredentials: true
    },*/
    type: "GET"}).done( function( data ){

        // this function will run if the AJAX call is successful
        console.log("forecast data is loaded succsfully");
        console.log( data );
        displayDayInfo(cssWeatherClass , data);
     }).fail( function( ){

        //this function will run if the AJAX call fails for any reason.
        console.log("failed to load forecast data");
        console.log( xhr.status );

        /*TODO: handle error cases.*/

     });

    displayDayInfo(cssWeatherClass , data);
}

function constructURL(){
    var FORECAST_API_KEY="28595388f228499527db3647095809fc";
    var ALGONQUIN_LATITUDE = "45.348391";
    var ALGONQUIN_LONGITUDE = "-75.757045";

    /* Get the weather in SI metric: Celsius, mm , kPa ... etc*/
    var UNITS = "units=ca";

    var url = "https://api.forecast.io/forecast/" +
        FORECAST_API_KEY + "/" +
        ALGONQUIN_LATITUDE + "," +
        ALGONQUIN_LONGITUDE +"?" +
        UNITS
    ;

    return url;
}

function wdgtSetIcon( canvasID, weatherState){
    /*In html doc , you must have:
    <canvas id="widget-forecast-icon" width="128" height="128"></canvas>*/

    console.debug("canvasID is: ", canvasID);
    console.debug("weatherState is: ", weatherState);
    var skycons = new Skycons();
    skycons.set(canvasID, weatherState);
    skycons.play();
}

function displayDayInfo(cssWeatherClass , data){

    /*  1. Create new div element and set its class to panel class.
        2. Set display hourly weather information upon clicking on new panel div
        3. append panel div to current weather forecast div*/
    $panel = $("<div></div>").addClass("panel").
             click(function (){
                console.log("Display hourly weather information");
                $("#hourly-panel").slideToggle( "slow" );
                $(".minus").toggle();
                $(".plus").toggle();
             }).
             appendTo($(cssWeatherClass));;

    /* Create paragraph for today*/
    $panel.append('<p class="today">TODAY</p>');

    /* 1. Create icon div for average weather of the whole.
       2. Append it to panel div element*/
    $dailyWeatherIcon = $("<div></div>").addClass("today-icon-container").
                        append('<canvas id="widget-forecast-today-icon" width="36" height="36"></canvas>').
                        appendTo($panel);
    /* Set icon of weather using skycons that was originally developped for forecast io website. */
    wdgtSetIcon("widget-forecast-today-icon", data.daily.data[0].icon);

    /* Add today weather summary and remove last full-stop or period*/
    $panel.append('<p class="summary">' +data.daily.data[0].summary.slice(0,-1) +'</p>');

    /* Add circular button to indicate that this section is expandable*/
    $button = $("<div></div>").addClass("widget-button").
                append('<div class="plus">+</div>').
                append('<div class="minus">-</div>').
                appendTo($panel);

    $panel.append('<div id="hourly-panel"></div>');
}
