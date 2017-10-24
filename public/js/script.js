$(document).ready(function () {
    //close the mobile hamburger menu when link is clicked
    console.log('script loaded');
    $(function () {
        $('nav a').on('click', function () {
            console.log('.nav a click triggered');
            if ($('.navbar-toggler').css('display') != 'none') {
                $('.navbar-toggler').trigger("click");
                console.log("click was triggered in hamburger menu");
            }
        });
    });


    //offset the href of the page
    var navOffset = $('.navbar').height();
    console.log(navOffset);
    $('.navbar li a').click(function (event) {
        var href = $(this).attr('href');

        // Don't let the browser scroll, but still update the current address
        // in the browser.
        event.preventDefault();
        window.location.hash = href;

        // Explicitly scroll to where the browser thinks the element
        // is, but apply the offset.
        $(href)[0].scrollIntoView();
        window.scrollBy(0, -navOffset);
        console.log(navOffset);
    });

});
