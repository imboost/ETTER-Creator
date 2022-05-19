page_history = app.views.main.history;
page_count = page_history.length;
page_current = page_history[page_count - 1];
page_previous = page_history[page_count - 2];

if (page_current === '/designer/') {
    panel_left_morph();
    panel_right_morph();

    window.onresize = function () {
        panel_left_morph();
        panel_right_morph();
    }

    uibuilder.send({
        "topic": "get_ip_address",
        "payload": ""
    });

    uibuilder.send({
        "topic": "uibuilder_all",
        "payload": ""
    });
}

$$(document).on('click', '#btn-list-application', function () {
    $$(document).find('#right-toolbar').hide();
    $$(document).find('#right-tabs').hide();
    $$(document).find('#application').html('');

    uibuilder.send({
        "topic": "uibuilder_all",
        "payload": ""
    });
});

uibuilder.onChange('msgsReceived', function (newVal) {
    if (msg.topic === "get_ip_address") {
        ip_address = msg.payload;
    }

    if (msg.topic === "uibuilder_all") {
        $$(document).find('#applications-list').empty();
        $$(document).find('#applications-list').append('<li class="item-divider">Applications<span style="margin-left: auto;margin-right:0;"><i class="f7-icons" style="font-size: small;cursor: pointer;">plus</i></span></li>');
        $$(document).find('#applications-list').append('<form class="searchbar">' +
            '    <div class="searchbar-inner">' +
            '        <div class="searchbar-input-wrap"> ' +
            '            <input type="search" placeholder="Search" id="application-search-input"> ' +
            '            <i class="searchbar-icon"></i>' +
            '            <span class="input-clear-button"></span> ' +
            '        </div> ' +
            '        <span class="searchbar-disable-button">Cancel</span>' +
            '    </div>' +
            '</form>');

        var i = 0;
        for (i = 0; i < msg.payload.length; i++) {
            if (msg.payload[i] === ".config") {
                // Do Nothing
            } else if (msg.payload[i] === "common") {
                // Do Nothing
            } else if (msg.payload[i] === "package-lock.json") {
                // Do Nothing
            } else if (msg.payload[i] === "package.json") {
                // Do Nothing
            } else if (msg.payload[i] === "node_modules") {
                // Do Nothing
            } else if (msg.payload[i] === "pro") {
                // Do Nothing
            } else {
                $$(document).find('#applications-list').append('<li class="item-link" id="btn-application-load" data-name="' + msg.payload[i] + '">' +
                    '    <div class="item-content">' +
                    '        <div class="item-inner">' +
                    '            <div class="item-title">' + msg.payload[i] + '</div>' +
                    '        </div>' +
                    '    </div>' +
                    '</li>');
            }
        }
    }

    if (msg.topic === "get_routes_js") {
        $$(document).find('#applications-list').empty();
        $$(document).find('#applications-list').append('<li class="item-divider"><i class="f7-icons" style="font-size: small;cursor: pointer;" id="btn-list-application">arrow_left</i>&nbsp;Pages<span style="margin-left: auto;margin-right:0;"><i class="f7-icons" id="btn-page-create" style="font-size: small;cursor: pointer;">plus</i></span></li>');
        $$(document).find('#applications-list').append('<form class="searchbar">' +
            '    <div class="searchbar-inner">' +
            '        <div class="searchbar-input-wrap"> ' +
            '            <input type="search" placeholder="Search" id="page-search-input"> ' +
            '            <i class="searchbar-icon"></i>' +
            '            <span class="input-clear-button"></span> ' +
            '        </div> ' +
            '        <span class="searchbar-disable-button">Cancel</span>' +
            '    </div>' +
            '</form>');

        var i = 0;
        for (i = 0; i < msg.payload.length; i++) {
            var title = msg.payload[i].path.split('/')[1];
            if (title === "") {
                title = "index";
            }
            if (title !== undefined) {
                $$(document).find('#applications-list').append('<li class="item-link" id="btn-page-load" data-path="' + msg.payload[i].path + '">' +
                    '    <div class="item-content">' +
                    '        <div class="item-inner">' +
                    '            <div class="item-title">' + title + '</div>' +
                    '        </div>' +
                    '    </div>' +
                    '</li>');
            }
        }
    }

    if (msg.topic === "get_page_data_name") {
        $$(document).find('#page_data_name').val(msg.payload);
        $$(document).find('#page_data_name').addClass('input-with-value');
        $$(document).find('#item_page_data_name').addClass('item-input-with-value');
    }

    if (msg.topic === "get_page_id") {
        $$(document).find('#element_id').val(msg.payload);
        $$(document).find('#element_id').addClass('input-with-value');
        $$(document).find('#item_element_id').addClass('item-input-with-value');

        element_id_selected = msg.payload;
        page_opened = msg.html;
    }

    if (msg.topic === "get_page_elements") {
        // element_id_selected = null;

        $$(document).find('#applications-list').empty();
        $$(document).find('#applications-list').append('<li class="item-divider"><i class="f7-icons" style="font-size: small;cursor: pointer;" id="btn-list-page">arrow_left</i>&nbsp;Page Elements</li>');
        $$(document).find('#applications-list').append('<form class="searchbar">' +
            '    <div class="searchbar-inner">' +
            '        <div class="searchbar-input-wrap"> ' +
            '            <input type="search" placeholder="Search" id="element-search-input"> ' +
            '            <i class="searchbar-icon"></i>' +
            '            <span class="input-clear-button"></span> ' +
            '        </div> ' +
            '        <span class="searchbar-disable-button">Cancel</span>' +
            '    </div>' +
            '</form>');

        var i = 0;
        for (i = 0; i < msg.payload.length; i++) {
            $$(document).find('#applications-list').append('<li class="btn-tree-choose" data-id="' + msg.payload[i].id + '">' +
                '    <div class="item-content">' +
                '        <div class="item-inner">' +
                '           <div class="item-title" style="cursor: pointer;font-size: small;">' +
                '               <i class="f7-icons text-color-red margin-right" id="btn-remove-element" data-id="' + msg.payload[i].id + '" style="font-size: small;cursor: pointer;">trash</i>' +
                '               <span class="text-color-orange">' + msg.payload[i].name + '</span>' +
                '               <span class="text-color-green" style="font-size: large;">#' + msg.payload[i].id + '</span>&nbsp;' +
                msg.payload[i].classList +
                '           </div>' +
                '        </div>' +
                '    </div>' +
                '</li>');
        }

        // $$(document).find('#element_list').empty();

        // var i = 0;
        // for (i = 0; i < msg.payload.length; i++) {
        //     $$(document).find('#element_list').append('<li class="btn-tree-choose" data-id="' + msg.payload[i].id + '">' +
        //         '    <div class="item-content">' +
        //         '        <div class="item-inner">' +
        //         '           <div class="item-title" style="cursor: pointer;font-size: small;">' +
        //         '               <i class="f7-icons text-color-red margin-right" id="btn-remove-element" data-id="' + msg.payload[i].id + '" style="font-size: small;cursor: pointer;">trash</i>' +
        //         '               <span class="text-color-blue">' + msg.payload[i].name + '</span>' +
        //         '               <span class="text-color-orange">#' + msg.payload[i].id + '</span>' + msg.payload[i].classList + '</div>' +
        //         '        </div>' +
        //         '    </div>' +
        //         '</li>');
        // }
    }

    if (msg.topic === "update_element_id") {
        app.toast.create({
            text: 'Updated',
            position: 'center',
            closeTimeout: 2000
        }).open();
    }

    if (msg.topic === "update_page_data_name") {
        app.toast.create({
            text: 'Updated',
            position: 'center',
            closeTimeout: 2000
        }).open();
    }

    if (msg.topic === "add_element_component") {
        uibuilder.send({
            "topic": "add_element_component_reload"
        });
    }

    if (msg.topic === "code_save") {
        app.toast.create({
            text: 'Saved',
            position: 'center',
            closeTimeout: 2000
        }).open();
    }

    if (msg.topic === "page_create_canceled") {
        app.toast.create({
            text: 'Page Name Used',
            icon: '<i class="f7-icons text-color-red">exclamationmark_circle</i>',
            position: 'center',
            closeTimeout: 2000
        }).open();
    }

    if (msg.topic === "page_create") {
        var path = '/' + msg.page_name + '/';

        // Reload Project
        $$(document).find('#application').empty();
        $$(document).find('#application').html('<object id="app_container" data="http://' + ip_address + '/' + app_name + '" type="text/html" style="width: 99%;height: 98%;border-radius: 5px;border: 1px solid #121212;"></object>');

        // uibuilder.send({
        //     "topic": "set_app_name",
        //     "payload": app_name
        // });

        // Open New Page Created
        app.dialog.confirm('New page <strong class="text-color-orange">' + msg.page_name + '</strong> created, open it now?', function () {
            // Send request to the app for navigate page
            uibuilder.send({
                "topic": "page_navigate",
                "payload": path
            });

            // Clear element properties
            $$(document).find('#element_id').val('');
            $$(document).find('#element_id').removeClass('input-with-value');
            $$(document).find('#item_element_id').removeClass('item-input-with-value');

            // Properties option
            $$(document).find('#right-toolbar').show();
            $$(document).find('#right-tabs').show();
        });
    }

    if (msg.topic === "page_remove") {
        // Reload Project
        $$(document).find('#application').empty();
        // $$(document).find('#application').html('<object id="app_container" data="http://' + ip_address + '/' + app_name + '" type="text/html" style="width: 99%;height: 89%;margin-top: 60px;border-radius: 5px;border: 1px solid #121212;"></object>');
        $$(document).find('#application').html('<object id="app_container" data="http://' + ip_address + '/' + app_name + '" type="text/html" style="width: 99%;height: 98%;border-radius: 5px;border: 1px solid #121212;"></object>');

        uibuilder.send({
            "topic": "set_app_name",
            "payload": app_name
        });

        $$(document).find('#right-toolbar').hide();
        $$(document).find('#right-tabs').hide();
    }

    if (msg.topic === "get_element_class") {
        var classList = msg.payload.split(" ");

        $$(document).find('#class-list').empty();

        var i = 0;
        for (i = 0; i < classList.length; i++) {
            if (classList[i] === "highlight" || classList[i] === "highlight-choosed") {
                // Do Nothing
            } else {
                $$(document).find('#class-list').append('<li>' +
                    '    <div class="item-content">' +
                    '        <div class="item-inner">' +
                    '            <div class="item-title">' + classList[i] + '</div>' +
                    '            <div class="item-after">' +
                    '                <i class="f7-icons text-color-red" id="btn-remove-class" data-class="' + classList[i] + '" style="cursor: pointer;font-size: medium;">trash</i>' +
                    '            </div>' +
                    '        </div>' +
                    '    </div>' +
                    '</li>');
            }

            // text alignment check
            if (classList[i] === "text-align-left") {
                $$(document).find('.btn-element-text-alignment').removeClass('button-active');
                $$(document).find('#btn-element-text-left').addClass('button-active');
            }

            if (classList[i] === "text-align-right") {
                $$(document).find('.btn-element-text-alignment').removeClass('button-active');
                $$(document).find('#btn-element-text-right').addClass('button-active');
            }

            if (classList[i] === "text-align-center") {
                $$(document).find('.btn-element-text-alignment').removeClass('button-active');
                $$(document).find('#btn-element-text-center').addClass('button-active');
            }

            if (classList[i] === "text-align-justify") {
                $$(document).find('.btn-element-text-alignment').removeClass('button-active');
                $$(document).find('#btn-element-text-justify').addClass('button-active');
            }
        }
    }

    if (msg.topic === "class_remove") {
        uibuilder.send({
            "topic": "get_element_class",
            "element_id": msg.element_id
        });

        // reload tree
    }

    if (msg.topic === "class_add") {
        uibuilder.send({
            "topic": "get_element_class",
            "element_id": msg.element_id
        });

        // reload tree
    }

    if (msg.topic === "get_element_style") {
        // Clear First
        $$(document).find('#item-style-font-size').val('');
        $$(document).find('#item-style-font-weight').val('');

        $$(document).find('#border-top-left-radius').val('');
        $$(document).find('#border-top-right-radius').val('');
        $$(document).find('#border-bottom-left-radius').val('');
        $$(document).find('#border-bottom-right-radius').val('');

        $$(document).find('#border-top').val('');
        $$(document).find('#border-right').val('');
        $$(document).find('#border-bottom').val('');
        $$(document).find('#border-left').val('');

        // Set Value
        if (msg.payload === null) {
            $$(document).find('#element_css').val('');

            $$(document).find('#item_style').removeClass('item-input-focused');
            $$(document).find('#item_style').removeClass('item-input-with-value');
            $$(document).find('#element_css').removeClass('input-with-value');
            $$(document).find('#element_css').removeClass('item-input-with-value');
        } else {
            var style_append = "";
            var style_rule = msg.payload.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    style_append = style_append + style_rule[i] + ';\r\n';

                    if (style_rule[i].includes("font-size:")) {
                        var style_value = style_rule[i].split(':');
                        style_value = style_value[1].replace(/\s/g, '');
                        $$(document).find('#item-style-font-size').val(style_value);
                    }

                    if (style_rule[i].includes("font-weight:")) {
                        var style_value = style_rule[i].split(':');
                        style_value = style_value[1].replace(/\s/g, '');
                        $$(document).find('#item-style-font-weight').val(style_value);
                    }

                    if (style_rule[i].includes("border-top-left-radius:")) {
                        var style_value = style_rule[i].split(':');
                        style_value = style_value[1].replace(/\s/g, '');
                        style_value = style_value.replace('px', '');
                        style_value = style_value.replace('%', '');
                        $$(document).find('#border-top-left-radius').val(Number(style_value));
                    }

                    if (style_rule[i].includes("border-top-left-radius:")) {
                        var style_value = style_rule[i].split(':');
                        style_value = style_value[1].replace(/\s/g, '');
                        if (style_value.includes("px")) {
                            $$(document).find('#border-top-left-radius-unit').val('px');
                        } else {
                            $$(document).find('#border-top-left-radius-unit').val('%');
                        }
                    }

                    if (style_rule[i].includes("border-top-right-radius:")) {
                        var style_value = style_rule[i].split(':');
                        style_value = style_value[1].replace(/\s/g, '');
                        style_value = style_value.replace('px', '');
                        style_value = style_value.replace('%', '');
                        $$(document).find('#border-top-right-radius').val(Number(style_value));
                    }

                    if (style_rule[i].includes("border-top-right-radius:")) {
                        var style_value = style_rule[i].split(':');
                        style_value = style_value[1].replace(/\s/g, '');
                        if (style_value.includes("px")) {
                            $$(document).find('#border-top-right-radius-unit').val('px');
                        } else {
                            $$(document).find('#border-top-right-radius-unit').val('%');
                        }
                    }

                    if (style_rule[i].includes("border-bottom-right-radius:")) {
                        var style_value = style_rule[i].split(':');
                        style_value = style_value[1].replace(/\s/g, '');
                        style_value = style_value.replace('px', '');
                        style_value = style_value.replace('%', '');
                        $$(document).find('#border-bottom-right-radius').val(Number(style_value));
                    }

                    if (style_rule[i].includes("border-bottom-right-radius:")) {
                        var style_value = style_rule[i].split(':');
                        style_value = style_value[1].replace(/\s/g, '');
                        if (style_value.includes("px")) {
                            $$(document).find('#border-bottom-right-radius-unit').val('px');
                        } else {
                            $$(document).find('#border-bottom-right-radius-unit').val('%');
                        }
                    }

                    if (style_rule[i].includes("border-bottom-left-radius")) {
                        var style_value = style_rule[i].split(':');
                        style_value = style_value[1].replace(/\s/g, '');
                        style_value = style_value.replace('px', '');
                        style_value = style_value.replace('%', '');
                        $$(document).find('#border-bottom-left-radius').val(Number(style_value));
                    }

                    if (style_rule[i].includes("border-bottom-left-radius:")) {
                        var style_value = style_rule[i].split(':');
                        style_value = style_value[1].replace(/\s/g, '');
                        if (style_value.includes("px")) {
                            $$(document).find('#border-bottom-left-radius-unit').val('px');
                        } else {
                            $$(document).find('#border-bottom-left-radius-unit').val('%');
                        }
                    }

                    if (style_rule[i].includes("color:")) {
                        var style_value = style_rule[i].split(':');
                        style_value = style_value[1].replace(/\s/g, '');
                        font_color.setValue({ hex: style_value });
                    }

                    if (style_rule[i].includes("border-top:")) {
                        var style_value = style_rule[i].split(':');
                        style_value = style_value[1].split(' ');

                        var size = style_value[1].replace('px', '');
                        size = size.replace('em', '');
                        $$(document).find('#border-top').val(Number(size));

                        if (style_value[1].includes("px")) {
                            $$(document).find('#border-top-unit').val('px');
                        } else {
                            $$(document).find('#border-top-unit').val('em');
                        }

                        $$(document).find('#border-top-type').val(style_value[2]);

                        border_color_top.setValue({ hex: style_value[3] });
                    }

                    if (style_rule[i].includes("border-right:")) {
                        var style_value = style_rule[i].split(':');
                        style_value = style_value[1].split(' ');

                        var size = style_value[1].replace('px', '');
                        size = size.replace('em', '');
                        $$(document).find('#border-right').val(Number(size));

                        if (style_value[1].includes("px")) {
                            $$(document).find('#border-right-unit').val('px');
                        } else {
                            $$(document).find('#border-right-unit').val('em');
                        }

                        $$(document).find('#border-right-type').val(style_value[2]);

                        border_color_right.setValue({ hex: style_value[3] });
                    }

                    if (style_rule[i].includes("border-bottom:")) {
                        var style_value = style_rule[i].split(':');
                        style_value = style_value[1].split(' ');

                        var size = style_value[1].replace('px', '');
                        size = size.replace('em', '');
                        $$(document).find('#border-bottom').val(Number(size));

                        if (style_value[1].includes("px")) {
                            $$(document).find('#border-bottom-unit').val('px');
                        } else {
                            $$(document).find('#border-bottom-unit').val('em');
                        }

                        $$(document).find('#border-bottom-type').val(style_value[2]);

                        border_color_bottom.setValue({ hex: style_value[3] });
                    }

                    if (style_rule[i].includes("border-left:")) {
                        var style_value = style_rule[i].split(':');
                        style_value = style_value[1].split(' ');

                        var size = style_value[1].replace('px', '');
                        size = size.replace('em', '');
                        $$(document).find('#border-left').val(Number(size));

                        if (style_value[1].includes("px")) {
                            $$(document).find('#border-left-unit').val('px');
                        } else {
                            $$(document).find('#border-left-unit').val('em');
                        }

                        $$(document).find('#border-left-type').val(style_value[2]);

                        border_color_left.setValue({ hex: style_value[3] });
                    }
                }
            }

            $$(document).find('#element_css').val(style_append);

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');

            // Update to current element style so it show latest style applied to overlap element highlight
            uibuilder.send({
                "topic": "update_element_style",
                "element_id": msg.element_id,
                "element_css": msg.payload
            });
        }
    }
});