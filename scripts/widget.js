/* Resources module is used to load all files required to build weather widget. */
var Resources = (function () {

    /* counter for number of files that have been loaded. */
    var scriptsLoaded = 0;
    var MAXIMUM_NUM_OF_ASYNC_FILES = 4;

    /* loadCSS: is used to add required css file to current document and set a callback function
        upon loading the file successfully. */
    var loadCSS = function (path, callback) {
        var css = document.createElement("link");
        css.addEventListener("load", callback );
        css.setAttribute("rel", "stylesheet");
        css.setAttribute("href", path);
        document.querySelector("head").appendChild(css);
    };

    /* loadJS: is used to add required JS file to current document and set a callback function
        upon loading the file successfully. */
    var loadJS = function (path, callback) {
        var js = document.createElement("script");
        js.addEventListener("load", callback );
        document.querySelector("head").appendChild(js);
        js.setAttribute("src",path);
    };

    /* loadJQueryUI: is used to fetch jquery-ui library then start building weather widget.
        Note that it must be loaded after loading of jquery js file to avoid runtime errors. */
    var loadJQueryUI = function(){
        loadJS("//code.jquery.com/ui/1.11.2/jquery-ui.min.js", buildWidget);
    }

    /* onFilesLoadedAsync: is callback function after fetching all files asynchronously. */
    var onFilesLoadedAsync = function(){
        console.debug("current file that is loaded is:",  this);
        scriptsLoaded++;

        if(scriptsLoaded === MAXIMUM_NUM_OF_ASYNC_FILES){
          console.log("asynchronous loading of scripts is done");
          loadJQueryUI("//code.jquery.com/ui/1.11.2/jquery-ui.min.js", buildWidget);
        }
    }

    var load = function () {
        console.debug('Loading required files for widget');

        loadCSS("//code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css",
                onFilesLoadedAsync);
        loadCSS("//m.edumedia.ca/show0017/mad9014/widget-resources/widget.css", onFilesLoadedAsync);
        loadJS("//cdnjs.cloudflare.com/ajax/libs/skycons/1396634940/skycons.min.js",
              onFilesLoadedAsync);
        loadJS("//code.jquery.com/jquery-1.11.1.min.js",onFilesLoadedAsync);
    };

  return {
    load: load
  };

})();

