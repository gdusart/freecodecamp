var WIKI_API_URL ="http://en.wikipedia.org/w/api.php?callback=?"

function onSearch() {
  var keyword = $("#searchField").val();
  search(keyword);
}

$(function() {
  /*
  pleasewait = bootbox.dialog({
    message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> Loading...</div>',
    closeButton: false
  });*/

  /* Load atom livereload script for DEV only */
  if (isLocal()) {
      $.getScript("http://localhost:35729/livereload.js");
  }

  $("#searchButton").click(onSearch);
});

/** Check if the page is accessed local (dev) */
function isLocal() {
  return location.protocol === "file:";
}

function showResults(results) {
  var mapped = results.map(function(val) {
      var result = {
        title: val.title,
        summary: val.extract
      };

      if (val.thumbnail) {
        result.image = val.thumbnail.source;
      } else {
        result.image ="";
      }

      return result;
  });

  var html = $.templates("#articleTemplate").render(mapped);
  $("#results").html(html);
}

function search(keyword) {
  $.getJSON(WIKI_API_URL, {
    action:"query",
    format: "json",
    generator: "search",
    gsrnamespace: 0, /* articles */
    gsrlimit: 10, /* max 10 items */
    pilimit: "max",
    prop: "pageimages|extracts",
    formatversion: 2,
    exintro: 1,
    explaintext: 1,
    gsrsearch: keyword,
    exsentences: 1,
    exlimit: "max"
  },
  function(data) {
    showResults(data.query.pages);
  }
);

}
