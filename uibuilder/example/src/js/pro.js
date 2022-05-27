/**
 * Helper
 */

// get all html
function outerHTML(node) {
    return node.outerHTML || new XMLSerializer().serializeToString(node);
}

// randomizer name
var string_randomizer = function (length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

/**
 * Constant and Variable
 */

var page_history = null;
var page_count = null;
var page_current = null;
var page_previous = null;
var file_name = null; // To be remove
var filename = null;

/**
 * Worker
 */

// get all route/page
uibuilder.send({
    "topic": "get_routes_js",
    "payload": ""
});

// page loaded
$(document).on('page:afterin', function (callback) {
    page_history = app.views.main.history;
    page_count = page_history.length;
    page_current = page_history[page_count - 1];
    page_previous = page_history[page_count - 2];

    if (page_current === null) {
        filename = 'index.html'

        // Set filename actively edit
        uibuilder.send({
            "topic": "set_filename",
            "payload": filename
        });
    } else {
        if (page_current.split('/')[1] === "") {
            filename = 'index.html'

            // Set filename actively edit
            uibuilder.send({
                "topic": "set_filename",
                "payload": filename
            });
        } else {
            filename = page_current.split('/')[1] + '.html';

            // Set filename actively edit
            uibuilder.send({
                "topic": "set_filename",
                "payload": filename
            });

            // Get page data-name
            var data_name_status = app.views.main.$el.find('.page-current').attr('data-name');
            if (data_name_status === null) {
                var data_name = string_randomizer(2, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
                var data_name_new = data_name + string_randomizer(3, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
                var page_html = app.views.main.$el.find('.page-current').attr('data-name', data_name_new);
                page_html = page_html.removeClass('page-current');

                uibuilder.send({
                    "topic": "set_page_data_name",
                    "payload": html_beautify(page_html[0].outerHTML),
                    "page_data_name": data_name_new
                });

                page_html = page_html.addClass('page-current');

                uibuilder.send({
                    "topic": "get_page_data_name",
                    "payload": data_name_new,
                });
            } else {
                var page_data_name = app.views.main.$el.find('.page-current').attr('data-name');

                uibuilder.send({
                    "topic": "get_page_data_name",
                    "payload": page_data_name,
                });
            }

            // Get page id
            var data_id_status = app.views.main.$el.find('.page-current').attr('id');
            if (data_id_status === null) {
                var id = string_randomizer(2, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
                var id_new = id + string_randomizer(3, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
                var page_html = app.views.main.$el.find('.page-current').attr('id', id_new);
                page_html = page_html.removeClass('page-current');

                uibuilder.send({
                    "topic": "set_page_id",
                    "payload": html_beautify(page_html[0].outerHTML),
                    "page_id": id_new
                });

                page_html = page_html.addClass('page-current');

                uibuilder.send({
                    "topic": "get_page_id",
                    "payload": id_new,
                    "html": page_html[0].outerHTML
                });
            } else {
                var page_id = app.views.main.$el.find('.page-current').attr('id');

                uibuilder.send({
                    "topic": "get_page_id",
                    "payload": page_id,
                    "html": app.views.main.$el.find('.page-current')[0].outerHTML
                });
            }

            // get all page tags/element
            var html_page = app.views.main.$el.find('.page-current');
            var html_elements = html_page.find('*');

            var elements = [];
            var i = 0;
            for (i = 0; i < html_elements.length; i++) {
                // element name
                var element_name = html_elements[i].localName;

                // element class
                var classList = "";
                var j = 0;
                for (j = 0; j < html_elements[i].classList.length; j++) {
                    classList = classList + '.' + html_elements[i].classList[j];
                }

                // element id
                var element_id = html_elements[i].id;
                if (element_id === "") { // if element id not available set new
                    // can't give id with number first must start with a letter
                    var element_id_new = string_randomizer(2, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
                    var element_id_new_second = string_randomizer(3, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
                    element_id = element_id_new + element_id_new_second;

                    $(html_elements[i]).attr('id', element_id);

                    uibuilder.send({
                        "topic": "set_element_id",
                        "payload": html_beautify(html_page[0].outerHTML)
                    });
                }

                elements.push({
                    "classList": classList,
                    "id": element_id,
                    "name": element_name
                });
            }

            uibuilder.send({
                "topic": "get_page_elements",
                "payload": elements,
            });

            // Element cleaner
            var cleaner_html_page = $(document).find('.page-current');
            
            // Remove range bar
            var range_bar = cleaner_html_page.find('.range-bar');
            var j = 0;
            for (j = 0; j < range_bar.length - 1; j++) {
                var id = $(range_bar[j]).attr('id');
                cleaner_html_page.find('#' + id).remove();
            }

            // Remove range knob
            var range_knob = cleaner_html_page.find('.range-knob-wrap');
            var k = 0;
            for (k = 0; k < range_knob.length - 1; k++) {
                var id = $(range_knob[k]).attr('id');
                cleaner_html_page.find('#' + id).remove();
            }

            uibuilder.send({
                "topic": "set_element_id",
                "payload": html_beautify(cleaner_html_page[0].outerHTML)
            });
        }
    }
});

uibuilder.onChange('msgsReceived', function (newVal) {
    // receive request from pro to navigate

    if (msg.topic === "page_navigate") {
        var path = msg.payload;

        app.panel.close();

        // app.views.main.router.navigate(path);
        app.views.main.router.navigate(path, {
            reloadCurrent: true,
            ignoreCache: true
        });
    }

    // highlight the element
    if (msg.topic === "element_hightlight_id") {
        var id = msg.element_id;
        $(document).find('#' + id).addClass('highlight');
        // app.views.main.$el.find('#' + id).addClass('highlight');
    }

    // clear the element highlight 
    if (msg.topic === "element_hightlight_id_clear") {
        var id = msg.element_id;
        $(document).find('#' + id).removeClass('highlight');
        // app.views.main.$el.find('#' + id).removeClass('highlight');
    }

    // highlight the choosed/clicked element
    if (msg.topic === "set_element_id_choosed") {
        var id = msg.element_id;

        $(document).find('.highlight-choosed').removeClass('highlight-choosed');
        // app.views.main.$el.find('.highlight-choosed').removeClass('highlight-choosed');
        $(document).find('#' + id).addClass('highlight-choosed');
        // app.views.main.$el.find('#' + id).addClass('highlight-choosed');

        // for attach id
        if (page_current === null) {
            filename = 'index.html'
        } else {
            if (page_current.split('/')[1] === "") {
                filename = 'index.html'
            } else {
                filename = page_current.split('/')[1] + '.html';
            }
        }

        // Set filename actively edit just to make sure
        uibuilder.send({
            "topic": "set_filename",
            "payload": filename
        });
    }

    // To Do still fail to update id for class page level but on html element ok
    if (msg.topic === "update_element_id") {
        var html_page = app.views.main.$el.find('.page-current');
        html_page.find('#' + msg.element_id_selected).attr('id', msg.element_id).removeClass("highlight-choosed");
        // var html_page = app.views.main.$el.find('#' + msg.element_id_selected);
        // html_page.find('#' + msg.element_id_selected);
        // html_page.attr('id', msg.element_id);

        uibuilder.send({
            "topic": "update_element_id",
            "payload": html_beautify(html_page[0].outerHTML)
        });
    }

    // update page data-name
    if (msg.topic === "update_page_data_name") {
        var page_html = $(document).find('#' + msg.element_id).attr('data-name', msg.name);

        uibuilder.send({
            "topic": "update_page_data_name",
            "payload": page_html[0].outerHTML
        });
    }

    // Remove element 
    if (msg.topic === "remove_element_id") {
        // var html_page = app.views.main.$el.find('.page-current');
        // html_page.find('#' + msg.element_id_selected).remove();
        var html_page = $(document).find('#' + msg.element_id_selected);
        html_page.remove();

        app.panel.close();

        setTimeout(function () {
            // var html_page = app.views.main.$el.find('.page-current');
            var html_page = $(document).find('.page-current');

            uibuilder.send({
                "topic": "remove_element_id",
                "payload": html_beautify(html_page[0].outerHTML)
            });

            // this router will trigger afterin so the tree element reloaded also
            app.views.main.router.navigate(app.views.main.router.currentRoute.url, {
                reloadCurrent: true,
                ignoreCache: true
            });
        }, 2000);
    }

    // Add UI component
    if (msg.topic === "add_element_component") {
        $(document).find('.highlight-choosed').removeClass('highlight-choosed');

        var html_page = app.views.main.$el.find('.page-current');

        if (html_page[0].id === msg.element_id) {
            app.dialog.confirm('This will replace all your page layout! Do you want to continue?', function () {
                html_page.html(msg.component);

                uibuilder.send({
                    "topic": "add_element_component",
                    "payload": html_beautify(html_page[0].outerHTML)
                });
            }, function () {
                // Do Notihing
            });
        } else {
            if (html_page.find("#" + msg.element_id).length === 0) { // for panel view
                var html_page = $(document).find("#" + msg.element_id);

                if (msg.action === "inner") {
                    html_page.html(msg.component);
                } else if (msg.action === "append") {
                    html_page.append(msg.component);
                } else if (msg.action === "prepend") {
                    html_page.prepend(msg.component);
                } else if (msg.action === "before") {
                    html_page.parent().prepend(msg.component);
                } else if (msg.action === "after") {
                    html_page.parent().append(msg.component);
                } else if (msg.action === "replace_before") {
                    html_page.parent().prepend(msg.component);
                    html_page.remove();
                } else if (msg.action === "replace_after") {
                    html_page.parent().append(msg.component);
                    html_page.remove();
                }

                app.panel.close();

                setTimeout(function () {
                    html_page = app.views.main.$el.find('.page-current');

                    uibuilder.send({
                        "topic": "add_element_component",
                        "payload": html_beautify(html_page[0].outerHTML)
                    });
                }, 2000);
            } else { // for main center
                if (msg.action === "inner") {
                    html_page.find("#" + msg.element_id).html(msg.component);
                } else if (msg.action === "append") {
                    html_page.find("#" + msg.element_id).append(msg.component);
                } else if (msg.action === "prepend") {
                    html_page.find("#" + msg.element_id).prepend(msg.component);
                } else if (msg.action === "before") {
                    html_page.find("#" + msg.element_id).parent().prepend(msg.component);
                } else if (msg.action === "after") {
                    html_page.find("#" + msg.element_id).parent().append(msg.component);
                } else if (msg.action === "replace_before") {
                    html_page.find("#" + msg.element_id).parent().prepend(msg.component);
                    html_page.find("#" + msg.element_id).remove();
                } else if (msg.action === "replace_after") {
                    html_page.find("#" + msg.element_id).parent().append(msg.component);
                    html_page.find("#" + msg.element_id).remove();
                }

                uibuilder.send({
                    "topic": "add_element_component",
                    "payload": html_beautify(html_page[0].outerHTML)
                });
            }
        }
    }

    // Reload after add UI component
    if (msg.topic === "add_element_component_reload") {
        app.views.main.router.navigate(app.views.main.router.currentRoute.url, {
            reloadCurrent: true,
            ignoreCache: true
        });
    }

    // Create new page
    if (msg.topic === "page_create") {
        uibuilder.send({
            "topic": "page_create",
            "name": msg.name + '.html',
            "page_name": msg.name,
            "code": '<div class="page" data-name="' + msg.name + '"></div>'
            // "code": '<div class="page page-current" data-name="' + msg.name + '">' +
            //     '\t<div class="navbar no-shadow no-border">' +
            //     '\t\t<div class="navbar-bg"></div>' +
            //     '\t\t<div class="navbar-inner">' +
            //     '\t\t\t<div class="left">' +
            //     '\t\t\t\t<a class="link back">' +
            //     '\t\t\t\t\t<i class="f7-icons">arrow_left_circle</i>' +
            //     '\t\t\t\t</a>' +
            //     '\t\t\t</div>' +
            //     '\t\t\t<div class="title">Title</div>' +
            //     '\t\t\t<div class="right">&nbsp;</div>' +
            //     '\t\t</div>' +
            //     '\t</div>' +
            //     '\t<div class="page-content">' +
            //     '\t\t<div class="card">' +
            //     '\t\t\t<div class="card-content padding">Blank Page</div>' +
            //     '\t\t</div>' +
            //     '\t</div>' +
            //     '</div>'
        });
    }

    // Get Class of HTML element
    if (msg.topic === "get_element_class") {
        // var html_page = app.views.main.$el.find('#' + msg.element_id);
        var html_page = $(document).find('#' + msg.element_id);

        var classList = html_page.attr('class');

        uibuilder.send({
            "topic": "get_element_class",
            "payload": classList
        });
    }

    // Remove Class from HTML element
    if (msg.topic === "class_remove") {
        // var html_page = app.views.main.$el.find('.page-current');
        var html_page = $(document).find('#' + msg.element_id);

        // html_page.find('#' + msg.element_id).removeClass(msg.class_name);
        // html_page.find('#' + msg.element_id).removeClass("highlight-choosed");
        html_page.removeClass(msg.class_name);
        html_page.removeClass("highlight-choosed");

        app.panel.close();

        setTimeout(function () {
            html_page = $(document).find('.page-current');

            uibuilder.send({
                "topic": "class_remove",
                "payload": html_beautify(html_page[0].outerHTML),
                "element_id": msg.element_id
            });

            // Reload tree elements
            var html_elements = html_page.find('*');

            var elements = [];
            var i = 0;
            for (i = 0; i < html_elements.length; i++) {
                // element name
                var element_name = html_elements[i].localName;

                // element class
                var classList = "";
                var j = 0;
                for (j = 0; j < html_elements[i].classList.length; j++) {
                    classList = classList + '.' + html_elements[i].classList[j];
                }

                // element id
                var element_id = html_elements[i].id;

                elements.push({
                    "classList": classList,
                    "id": element_id,
                    "name": element_name
                });
            }

            uibuilder.send({
                "topic": "get_page_elements",
                "payload": elements,
            });

            html_page.find('#' + msg.element_id).addClass("highlight-choosed");
        }, 2000);
    }

    // Add Class to HTML element
    if (msg.topic === "class_add") {
        // var html_page = app.views.main.$el.find('.page-current');
        var html_page = $(document).find('#' + msg.element_id);

        // html_page.find('#' + msg.element_id).addClass(msg.class_name);
        // html_page.find('#' + msg.element_id).removeClass("highlight-choosed");
        html_page.addClass(msg.class_name);
        html_page.removeClass("highlight-choosed");

        app.panel.close();

        setTimeout(function () {
            html_page = $(document).find('.page-current');

            uibuilder.send({
                "topic": "class_add",
                "payload": html_beautify(html_page[0].outerHTML),
                "element_id": msg.element_id
            });

            // Reload tree elements
            var html_elements = html_page.find('*');

            var elements = [];
            var i = 0;
            for (i = 0; i < html_elements.length; i++) {
                // element name
                var element_name = html_elements[i].localName;

                // element class
                var classList = "";
                var j = 0;
                for (j = 0; j < html_elements[i].classList.length; j++) {
                    classList = classList + '.' + html_elements[i].classList[j];
                }

                // element id
                var element_id = html_elements[i].id;

                elements.push({
                    "classList": classList,
                    "id": element_id,
                    "name": element_name
                });
            }

            uibuilder.send({
                "topic": "get_page_elements",
                "payload": elements,
            });

            html_page.find('#' + msg.element_id).addClass("highlight-choosed");
        }, 2000);
    }

    // Get Style CSS of HTML element
    if (msg.topic === "get_element_style") {
        // var html_page = app.views.main.$el.find('#' + msg.element_id);
        var html_page = $(document).find('#' + msg.element_id);

        var style = html_page.attr('style');

        uibuilder.send({
            "topic": "get_element_style",
            "payload": style,
            "element_id": msg.element_id
        });
    }

    if (msg.topic === "update_element_style") { // this function call when click on element choosed
        // var html_page = app.views.main.$el.find('.page-current');
        // html_page.find('#' + msg.element_id).attr('style', msg.element_css);
        // html_page.find('#' + msg.element_id).removeClass("highlight-choosed");
        // html_page.find('#' + msg.element_id).removeClass("highlight");

        var html_page = $(document).find('#' + msg.element_id);
        html_page.attr('style', msg.element_css);
        html_page.removeClass("highlight-choosed");
        html_page.removeClass("highlight");

        app.panel.close(); // This will close when element selected, no other choice currently

        setTimeout(function () {
            html_page = $(document).find('.page-current');

            uibuilder.send({
                "topic": "update_element_style",
                "payload": html_beautify(html_page[0].outerHTML)
            });

            html_page.find('#' + msg.element_id).addClass("highlight-choosed");
        }, 2000);
    }

    // Get Routes of Pages
    if (msg.topic === "get_app_pages") {
        // request all route/page
        uibuilder.send({
            "topic": "get_routes_js",
            "payload": ""
        });
    }
});

$(document).on('click', function () {
    var html_page = app.views.main.$el.find('.page-current');
    html_page.find('#' + msg.element_id).removeClass("highlight-choosed");
    html_page.find('#' + msg.element_id).removeClass("highlight");
});