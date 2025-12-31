(function ($) {
    "use strict";







    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content, .sidebar-toggler-container').toggleClass("open");


        if ($('.sidebar').hasClass('open')) {
            $('#sidebar-arrow').css('transform', 'rotate(180deg)');
        } else {
            $('#sidebar-arrow').css('transform', 'rotate(0deg)');
        }

        return false;
    });



    $('.pg-bar').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, { offset: '80%' });



    $('#calender').datetimepicker({
        inline: true,
        format: 'L'
    });

})(jQuery);

