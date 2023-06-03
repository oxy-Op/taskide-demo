
// get lists from server and append it
$(document).ready(function () {
    $.getJSON("/api/lists/", function (data) {
        if (Object.values(data).some(item => Object.keys(item).length > 0)) {
            if (Object.keys(data).length !== 0) {
                Object.keys(data).forEach(function (listId) {
                    if (Object.keys(data[listId]).length !== 0) {
                        var list = data[listId];
                        var item = $("<li>").attr('id', `list_${listId}`).append(
                            $("<a>").append($("<span>").text(list.list))
                        );
                        item.append(
                            "<div><button class='list_task_edit'><img src='/static/assets/edit.svg' alt='edit svg'></button><button class='list_delete'><img src='/static/assets/delete.svg' alt='delete svg'></button></div>"
                        );
                        $(".lists").append(item); // Append the new item to the list container
                    }
                })
            }

        } else {
            showError('Add a list');
            $('#task_text').prop('disabled', true);
            $('#task_text').css('cursor', 'not-allowed');
            $(".addlist").css({
                outline: 'solid 3px black',
                transform: 'scale(1.1)'
            });
            setInterval(() => {
                $(".addlist").css({
                    outline: 'none',
                    transform: 'none'
                });
            }, 3000);
            window.onpopstate = function (event) {
                // Handle location change here
                let currentURL = window.location.href;
                let listID = currentURL.match(/\d+$/)[0];
                let listid = $('.lists li').attr('id').match(/\d+$/)[0];
                if (listID == listid) {
                    $('#task_text').prop('disabled', false);
                    $('#task_text').css('cursor', '');
                }
            };
        }

    }).fail(function () {
        showError('Failed to fetch lists')
    });
});

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
        }, 3000);
    })
}

$(document).on('click', '.lists li a', function () {
    $('.lists li.selected').removeClass('selected');
    $(this).parent('li').addClass('selected');
});

function getTasks(list_id) {
    $.get("/api/lists/" + parseInt(list_id), function (data) {
        if (data.tasks) {
            Object.keys(data.tasks).forEach(function (t) {
                if (Object.keys(data.tasks[t]).length !== 0) {
                    var item = $("<li>").attr('id', `list_${list_id}_task${t}`).append($("<span>").text(data.tasks[t]["task"]));
                    $(".tasks").append(item);
                    $(".tasks li")
                        .last()
                        .append(
                            "<div class='options'><button class = 'task_edit' ><img src='/static/assets/edit.svg' alt='edit svg'></button><button class='task_delete' ><img src='/static/assets/delete.svg' alt='delete svg'></button></div>"
                        );
                }

            });
        }
        else {
            showError('could not fetch tasks')
        }

    }).fail(function (xhr, status, error) {
        // Handle any errors
        showError(error)
    });
}

$(document).ready(function () {
    // Attach the popstate event handler
    $(window).on('popstate', function () {
        // Get the current list ID from the URL
        let currentURL = window.location.href;
        let listID = currentURL.match(/\d+$/)[0];
        $('.tasks').empty();
        getTasks(listID);
    });

    // Attach the click event handler to the link
    $(document).on("click", ".lists li a", function () {
        // Change the URL and navigate to another page
        let listID = $(this).parent('li').attr('id').match(/\d+$/)[0];
        history.pushState(null, null, listID);
        window.dispatchEvent(new Event('popstate'));
    });
});

// Get the current URL
var currentURL = location.href;
var matches = currentURL.match(/\/(\d+)$/);
if (matches && matches[1]) {
    var numericPart = matches[1];
    getTasks(numericPart);
}

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

$(document).on("click", ".task_delete", function () {
    var me = $(this);
    var id = $(this).parents('li').attr("id");
    var taskId = id.match(/\d+$/)[0]
    let currentURL = window.location.href;
    let listID = currentURL.match(/\d+$/)[0];
    $.ajax({
        url: `/api/lists/${listID}/task/${taskId}/delete`,
        type: "DELETE",
        contentType: "application/json"
    }).done(function (data, status) {
        if (status === 'success' && data['status'] === 'success') {
            $(me).parents("li")
                .animate(
                    {
                        width: 0,
                        height: 0,
                        opacity: 0,
                    },
                    400,
                    function () {
                        $(me).parents("li").remove();
                    }
                );
        }
        else {
            showError(data['status'] + ": " + data['message'])
        }
    }).fail(function (xhr, status, error) {
        showError(error);
    })
});

$(document).on("click", ".list_delete", function () {
    var me = $(this);
    let lD = me.parents("li").attr('id');
    let listID = lD.match(/\d+$/)[0];
    $.ajax({
        url: `/api/lists/${listID}/delete`,
        type: "DELETE",
        contentType: "application/json"

    }).done(function (data, status) {
        if (status === 'success' && data['status'] === 'success') {
            $(me).parents("li")
                .animate(
                    {
                        width: 0,
                        height: 0,
                        opacity: 0,
                    },
                    400,
                    function () {
                        $(me).parents("li").remove();
                    }

                );
            try {
                let currentURL = window.location.href;
                let url_last = currentURL.match(/\d+$/)[0];
                if (url_last == listID) {
                    window.location.href = '/'
                }
            } catch (error) {

            }

        }
        else {
            showError(data['status'] + ": " + data['message'])
        }
    }).fail(function (xhr, status, error) {
        showError(error)
    })
});

