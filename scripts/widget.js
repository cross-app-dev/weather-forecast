function buildWidget(cssClass){


    console.log("Start to fetch data from Forecast.io website using Ajax");
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

     }).fail( function( ){

        //this function will run if the AJAX call fails for any reason.
        console.log("failed to load forecast data");
        console.log( xhr.status );

        /*TODO: handle error cases.*/

     });
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