var ForecastAPI = (function () {

    var forecastData;
    var constructURL = function (){
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

    var requestDataAsync = function () {
        var xhr = $.ajax(
        {
            url :  constructURL(),
            dataType :"jsonp",
            type: "GET"
        }).done(function (data){
            console.log("forecast data is loaded succsfully");
            forecastData = data;
            console.debug(forecastData);
            DailyWeather.createPanel(".weather-forecast");
        }).fail( function( ){

            console.error("failed to load forecast data");
            console.log( xhr.status );
            //TODO: handle error cases.
        });
    };

    var getData = function (){
        return forecastData;
    };

  return {
      requestDataAsync: requestDataAsync,
      getData: getData
  };

})();

var Icon = (function () {

    var set = function ( canvasID, weatherState){

    /*  Skycons is a set of ten animated weather glyphs, procedurally generated by JavaScript using the
        HTML5 canvas tag. Skycons were designed for Forecast.io */
    var skycons = new Skycons();

    /* According to thier original exmaples: http://darkskyapp.github.io/skycons/
       Canvas has been created using jQuery and set to an id.*/
    skycons.set(canvasID, weatherState);

    /* Start the icon animation. */
    skycons.play();
}
  return {
    set: set
  };

})();

var HourlyWeather = (function () {

    var getHoursTickClass = function (i){
        return (i%2==0)? "even":"odd";
    };

    var onSlidingOver = onChangeValue = function(event, ui) {

        var forecastData = ForecastAPI.getData();
        console.debug(new Date(forecastData.hourly.data[ui.value].time * 1000));
        /* Get the second row in the hourly detailed table. Note that eq filter uses zero-based index
           Then clear that row to add updated table data information for the selected value. */
        $("#hourly-detailed-table tr:eq(1) td").each(function(index){
            switch(index){
                    case 0:
                        $(this).text(forecastData.hourly.data[ui.value].temperature).
                            append("<sup>o<sup>");
                        break;
                    case 1:
                        $(this).text(Math.round(forecastData.hourly.data[ui.value].humidity*100) +
                                       "%");
                        break;
                    case 2:
                        $(this).text(forecastData.hourly.data[ui.value].windSpeed + " kph");
                        break;
                    case 3:
                        $(this).text(forecastData.hourly.data[ui.value].cloudCover + " Okta");
                        break;
            }

        });

        /* change corresponding weather icon and hourly summary. */
        Icon.set("widget-forecast-hourly-icon", forecastData.hourly.data[ui.value].icon);
        $(".hourly-summary").text(forecastData.hourly.data[ui.value].summary);
    };

    var createPanel = function (){

        var panelHTML = '<div id="slider"></div>';

        /* create hours ticks dashes for even and odd hours*/
        panelHTML   +=   '<div class="hour-ticks">';
        for (var i=0; i< 24; i++){
            panelHTML += '<span class="'+getHoursTickClass(i)+'"></span>';
        }
        panelHTML +='</div>';

        /* create hours tags under the slider bar*/
        panelHTML += '<div class="hours">';
        panelHTML += '<span class="hour">12AM</span>'
        for (var i=2; i<24; i+=2){
            var hour = (i % 12 || 12) + ((i<12)?"AM":"PM");
            panelHTML += '<span class="hour">' + hour + '</span>';
        }

        /*  1. Create icon div for hourly weather
            2. Hourly weather summary
            3. Table for detailed hourly information with four table data cells:
                humidity, cloud cover, temperature, wind speed*/
        panelHTML += '<div class="hourly-icon-container">\
                        <canvas id="widget-forecast-hourly-icon" width="100" height="60"</canvas>\                             </div>';
        panelHTML += '<p class="hourly-summary"></p>';

        panelHTML += '<table id="hourly-detailed-table">\
                        <tr><th>Temp</th><th>Humidity</th><th>Wind</th><th>Cloud Cover</th></tr>\
                        <tr><td></td><td></td><td></td><td></td></tr>\
                     </table>';

        $("#hourly-panel").append(panelHTML);

        /* create a slider using jquery-ui library for 24 hour of any any day*/
        var $slider = $("#slider");
        $slider.slider(
            {
                min    : 0,  // This maps to 12am (mid-night)
                max    : 23, // This maps to 11 pm
                value  : 0,  //initial value on slider
                animate: 1000, //slide the handle smoothly when the user clicks on the slider track.
                slide : onSlidingOver, //set listener for sliding action
                change: onChangeValue /* set listner after changing the slider value programmatically as
                done inside onButtonClicked */

            });
    };

  return {
    createPanel: createPanel
  };

})();

var DailyWeather = (function () {

    var forecastData;
    var weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    var onButtonClicked = function (){
        console.debug("dialy panel button has been clicked");

        /* Toggle sliding direction for hourly panel inside the daily panel. As well as,
           the visibilty of child spans for the circular button. */
        $("#hourly-panel").slideToggle( "slow" );
        $(".expand").toggle();
        $(".fold").toggle();

        /*In case of expansion, let the slider moves from the begining till the current hour of the
            day.*/
        if("none" === $(".expand").css("display")){
            $("#slider").slider('value', 0);
            $("#slider").slider('value', new Date().getHours());
        }
    }

    var createPanel = function (weatherWidgetClass){

    /* Create new div element and set its class to panel class.*/
    var htmlPanel = '<div class="daily-panel">';

    /* Create paragraph for today*/
    htmlPanel += '<p class="today">'+ weekDays[new Date().getDay()] +'</p>';

    /* Create icon div for average weather of the whole day.*/
    htmlPanel += '<div class="today-icon-container">';
    htmlPanel += '<canvas id="widget-forecast-today-icon" width="36" height="36" </canvas>';
    htmlPanel += '</div>'; // closing tage for div with class today-icon-container

    forecastData = ForecastAPI.getData();

    /* Add today weather summary and remove last full-stop or period*/
    htmlPanel += '<p class="summary">' + forecastData.daily.data[0].summary.slice(0,-1) + '</p>';

    /* Add circular button to indicate that daily weather panel is expandable*/
    htmlPanel += '<div class="circular-button">';
    htmlPanel += '<span class="expand">+</span>';
    htmlPanel += '<span class="fold">-</span>';
    htmlPanel += '</div>'; //closing tag for div with class circular-buton

    /* create a container for inner hourly panel inside the daily panel.*/
    htmlPanel += '<div id="hourly-panel"></div>';

    htmlPanel +='</div>'; //closing tag for div with class daily-panel

    /* append panel div html string to current weather forecast div */
    $(weatherWidgetClass).append(htmlPanel);

    /* set callback function upon clicking the circular button. */
    $(".circular-button").click(onButtonClicked);

    /* Set icon of weather using skycons */
    Icon.set("widget-forecast-today-icon", forecastData.daily.data[0].icon);

    /* create all required div elements for hourly weather panel. */
    HourlyWeather.createPanel();
}

  return {
    createPanel: createPanel
  };

})();

document.addEventListener("DOMContentLoaded", function(){
    Resources.load();
});

function buildWidget(){
    console.log("Start to fetch data from Forecast.io website using Ajax");
    ForecastAPI.requestDataAsync();
    /*setTimeout(function (){console.log("Timeout:", ForecastAPI.getData());}, 1000);*/
    //DailyWeather.createPanel();
}
