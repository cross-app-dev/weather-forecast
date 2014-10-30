var forecastData;

/**************************
Add a link for a CSS file that styles .mywidget
Add a script tag that points to CDN version of jQuery 1.*
Add a script tag that loads your script file from http://m.edumedia.ca/
Add a script tag that loads skycons minified version from CDN to load weather icons.
**************************/
var scriptsLoaded = 0;

document.addEventListener("DOMContentLoaded", function(){
    /*****************************************************************/
    /****      Load jQuery-UI-Css and apply it to the page        ****/
    /*****************************************************************/
    var jqUiCss = document.createElement("link");
    jqUiCss.setAttribute("rel", "stylesheet");
    jqUiCss.setAttribute("href", "//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css");
    document.querySelector("head").appendChild(jqUiCss);

    /*****************************************************************/
    /****      Load the CSS file and apply it to the page         ****/
    /*****************************************************************/
    var css = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    /* TODO: check where widget.css should be located exactly? */
    css.setAttribute("href", "css/widget.css");
    document.querySelector("head").appendChild(css);

    /*****************************************************************/
    /****     Load the jQuery file and apply it to the page       ****/
    /*****************************************************************/
    var jq = document.createElement("script");
    jq.addEventListener("load", buildForecastWidget );
    document.querySelector("head").appendChild(jq);
//    jq.setAttribute("src","//code.jquery.com/jquery-1.10.2.js");
    jq.setAttribute("src","//code.jquery.com/jquery-1.10.2.js");

    /*****************************************************************/
    /****      Load the skycons JS and apply it to the page       ****/
    /*****************************************************************/
    var skyconsScript = document.createElement("script");
    skyconsScript.addEventListener("load",buildForecastWidget);
    document.querySelector("head").appendChild(skyconsScript);
//    skyconsScript.setAttribute("src", "//cdnjs.cloudflare.com/ajax/libs/skycons/1396634940/skycons.min.js");
    skyconsScript.setAttribute("src", "scripts/skycons.min.js");

    /*****************************************************************/
    /****      Load jQuery-UI and apply it to the page           ****/
    /*****************************************************************/
    var jqUi = document.createElement("script");
    jqUi.addEventListener("load", buildForecastWidget );
    document.querySelector("head").appendChild(jqUi);
//    jqUi.setAttribute("src","//code.jquery.com/ui/1.11.2/jquery-ui.js");
    jqUi.setAttribute("src","//code.jquery.com/ui/1.11.2/jquery-ui.js");
});

function buildForecastWidget(){
    console.log("current file that is loaded is:",  this);
    scriptsLoaded++;

    if(scriptsLoaded === 3){
      //call the function in My widget script to load the JSON and build the widget
      console.log("all three are scripts loaded");
      buildWidget(".weather-forecast");
    }
}


function buildWidget(weatherWidgetClass){
    console.log("Start to fetch data from Forecast.io website using Ajax");
    var xhr = $.ajax(
        {
            url :  constructURL(),
            dataType :"jsonp",
            type: "GET"
        }).done( function( data ){
            console.log("forecast data is loaded succsfully");
            forecastData = data;
            createDailyWeatherPanel(weatherWidgetClass);
        }).fail( function( ){

            console.log("failed to load forecast data");
            console.log( xhr.status );
            //TODO: handle error cases.
        });
}

function constructURL(){
    var FORECAST_API_KEY="28595388f228499527db3647095809fc";
    var ALGONQUIN_LATITUDE = "45.348391";
    var ALGONQUIN_LONGITUDE = "-75.757045";

    /* JS Date object returns number of milliseconds since 1 January, 1970 meanwhile
       Forecast TIME field should be number of seconds since 1 January, 1970.
       So round divide result object by 1000 to convert from msec to sec.
       Finally, round the result to remove fractions (if any). */
    var TIME = Math.round((new Date())/1000);

    /* Get the weather in SI metric: Celsius, mm , kPa ... etc.
       According to Forecast API documentation, canadian units are Identical to si, except that
       windSpeed is in kilometers per hour.*/
    var UNITS = "units=ca";

    var url = "https://api.forecast.io/forecast/" +
        FORECAST_API_KEY + "/" +
        ALGONQUIN_LATITUDE + "," +
        ALGONQUIN_LONGITUDE +"," +
        TIME + "?" +
        UNITS
    ;

    return url;
}

function wdgtSetIcon( canvasID, weatherState){

    /*  Skycons is a set of ten animated weather glyphs, procedurally generated by JavaScript using the
        HTML5 canvas tag. Skycons were designed for Forecast.io */
    var skycons = new Skycons();

    /* According to thier original exmaples: http://darkskyapp.github.io/skycons/
       Canvas has been created using jQuery and set to an id.*/
    skycons.set(canvasID, weatherState);

    /* Start the icon animation. */
    skycons.play();
}

