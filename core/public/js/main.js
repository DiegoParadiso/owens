(function ($) {
    "use strict";







    // Sidebar Toggler
    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content, .sidebar-toggler-container').toggleClass("open");

        // Rotate arrow
        if ($('.sidebar').hasClass('open')) {
            $('#sidebar-arrow').css('transform', 'rotate(180deg)');
        } else {
            $('#sidebar-arrow').css('transform', 'rotate(0deg)');
        }

        return false;
    });


    // Progress Bar
    $('.pg-bar').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, { offset: '80%' });


    // Calender
    $('#calender').datetimepicker({
        inline: true,
        format: 'L'
    });

})(jQuery);