$(document).on("click", ".list_task_edit", function () {
    var parent = $(this).closest("li");
    var span = parent.children("a").children("span");
    var opt = parent.children("div");
    opt.remove();
    var inputElement = $("<input>", {
        type: "text",
        maxlength: 20,
        autocomplete: "off",
        class: "list_textbox",
        value: span.text(),
    });
    span.remove();
    parent.children("a").append(inputElement);
    inputElement.focus();

    // Create the submit button
    var submit = $("<button>")
        .attr("type", "submit")
        .addClass("list_tasksubmit")
        .append($("<img>").attr("src", "/static/assets/tick.svg"));

    // Create the cancel button
    var cancel = $("<button>")
        .attr("type", "submit")
        .addClass("list_cancelsubmit")
        .append($("<img>").attr("src", "/static/assets/cross.svg"));

    var editoption = $("<div>").append(submit, cancel);
    // Append to parent container
    parent.append(editoption);

    inputElement.on("keydown", function (e) {
        if (e.key === "Enter") {
            if ($(this).val().trim() === "") {
                e.preventDefault();
            } else {
                buttonClicked = true;
                $(".list_tasksubmit").click();
            }
        }
    });

    var buttonClicked = false;

    editoption.on("click", ".list_tasksubmit", function (e) {
        if (inputElement.val().trim() === "") {
            e.preventDefault();
        } else {
            var list_id = parent.attr('id')
            var l_id = list_id.match(/\d+$/)[0];
            $.ajax({
                url: `/api/lists/${l_id}/edit`,
                type: "PATCH",
                contentType: "application/json",
                data: JSON.stringify({
                    text: inputElement.val()
                })
            }).done(function (data, status) {
                if (status === "success" && data['status'] === "success") {
                    buttonClicked = true;
                    inputElement.remove();
                    parent.children("a").append(span.text(inputElement.val()));
                    parent.children("div").remove();
                    parent.append(opt);
                }
                else {
                    showError(data['status'] + ": " + data['message'])
                }
            }).fail(function (e, x, r) {
                showError(r)
            });
        }
    });

    inputElement.on("blur", function () {
        if (!buttonClicked) {
            inputElement.remove();
            parent.children("a").append(span);
            parent.children("div").remove();
            parent.append(opt);
        }
    });

    $(".list_tasksubmit").on("mousedown", function () {
        buttonClicked = true;
    });
});

$(document).on("click", ".task_edit", function () {
    var parent = $(this).closest("li");
    var span = parent.children("span");
    var input = $(
        '<textarea id="editarea" autocomplete="off" maxlength="200" class="taskedit" rows="5">'
    ).val(span.text());
    var opt = parent.children(".options");

    // Set the textarea height and width to match the span element's height and width
    input.css({
        height: span.height(),
        width: span.width(),
    });

    // Hide span and show textarea
    span.hide();
    parent.append(input);
    input.focus();

    // When user types in textarea
    input.on("input", function () {
        $(this).height(0); // Reset the height to 0
        $(this).height(this.scrollHeight);

        // Disable submit button if values are whitespace(s)
        if ($(this).val().trim() === "") {
            submit.prop("disabled", true);
        } else {
            submit.prop("disabled", false);
        }
    });

    // Submit button
    var submit = $("<button>")
        .attr("type", "submit")
        .addClass("tasksubmit")
        .text("Submit");

    // Create the cancel button
    var cancel = $("<button>")
        .attr("type", "submit")
        .addClass("cancelsubmit")
        .text("Cancel");

    // Create the div container and append the buttons
    var editoptions = $("<div>").addClass("editoptions").append(submit, cancel);
    // Append to parent container
    parent.append(editoptions);

    // Function to show .options and .editoptions when cancel button is clicked
    function showDiv() {
        parent.css("flex-direction", "row");
        parent.children(".editoptions").remove();
        parent.append(opt);
    }

    parent.css("flex-direction", "column");
    parent.children(".options").remove();
    submit.prop("disabled", true);

    // When cancel button is clicked
    editoptions.on("click", ".cancelsubmit", function () {
        showDiv();
        span.show();
        input.remove();
    });

    // When submit button is clicked
    editoptions.on("click", ".tasksubmit", function () {
        var id = parent.attr("id");
        var taskId = id.match(/\d+$/)[0];
        let currentURL = window.location.href;
        let listID = currentURL.match(/\d+$/)[0];
        $.ajax({
            url: `/api/lists/${listID}/task/${taskId}/edit`,
            contentType: "application/json",
            type: "PATCH",
            data: JSON.stringify({
                "text": input.val()
            })
        }).done(function (data, status) {
            if (status === "success" && data['status'] === "success") {
                showDiv();
                span.text(input.val()).show();
                input.remove();
                input.css({
                    height: 0,
                    width: 0,
                });
            }
            else {
                showError(data['status'] + ": " + data['message'])
            }
        }).fail(function (data, status, error) {
            showError(error);
        })
    });
});

