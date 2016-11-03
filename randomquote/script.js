var serviceUrl = "https://crossorigin.me/http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback=";
/*var serviceUrl = "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback=";*/

function setLoading(loading) {
    $("#newquote > i").toggleClass("fa-spin", $(loading));
    $("#circle").fadeTo(1500, loading ? 0.5 : 1);

    $("button").prop("disabled", loading);
}

function loadRandomQuote() {

    setLoading(true);

    /** For dev purpose */
    if (location.protocol === "file:") {
      setTimeout(function () {
        setQuote("Confucius", "Exige beaucoup de toi-même et attends peu des autres. Ainsi beaucoup d'ennuis te seront épargnés.Exige beaucoup de toi-même et attends peu des autres.Exige beaucoup de toi-même et attends peu des autres.");
        setLoading(false);
      }, 0);
    }
    /** Actual call to API */
    else {
      $.getJSON(serviceUrl)
          .done(function(data) {
              var quote = $(data[0].content).text();
              setQuote(data[0].title, quote);
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

$(function() {
    $.ajaxSetup({ cache: false });

    loadRandomQuote();
    $("#newquote").click(function(event) {
        loadRandomQuote();
    });
});
