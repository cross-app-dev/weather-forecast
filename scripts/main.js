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
    /****      Load the widget JS and apply it to the page        ****/
    /*****************************************************************/
    var wdgtScript = document.createElement("script");
    wdgtScript.addEventListener("load", buildForecastWidget);
    document.querySelector("head").appendChild(wdgtScript);
    /* TODO: fetch your widget.js from edumedia.*/
    wdgtScript.setAttribute("src","./scripts/widget.js");

    /* TODO: remove this skycons example.
    var skycons = new Skycons({color:"orange"});
    skycons.set("widget-forecast-icon", "rain");
    skycons.play();
    */

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

    if(scriptsLoaded === 4){
      //call the function in My widget script to load the JSON and build the widget
      console.log("all three are scripts loaded");
      buildWidget(".weather-forecast");
    }
}