document.getElementById("task_text")
    .addEventListener("keypress", function handleKeyDown(event) {
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
    try {
        var userInput = textarea_.val();
        let currentURL = window.location.href;
        var listID = currentURL.match(/\d+$/)[0];
    } catch (error) {
        showError('Please add a list')
    }
    if (listID !== undefined) {
        $.post(`/api/tasks/${listID}/count`, function (data, status) {
            if (data && status == "success") {
                $.ajax({
                    url: "/addtask",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        task: userInput,
                        list_id: parseInt(listID),
                    }),
                })
                    .done(function (response, status, jqXHR) {
                        if (jqXHR.status == 200 && response['status'] == 'success') {
                            var item = $("<li>")
                                .attr("id", `list_${listID}_task${data['task_count'] + 1}`)
                                .append($("<span>").text(userInput));
                            item
                                .hide()
                                .appendTo(".tasks")
                                .fadeOut(500, function () {
                                    $(this).fadeIn(500, function () { });
                                });
                            $(".tasks").append(item);
                            $(".tasks li")
                                .last()
                                .append(
                                    "<div class='options'><button class = 'task_edit' ><img src='/static/assets/edit.svg' alt='edit svg'></button><button class='task_delete' ><img src='/static/assets/delete.svg' alt='delete svg'></button></div>"
                                );
                            textarea_.val("");
                            textarea_.height("");
                            var myElement = $(".tasks");
                            myElement.scrollTop(
                                myElement[0].scrollHeight + 100 - myElement.outerHeight()
                            );
                        }
                        else {
                            showError(data['status'] + ": " + data['message'])
                        }
                    })
                    .fail(function (e, x, r) {
                        showError(r)
                    });
            }
            else {
                showError(data['status'] + ": " + data['message'])
            }

        });
    }
}

// Function to handle the process of adding items to a list container
function addList() {
    var parent = $("#addlist_btn").parent(); // Reference to the parent element
    var child = $("#addlist_btn"); // Reference to the add list button element

    // Replace the parent's children with an input element and set focus on it
    parent
        .empty()
        .append(
            $(
                '<input id="input_list" class="addlist" type="text" autocomplete="off" maxlength="20" placeholder="Name your list">'
            )
        )
        .children()
        .focus();

    // Event handlers for the add list input
    $(".addlist").on({
        // Handle keydown event
        keydown: function (e) {
            if (e.key === "Enter") {
                var userInput = $.trim($(".addlist").val()); // Get user input and trim any whitespace
                if (userInput === "") {
                    return; // Do nothing if input is empty
                }
                $.getJSON("/api/lists/count/")
                    .done(function (response, status) {
                        // Handle successful response here
                        console.log("Success:", response);
                        if (status === 'success') {
                            $.ajax({
                                url: "/addlist",
                                type: "POST",
                                contentType: "application/json",
                                data: JSON.stringify({
                                    id: response["count"] + 1,
                                    list: userInput,
                                })
                            }).done(function (data, status) {
                                if (status === 'success' && data['status'] === 'success') {
                                    var myElement = $(".lists"); // Reference to the list container
                                    var item = $("<li>").attr('id', `list_${response["count"] + 1}`)
                                        .append(
                                            $("<a>")
                                                .append($("<span>").text(userInput))
                                        )
                                        .hide(300)
                                        .show(300, function () {
                                            myElement.scrollTop(
                                                myElement[0].scrollHeight - myElement.outerHeight()
                                            ); // Scroll to the bottom of the list container


                                        })
                                    item.append(
                                        "<div><button class='list_task_edit'><img src='/static/assets/edit.svg' alt='edit svg'></button><button class='list_delete'><img src='/static/assets/delete.svg' alt='delete svg'></button></div>"
                                    );
                                    $(".lists").append(item); // Append the new item to the list container

                                    parent.empty().append(child);
                                }

                            }).fail(function (jqXHR, textStatus, errorThrown) {
                                console.log("error");
                                // TODO: Handle error;
                            });
                        }
                        else {
                            showError(data['status'] + ": " + data['message'])
                        }

                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        // Handle error or failure here
                        showError(errorThrown);
                    })


                // Replace the input with the original button
            }
        },
        // Handle blur event
        blur: function () {
            var input = $(this); // Reference to the input element
            input.animate(
                {
                    width: 0,
                    opacity: 0,
                },
                300,
                function () {
                    parent.animate(
                        {
                            opacity: 1,
                        },
                        200,
                        function () {
                            parent.empty().append(child); // Replace the input with the original button
                        }
                    );
                }
            );
        },
    });
}



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
