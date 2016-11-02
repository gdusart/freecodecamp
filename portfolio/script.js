function setSelectedMenuItem(anchorId) {
  var items = $('#navbar > ul > li > a[href^="#"]').each(function() {
    var link = this;
    $(link).parent().toggleClass("active", link.hash == anchorId);
  });
}

$(document).ready(function(){
    $('a[href^="#"]').on('click',function (e) {
        e.preventDefault();
        var target = this.hash;
        scrollToAnchor(target);
    });
});

function scrollToAnchor(divId){
    var container = $(divId);
    $('html,body').animate({scrollTop: container.offset().top - 50},'slow'); /*50px for navbar */
    setSelectedMenuItem(divId);
}

function getCurrentMenu() {
  return $("#navbar > ul > li.active");
}


/* Autoscroll on mouse wheel */
(function() {
  var delay = false;

  $(document).on('mousewheel DOMMouseScroll', function(event) {
    event.preventDefault();
    if(delay) return;

    delay = true;
    setTimeout(function(){delay = false},200)

    var wd = event.originalEvent.wheelDelta || -event.originalEvent.detail;

    var a = $(".section");
    if(wd < 0) {
      for(var i = 0 ; i < a.length ; i++) {
        var t = a[i].getClientRects()[0].top;
        if(t >= 60) break;
      }
    }
    else {
      for(var i = a.length-1 ; i >= 0 ; i--) {
        var t = a[i].getClientRects()[0].top;
        if(t < -20) break;
      }
    }

    if (typeof(a[i]) === 'undefined') {
      return;
    }

    scrollToAnchor("#" + a[i].id);
  });
})();
