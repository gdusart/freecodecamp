$(document).ready(function(){
    $('a[href^="#"]').on('click',function (e) {
        var current = getCurrentMenu();
        e.preventDefault();
        var target = this.hash;
        scrollToAnchor(target);
        current.toggleClass("active");
        $(this).parent().toggleClass("active");
    });
});

function scrollToAnchor(divId){
    var container = $(divId);
    $('html,body').animate({scrollTop: container.offset().top - 50},'slow'); /*50px for navbar */
}

function getCurrentMenu() {
  return $("#navbar > ul > li.active");
}
