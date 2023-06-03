
// get lists from server and append it

$(document).ready(function () {
    $(document).on('click', '#error_dismiss', function () {
        $(this).parent('div').hide(200)
    })
})

function showError(message) {
    $(document).ready(function () {
        var element = $('#error')
        var msg = element.children('span').text(message).hide();
        var btn = element.children('button').hide()
        element.slideDown(400, function () {
            element.css('display', 'flex')
            btn.show(100)
            msg.slideDown(300)
        })
        setInterval(() => {
            element.hide(200)
        }, 30000);
    })
}

$(document).on('click', '.lists li a', function () {
    $('.lists li.selected').removeClass('selected');
    $(this).parent('li').addClass('selected');
});


$(document).ready(function () {
    $("#task_text").on({
        input: function () {
            $(this).height(0); // Reset the height to 0
            $(this).height(this.scrollHeight);
        },
        keypress: function () {
            $(this)
                .css(
                    {
                        borderBottom: "1.5px solid saddlebrown",
                    },
                    500
                )
                .show(200);
        },
    });

    $(".profile_icon").on("click", function () {
        $(".profile").toggle(200).css("display", "flex");
    });

    var excludedSelectors = ".profile, .profile_icon";

    $(window).on("click", function (e) {
        var isExcluded = $(e.target).closest(excludedSelectors).length > 0;

        if (!isExcluded) {
            $(".profile").hide(400);
        }
    });
});


$(document).ready(function () {
    function isMobileDevice() {
        return $(window).width() <= 768;
    }

    function attachEventHandlers() {
        $("#toggle_on").on("click", function () {
            $(".leftpane").animate(
                {
                    width: "80%",
                    display: "flex",
                },
                300,
                function () {
                    $("#toggle_on").hide();
                    $("#toggle_off").show();
                    $(".bottom-leftpane").show();
                }
            );
        });

        $("#toggle_off").on("click", function () {
            $(".leftpane").animate(
                {
                    width: "0%",
                },
                300,
                function () {
                    $("#toggle_on").show();
                    $("#toggle_off").hide();
                    $(".bottom-leftpane").hide();
                }
            );
        });
    }

    function detachEventHandlers() {
        $("#toggle_on, #toggle_off").off("click");
    }

    function updateLayout() {
        if (isMobileDevice()) {
            // Mobile layout
            detachEventHandlers();
            attachEventHandlers();
        } else {
            // Desktop layout
            detachEventHandlers();
            $(".leftpane, .bottom-leftpane").removeAttr("style");
        }
    }

    updateLayout();

    $(window).on("resize", function () {
        updateLayout();
    });

    $(".container").on("click", function (e) {
        if (isMobileDevice() && $("#toggle_off").is(":visible")) {
            $("#toggle_off").click();
        }
    });
});
