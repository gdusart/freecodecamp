var twitterUrl = "https://twitter.com/intent/tweet";
var serviceUrl = "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&_jsonp=?";

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
              var quote = $(data[0].content).text(); /* inside a <p> tag */
              setQuote($('<p/>').html(data[0].title).text(), quote); /* html-encoded string */
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
        event.preventDefault();
        loadRandomQuote();
    });

    $("#twitterLink").click(function() {
      event.preventDefault();
      tweetQuote();
    });
});
