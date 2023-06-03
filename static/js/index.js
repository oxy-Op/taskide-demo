
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

showError("DEMO VERSION: COMMAND WONT WORK")

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
            $(this).css({
                borderBottom: '1.5px solid saddlebrown'
            }, 500).show(200);
        }
    });

    $('.profile_icon').on('click', function () {
        $('.profile').toggle(200).css('display', 'flex');
    });


    var excludedSelectors = '.profile, .profile_icon';

    $(window).on('click', function (e) {
        var isExcluded = $(e.target).closest(excludedSelectors).length > 0;

        if (!isExcluded) {
            $('.profile').hide(400);
        }
    });


});


$(document).on('click', '.task_delete', function () {
    var me = $(this);
    $(me).parents('li').animate({
        width: 0,
        height: 0,
        opacity: 0
    }, 400, function () {
        $(me).parents('li').remove();
    })
})

$(document).on('click', '.task_edit', function () {
    var parent = $(this).closest('li');
    var span = parent.children('span');
    var input = $('<textarea id="editarea" autocomplete="off" maxlength="200" class="taskedit" rows="5">').val(span.text());
    var opt = parent.children('.options');

    // Set the textarea height and width to match the span element's height and width
    input.css({
        height: span.height(),
        width: span.width()
    });

    // Hide span and show textarea
    span.hide();
    parent.append(input);
    input.focus();

    // When user types in textarea
    input.on('input', function () {
        $(this).height(0); // Reset the height to 0
        $(this).height(this.scrollHeight);

        // Disable submit button if values are whitespace(s)
        if ($(this).val().trim() === "") {
            submit.prop('disabled', true);
        } else {
            submit.prop('disabled', false);
        }
    });

    // Submit button
    var submit = $('<button>').attr('type', 'submit').addClass('tasksubmit').text('Submit');

    // Create the cancel button
    var cancel = $('<button>').attr('type', 'submit').addClass('cancelsubmit').text('Cancel');

    // Create the div container and append the buttons
    var editoptions = $('<div>').addClass('editoptions').append(submit, cancel);
    // Append to parent container
    parent.append(editoptions);

    // Function to show .options and .editoptions when cancel button is clicked
    function showDiv() {
        parent.css('flex-direction', 'row');
        parent.children('.editoptions').remove();
        parent.append(opt);
    }

    parent.css('flex-direction', 'column');
    parent.children('.options').remove();
    submit.prop('disabled', true);

    // When cancel button is clicked
    editoptions.on('click', '.cancelsubmit', function () {
        showDiv();
        span.show();
        input.remove();
    });

    // When submit button is clicked
    editoptions.on('click', '.tasksubmit', function () {
        showDiv();
        span.text(input.val()).show();
        input.remove();
        input.css({
            height: 0,
            width: 0
        });
    });
});



document.getElementById('task_text').addEventListener('keypress', function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        addTask();
    }
});

function addTask() {
    var textarea_ = $("#task_text");
    if (textarea_.val().trim() == "") {
        return false;
    }
    let userInput = textarea_.val();
    console.log(userInput)
    let item = $('<li>').append($('<span>').text(userInput));
    item.hide().appendTo('.tasks').fadeOut(500, function () {
        $(this).fadeIn(500, function () {
        });
    });
    // item.
    $(".tasks").append(item);
    $(".tasks li").last().append("<div class='options'><button class = 'task_edit' ><img src='/static/assets/edit.svg' alt='edit svg'></button><button class='task_delete' ><img src='/static/assets/delete.svg' alt='delete svg'></button></div>")
    textarea_.val('');
    textarea_.height('');
    var myElement = $('.tasks');
    myElement.scrollTop((myElement[0].scrollHeight + 100) - myElement.outerHeight());
};

