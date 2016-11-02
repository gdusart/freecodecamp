var serviceUrl = "https://crossorigin.me/http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback=";

function setLoading(loading) {
    $("#newquote > i").toggleClass("fa-spin", loading ? true : false);
    $("#center").fadeTo(1500, loading ? 0.5 : 1);
}

function loadRandomQuote() {

    setLoading(true);

    $.getJSON(serviceUrl)
        .done(function(data) {
            var quote = $(data[0].content).text();
            setQuote(data[0].title, quote);
            setLoading(false);
        })
        .fail(function(response) {
            alert("error : " + response.statusText);
            setLoading(false);
        });

    /*
    setTimeout(function () {
      setQuote("Confucius", "Exige beaucoup de toi-même et attends peu des autres. Ainsi beaucoup d'ennuis te seront épargnés.Exige beaucoup de toi-même et attends peu des autres.Exige beaucoup de toi-même et attends peu des autres.");
      setLoading(false);
    }, 2000);
    */

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
