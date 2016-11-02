$(document).ready(function() {
    /** Add some additional markers to the sections, used for scrolling **/
    $('.section').each(function() {
        $(this).prepend("<div class='sectionstart'></div>");
        $(this).append("<div class='sectionend'></div>");
    });

    /** Handle menu click >> scroll page to section **/
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = this.hash;
        scrollToAnchor(target);
    });
});

/* Set appropriate layout on menu items by toggling selected state */
function setSelectedMenuItem(anchorId) {
    var items = $('#navbar > ul > li > a[href^="#"]').each(function() {
        var link = this;
        $(link).parent().toggleClass("active", link.hash == anchorId);
    });
}

function scrollToAnchor(divId) {
    var container = $(divId);
    $('html,body').animate({
        /*50px for navbar */
        scrollTop: container.offset().top - 50
    }, 'slow');
    setSelectedMenuItem(divId);
}

function getCurrentMenuAnchor() {
    var menuItem = $("#navbar > ul > li.active > a").get(0);
    return menuItem.hash;
}

function getSections() {
    return $(".section");
}

/* Autoscroll on mouse wheel
 Based on http://stackoverflow.com/questions/25839487/auto-scroll-to-next-anchor-at-mouse-wheel
*/
(function() {
    var delay = false;

    $(document).on('mousewheel DOMMouseScroll', function(event) {

        var currentItemId = getCurrentMenuAnchor();
        if (typeof(currentItemId) === "undefined") {
            return;
        }

        /* Determine direction */
        var goingDown = (event.originalEvent.wheelDelta || -event.originalEvent.detail) < 0;

        /* Check if actual div content is visible
          If not, allow scrolling (required for mobile where section is not fully displayed)
        */
        var markerClass = goingDown ? "sectionend" : "sectionstart";
        var marker = $(currentItemId + " > div." + markerClass).get(0);
        if (!$(marker).visible()) {
            return;
        }

        event.preventDefault();
        if (delay) return;

        delay = true;
        setTimeout(function() {
            delay = false
        }, 200)


        var found = false;
        var sections = $(".section");
        if (goingDown) {
            for (var i = 0; i < sections.length; i++) {
                var t = sections[i].getClientRects()[0].top;
                if (t >= 60) {
                    found = true;
                    break;
                }
            }
        } else {
            for (var i = sections.length - 1; i >= 0; i--) {
                var t = sections[i].getClientRects()[0].top;
                if (t < -20) {
                    found = true;
                    break;
                }
            }
        }

        var toDisplay = sections[i];

        if (!found || typeof(toDisplay) === 'undefined') {
            return;
        }

        scrollToAnchor("#" + toDisplay.id);
    });
})();