// Function to handle the process of adding items to a list container
function addList() {
    var parent = $('#addlist_btn').parent(); // Reference to the parent element
    var child = $('#addlist_btn'); // Reference to the add list button element

    // Replace the parent's children with an input element and set focus on it
    parent.empty().append($('<input id="input_list" class="addlist" type="text" autocomplete="off" maxlength="20" placeholder="Name your list">')).children().focus();

    // Event handlers for the add list input
    $('.addlist').on({
        // Handle keydown event
        keydown: function (e) {
            if (e.key === 'Enter') {
                var userInput = $.trim($('.addlist').val()); // Get user input and trim any whitespace
                if (userInput === '') {
                    return; // Do nothing if input is empty
                }

                var myElement = $('.lists'); // Reference to the list container
                var item = $('<li>').append($('<a>').append($('<span>').text(userInput))).hide(300).show(300, function () {
                    myElement.scrollTop(myElement[0].scrollHeight - myElement.outerHeight()); // Scroll to the bottom of the list container
                });

                item.append("<div><button class='list_task_edit'><img src='/static/assets/edit.svg' alt='edit svg'></button><button class='list_task_delete'><img src='/static/assets/delete.svg' alt='delete svg'></button></div>");
                $('.lists').append(item); // Append the new item to the list container

                parent.empty().append(child); // Replace the input with the original button
            }
        },
        // Handle blur event
        blur: function () {
            var input = $(this); // Reference to the input element
            input.animate({
                width: 0,
                opacity: 0
            }, 300, function () {
                parent.animate({
                    opacity: 1
                }, 200, function () {
                    parent.empty().append(child); // Replace the input with the original button
                });
            });
        }
    });
}


$(document).on('click', '.list_task_edit', function () {
    var parent = $(this).closest('li');
    var span = parent.children('a').children('span');
    var opt = parent.children('div')
    opt.remove();
    var inputElement = $('<input>', {
        type: 'text',
        maxlength: 20,
        autocomplete: 'off',
        class: 'list_textbox',
        value: span.text(),
    });
    span.remove();
    parent.children('a').append(inputElement);
    inputElement.focus();
    // inputElement.on('input', function (e) {
    //     // Disable submit button if values are whitespace(s)
    //     if ($(this).val().trim() === "") {
    //        e.preventDefault();
    //     }
    // });

    // Create the submit button
    var submit = $('<button>').attr('type', 'submit').addClass('list_tasksubmit').append($('<img>').attr('src', '/static/assets/tick.svg'))

    // Create the cancel button
    var cancel = $('<button>').attr('type', 'submit').addClass('list_cancelsubmit').append($('<img>').attr('src', '/static/assets/cross.svg'))

    var editoption = $('<div>').append(submit, cancel);
    // Append to parent container
    parent.append(editoption);

    inputElement.on('keydown', function (e) {
        if (e.key === 'Enter') {
            if ($(this).val().trim() === "") {
                e.preventDefault();
            }
            else {
                buttonClicked = true;
                $('.list_tasksubmit').click();
            }
        }
    })

    var buttonClicked = false;

    editoption.on('click', '.list_tasksubmit', function () {
        if (inputElement.val().trim() === "") {
            e.preventDefault();
        }
        else {
            buttonClicked = true;
            inputElement.remove();
            parent.children('a').append(span.text(inputElement.val()));
            parent.children('div').remove();
            parent.append(opt);
        }
    });

    inputElement.on('blur', function () {
        if (!buttonClicked) {
            inputElement.remove();
            parent.children('a').append(span);
            parent.children('div').remove();
            parent.append(opt);
        }
    });

    $('.list_tasksubmit').on('mousedown', function () {
        buttonClicked = true;
    });

});


$(document).ready(function () {
    function isMobileDevice() {
        return $(window).width() <= 768;
    }

    function attachEventHandlers() {

        $('#toggle_on').on('click', function () {
            $('.leftpane').animate({
                width: '80%',
                display: 'flex'
            }, 300, function () {
                $('#toggle_on').hide();
                $('#toggle_off').show();
                $('.bottom-leftpane').show();
            })
        });

        $('#toggle_off').on('click', function () {
            $('.leftpane').animate({
                width: '0%'
            }, 300, function () {
                $('#toggle_on').show();
                $('#toggle_off').hide();
                $('.bottom-leftpane').hide();
            });

        });
    }

    function detachEventHandlers() {
        $('#toggle_on, #toggle_off').off('click');
    }

    function updateLayout() {
        if (isMobileDevice()) {
            // Mobile layout
            detachEventHandlers();
            attachEventHandlers();
        } else {
            // Desktop layout
            detachEventHandlers();
            $('.leftpane, .bottom-leftpane').removeAttr('style');
        }
    }

    updateLayout();

    $(window).on('resize', function () {
        updateLayout();
    });

    $('.container').on('click', function (e) {
        if (isMobileDevice() && $('#toggle_off').is(':visible')) {
            $('#toggle_off').click()
        }
    });
});
