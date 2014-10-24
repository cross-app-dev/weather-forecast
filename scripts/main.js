//MyWidget Script
/**************************
Add a link for a CSS file that styles .mywidget
Add a script tag that points to CDN version of jQuery 1.*
Add a script tag that loads your script file from http://m.edumedia.ca/
**************************/
document.addEventListener("DOMContentLoaded", function(){
    /*****************************************************************/
    /****      Load the CSS file and apply it to the page         ****/
    /*****************************************************************/
    var css = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("href", "css/widget.css");
    var scriptsLoaded = 0;

    /*****************************************************************/
    /****     Load the jQuery file and apply it to the page       ****/
    /*****************************************************************/
    var jq = document.createElement("script");
    jq.addEventListener("load", function(){
        scriptsLoaded++;
        if(scriptsLoaded === 2){
          //call the function in My widget script to load the JSON and build the widget
          console.log("both scripts loaded");
          buildWidget(".mywidget");
        }
    });
    document.querySelector("head").appendChild(jq);
    jq.setAttribute("src","//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js");

    /*****************************************************************/
    /****      Load the widget JS and apply it to the page        ****/
    /*****************************************************************/
    var script = document.createElement("script");
    script.addEventListener("load", function(){
        scriptsLoaded++;
        if(scriptsLoaded === 2){
          //call the function in My widget script to load the JSON and build the widget
          console.log("both scripts loaded");
          buildWidget(".mywidget");
        }
    });
    document.querySelector("head").appendChild(script);
    script.setAttribute("src","./scripts/widget.js");
});
