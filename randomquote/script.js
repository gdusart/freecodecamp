var serviceUrl = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?";
var twitterUrl = "https://twitter.com/intent/tweet";
/*var serviceUrl = "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback=";*/

function setLoading(loading) {
    $("button").prop("disabled", loading);
    $("#newquote > i").toggleClass("fa-spin", $(loading));
}

function loadRandomQuote() {

    setLoading(true);

    /** For dev purpose */
    if (location.protocol === "file:" && false) {
      setTimeout(function () {
        setQuote("Confucius", "Exige beaucoup de toi-même et attends peu des autres. Ainsi beaucoup d'ennuis te seront épargnés.Exige beaucoup de toi-même et attends peu des autres.Exige beaucoup de toi-même et attends peu des autres.");
        setLoading(false);
      }, 0);
    }
    /** Actual call to API */
    else {
      $.getJSON(serviceUrl)
          .done(function(data) {
              setQuote(data.quoteAuthor, data.quoteText);
              setLoading(false);
          })
          .fail(function(response) {
              setQuote("", "An error has occured");
              setLoading(false);
          });
        }
}

function setQuote(author, quote) {
    $("#quote").text(quote);
    $("#author").text(author);
}

function getCurrentQuote() {
  return $("#quote").text();
}

function getCurrentAuthor() {
  return $("#author").text();
}

function tweetQuote() {
    var params = { text: getCurrentQuote() + " - " + getCurrentAuthor(), hashtags: "gdusart@freebootcamp"};
    var win = window.open(twitterUrl + "?" + $.param(params), "_blank");
}

$(function() {
    $.ajaxSetup({ cache: false });

    loadRandomQuote();
    $("#newquote").click(function(event) {
        loadRandomQuote();
    });

    $("#twitterLink").click(function() {
      tweetQuote();
    });
});
