var weather_api = "http://api.openweathermap.org/data/2.5/weather?callback=?"
var weather_api_key = "c3a98685120384f743a7da3e02611c45";
var flickr_api = "https://api.flickr.com/services/rest/?method=flickr.photos.search&callback=?"
var flickr_api_key = "273b135f9b33fa4a5583cfe82e4fe098";
var flickr_img_url = 'http://farm{farm}.static.flickr.com/{server}/{id}_{secret}_z.jpg';


/** State object **/
var weather_request = {
    lat: 49.61,
    lon: 6.14,
    units: "metric",
    appid: weather_api_key
}

var flickr_request = {
    api_key: '273b135f9b33fa4a5583cfe82e4fe098',

    /* geolocation */
    lat: weather_request.lat,
    lon: weather_request.lon,

    /*region*/
    accuracy: 6,

    /* Photos only */
    content_type: 1,

    /* public */
    privacy_filter: 1,

    /*outdoors*/
    /*geo_context: 2,*/
    per_page: 5,
    format: "json"
}

$(function() {
    refreshLocation(); /* default display, before user reply */
    getLocation();
});

function getLocation() {
    //check geolocation available
    if ("geolocation" in navigator) {
        //try to get user current location using getCurrentPosition() method
        navigator.geolocation.getCurrentPosition(
            /* User accepted */
            function(position) {
                locationUpdated(position.coords.latitude, position.coords.longitude);
            }
        );
    } else {
        console.log("Browser doesn't support geolocation, returning Luxembourg location");
        onLocationLoaded(49.6195512, 6.144647500000019);
    }
};


function refreshLocation() {
    $("#location").text(weather_request.lat + " - " + weather_request.lon);
    refreshWeather();
}

function locationUpdated(lat, lon) {
    weather_request.lat = lat;
    weather_request.lon = lon;
    flickr_request.lat = lat;
    flickr_request.lon = lon;

    refreshWeather();
    refreshPictures();
}

function refreshWeather() {
    $.getJSON(weather_api, weather_request)
        .done(function(data) {
            onWeatherLoaded(JSON.stringify(data));
        })
        .fail(function(error) {
            alert("fail " + JSON.stringify(error));
        });
}

function refreshPictures() {
    $.getJSON(flickr_api, flickr_request)
        .done(function(data) {} /* Handled by JSONP callback jsonFlickrApi */
        /*.fail(function(error) {
            alert("fail to load pictures " + JSON.stringify(error));
        }*/
       );
}

function onWeatherLoaded(data) {
    $("#weather").text(data);
}

function onPicturesLoaded(data) {
$("#json").text(JSON.stringify(data));

  $("#pictures").empty();
  $.each(data, function(index, value) {
    $("#pictures").append($("<img/>", {src: value.link, alt: value.description, width: "300px"}));

  });
}

/** Will handle JSONP reply from flickr */
function jsonFlickrApi(response) {
  if (response.stat == "ok") {
    var mapped = $.map(response.photos.photo, function(elt){
      return {
        // replace each {key} with its value
        link: flickr_img_url.replace(/({)([\w\-]+)(})/gi, function(str, p1, p2) {return elt[p2];}),
        description: elt.title
      };
    });
  } else {
    return [];
  }

   onPicturesLoaded(mapped);
}