function createDailyWeatherPanel(weatherWidgetClass){

    /*  1. Create new div element and set its class to panel class.
        2. append panel div to current weather forecast div*/
    var $dailyPanel = $("<div></div>").addClass("daily-panel").
             appendTo($(weatherWidgetClass));

    /* Create paragraph for today*/
    $dailyPanel.append('<p class="today">TODAY</p>');

    /* 1. Create icon div for average weather of the whole day.
       2. Append it to daily panel*/
    $dailyWeatherIcon = $("<div></div>").addClass("today-icon-container").
                        append('<canvas id="widget-forecast-today-icon" width="36" height="36"\
                               </canvas>').
                        appendTo($dailyPanel);
    /* Set icon of weather using skycons */
    wdgtSetIcon("widget-forecast-today-icon", forecastData.daily.data[0].icon);

    /* Add today weather summary and remove last full-stop or period*/
    $dailyPanel.append('<p class="summary">' +forecastData.daily.data[0].summary.slice(0,-1) +'</p>');

    /* Add circular button to indicate that daily weather panel is expandable*/
    $button = $("<div></div>").addClass("circular-button").
                append('<span class="expand">+</span>').
                append('<span class="fold">-</span>').
                appendTo($dailyPanel).
                click(onDailyPanelClicked);

    /* create a container for inner hourly panel inside the daily panel.*/
    $dailyPanel.append('<div id="hourly-panel"></div>');

    /* create all required div elements for hourly weather panel. */
    createHourlyWeatherPanel();
}

function onDailyPanelClicked(){
    console.log("dialy panel has been clicked");

    /* Toggle sliding direction for hourly panel inside the daily panel. As well as,
       the visibilty of child spans for the circular button. */
    $("#hourly-panel").slideToggle( "slow" );
    $(".expand").toggle();
    $(".fold").toggle();

    /*In case of expansion, let the slider moves from the begining till the current hour of the day.*/
    if("none" === $(".expand").css("display")){
        $("#slider").slider('value', 0);
        $("#slider").slider('value', new Date().getHours());
    }

}

function createHourlyWeatherPanel(){
    var $slider = $('<div id="slider"></div>')
                    .appendTo($("#hourly-panel"));

    /* create a slider using jquery-ui library for 24 hour of any any day*/
    $slider.slider(
        {
            min    : 0,  // This maps to 12am (mid-night)
            max    : 23, // This maps to 11 pm
            value  : 0,  //initial value on slider
            animate: 1000, //slide the handle smoothly when the user clicks on the slider track.
            change: onChangeSliderValue, //set listener for value changing
            slide : onSlidingover //set listener for sliding action
        });

    /* create hours ticks dashes for even and odd hours*/
    $hoursTick = $('<div class="hour-ticks"></div>').appendTo($("#hourly-panel"));
    for (var i=0; i< 24; i++){
        $hoursTick.append('<span class="'+getHoursTickClass(i)+'"></span>');
    }

    /* create hours tags under the slider bar*/
    $hours = $('<div class="hours"></div>').appendTo($("#hourly-panel"));
    var timeTagObj = {am:"AM",pm:"PM"};
    for (var prop in timeTagObj){
        for(var i=2; i<=10; i+=2){
            $hours.append('<span class="hour">'+i+timeTagObj[prop]+'</span>');
        }
    }
    /* Finally insert 12AM/12PM in the appropriate locations on the sliding bar.*/
    $(".hour:contains(2AM)").before('<span class="hour">12AM</span>');
    $('<span class="hour">12PM</span>').insertBefore($(".hour:contains(2PM)"));

    /* display detailed weather information for every hour such it includes:
       humidity, cloud cover, temperature, wind speed, weather icon and summary description*/

    /*  1. Create icon div for hourly weather
        2. Append it to hourly panel*/
    $hourlyWeatherIcon = $("<div></div>").addClass("hourly-icon-container").
                        append('<canvas id="widget-forecast-hourly-icon" width="100" height="60"\
                               </canvas>').
                        appendTo($("#hourly-panel"));

    /* Add hourly weather summary and remove last full-stop or period*/
    $("#hourly-panel").append('<p class="hourly-summary"></p>');

    $detailedInfoTable = $('<table id="hourly-detailed-table"></table>').appendTo($("#hourly-panel"));
    $detailedInfoTable.append("<tr><th>Temp</th><th>Humidity</th><th>Wind</th>\                                            <th>Cloud Cover</th><tr>");
    $row = $("<tr></tr>").appendTo($detailedInfoTable);
}

function getHoursTickClass(i){
    return (i%2==0)? "even":"odd";
}

var onChangeSliderValue = onSlidingover = function(event, ui) {

    console.debug(new Date(forecastData.hourly.data[ui.value].time * 1000));
    /* Get the second row in the hourly detailed table. Note that eq filter uses zero-based index
       Then clear that row to add updated table data information for the selected value. */
    $row = $("#hourly-detailed-table tr:eq(1)").empty();
    $("<td></td>").appendTo($row).
            text(forecastData.hourly.data[ui.value].temperature).append("<sup>o<sup>");
    $("<td></td>").appendTo($row).text(forecastData.hourly.data[ui.value].humidity*100 + " %");
    $("<td></td>").appendTo($row).text(forecastData.hourly.data[ui.value].windSpeed + " kph");
    $("<td></td>").appendTo($row).text(forecastData.hourly.data[ui.value].cloudCover + " Okta");

    /* change corresponding weather icon and hourly summary. */
    wdgtSetIcon("widget-forecast-hourly-icon", forecastData.hourly.data[ui.value].icon);
    $(".hourly-summary").text(forecastData.hourly.data[ui.value].summary);
}
