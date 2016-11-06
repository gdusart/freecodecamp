var iplocation_url = "https://freegeoip.net/json?callback=?";
var weather_api = "http://api.openweathermap.org/data/2.5/weather?callback=?"
var weather_api_key = "c3a98685120384f743a7da3e02611c45";
var flickr_api = "https://api.flickr.com/services/rest/?method=flickr.photos.search&callback=?"
var flickr_api_key = "273b135f9b33fa4a5583cfe82e4fe098";
var flickr_img_url = 'http://farm{farm}.static.flickr.com/{server}/{id}_{secret}_h.jpg';

var currentcity;

$(function() {
  getIPLocation();

  $("#locationbutton").click(function() {
    getBrowserLocation();
  });
});

/** To store the current application state */
var currentstate = {
  lat: 40.7142,
  lon: -74.00,
  city: "Arlon",
  units: "metric",
  appid: weather_api_key,
  pictures: [],
  pictureindex :0

}

/** State object **/
var weather_request = {
  /*lat: */
  /*lon: */
  /*units: */
  appid: weather_api_key
}

/**  flickr request properties */
var flickr_request = {
    api_key: '273b135f9b33fa4a5583cfe82e4fe098',

    /*city */
    accuracy: 16,

    /* for outdoors, but returns nothing ? */
    //geo_context: 2,

    /* Photos only */
    content_type: 1,

    /* public */
    privacy_filter: 1,

    /*outdoors*/
    /*geo_context: 2,*/
    per_page: 10,
    format: "json"
}

/**
Calls external IP to get location based on IP
*/
function getIPLocation() {
    $.getJSON(iplocation_url, function(data) {
      currentstate.lat = data.latitude;
      currentstate.lon = data.longitude;
      currentstate.city = data.city;
      onLocationUpdated();
    });
}

/**
Uses browser to get location (more precise)
*/
function getBrowserLocation() {
    //check geolocation available
    if ("geolocation" in navigator) {
        //try to get user current location using getCurrentPosition() method
        navigator.geolocation.getCurrentPosition(
            /* User accepted */
            function(position) {
              currentstate.lat = position.coords.latitude;
              currentstate.lon = position.coords.longitude;
              var latlng = {lat: parseFloat(currentstate.lat), lng:parseFloat(currentstate.lon)};
              var geocoder = new google.maps.Geocoder;

              geocoder.geocode({'location': latlng}, function(results, status) {
                /*TODO: error handling */

                var localityComponents = results[0].address_components.filter(function(value, index) {
                  return value.types.indexOf("locality") != -1;
                });
                currentstate.city = localityComponents[0].long_name;
                onLocationUpdated();
              });
            }
          );
    }
};


function refreshLocation() {
    $("#location").text(currentstate.city);
}

function onLocationUpdated() {
    refreshLocation();
    refreshWeather();
    refreshPictures();
}

function refreshWeather() {
    weather_request.lat = currentstate.lat;
    weather_request.lon = currentstate.lon;
    weather_request.unit = currentstate.unit;

    $.getJSON(weather_api, weather_request)
        .done(function(data) {
            onWeatherLoaded(data);
        })
        .fail(function(error) {
            alert("fail to load weather: " + JSON.stringify(error));
        });
}

function showNextPicture() {
  /* Check pictures are available */
  if (currentstate.pictures.length > 0) {
    /* end of array ? */
    if (currentstate.pictureindex >= currentstate.pictures.length) {
      currentstate.pictureindex = 0;
    }

    $("#citypicture").css("opacity",0);
    setTimeout(function() {
      $("#citypicture").attr("src", currentstate.pictures[currentstate.pictureindex++].link);
      $("#citypicture").css("opacity",1);}, 2000);
    }

}

function refreshPictures() {
    flickr_request.lat = currentstate.lat;
    flickr_request.lon = currentstate.lon;
    $.getJSON(flickr_api, flickr_request)
        .done(function(data) {} /* Handled by JSONP callback jsonFlickrApi */ );
}

function onWeatherLoaded(data) {
    $("#weathericon").removeClass(); /* reset icon */
    $("#weathericon").addClass("wi wi-owm-" + data.weather[0].id);

    $("#weather").text(data.weather[0].description);
}

function onPicturesLoaded(data) {
  currentstate.pictureindex = 0;
  currentstate.pictures = data;
  showNextPicture();
}

/** Will handle JSONP reply from flickr */
function jsonFlickrApi(response) {
    if (response.stat == "ok") {
        var mapped = $.map(response.photos.photo, function(elt) {
            return {
                // replace each {key} with its value
                link: flickr_img_url.replace(/({)([\w\-]+)(})/gi, function(str, p1, p2) {
                    return elt[p2];
                }),
                description: elt.title
            };
        });
    } else {
        return [];
    }

    onPicturesLoaded(mapped);
}

/* disable cache for ajax calls */
$.ajax({
    cache: false,
});

/* Change image every 5 second */
$(function() {
  setInterval(function() {
    showNextPicture();
  }, 15000)
})
