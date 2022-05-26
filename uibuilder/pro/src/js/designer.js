$$(document).on('page:afterin', '.page[data-name="designer"]', function (callback) {
    page_history = app.views.main.history;
    page_count = page_history.length;
    page_current = page_history[page_count - 1];
    page_previous = page_history[page_count - 2];

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
});

$$(document).on('click', '#btn-application-create', function () {
    var app_name = '';
    app.dialog.prompt('Application Name?', function (name) {
        app_name = name.replace(/ /g, "_").replace(/[`~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').toLowerCase();
        uibuilder.send({
            "topic": "add_new_app",
            "app_name": app_name
        });
    });
});

$$(document).on('click', '#btn-application-load', function () {
    var name = $$(this).attr('data-name');
    $$(document).find('#application').empty();
    $$(document).find('#application').html('<object id="app_container" data="http://' + ip_address + '/' + name + '" type="text/html" style="width: 99%;height: 98%;border-radius: 5px;border: 1px solid #121212;"></object>');

    app_name = name;

    uibuilder.send({
        "topic": "set_app_name",
        "payload": name
    });
});

$$(document).on('click', '#btn-list-page', function () {
    uibuilder.send({
        "topic": "get_app_pages",
        "payload": app_name
    });
});

$$(document).on('click', '#btn-page-load', function () {
    // Navigate
    var path = $$(this).attr('data-path');

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
    if (path === '/') {
        $$(document).find('#right-toolbar').hide();
        $$(document).find('#right-tabs').hide();
    } else {
        $$(document).find('#right-toolbar').show();
        $$(document).find('#right-tabs').show();
    }

    $$(document).find('#editor-container').hide();

    font_color = app.colorPicker.create({
        inputEl: '#style-color-picker',
        targetEl: '#style-color-picker-value',
        targetElSetBackgroundColor: true,
        modules: ['sb-spectrum', 'hue-slider'],
        openIn: 'popover',
        value: {
            hex: '#000000',
        },
        on: {
            change: function (result) {
                // read from css textarea
                var element_css = $$(document).find('#element_css').val();
                element_css = element_css.replace(/\r/g, '');
                element_css = element_css.replace(/\n/g, '');

                // replace or add new rule
                if (element_css.includes("color:")) {
                    var style_append = "";
                    var style_rule = element_css.split(";");

                    var i = 0;
                    for (i = 0; i < style_rule.length; i++) {
                        if (style_rule[i] === '') {
                            // Do Nothing
                        } else {
                            if (style_rule[i].includes("color:")) { // replace
                                style_rule[i] = 'color: ' + result.value.hex + ';';
                                style_append = style_append + style_rule[i];
                            } else { // add new rule
                                style_append = style_append + style_rule[i] + ';';
                            }
                        }
                    }

                    element_css = style_append;
                } else {
                    element_css = element_css + 'color: ' + result.value.hex + ';';
                }

                uibuilder.send({
                    "topic": "update_element_style",
                    "element_id": element_id_selected,
                    "element_css": element_css
                });

                // Beautify
                var style_append = "";
                var style_rule = element_css.split(";");

                var i = 0;
                for (i = 0; i < style_rule.length; i++) {
                    if (style_rule[i] === '') {
                        // Do Nothing
                    } else {
                        style_append = style_append + style_rule[i] + ';\r\n';
                    }
                }

                $$(document).find('#element_css').val(style_append);
            }
        }
    });

    border_color_top = app.colorPicker.create({
        inputEl: '#border-color-top-picker',
        targetEl: '#border-color-top-picker-value',
        targetElSetBackgroundColor: true,
        modules: ['sb-spectrum', 'hue-slider'],
        openIn: 'popover',
        value: {
            hex: '#3c3c3c',
        },
        on: {
            change: function (result) {
                var value = $$(document).find('#border-top').val();
                if (value === '' || value === ' ') {
                    // Do Nothing
                } else {
                    // read from css textarea
                    var element_css = $$(document).find('#element_css').val();
                    element_css = element_css.replace(/\r/g, '');
                    element_css = element_css.replace(/\n/g, '');

                    // replace or add new rule
                    if (element_css.includes("border-top:")) {
                        var style_append = "";
                        var style_rule = element_css.split(";");

                        var i = 0;
                        for (i = 0; i < style_rule.length; i++) {
                            if (style_rule[i] === '') {
                                // Do Nothing
                            } else {
                                if (style_rule[i].includes("border-top:")) { // replace
                                    style_rule[i] = 'border-top: ' + value + $$(document).find('#border-top-unit').val() + ' ' + $$(document).find('#border-top-type').val() + ' ' + result.value.hex + ';';
                                    style_append = style_append + style_rule[i];
                                } else { // add new rule
                                    style_append = style_append + style_rule[i] + ';';
                                }
                            }
                        }

                        element_css = style_append;
                        element_css = element_css.replace('border-top: px;', '');
                        element_css = element_css.replace('border-top: px solid ' + $$(document).find('#border-color-top-picker').val() + ';', '');
                        element_css = element_css.replace('border-top: px dotted ' + $$(document).find('#border-color-top-picker').val() + ';', '');
                        element_css = element_css.replace('border-top: px dashed ' + $$(document).find('#border-color-top-picker').val() + ';', '');
                        element_css = element_css.replace('border-top: px double ' + $$(document).find('#border-color-top-picker').val() + ';', '');
                        element_css = element_css.replace('border-top: px groove ' + $$(document).find('#border-color-top-picker').val() + ';', '');
                        element_css = element_css.replace('border-top: px ridge ' + $$(document).find('#border-color-top-picker').val() + ';', '');
                        element_css = element_css.replace('border-top: px inset ' + $$(document).find('#border-color-top-picker').val() + ';', '');
                        element_css = element_css.replace('border-top: px outset ' + $$(document).find('#border-color-top-picker').val() + ';', '');
                        element_css = element_css.replace('border-top: em;', '');
                        element_css = element_css.replace('border-top: em solid ' + $$(document).find('#border-color-top-picker').val() + ';', '');
                        element_css = element_css.replace('border-top: em dotted ' + $$(document).find('#border-color-top-picker').val() + ';', '');
                        element_css = element_css.replace('border-top: em dashed ' + $$(document).find('#border-color-top-picker').val() + ';', '');
                        element_css = element_css.replace('border-top: em double ' + $$(document).find('#border-color-top-picker').val() + ';', '');
                        element_css = element_css.replace('border-top: em groove ' + $$(document).find('#border-color-top-picker').val() + ';', '');
                        element_css = element_css.replace('border-top: em ridge ' + $$(document).find('#border-color-top-picker').val() + ';', '');
                        element_css = element_css.replace('border-top: em inset ' + $$(document).find('#border-color-top-picker').val() + ';', '');
                        element_css = element_css.replace('border-top: em outset ' + $$(document).find('#border-color-top-picker').val() + ';', '');
                    } else {
                        if (value === "") {
                            // Do Nothing
                        } else {
                            element_css = element_css + 'border-top: ' + value + $$(document).find('#border-top-unit').val() + ' ' + $$(document).find('#border-top-type').val() + ' ' + result.value.hex + ';';

                            $$(document).find('#item_style').addClass('item-input-focused');
                            $$(document).find('#item_style').addClass('item-input-with-value');
                            $$(document).find('#element_css').addClass('input-with-value');
                            $$(document).find('#element_css').addClass('item-input-with-value');
                        }
                    }

                    uibuilder.send({
                        "topic": "update_element_style",
                        "element_id": element_id_selected,
                        "element_css": element_css
                    });

                    // Beautify
                    var style_append = "";
                    var style_rule = element_css.split(";");

                    var i = 0;
                    for (i = 0; i < style_rule.length; i++) {
                        if (style_rule[i] === '') {
                            // Do Nothing
                        } else {
                            style_append = style_append + style_rule[i] + ';\r\n';
                        }
                    }

                    $$(document).find('#element_css').val(style_append);
                }
            }
        }
    });

    border_color_right = app.colorPicker.create({
        inputEl: '#border-color-right-picker',
        targetEl: '#border-color-right-picker-value',
        targetElSetBackgroundColor: true,
        modules: ['sb-spectrum', 'hue-slider'],
        openIn: 'popover',
        value: {
            hex: '#3c3c3c',
        },
        on: {
            change: function (result) {
                var value = $$(document).find('#border-right').val();
                if (value === '' || value === ' ') {
                    // Do Nothing
                } else {
                    // read from css textarea
                    var element_css = $$(document).find('#element_css').val();
                    element_css = element_css.replace(/\r/g, '');
                    element_css = element_css.replace(/\n/g, '');

                    // replace or add new rule
                    if (element_css.includes("border-right:")) {
                        var style_append = "";
                        var style_rule = element_css.split(";");

                        var i = 0;
                        for (i = 0; i < style_rule.length; i++) {
                            if (style_rule[i] === '') {
                                // Do Nothing
                            } else {
                                if (style_rule[i].includes("border-right:")) { // replace
                                    style_rule[i] = 'border-right: ' + value + $$(document).find('#border-right-unit').val() + ' ' + $$(document).find('#border-right-type').val() + ' ' + result.value.hex + ';';
                                    style_append = style_append + style_rule[i];
                                } else { // add new rule
                                    style_append = style_append + style_rule[i] + ';';
                                }
                            }
                        }

                        element_css = style_append;
                        element_css = element_css.replace('border-right: px;', '');
                        element_css = element_css.replace('border-right: px solid ' + $$(document).find('#border-color-right-picker').val() + ';', '');
                        element_css = element_css.replace('border-right: px dotted ' + $$(document).find('#border-color-right-picker').val() + ';', '');
                        element_css = element_css.replace('border-right: px dashed ' + $$(document).find('#border-color-right-picker').val() + ';', '');
                        element_css = element_css.replace('border-right: px double ' + $$(document).find('#border-color-right-picker').val() + ';', '');
                        element_css = element_css.replace('border-right: px groove ' + $$(document).find('#border-color-right-picker').val() + ';', '');
                        element_css = element_css.replace('border-right: px ridge ' + $$(document).find('#border-color-right-picker').val() + ';', '');
                        element_css = element_css.replace('border-right: px inset ' + $$(document).find('#border-color-right-picker').val() + ';', '');
                        element_css = element_css.replace('border-right: px outset ' + $$(document).find('#border-color-right-picker').val() + ';', '');
                        element_css = element_css.replace('border-right: em;', '');
                        element_css = element_css.replace('border-right: em solid ' + $$(document).find('#border-color-right-picker').val() + ';', '');
                        element_css = element_css.replace('border-right: em dotted ' + $$(document).find('#border-color-right-picker').val() + ';', '');
                        element_css = element_css.replace('border-right: em dashed ' + $$(document).find('#border-color-right-picker').val() + ';', '');
                        element_css = element_css.replace('border-right: em double ' + $$(document).find('#border-color-right-picker').val() + ';', '');
                        element_css = element_css.replace('border-right: em groove ' + $$(document).find('#border-color-right-picker').val() + ';', '');
                        element_css = element_css.replace('border-right: em ridge ' + $$(document).find('#border-color-right-picker').val() + ';', '');
                        element_css = element_css.replace('border-right: em inset ' + $$(document).find('#border-color-right-picker').val() + ';', '');
                        element_css = element_css.replace('border-right: em outset ' + $$(document).find('#border-color-right-picker').val() + ';', '');
                    } else {
                        if (value === "") {
                            // Do Nothing
                        } else {
                            element_css = element_css + 'border-right: ' + value + $$(document).find('#border-right-unit').val() + ' ' + $$(document).find('#border-right-type').val() + ' ' + result.value.hex + ';';

                            $$(document).find('#item_style').addClass('item-input-focused');
                            $$(document).find('#item_style').addClass('item-input-with-value');
                            $$(document).find('#element_css').addClass('input-with-value');
                            $$(document).find('#element_css').addClass('item-input-with-value');
                        }
                    }

                    uibuilder.send({
                        "topic": "update_element_style",
                        "element_id": element_id_selected,
                        "element_css": element_css
                    });

                    // Beautify
                    var style_append = "";
                    var style_rule = element_css.split(";");

                    var i = 0;
                    for (i = 0; i < style_rule.length; i++) {
                        if (style_rule[i] === '') {
                            // Do Nothing
                        } else {
                            style_append = style_append + style_rule[i] + ';\r\n';
                        }
                    }

                    $$(document).find('#element_css').val(style_append);
                }
            }
        }
    });

    border_color_bottom = app.colorPicker.create({
        inputEl: '#border-color-bottom-picker',
        targetEl: '#border-color-bottom-picker-value',
        targetElSetBackgroundColor: true,
        modules: ['sb-spectrum', 'hue-slider'],
        openIn: 'popover',
        value: {
            hex: '#3c3c3c',
        },
        on: {
            change: function (result) {
                var value = $$(document).find('#border-bottom').val();
                if (value === '' || value === ' ') {
                    // Do Nothing
                } else {
                    // read from css textarea
                    var element_css = $$(document).find('#element_css').val();
                    element_css = element_css.replace(/\r/g, '');
                    element_css = element_css.replace(/\n/g, '');

                    // replace or add new rule
                    if (element_css.includes("border-bottom:")) {
                        var style_append = "";
                        var style_rule = element_css.split(";");

                        var i = 0;
                        for (i = 0; i < style_rule.length; i++) {
                            if (style_rule[i] === '') {
                                // Do Nothing
                            } else {
                                if (style_rule[i].includes("border-bottom:")) { // replace
                                    style_rule[i] = 'border-bottom: ' + value + $$(document).find('#border-bottom-unit').val() + ' ' + $$(document).find('#border-bottom-type').val() + ' ' + result.value.hex + ';';
                                    style_append = style_append + style_rule[i];
                                } else { // add new rule
                                    style_append = style_append + style_rule[i] + ';';
                                }
                            }
                        }

                        element_css = style_append;
                        element_css = element_css.replace('border-bottom: px;', '');
                        element_css = element_css.replace('border-bottom: px solid ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
                        element_css = element_css.replace('border-bottom: px dotted ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
                        element_css = element_css.replace('border-bottom: px dashed ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
                        element_css = element_css.replace('border-bottom: px double ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
                        element_css = element_css.replace('border-bottom: px groove ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
                        element_css = element_css.replace('border-bottom: px ridge ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
                        element_css = element_css.replace('border-bottom: px inset ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
                        element_css = element_css.replace('border-bottom: px outset ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
                        element_css = element_css.replace('border-bottom: em;', '');
                        element_css = element_css.replace('border-bottom: em solid ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
                        element_css = element_css.replace('border-bottom: em dotted ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
                        element_css = element_css.replace('border-bottom: em dashed ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
                        element_css = element_css.replace('border-bottom: em double ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
                        element_css = element_css.replace('border-bottom: em groove ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
                        element_css = element_css.replace('border-bottom: em ridge ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
                        element_css = element_css.replace('border-bottom: em inset ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
                        element_css = element_css.replace('border-bottom: em outset ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
                    } else {
                        if (value === "") {
                            // Do Nothing
                        } else {
                            element_css = element_css + 'border-bottom: ' + value + $$(document).find('#border-bottom-unit').val() + ' ' + $$(document).find('#border-bottom-type').val() + ' ' + result.value.hex + ';';

                            $$(document).find('#item_style').addClass('item-input-focused');
                            $$(document).find('#item_style').addClass('item-input-with-value');
                            $$(document).find('#element_css').addClass('input-with-value');
                            $$(document).find('#element_css').addClass('item-input-with-value');
                        }
                    }

                    uibuilder.send({
                        "topic": "update_element_style",
                        "element_id": element_id_selected,
                        "element_css": element_css
                    });

                    // Beautify
                    var style_append = "";
                    var style_rule = element_css.split(";");

                    var i = 0;
                    for (i = 0; i < style_rule.length; i++) {
                        if (style_rule[i] === '') {
                            // Do Nothing
                        } else {
                            style_append = style_append + style_rule[i] + ';\r\n';
                        }
                    }

                    $$(document).find('#element_css').val(style_append);
                }
            }
        }
    });

    border_color_left = app.colorPicker.create({
        inputEl: '#border-color-left-picker',
        targetEl: '#border-color-left-picker-value',
        targetElSetBackgroundColor: true,
        modules: ['sb-spectrum', 'hue-slider'],
        openIn: 'popover',
        value: {
            hex: '#3c3c3c',
        },
        on: {
            change: function (result) {
                var value = $$(document).find('#border-left').val();
                if (value === '' || value === ' ') {
                    // Do Nothing
                } else {
                    // read from css textarea
                    var element_css = $$(document).find('#element_css').val();
                    element_css = element_css.replace(/\r/g, '');
                    element_css = element_css.replace(/\n/g, '');

                    // replace or add new rule
                    if (element_css.includes("border-left:")) {
                        var style_append = "";
                        var style_rule = element_css.split(";");

                        var i = 0;
                        for (i = 0; i < style_rule.length; i++) {
                            if (style_rule[i] === '') {
                                // Do Nothing
                            } else {
                                if (style_rule[i].includes("border-left:")) { // replace
                                    style_rule[i] = 'border-left: ' + value + $$(document).find('#border-left-unit').val() + ' ' + $$(document).find('#border-left-type').val() + ' ' + result.value.hex + ';';
                                    style_append = style_append + style_rule[i];
                                } else { // add new rule
                                    style_append = style_append + style_rule[i] + ';';
                                }
                            }
                        }

                        element_css = style_append;
                        element_css = element_css.replace('border-left: px;', '');
                        element_css = element_css.replace('border-left: px solid ' + $$(document).find('#border-color-left-picker').val() + ';', '');
                        element_css = element_css.replace('border-left: px dotted ' + $$(document).find('#border-color-left-picker').val() + ';', '');
                        element_css = element_css.replace('border-left: px dashed ' + $$(document).find('#border-color-left-picker').val() + ';', '');
                        element_css = element_css.replace('border-left: px double ' + $$(document).find('#border-color-left-picker').val() + ';', '');
                        element_css = element_css.replace('border-left: px groove ' + $$(document).find('#border-color-left-picker').val() + ';', '');
                        element_css = element_css.replace('border-left: px ridge ' + $$(document).find('#border-color-left-picker').val() + ';', '');
                        element_css = element_css.replace('border-left: px inset ' + $$(document).find('#border-color-left-picker').val() + ';', '');
                        element_css = element_css.replace('border-left: px outset ' + $$(document).find('#border-color-left-picker').val() + ';', '');
                        element_css = element_css.replace('border-left: em;', '');
                        element_css = element_css.replace('border-left: em solid ' + $$(document).find('#border-color-left-picker').val() + ';', '');
                        element_css = element_css.replace('border-left: em dotted ' + $$(document).find('#border-color-left-picker').val() + ';', '');
                        element_css = element_css.replace('border-left: em dashed ' + $$(document).find('#border-color-left-picker').val() + ';', '');
                        element_css = element_css.replace('border-left: em double ' + $$(document).find('#border-color-left-picker').val() + ';', '');
                        element_css = element_css.replace('border-left: em groove ' + $$(document).find('#border-color-left-picker').val() + ';', '');
                        element_css = element_css.replace('border-left: em ridge ' + $$(document).find('#border-color-left-picker').val() + ';', '');
                        element_css = element_css.replace('border-left: em inset ' + $$(document).find('#border-color-left-picker').val() + ';', '');
                        element_css = element_css.replace('border-left: em outset ' + $$(document).find('#border-color-left-picker').val() + ';', '');
                    } else {
                        if (value === "") {
                            // Do Nothing
                        } else {
                            element_css = element_css + 'border-left: ' + value + $$(document).find('#border-left-unit').val() + ' ' + $$(document).find('#border-left-type').val() + ' ' + result.value.hex + ';';

                            $$(document).find('#item_style').addClass('item-input-focused');
                            $$(document).find('#item_style').addClass('item-input-with-value');
                            $$(document).find('#element_css').addClass('input-with-value');
                            $$(document).find('#element_css').addClass('item-input-with-value');
                        }
                    }

                    uibuilder.send({
                        "topic": "update_element_style",
                        "element_id": element_id_selected,
                        "element_css": element_css
                    });

                    // Beautify
                    var style_append = "";
                    var style_rule = element_css.split(";");

                    var i = 0;
                    for (i = 0; i < style_rule.length; i++) {
                        if (style_rule[i] === '') {
                            // Do Nothing
                        } else {
                            style_append = style_append + style_rule[i] + ';\r\n';
                        }
                    }

                    $$(document).find('#element_css').val(style_append);
                }
            }
        }
    });
});

$$(window).on('beforeunload', function () {
    console.log('Before Unload');
    // Send to clear hightlight and hightlight-choosed
});

$$(document).on('click', '.btn-tree-choose', function () {
    $$(document).find('#editor-container').show();

    var element_id = $$(this).attr('data-id');

    uibuilder.send({
        "topic": "set_element_id_choosed",
        "element_id": element_id
    });

    element_id_selected = element_id;
    $$(document).find('#element_id').val(element_id);
    $$(document).find('#element_id').addClass('input-with-value');
    $$(document).find('#item_element_id').addClass('item-input-with-value');

    uibuilder.send({
        "topic": "get_element_class",
        "element_id": element_id
    });

    app.autocomplete.create({
        inputEl: '#class_name',
        openIn: 'dropdown',
        // dropdownPlaceholderText: 'Try to type "Pineapple"',
        typeahead: true,
        source: function (query, render) {
            var results = [];

            // if (query.length === 0) {
            //     render(results);
            //     return;
            // } // resulting error first touch

            // Find matched items
            for (var i = 0; i < class_name_autocomplete.length; i++) {
                if (class_name_autocomplete[i].toLowerCase().indexOf(query.toLowerCase()) === 0) results.push(class_name_autocomplete[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });

    uibuilder.send({
        "topic": "get_element_style",
        "element_id": element_id
    });
});

$$(document).on('click', '#btn-remove-element', function () {
    var element_id = $$(this).attr('data-id');

    uibuilder.send({
        "topic": "set_element_id_choosed",
        "element_id": element_id
    });

    element_id_selected = element_id;
    $$(document).find('#element_id').val(element_id);
    $$(document).find('#element_id').addClass('input-with-value');
    $$(document).find('#item_element_id').addClass('item-input-with-value');

    app.dialog.confirm('Remove selected element?', function () {
        uibuilder.send({
            "topic": "remove_element_id",
            "element_id": element_id,
            "element_id_selected": element_id
        });
    });
});

$$(document).on('click', '#btn-save-element-id', function () {
    var formData = app.form.convertToData('#form-element-id');

    if (formData.element_id === "" || formData.element_id === " ") {
        app.dialog.alert('Please inspect and choose element to get id name!');
    } else {
        uibuilder.send({
            "topic": "update_element_id",
            "element_id": formData.element_id,
            "element_id_selected": element_id_selected
        });
    }
});

// Code Editor Popup
var editor = null;
var editorPopup = app.popup.create({
    content: '<div class="popup popup-tablet-fullscreen">' +
        '   <div class="block" style="height: 90%">' +
        '       <p class="text-align-right">' +
        '           <a class="link popup-close text-color-white"><i class="f7-icons text-color-red">xmark_circle</i>&nbsp;Close</a>&nbsp;&nbsp;' +
        '           <a class="link text-color-white" id="btn-code-save"><i class="f7-icons text-color-orange">checkmark_alt_circle</i>&nbsp;Save</a>' +
        '           <a class="link popup-close text-color-white" id="btn-code-save-close"><i class="f7-icons text-color-green">checkmark_alt_circle</i>&nbsp;Save and Close</a>' +
        '       </p>' +
        '       <p id="editor" style="height: 97%;"></p>' +
        '   </div>' +
        '</div>',
    on: {
        open: function (popup) {
            app.preloader.show();

            // TODO Get code and load

            require(['vs/editor/editor.main'], function () {
                editor = monaco.editor.create(document.getElementById('editor'), {
                    value: [page_opened].join('\n'),
                    parameterHints: {
                        enabled: true
                    },
                    scrollBeyondLastLine: false,
                    fixedOverflowWidgets: true,
                    lineNumbers: 'on',
                    lineDecorationsWidth: 36,
                    matchBrackets: "always",
                    lineHeight: 19,
                    folding: true,
                    autoIndent: true,
                    automaticLayout: true,
                    foldingHighlight: true,
                    showFoldingControls: 'always',
                    fontLigatures: true,
                    showUnused: true,
                    smoothScrolling: true,
                    language: 'html',
                    theme: 'vs-dark'
                });
            });

            setTimeout(function () {
                app.preloader.hide();
                $$(document).find(".margin[role=presentation]").removeClass('margin');
            }, 1000)
        }
    }
});

editorPopup.on('closed', function (popup) {
    editor.dispose();
});

$$('#editor-popup').on('click', function () {
    if (page_opened === null) {
        app.dialog.alert('Please choose element to edit!');
    } else {
        editorPopup.open();
    }
});

$$(document).on('click', '#btn-code-save', function () {
    uibuilder.send({
        "topic": "code_save",
        "payload": editor.getValue()
    });

    page_opened = editor.getValue();
});

$$(document).on('click', '#btn-code-save-close', function () {
    uibuilder.send({
        "topic": "code_save",
        "payload": editor.getValue()
    });

    page_opened = editor.getValue();
});

$$(document).on('mouseover', '.btn-tree-choose', function () {
    var element_id = $$(this).attr('data-id');

    uibuilder.send({
        "topic": "element_hightlight_id",
        "element_id": element_id
    });
});

$$(document).on('mouseout', '.btn-tree-choose', function () {
    var element_id = $$(this).attr('data-id');

    uibuilder.send({
        "topic": "element_hightlight_id_clear",
        "element_id": element_id
    });
});

$$(document).on('click', '#btn-page-data-name-save', function () {
    var formData = app.form.convertToData('#form_page_name');

    uibuilder.send({
        "topic": "update_page_data_name",
        "name": formData.page_data_name,
        "element_id": element_id_selected
    });
});

$$(document).on('click', '#btn-page-create', function () {
    var page_name = '';
    app.dialog.prompt('New Page Name?', function (name) {
        page_name = name.replace(/ /g, "_").replace(/[`~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').toLowerCase();
        uibuilder.send({
            "topic": "page_create",
            "name": page_name
        });
    });
});

$$(document).on('click', '#btn-page-remove', function () {
    app.dialog.confirm('Do you want to remove this page?', function () {
        app.dialog.confirm("This process can't undo!", function () {
            uibuilder.send({
                "topic": "page_remove"
            });
        });
    });
});

$$(document).on('click', '#btn-remove-class', function () {
    var class_name = $$(this).attr('data-class');

    if (class_name === "text-align-left" || class_name === "text-align-center" || class_name === "text-align-right" || class_name === "text-align-justify") {
        $$(document).find('.btn-element-text-alignment').removeClass('button-active');
    }

    app.dialog.confirm('Do you want to remove this class?', function () {
        uibuilder.send({
            "topic": "class_remove",
            "element_id": element_id_selected,
            "class_name": class_name
        });
    });
});

$$(document).on('click', '#btn-add-class', function () {
    var formData = app.form.convertToData('#form_add_class');

    uibuilder.send({
        "topic": "class_add",
        "element_id": element_id_selected,
        "class_name": formData.class_name
    });

    $$(document).find('#class_name').val('');
    $$(document).find('#class_name').removeClass('input-with-value');
    $$(document).find('#item_class_id').removeClass('item-input-with-value');
});

$$(document).on('click', '.btn-element-text-alignment', function () {
    var previous_active = $$(document).find('.btn-element-text-alignment.button-active').attr('id');

    if (previous_active === undefined) {
        // Do Nothing
    } else {
        if (previous_active === "btn-element-text-left") {
            uibuilder.send({
                "topic": "class_remove",
                "element_id": element_id_selected,
                "class_name": "text-align-left"
            });
        }

        if (previous_active === "btn-element-text-right") {
            uibuilder.send({
                "topic": "class_remove",
                "element_id": element_id_selected,
                "class_name": "text-align-right"
            });
        }

        if (previous_active === "btn-element-text-center") {
            uibuilder.send({
                "topic": "class_remove",
                "element_id": element_id_selected,
                "class_name": "text-align-center"
            });
        }

        if (previous_active === "btn-element-text-justify") {
            uibuilder.send({
                "topic": "class_remove",
                "element_id": element_id_selected,
                "class_name": "text-align-justify"
            });
        }
    }

    $$(document).find('.btn-element-text-alignment').removeClass('button-active');
    $$(this).addClass('button-active');

    var class_name = "";
    var id = $$(this).attr('id');
    if (id === "btn-element-text-left") {
        class_name = "text-align-left"
    }
    if (id === "btn-element-text-right") {
        class_name = "text-align-right"
    }
    if (id === "btn-element-text-center") {
        class_name = "text-align-center"
    }
    if (id === "btn-element-text-justify") {
        class_name = "text-align-justify"
    }

    uibuilder.send({
        "topic": "class_add",
        "element_id": element_id_selected,
        "class_name": class_name
    });
});

$$(document).on('click', '#btn-save-style', function () {
    var formData = app.form.convertToData('#element_style');
    var formDataClear = formData.element_css.replace(/\r?\n|\r/g, "");
    console.log(formDataClear);
});

$$(document).on('change', '#item-style-font-size', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("font-size")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else if (style_rule[i] === 'font-size: ;' || style_rule[i] === 'font-size: ') {
                // Clear the rule
                delete style_rule[i];
            } else {
                if (style_rule[i].includes("font-size")) { // replace
                    style_rule[i] = 'font-size: ' + $$(this).val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('font-size: ;', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'font-size: ' + $$(this).val() + ';';
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else if (style_rule[i] === 'font-size: ;' || style_rule[i] === 'font-size: ') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('change', '#item-style-font-weight', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("font-weight")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else if (style_rule[i] === 'font-weight: ;' || style_rule[i] === 'font-weight: ') {
                // Clear the rule
                delete style_rule[i];
            } else {
                if (style_rule[i].includes("font-weight")) { // replace
                    style_rule[i] = 'font-weight: ' + $$(this).val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'font-weight: ' + $$(this).val() + ';';
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else if (style_rule[i] === 'font-weight: ;' || style_rule[i] === 'font-weight: ') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('keyup', '#border-top-left-radius', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("border-top-left-radius")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                if (style_rule[i].includes("border-top-left-radius")) { // replace
                    style_rule[i] = 'border-top-left-radius: ' + $$(this).val() + $$(document).find('#border-top-left-radius-unit').val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('border-top-left-radius: px;', '');
        element_css = element_css.replace('border-top-left-radius: %;', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'border-top-left-radius: ' + $$(this).val() + $$(document).find('#border-top-left-radius-unit').val() + ';';

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('keyup', '#border-top-right-radius', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("border-top-right-radius")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                if (style_rule[i].includes("border-top-right-radius")) { // replace
                    style_rule[i] = 'border-top-right-radius: ' + $$(this).val() + $$(document).find('#border-top-right-radius-unit').val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('border-top-right-radius: px;', '');
        element_css = element_css.replace('border-top-right-radius: %;', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'border-top-right-radius: ' + $$(this).val() + $$(document).find('#border-top-right-radius-unit').val() + ';';

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('keyup', '#border-bottom-right-radius', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("border-bottom-right-radius")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                if (style_rule[i].includes("border-bottom-right-radius")) { // replace
                    style_rule[i] = 'border-bottom-right-radius: ' + $$(this).val() + $$(document).find('#border-bottom-right-radius-unit').val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('border-bottom-right-radius: px;', '');
        element_css = element_css.replace('border-bottom-right-radius: %;', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'border-bottom-right-radius: ' + $$(this).val() + $$(document).find('#border-bottom-right-radius-unit').val() + ';';

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('keyup', '#border-bottom-left-radius', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("border-bottom-left-radius")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                if (style_rule[i].includes("border-bottom-left-radius")) { // replace
                    style_rule[i] = 'border-bottom-left-radius: ' + $$(this).val() + $$(document).find('#border-bottom-left-radius-unit').val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('border-bottom-left-radius: px;', '');
        element_css = element_css.replace('border-bottom-left-radius: %;', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'border-bottom-left-radius: ' + $$(this).val() + $$(document).find('#border-bottom-left-radius-unit').val() + ';';

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('change', '#border-top-left-radius-unit', function () {
    var value = $$(document).find('#border-top-left-radius').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("border-top-left-radius")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("border-top-left-radius")) { // replace
                        style_rule[i] = 'border-top-left-radius: ' + value + $$(document).find('#border-top-left-radius-unit').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('border-top-left-radius: px;', '');
            element_css = element_css.replace('border-top-left-radius: %;', '');
        } else {
            if ($$(this).val() === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'border-top-left-radius: ' + value + $$(document).find('#border-top-left-radius-unit').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('change', '#border-top-right-radius-unit', function () {
    var value = $$(document).find('#border-top-right-radius').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("border-top-right-radius")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("border-top-right-radius")) { // replace
                        style_rule[i] = 'border-top-right-radius: ' + value + $$(document).find('#border-top-right-radius-unit').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('border-top-right-radius: px;', '');
            element_css = element_css.replace('border-top-right-radius: %;', '');
        } else {
            if ($$(this).val() === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'border-top-right-radius: ' + value + $$(document).find('#border-top-right-radius-unit').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('change', '#border-bottom-right-radius-unit', function () {
    var value = $$(document).find('#border-bottom-right-radius').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("border-bottom-right-radius")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("border-bottom-right-radius")) { // replace
                        style_rule[i] = 'border-bottom-right-radius: ' + value + $$(document).find('#border-bottom-right-radius-unit').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('border-bottom-right-radius: px;', '');
            element_css = element_css.replace('border-bottom-right-radius: %;', '');
        } else {
            if ($$(this).val() === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'border-bottom-right-radius: ' + value + $$(document).find('#border-bottom-right-radius-unit').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('change', '#border-bottom-left-radius-unit', function () {
    var value = $$(document).find('#border-bottom-left-radius').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("border-bottom-left-radius")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("border-bottom-left-radius")) { // replace
                        style_rule[i] = 'border-bottom-left-radius: ' + value + $$(document).find('#border-bottom-left-radius-unit').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('border-bottom-left-radius: px;', '');
            element_css = element_css.replace('border-bottom-left-radius: %;', '');
        } else {
            if ($$(this).val() === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'border-bottom-left-radius: ' + value + $$(document).find('#border-bottom-left-radius-unit').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('keyup', '#border-top', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("border-top")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                if (style_rule[i].includes("border-top")) { // replace
                    style_rule[i] = 'border-top: ' + $$(this).val() + $$(document).find('#border-top-unit').val() + ' ' + $$(document).find('#border-top-type').val() + ' ' + $$(document).find('#border-color-top-picker').val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('border-top: px;', '');
        element_css = element_css.replace('border-top: px solid ' + $$(document).find('#border-color-top-picker').val() + ';', '');
        element_css = element_css.replace('border-top: px dotted ' + $$(document).find('#border-color-top-picker').val() + ';', '');
        element_css = element_css.replace('border-top: px dashed ' + $$(document).find('#border-color-top-picker').val() + ';', '');
        element_css = element_css.replace('border-top: px double ' + $$(document).find('#border-color-top-picker').val() + ';', '');
        element_css = element_css.replace('border-top: px groove ' + $$(document).find('#border-color-top-picker').val() + ';', '');
        element_css = element_css.replace('border-top: px ridge ' + $$(document).find('#border-color-top-picker').val() + ';', '');
        element_css = element_css.replace('border-top: px inset ' + $$(document).find('#border-color-top-picker').val() + ';', '');
        element_css = element_css.replace('border-top: px outset ' + $$(document).find('#border-color-top-picker').val() + ';', '');
        element_css = element_css.replace('border-top: em;', '');
        element_css = element_css.replace('border-top: em solid ' + $$(document).find('#border-color-top-picker').val() + ';', '');
        element_css = element_css.replace('border-top: em dotted ' + $$(document).find('#border-color-top-picker').val() + ';', '');
        element_css = element_css.replace('border-top: em dashed ' + $$(document).find('#border-color-top-picker').val() + ';', '');
        element_css = element_css.replace('border-top: em double ' + $$(document).find('#border-color-top-picker').val() + ';', '');
        element_css = element_css.replace('border-top: em groove ' + $$(document).find('#border-color-top-picker').val() + ';', '');
        element_css = element_css.replace('border-top: em ridge ' + $$(document).find('#border-color-top-picker').val() + ';', '');
        element_css = element_css.replace('border-top: em inset ' + $$(document).find('#border-color-top-picker').val() + ';', '');
        element_css = element_css.replace('border-top: em outset ' + $$(document).find('#border-color-top-picker').val() + ';', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'border-top: ' + $$(this).val() + $$(document).find('#border-top-unit').val() + ' ' + $$(document).find('#border-top-type').val() + ' ' + $$(document).find('#border-color-top-picker').val() + ';';

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('change', '#border-top-type', function () {
    var value = $$(document).find('#border-top').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("border-top")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("border-top")) { // replace
                        style_rule[i] = 'border-top: ' + value + $$(document).find('#border-top-unit').val() + ' ' + $$(document).find('#border-top-type').val() + ' ' + $$(document).find('#border-color-top-picker').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('border-top: px;', '');
            element_css = element_css.replace('border-top: px solid ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: px dotted ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: px dashed ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: px double ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: px groove ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: px ridge ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: px inset ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: px outset ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: em;', '');
            element_css = element_css.replace('border-top: em solid ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: em dotted ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: em dashed ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: em double ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: em groove ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: em ridge ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: em inset ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: em outset ' + $$(document).find('#border-color-top-picker').val() + ';', '');
        } else {
            if (value === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'border-top: ' + value + $$(document).find('#border-top-unit').val() + ' ' + $$(document).find('#border-top-type').val() + ' ' + $$(document).find('#border-color-top-picker').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('change', '#border-top-unit', function () {
    var value = $$(document).find('#border-top').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("border-top")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("border-top")) { // replace
                        style_rule[i] = 'border-top: ' + value + $$(document).find('#border-top-unit').val() + ' ' + $$(document).find('#border-top-type').val() + ' ' + $$(document).find('#border-color-top-picker').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('border-top: px;', '');
            element_css = element_css.replace('border-top: px solid ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: px dotted ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: px dashed ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: px double ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: px groove ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: px ridge ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: px inset ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: px outset ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: em;', '');
            element_css = element_css.replace('border-top: em solid ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: em dotted ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: em dashed ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: em double ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: em groove ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: em ridge ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: em inset ' + $$(document).find('#border-color-top-picker').val() + ';', '');
            element_css = element_css.replace('border-top: em outset ' + $$(document).find('#border-color-top-picker').val() + ';', '');
        } else {
            if (value === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'border-top: ' + value + $$(document).find('#border-top-unit').val() + ' ' + $$(document).find('#border-top-type').val() + ' ' + $$(document).find('#border-color-top-picker').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('keyup', '#border-right', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("border-right")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                if (style_rule[i].includes("border-right")) { // replace
                    style_rule[i] = 'border-right: ' + $$(this).val() + $$(document).find('#border-right-unit').val() + ' ' + $$(document).find('#border-right-type').val() + ' ' + $$(document).find('#border-color-right-picker').val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('border-right: px;', '');
        element_css = element_css.replace('border-right: px solid ' + $$(document).find('#border-color-right-picker').val() + ';', '');
        element_css = element_css.replace('border-right: px dotted ' + $$(document).find('#border-color-right-picker').val() + ';', '');
        element_css = element_css.replace('border-right: px dashed ' + $$(document).find('#border-color-right-picker').val() + ';', '');
        element_css = element_css.replace('border-right: px double ' + $$(document).find('#border-color-right-picker').val() + ';', '');
        element_css = element_css.replace('border-right: px groove ' + $$(document).find('#border-color-right-picker').val() + ';', '');
        element_css = element_css.replace('border-right: px ridge ' + $$(document).find('#border-color-right-picker').val() + ';', '');
        element_css = element_css.replace('border-right: px inset ' + $$(document).find('#border-color-right-picker').val() + ';', '');
        element_css = element_css.replace('border-right: px outset ' + $$(document).find('#border-color-right-picker').val() + ';', '');
        element_css = element_css.replace('border-right: em;', '');
        element_css = element_css.replace('border-right: em solid ' + $$(document).find('#border-color-right-picker').val() + ';', '');
        element_css = element_css.replace('border-right: em dotted ' + $$(document).find('#border-color-right-picker').val() + ';', '');
        element_css = element_css.replace('border-right: em dashed ' + $$(document).find('#border-color-right-picker').val() + ';', '');
        element_css = element_css.replace('border-right: em double ' + $$(document).find('#border-color-right-picker').val() + ';', '');
        element_css = element_css.replace('border-right: em groove ' + $$(document).find('#border-color-right-picker').val() + ';', '');
        element_css = element_css.replace('border-right: em ridge ' + $$(document).find('#border-color-right-picker').val() + ';', '');
        element_css = element_css.replace('border-right: em inset ' + $$(document).find('#border-color-right-picker').val() + ';', '');
        element_css = element_css.replace('border-right: em outset ' + $$(document).find('#border-color-right-picker').val() + ';', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'border-right: ' + $$(this).val() + $$(document).find('#border-right-unit').val() + ' ' + $$(document).find('#border-right-type').val() + ' ' + $$(document).find('#border-color-right-picker').val() + ';';

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('change', '#border-right-type', function () {
    var value = $$(document).find('#border-right').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("border-right")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("border-right")) { // replace
                        style_rule[i] = 'border-right: ' + value + $$(document).find('#border-right-unit').val() + ' ' + $$(document).find('#border-right-type').val() + ' ' + $$(document).find('#border-color-right-picker').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('border-right: px;', '');
            element_css = element_css.replace('border-right: px solid ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: px dotted ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: px dashed ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: px double ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: px groove ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: px ridge ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: px inset ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: px outset ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: em;', '');
            element_css = element_css.replace('border-right: em solid ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: em dotted ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: em dashed ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: em double ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: em groove ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: em ridge ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: em inset ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: em outset ' + $$(document).find('#border-color-right-picker').val() + ';', '');
        } else {
            if (value === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'border-right: ' + value + $$(document).find('#border-right-unit').val() + ' ' + $$(document).find('#border-right-type').val() + ' ' + $$(document).find('#border-color-right-picker').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('change', '#border-right-unit', function () {
    var value = $$(document).find('#border-right').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("border-right")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("border-right")) { // replace
                        style_rule[i] = 'border-right: ' + value + $$(document).find('#border-right-unit').val() + ' ' + $$(document).find('#border-right-type').val() + ' ' + $$(document).find('#border-color-right-picker').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('border-right: px;', '');
            element_css = element_css.replace('border-right: px solid ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: px dotted ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: px dashed ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: px double ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: px groove ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: px ridge ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: px inset ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: px outset ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: em;', '');
            element_css = element_css.replace('border-right: em solid ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: em dotted ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: em dashed ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: em double ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: em groove ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: em ridge ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: em inset ' + $$(document).find('#border-color-right-picker').val() + ';', '');
            element_css = element_css.replace('border-right: em outset ' + $$(document).find('#border-color-right-picker').val() + ';', '');
        } else {
            if (value === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'border-right: ' + value + $$(document).find('#border-right-unit').val() + ' ' + $$(document).find('#border-right-type').val() + ' ' + $$(document).find('#border-color-right-picker').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('keyup', '#border-bottom', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("border-bottom")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                if (style_rule[i].includes("border-bottom")) { // replace
                    style_rule[i] = 'border-bottom: ' + $$(this).val() + $$(document).find('#border-bottom-unit').val() + ' ' + $$(document).find('#border-bottom-type').val() + ' ' + $$(document).find('#border-color-bottom-picker').val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('border-bottom: px;', '');
        element_css = element_css.replace('border-bottom: px solid ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
        element_css = element_css.replace('border-bottom: px dotted ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
        element_css = element_css.replace('border-bottom: px dashed ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
        element_css = element_css.replace('border-bottom: px double ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
        element_css = element_css.replace('border-bottom: px groove ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
        element_css = element_css.replace('border-bottom: px ridge ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
        element_css = element_css.replace('border-bottom: px inset ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
        element_css = element_css.replace('border-bottom: px outset ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
        element_css = element_css.replace('border-bottom: em;', '');
        element_css = element_css.replace('border-bottom: em solid ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
        element_css = element_css.replace('border-bottom: em dotted ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
        element_css = element_css.replace('border-bottom: em dashed ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
        element_css = element_css.replace('border-bottom: em double ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
        element_css = element_css.replace('border-bottom: em groove ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
        element_css = element_css.replace('border-bottom: em ridge ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
        element_css = element_css.replace('border-bottom: em inset ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
        element_css = element_css.replace('border-bottom: em outset ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'border-bottom: ' + $$(this).val() + $$(document).find('#border-bottom-unit').val() + ' ' + $$(document).find('#border-bottom-type').val() + ' ' + $$(document).find('#border-color-bottom-picker').val() + ';';

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('change', '#border-bottom-type', function () {
    var value = $$(document).find('#border-bottom').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("border-bottom")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("border-bottom")) { // replace
                        style_rule[i] = 'border-bottom: ' + value + $$(document).find('#border-bottom-unit').val() + ' ' + $$(document).find('#border-bottom-type').val() + ' ' + $$(document).find('#border-color-bottom-picker').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('border-bottom: px;', '');
            element_css = element_css.replace('border-bottom: px solid ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: px dotted ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: px dashed ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: px double ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: px groove ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: px ridge ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: px inset ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: px outset ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: em;', '');
            element_css = element_css.replace('border-bottom: em solid ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: em dotted ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: em dashed ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: em double ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: em groove ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: em ridge ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: em inset ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: em outset ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
        } else {
            if (value === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'border-bottom: ' + value + $$(document).find('#border-bottom-unit').val() + ' ' + $$(document).find('#border-bottom-type').val() + ' ' + $$(document).find('#border-color-bottom-picker').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('change', '#border-bottom-unit', function () {
    var value = $$(document).find('#border-bottom').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("border-bottom")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("border-bottom")) { // replace
                        style_rule[i] = 'border-bottom: ' + value + $$(document).find('#border-bottom-unit').val() + ' ' + $$(document).find('#border-bottom-type').val() + ' ' + $$(document).find('#border-color-bottom-picker').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('border-bottom: px;', '');
            element_css = element_css.replace('border-bottom: px solid ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: px dotted ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: px dashed ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: px double ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: px groove ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: px ridge ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: px inset ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: px outset ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: em;', '');
            element_css = element_css.replace('border-bottom: em solid ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: em dotted ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: em dashed ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: em double ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: em groove ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: em ridge ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: em inset ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
            element_css = element_css.replace('border-bottom: em outset ' + $$(document).find('#border-color-bottom-picker').val() + ';', '');
        } else {
            if (value === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'border-bottom: ' + value + $$(document).find('#border-bottom-unit').val() + ' ' + $$(document).find('#border-bottom-type').val() + ' ' + $$(document).find('#border-color-bottom-picker').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('keyup', '#border-left', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("border-left")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                if (style_rule[i].includes("border-left")) { // replace
                    style_rule[i] = 'border-left: ' + $$(this).val() + $$(document).find('#border-left-unit').val() + ' ' + $$(document).find('#border-left-type').val() + ' ' + $$(document).find('#border-color-left-picker').val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('border-left: px;', '');
        element_css = element_css.replace('border-left: px solid ' + $$(document).find('#border-color-left-picker').val() + ';', '');
        element_css = element_css.replace('border-left: px dotted ' + $$(document).find('#border-color-left-picker').val() + ';', '');
        element_css = element_css.replace('border-left: px dashed ' + $$(document).find('#border-color-left-picker').val() + ';', '');
        element_css = element_css.replace('border-left: px double ' + $$(document).find('#border-color-left-picker').val() + ';', '');
        element_css = element_css.replace('border-left: px groove ' + $$(document).find('#border-color-left-picker').val() + ';', '');
        element_css = element_css.replace('border-left: px ridge ' + $$(document).find('#border-color-left-picker').val() + ';', '');
        element_css = element_css.replace('border-left: px inset ' + $$(document).find('#border-color-left-picker').val() + ';', '');
        element_css = element_css.replace('border-left: px outset ' + $$(document).find('#border-color-left-picker').val() + ';', '');
        element_css = element_css.replace('border-left: em;', '');
        element_css = element_css.replace('border-left: em solid ' + $$(document).find('#border-color-left-picker').val() + ';', '');
        element_css = element_css.replace('border-left: em dotted ' + $$(document).find('#border-color-left-picker').val() + ';', '');
        element_css = element_css.replace('border-left: em dashed ' + $$(document).find('#border-color-left-picker').val() + ';', '');
        element_css = element_css.replace('border-left: em double ' + $$(document).find('#border-color-left-picker').val() + ';', '');
        element_css = element_css.replace('border-left: em groove ' + $$(document).find('#border-color-left-picker').val() + ';', '');
        element_css = element_css.replace('border-left: em ridge ' + $$(document).find('#border-color-left-picker').val() + ';', '');
        element_css = element_css.replace('border-left: em inset ' + $$(document).find('#border-color-left-picker').val() + ';', '');
        element_css = element_css.replace('border-left: em outset ' + $$(document).find('#border-color-left-picker').val() + ';', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'border-left: ' + $$(this).val() + $$(document).find('#border-left-unit').val() + ' ' + $$(document).find('#border-left-type').val() + ' ' + $$(document).find('#border-color-left-picker').val() + ';';

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('change', '#border-left-type', function () {
    var value = $$(document).find('#border-left').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("border-left")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("border-left")) { // replace
                        style_rule[i] = 'border-left: ' + value + $$(document).find('#border-left-unit').val() + ' ' + $$(document).find('#border-left-type').val() + ' ' + $$(document).find('#border-color-left-picker').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('border-left: px;', '');
            element_css = element_css.replace('border-left: px solid ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: px dotted ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: px dashed ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: px double ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: px groove ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: px ridge ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: px inset ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: px outset ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: em;', '');
            element_css = element_css.replace('border-left: em solid ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: em dotted ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: em dashed ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: em double ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: em groove ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: em ridge ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: em inset ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: em outset ' + $$(document).find('#border-color-left-picker').val() + ';', '');
        } else {
            if (value === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'border-left: ' + value + $$(document).find('#border-left-unit').val() + ' ' + $$(document).find('#border-left-type').val() + ' ' + $$(document).find('#border-color-left-picker').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('change', '#border-left-unit', function () {
    var value = $$(document).find('#border-left').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("border-left")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("border-left")) { // replace
                        style_rule[i] = 'border-left: ' + value + $$(document).find('#border-left-unit').val() + ' ' + $$(document).find('#border-left-type').val() + ' ' + $$(document).find('#border-color-left-picker').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('border-left: px;', '');
            element_css = element_css.replace('border-left: px solid ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: px dotted ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: px dashed ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: px double ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: px groove ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: px ridge ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: px inset ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: px outset ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: em;', '');
            element_css = element_css.replace('border-left: em solid ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: em dotted ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: em dashed ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: em double ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: em groove ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: em ridge ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: em inset ' + $$(document).find('#border-color-left-picker').val() + ';', '');
            element_css = element_css.replace('border-left: em outset ' + $$(document).find('#border-color-left-picker').val() + ';', '');
        } else {
            if (value === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'border-left: ' + value + $$(document).find('#border-left-unit').val() + ' ' + $$(document).find('#border-left-type').val() + ' ' + $$(document).find('#border-color-left-picker').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('keyup', '#margin-top', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("margin-top")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                if (style_rule[i].includes("margin-top")) { // replace
                    style_rule[i] = 'margin-top: ' + $$(this).val() + $$(document).find('#margin-top-unit').val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('margin-top: px;', '');
        element_css = element_css.replace('margin-top: %;', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'margin-top: ' + $$(this).val() + $$(document).find('#margin-top-unit').val() + ';';

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('change', '#margin-top-unit', function () {
    var value = $$(document).find('#margin-top').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("margin-top")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("margin-top")) { // replace
                        style_rule[i] = 'margin-top: ' + value + $$(document).find('#margin-top-unit').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('margin-top: px;', '');
            element_css = element_css.replace('margin-top: %;', '');
        } else {
            if ($$(this).val() === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'margin-top: ' + value + $$(document).find('#margin-top-unit').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('keyup', '#margin-right', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("margin-right")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                if (style_rule[i].includes("margin-right")) { // replace
                    style_rule[i] = 'margin-right: ' + $$(this).val() + $$(document).find('#margin-right-unit').val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('margin-right: px;', '');
        element_css = element_css.replace('margin-right: %;', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'margin-right: ' + $$(this).val() + $$(document).find('#margin-right-unit').val() + ';';

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('change', '#margin-right-unit', function () {
    var value = $$(document).find('#margin-right').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("margin-right")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("margin-right")) { // replace
                        style_rule[i] = 'margin-right: ' + value + $$(document).find('#margin-right-unit').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('margin-right: px;', '');
            element_css = element_css.replace('margin-right: %;', '');
        } else {
            if ($$(this).val() === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'margin-right: ' + value + $$(document).find('#margin-right-unit').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('keyup', '#margin-bottom', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("margin-bottom")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                if (style_rule[i].includes("margin-bottom")) { // replace
                    style_rule[i] = 'margin-bottom: ' + $$(this).val() + $$(document).find('#margin-bottom-unit').val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('margin-bottom: px;', '');
        element_css = element_css.replace('margin-bottom: %;', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'margin-bottom: ' + $$(this).val() + $$(document).find('#margin-bottom-unit').val() + ';';

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('change', '#margin-bottom-unit', function () {
    var value = $$(document).find('#margin-bottom').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("margin-bottom")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("margin-bottom")) { // replace
                        style_rule[i] = 'margin-bottom: ' + value + $$(document).find('#margin-bottom-unit').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('margin-bottom: px;', '');
            element_css = element_css.replace('margin-bottom: %;', '');
        } else {
            if ($$(this).val() === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'margin-bottom: ' + value + $$(document).find('#margin-bottom-unit').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('keyup', '#margin-left', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("margin-left")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                if (style_rule[i].includes("margin-left")) { // replace
                    style_rule[i] = 'margin-left: ' + $$(this).val() + $$(document).find('#margin-left-unit').val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('margin-left: px;', '');
        element_css = element_css.replace('margin-left: %;', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'margin-left: ' + $$(this).val() + $$(document).find('#margin-left-unit').val() + ';';

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('change', '#margin-left-unit', function () {
    var value = $$(document).find('#margin-left').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("margin-left")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("margin-left")) { // replace
                        style_rule[i] = 'margin-left: ' + value + $$(document).find('#margin-left-unit').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('margin-left: px;', '');
            element_css = element_css.replace('margin-left: %;', '');
        } else {
            if ($$(this).val() === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'margin-left: ' + value + $$(document).find('#margin-left-unit').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('keyup', '#padding-top', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("padding-top")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                if (style_rule[i].includes("padding-top")) { // replace
                    style_rule[i] = 'padding-top: ' + $$(this).val() + $$(document).find('#padding-top-unit').val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('padding-top: px;', '');
        element_css = element_css.replace('padding-top: %;', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'padding-top: ' + $$(this).val() + $$(document).find('#padding-top-unit').val() + ';';

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('change', '#padding-top-unit', function () {
    var value = $$(document).find('#padding-top').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("padding-top")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("padding-top")) { // replace
                        style_rule[i] = 'padding-top: ' + value + $$(document).find('#padding-top-unit').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('padding-top: px;', '');
            element_css = element_css.replace('padding-top: %;', '');
        } else {
            if ($$(this).val() === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'padding-top: ' + value + $$(document).find('#padding-top-unit').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('keyup', '#padding-right', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("padding-right")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                if (style_rule[i].includes("padding-right")) { // replace
                    style_rule[i] = 'padding-right: ' + $$(this).val() + $$(document).find('#padding-right-unit').val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('padding-right: px;', '');
        element_css = element_css.replace('padding-right: %;', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'padding-right: ' + $$(this).val() + $$(document).find('#padding-right-unit').val() + ';';

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('change', '#padding-right-unit', function () {
    var value = $$(document).find('#padding-right').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("padding-right")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("padding-right")) { // replace
                        style_rule[i] = 'padding-right: ' + value + $$(document).find('#padding-right-unit').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('padding-right: px;', '');
            element_css = element_css.replace('padding-right: %;', '');
        } else {
            if ($$(this).val() === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'padding-right: ' + value + $$(document).find('#padding-right-unit').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('keyup', '#padding-bottom', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("padding-bottom")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                if (style_rule[i].includes("padding-bottom")) { // replace
                    style_rule[i] = 'padding-bottom: ' + $$(this).val() + $$(document).find('#padding-bottom-unit').val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('padding-bottom: px;', '');
        element_css = element_css.replace('padding-bottom: %;', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'padding-bottom: ' + $$(this).val() + $$(document).find('#padding-bottom-unit').val() + ';';

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('change', '#padding-bottom-unit', function () {
    var value = $$(document).find('#padding-bottom').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("padding-bottom")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("padding-bottom")) { // replace
                        style_rule[i] = 'padding-bottom: ' + value + $$(document).find('#padding-bottom-unit').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('padding-bottom: px;', '');
            element_css = element_css.replace('padding-bottom: %;', '');
        } else {
            if ($$(this).val() === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'padding-bottom: ' + value + $$(document).find('#padding-bottom-unit').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('keyup', '#padding-left', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("padding-left")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                if (style_rule[i].includes("padding-left")) { // replace
                    style_rule[i] = 'padding-left: ' + $$(this).val() + $$(document).find('#padding-left-unit').val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('padding-left: px;', '');
        element_css = element_css.replace('padding-left: %;', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'padding-left: ' + $$(this).val() + $$(document).find('#padding-left-unit').val() + ';';

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('change', '#padding-left-unit', function () {
    var value = $$(document).find('#padding-left').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("padding-left")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("padding-left")) { // replace
                        style_rule[i] = 'padding-left: ' + value + $$(document).find('#padding-left-unit').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('padding-left: px;', '');
            element_css = element_css.replace('padding-left: %;', '');
        } else {
            if ($$(this).val() === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'padding-left: ' + value + $$(document).find('#padding-left-unit').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('keyup', '#width', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("width")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                if (style_rule[i].includes("width")) { // replace
                    style_rule[i] = 'width: ' + $$(this).val() + $$(document).find('#width-unit').val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('width: px;', '');
        element_css = element_css.replace('width: %;', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'width: ' + $$(this).val() + $$(document).find('#width-unit').val() + ';';

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('change', '#width-unit', function () {
    var value = $$(document).find('#width').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("width")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("width")) { // replace
                        style_rule[i] = 'width: ' + value + $$(document).find('#width-unit').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('width: px;', '');
            element_css = element_css.replace('width: %;', '');
        } else {
            if ($$(this).val() === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'width: ' + value + $$(document).find('#width-unit').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('keyup', '#height', function () {
    // read from css textarea
    var element_css = $$(document).find('#element_css').val();
    element_css = element_css.replace(/\r/g, '');
    element_css = element_css.replace(/\n/g, '');

    // replace or add new rule
    if (element_css.includes("height")) {
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                if (style_rule[i].includes("height")) { // replace
                    style_rule[i] = 'height: ' + $$(this).val() + $$(document).find('#height-unit').val() + ';';
                    style_append = style_append + style_rule[i];
                } else { // add new rule
                    style_append = style_append + style_rule[i] + ';';
                }
            }
        }

        element_css = style_append;
        element_css = element_css.replace('height: px;', '');
        element_css = element_css.replace('height: %;', '');
    } else {
        if ($$(this).val() === "") {
            // Do Nothing
        } else {
            element_css = element_css + 'height: ' + $$(this).val() + $$(document).find('#height-unit').val() + ';';

            $$(document).find('#item_style').addClass('item-input-focused');
            $$(document).find('#item_style').addClass('item-input-with-value');
            $$(document).find('#element_css').addClass('input-with-value');
            $$(document).find('#element_css').addClass('item-input-with-value');
        }
    }

    uibuilder.send({
        "topic": "update_element_style",
        "element_id": element_id_selected,
        "element_css": element_css
    });

    // Beautify
    var style_append = "";
    var style_rule = element_css.split(";");

    var i = 0;
    for (i = 0; i < style_rule.length; i++) {
        if (style_rule[i] === '') {
            // Do Nothing
        } else {
            style_append = style_append + style_rule[i] + ';\r\n';
        }
    }

    $$(document).find('#element_css').val(style_append);
});

$$(document).on('change', '#height-unit', function () {
    var value = $$(document).find('#height').val();
    if (value === '' || value === ' ') {
        // Do Nothing
    } else {
        // read from css textarea
        var element_css = $$(document).find('#element_css').val();
        element_css = element_css.replace(/\r/g, '');
        element_css = element_css.replace(/\n/g, '');

        // replace or add new rule
        if (element_css.includes("height")) {
            var style_append = "";
            var style_rule = element_css.split(";");

            var i = 0;
            for (i = 0; i < style_rule.length; i++) {
                if (style_rule[i] === '') {
                    // Do Nothing
                } else {
                    if (style_rule[i].includes("height")) { // replace
                        style_rule[i] = 'height: ' + value + $$(document).find('#height-unit').val() + ';';
                        style_append = style_append + style_rule[i];
                    } else { // add new rule
                        style_append = style_append + style_rule[i] + ';';
                    }
                }
            }

            element_css = style_append;
            element_css = element_css.replace('height: px;', '');
            element_css = element_css.replace('height: %;', '');
        } else {
            if ($$(this).val() === "") {
                // Do Nothing
            } else {
                element_css = element_css + 'height: ' + value + $$(document).find('#height-unit').val() + ';';

                $$(document).find('#item_style').addClass('item-input-focused');
                $$(document).find('#item_style').addClass('item-input-with-value');
                $$(document).find('#element_css').addClass('input-with-value');
                $$(document).find('#element_css').addClass('item-input-with-value');
            }
        }

        uibuilder.send({
            "topic": "update_element_style",
            "element_id": element_id_selected,
            "element_css": element_css
        });

        // Beautify
        var style_append = "";
        var style_rule = element_css.split(";");

        var i = 0;
        for (i = 0; i < style_rule.length; i++) {
            if (style_rule[i] === '') {
                // Do Nothing
            } else {
                style_append = style_append + style_rule[i] + ';\r\n';
            }
        }

        $$(document).find('#element_css').val(style_append);
    }
});

$$(document).on('keypress', '#component-search-input', function (event) {
    var keyword = $$(this).val().toLowerCase().trim();

    if (event.keyCode == 13) {
        event.preventDefault();

        $$('#items-component > li > div > div > .item-title').each(function () {
            var currentLiText = $$(this).text().toLowerCase();
            if (currentLiText.includes(keyword)) {
                $$(this).parent().parent().parent().show();
            } else {
                $$(this).parent().parent().parent().hide();
            }
        });
    }
});

$$(document).on('keypress', '#element-search-input', function (event) {
    var keyword = $$(this).val().toLowerCase().trim();

    if (event.keyCode == 13) {
        event.preventDefault();

        $$('#applications-list > li > div > div > .item-title').each(function () {
            var currentLiText = $$(this).text().toLowerCase();
            if (currentLiText.includes(keyword)) {
                $$(this).parent().parent().parent().show();
            } else {
                $$(this).parent().parent().parent().hide();
            }
        });
    }
});

$$(document).on('keypress', '#page-search-input', function (event) {
    var keyword = $$(this).val().toLowerCase().trim();

    if (event.keyCode == 13) {
        event.preventDefault();

        $$('#applications-list > li > div > div > .item-title').each(function () {
            var currentLiText = $$(this).text().toLowerCase();
            if (currentLiText.includes(keyword)) {
                $$(this).parent().parent().parent().show();
            } else {
                $$(this).parent().parent().parent().hide();
            }
        });
    }
});

$$(document).on('keypress', '#application-search-input', function (event) {
    var keyword = $$(this).val().toLowerCase().trim();

    if (event.keyCode == 13) {
        event.preventDefault();

        $$('#applications-list > li > div > div > .item-title').each(function () {
            var currentLiText = $$(this).text().toLowerCase();
            if (currentLiText.includes(keyword)) {
                $$(this).parent().parent().parent().show();
            } else {
                $$(this).parent().parent().parent().hide();
            }
        });
    }
});

$$(document).on('click', '.btn-element-add-accordion', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<div class="list accordion-list">\n' +
                '\t<ul>\n' +
                '\t\t<li class="accordion-item"\n>' +
                '\t\t\t<a class="item-content item-link" href="#">\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title">Item 1</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t\t<div class="accordion-item-content">\n' +
                '\t\t\t\t<div class="block">\n' +
                '\t\t\t\t\t<p>Item 1 content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim viverra velit sed euismod. Mauris sed quam vehicula, dapibus ante a, aliquet augue.</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</div>\n' +
                '\t\t</li>\n' +
                '\t\t<li class="accordion-item">\n' +
                '\t\t\t<a class="item-content item-link" href="#">\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title">Item 2</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t\t<div class="accordion-item-content">\n' +
                '\t\t\t\t<div class="block">\n' +
                '\t\t\t\t\t<p>Item 2 content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim viverra velit sed euismod. Mauris sed quam vehicula, dapibus ante a, aliquet augue.</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</div>\n' +
                '\t\t</li>\n' +
                '\t\t<li class="accordion-item">\n' +
                '\t\t\t<a class="item-content item-link" href="#">\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title">Item 3</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t\t<div class="accordion-item-content">\n' +
                '\t\t\t\t<div class="block">\n' +
                '\t\t\t\t\t<p>Item 3 content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim viverra velit sed euismod. Mauris sed quam vehicula, dapibus ante a, aliquet augue.</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</div>\n' +
                '\t\t</li>\n' +
                '\t\t<li class="accordion-item">\n' +
                '\t\t\t<a class="item-content item-link" href="#">\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title">Item 4</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t\t<div class="accordion-item-content">\n' +
                '\t\t\t\t<div class="block">\n' +
                '\t\t\t\t\t<p>Item 4 content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim viverra velit sed euismod. Mauris sed quam vehicula, dapibus ante a, aliquet augue.</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</div>\n' +
                '\t\t</li>\n' +
                '\t</ul>\n' +
                '</div>',
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-accordion-separated', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<div class="list">\n' +
                '\t<ul>\n' +
                '\t\t<li class="accordion-item">\n' +
                '\t\t\t<a class="item-content item-link" href="#">\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title">Item 1</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t\t<div class="accordion-item-content">\n' +
                '\t\t\t\t<div class="block">\n' +
                '\t\t\t\t<p>Item 1 content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim viverra\n' +
                '\t\t\t\t\tvelit sed euismod. Mauris sed quam vehicula, dapibus ante a, aliquet augue.</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</div>\n' +
                '\t\t</li>\n' +
                '\t\t<li class="accordion-item">\n' +
                '\t\t\t<a class="item-content item-link" href="#">\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title">Item 2</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t\t<div class="accordion-item-content">\n' +
                '\t\t\t\t<div class="block">\n' +
                '\t\t\t\t<p>Item 2 content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim viverra\n' +
                '\t\t\t\t\tvelit sed euismod. Mauris sed quam vehicula, dapibus ante a, aliquet augue.</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</div>\n' +
                '\t\t</li>\n' +
                '\t\t<li class="accordion-item">\n' +
                '\t\t\t<a class="item-content item-link" href="#">\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title">Item 3</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t\t<div class="accordion-item-content">\n' +
                '\t\t\t\t<div class="block">\n' +
                '\t\t\t\t<p>Item 3 content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim viverra\n' +
                '\t\t\t\t\tvelit sed euismod. Mauris sed quam vehicula, dapibus ante a, aliquet augue.</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</div>\n' +
                '\t\t</li>\n' +
                '\t\t<li class="accordion-item">\n' +
                '\t\t\t<a class="item-content item-link" href="#">\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title">Item 4</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t\t<div class="accordion-item-content">\n' +
                '\t\t\t\t<div class="block">\n' +
                '\t\t\t\t<p>Item 4 content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim viverra\n' +
                '\t\t\t\t\tvelit sed euismod. Mauris sed quam vehicula, dapibus ante a, aliquet augue.</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</div>\n' +
                '\t\t</li>\n' +
                '\t</ul>\n' +
                '</div>',
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-accordion-oposite', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<div class="list accordion-list accordion-opposite">\n' +
                '\t<ul>\n' +
                '\t\t<li class="accordion-item">' +
                '\t\t\t<a class="item-content item-link" href="#">\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title">Item 1</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t\t<div class="accordion-item-content">\n' +
                '\t\t\t\t<div class="block">\n' +
                '\t\t\t\t\t<p>Item 1 content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim viverra velit sed euismod. Mauris sed quam vehicula, dapibus ante a, aliquet augue.</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</div>\n' +
                '\t\t</li>\n' +
                '\t\t<li class="accordion-item">' +
                '\t\t\t<a class="item-content item-link" href="#">\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title">Item 2</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t\t<div class="accordion-item-content">\n' +
                '\t\t\t\t<div class="block">\n' +
                '\t\t\t\t\t<p>Item 2 content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim viverra velit sed euismod. Mauris sed quam vehicula, dapibus ante a, aliquet augue.</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</div>\n' +
                '\t\t</li>\n' +
                '\t\t<li class="accordion-item">' +
                '\t\t\t<a class="item-content item-link" href="#">\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title">Item 3</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t\t<div class="accordion-item-content">\n' +
                '\t\t\t\t<div class="block">\n' +
                '\t\t\t\t\t<p>Item 3 content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim viverra velit sed euismod. Mauris sed quam vehicula, dapibus ante a, aliquet augue.</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</div>\n' +
                '\t\t</li>\n' +
                '\t\t<li class="accordion-item">' +
                '\t\t\t<a class="item-content item-link" href="#">\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title">Item 4</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t\t<div class="accordion-item-content">\n' +
                '\t\t\t\t<div class="block">\n' +
                '\t\t\t\t\t<p>Item 4 content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim viverra velit sed euismod. Mauris sed quam vehicula, dapibus ante a, aliquet augue.</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</div>\n' +
                '\t\t</li>\n' +
                '\t</ul>\n' +
                '</div>\n',
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-accordion-custom', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<div class="block accordion-list custom-accordion">\n' +
                '\t<div class="accordion-item">\n' +
                '\t\t<div class="accordion-item-toggle">\n' +
                '\t\t\t<i class="icon icon-plus">+</i>\n' +
                '\t\t\t<i class="icon icon-minus">-</i>\n' +
                '\t\t\t<span>Item 1</span>\n' +
                '\t\t</div>\n' +
                '\t\t<div class="accordion-item-content">\n' +
                '\t\t\t<p>Item 1 content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim viverra velit sed euismod. Mauris sed quam vehicula, dapibus ante a, aliquet augue.</p>\n' +
                '\t\t</div>\n' +
                '\t</div>\n' +
                '\t<div class="accordion-item">\n' +
                '\t\t<div class="accordion-item-toggle">\n' +
                '\t\t\t<i class="icon icon-plus">+</i>\n' +
                '\t\t\t<i class="icon icon-minus">-</i>\n' +
                '\t\t\t<span>Item 2</span>\n' +
                '\t\t</div>\n' +
                '\t\t<div class="accordion-item-content">\n' +
                '\t\t\t<p>Item 2 content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim viverra velit sed euismod. Mauris sed quam vehicula, dapibus ante a, aliquet augue.</p>\n' +
                '\t\t</div>\n' +
                '\t</div>\n' +
                '\t<div class="accordion-item">\n' +
                '\t\t<div class="accordion-item-toggle">\n' +
                '\t\t\t<i class="icon icon-plus">+</i>\n' +
                '\t\t\t<i class="icon icon-minus">-</i>\n' +
                '\t\t\t<span>Item 3</span>\n' +
                '\t\t</div>\n' +
                '\t\t<div class="accordion-item-content">\n' +
                '\t\t\t<p>Item 3 content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim viverra velit sed euismod. Mauris sed quam vehicula, dapibus ante a, aliquet augue.</p>\n' +
                '\t\t</div>\n' +
                '\t</div>\n' +
                '</div>\n',
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-card', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '\n<div class="card">\n' +
                '\t<div class="card-content padding">Provided By ETTER</div>\n' +
                '</div>\n',
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-card-header-footer', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<div class=\"card\">\n" +
                "\t<div class=\"card-header\">Card header</div>\n" +
                "\t<div class=\"card-content card-content-padding\">This is a card example.</div>\n" +
                "\t<div class=\"card-footer\">Card Footer</div>\n" +
                "</div>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-card-outline', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<div class=\"card card-outline\">\n" +
                "\t<div class=\"card-content card-content-padding\">This is a card example.</div>\n" +
                "</div>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-card-outline-header-footer', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<div class=\"card card-outline\">\n" +
                "\t<div class=\"card-header\">Card header</div>\n" +
                "\t<div class=\"card-content card-content-padding\">This is a card example.</div>\n" +
                "\t<div class=\"card-footer\">Card Footer</div>\n" +
                "</div>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-card-picture', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<div class=\"card demo-card-header-pic\">\n" +
                "\t<div style=\"background-image:url(https://cdn.framework7.io/placeholder/nature-1000x600-3.jpg)\" class=\"card-header align-items-flex-end\">Journey To Mountains</div>\n" +
                "\t<div class=\"card-content card-content-padding\">\n" +
                "\t\t<p class=\"date\">Posted on 2 days ago</p>\n" +
                "\t\t<p>Card picture example</p>\n" +
                "\t</div>\n" +
                "\t<div class=\"card-footer\">\n" +
                "\t\t<a href=\"#\" class=\"link\">Like</a>\n" +
                "\t\t<a href=\"#\" class=\"link\">Read more</a>\n" +
                "\t</div>\n" +
                "</div>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-card-facebook', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<div class=\"card demo-facebook-card\">\n" +
                "\t<div class=\"card-header\">\n" +
                "\t\t<div class=\"demo-facebook-avatar\">\n" +
                "\t\t\t<img src=\"https://cdn.framework7.io/placeholder/people-68x68-1.jpg\" width=\"34\" height=\"34\" />\n" +
                "\t\t</div>\n" +
                "\t\t<div class=\"demo-facebook-name\">John Doe</div>\n" +
                "\t\t<div class=\"demo-facebook-date\">Monday at 2:15 PM</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"card-content card-content-padding\">\n" +
                "\t\t<p>What a nice photo i took yesterday!</p>\n" +
                "\t\t<img src=\"https://cdn.framework7.io/placeholder/nature-1000x700-8.jpg\" width=\"100%\" />\n" +
                "\t\t<p class=\"likes\">Likes: 112 &nbsp;&nbsp; Comments: 43</p>\n" +
                "\t</div>\n" +
                "\t<div class=\"card-footer\">\n" +
                "\t\t<a href=\"#\" class=\"link\">Like</a>\n" +
                "\t\t<a href=\"#\" class=\"link\">Comment</a>\n" +
                "\t\t<a href=\"#\" class=\"link\">Share</a>\n" +
                "\t</div>\n" +
                "</div>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-card-facebook-picture', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<div class=\"card demo-facebook-card\">\n" +
                "\t<div class=\"card-header\">\n" +
                "\t\t<div class=\"demo-facebook-avatar\">\n" +
                "\t\t\t<img src=\"https://cdn.framework7.io/placeholder/people-68x68-1.jpg\" width=\"34\" height=\"34\" />\n" +
                "\t\t</div>\n" +
                "\t\t<div class=\"demo-facebook-name\">John Doe</div>\n" +
                "\t\t<div class=\"demo-facebook-date\">Monday at 2:15 PM</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"card-content\">\n" +
                "\t\t<img src=\"https://cdn.framework7.io/placeholder/nature-1000x700-8.jpg\" width=\"100%\" />\n" +
                "\t</div>\n" +
                "\t<div class=\"card-footer\">\n" +
                "\t\t<a href=\"#\" class=\"link\">Like</a>\n" +
                "\t\t<a href=\"#\" class=\"link\">Comment</a>\n" +
                "\t\t<a href=\"#\" class=\"link\">Share</a>\n" +
                "\t</div>\n" +
                "</div>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-card-list', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<div class=\"card\">\n" +
                "\t<div class=\"card-content\">\n" +
                "\t\t<div class=\"list links-list no-ios-edges\">\n" +
                "\t\t\t<ul>\n" +
                "\t\t\t\t<li><a href=\"#\">Link 1</a></li>\n" +
                "\t\t\t\t<li><a href=\"#\">Link 2</a></li>\n" +
                "\t\t\t\t<li><a href=\"#\">Link 3</a></li>\n" +
                "\t\t\t\t<li><a href=\"#\">Link 4</a></li>\n" +
                "\t\t\t\t<li><a href=\"#\">Link 5</a></li>\n" +
                "\t\t\t</ul>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</div>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-card-list-media', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<div class=\"card\">\n" +
                "\t<div class=\"card-content\">\n" +
                "\t\t<div class=\"list media-list no-ios-edges\">\n" +
                "\t\t\t<ul>\n" +
                "\t\t\t\t<li class=\"item-content\">\n" +
                "\t\t\t\t\t<div class=\"item-media\">\n" +
                "\t\t\t\t\t\t<img src=\"https://cdn.framework7.io/placeholder/fashion-88x88-4.jpg\" width=\"44\" />\n" +
                "\t\t\t\t\t</div>\n" +
                "\t\t\t\t\t<div class=\"item-inner\">\n" +
                "\t\t\t\t\t\t<div class=\"item-title-row\">\n" +
                "\t\t\t\t\t\t\t<div class=\"item-title\">Yellow Submarine</div>\n" +
                "\t\t\t\t\t\t</div>\n" +
                "\t\t\t\t\t\t<div class=\"item-subtitle\">Beatles</div>\n" +
                "\t\t\t\t\t</div>\n" +
                "\t\t\t\t</li>\n" +
                "\t\t\t\t<li class=\"item-content\">\n" +
                "\t\t\t\t\t<div class=\"item-media\">\n" +
                "\t\t\t\t\t\t<img src=\"https://cdn.framework7.io/placeholder/fashion-88x88-5.jpg\" width=\"44\" />\n" +
                "\t\t\t\t\t</div>\n" +
                "\t\t\t\t\t<div class=\"item-inner\">\n" +
                "\t\t\t\t\t\t<div class=\"item-title-row\">\n" +
                "\t\t\t\t\t\t\t<div class=\"item-title\">Don't Stop Me Now</div>\n" +
                "\t\t\t\t\t\t</div>\n" +
                "\t\t\t\t\t\t<div class=\"item-subtitle\">Queen</div>\n" +
                "\t\t\t\t\t</div>\n" +
                "\t\t\t\t</li>\n" +
                "\t\t\t\t<li class=\"item-content\">\n" +
                "\t\t\t\t\t<div class=\"item-media\">\n" +
                "\t\t\t\t\t\t<img src=\"https://cdn.framework7.io/placeholder/fashion-88x88-6.jpg\" width=\"44\" />\n" +
                "\t\t\t\t\t</div>\n" +
                "\t\t\t\t\t<div class=\"item-inner\">\n" +
                "\t\t\t\t\t\t<div class=\"item-title-row\">\n" +
                "\t\t\t\t\t\t\t<div class=\"item-title\">Billie Jean</div>\n" +
                "\t\t\t\t\t\t</div>\n" +
                "\t\t\t\t\t\t<div class=\"item-subtitle\">Michael Jackson</div>\n" +
                "\t\t\t\t\t</div>\n" +
                "\t\t\t\t</li>\n" +
                "\t\t\t</ul>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</div>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-button-rect', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<a class=\"button col\">Button</a>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-button-rect-raised', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<a class=\"button button-raised col\">Button</a>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-button-rect-fill', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<a class=\"button button-fill col\">Button</a>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-button-rect-fill-raised', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<a class=\"button button-fill button-raised col\">Button</a>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-button-rect-outline', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<a class=\"button button-outline col\">Button</a>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-button-rect-outline-raised', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<a class=\"button button-outline button-raised col\">Button</a>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-button-round', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<a class=\"button button-round col\">Button</a>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-button-round-raised', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<a class=\"button button-round button-raised col\">Button</a>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-button-round-fill', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<a class=\"button button-round button-fill col\">Button</a>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-button-round-fill-raised', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<a class=\"button button-round button-fill button-raised col\">Button</a>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-button-round-outline', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<a class=\"button button-round button-outline col\">Button</a>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-button-segmented', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<p class=\"segmented\">\n" +
                "\t<button class=\"button\">Button</button>\n" +
                "\t<button class=\"button\">Button</button>\n" +
                "\t<button class=\"button button-active\">Active</button>\n" +
                "</p>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-button-segmented-strong', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<p class=\"segmented segmented-strong\">\n" +
                "\t<button class=\"button\">Button</button>\n" +
                "\t<button class=\"button\">Button</button>\n" +
                "\t<button class=\"button button-active\">Active</button>\n" +
                "\t<span class=\"segmented-highlight\"></span>\n" +
                "</p>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-button-round-outline-raised', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<a class=\"button button-round button-outline button-raised col\">Button</a>\n",
            "action": action
        });
    }
});

$$(document).on('click', '#btn-element-add-page-signin', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "\t<div class=\"page-content login-screen-content\">\n" +
                "\t\t<div class=\"login-screen-title\" style=\"margin-top: 10%;\">\n" +
                "\t\t\t<img src=\"https://red.247go.biz/mobilekit/assets/img/sample/photo/1.jpg\" style=\"width: 150px;\" />\n" +
                "\t\t</div>\n" +
                "\t\t<form class=\"list\" id=\"user-form-signin\">\n" +
                "\t\t\t<ul>\n" +
                "\t\t\t\t<li class=\"item-content item-input\">\n" +
                "\t\t\t\t\t<div class=\"item-inner\">\n" +
                "\t\t\t\t\t\t<div class=\"item-title item-label\">Username</div>\n" +
                "\t\t\t\t\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t\t\t\t\t<input type=\"text\" name=\"username\" id=\"username\" placeholder=\"Type Here\">\n" +
                "\t\t\t\t\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t\t\t\t\t</div>\n" +
                "\t\t\t\t\t</div>\n" +
                "\t\t\t\t</li>\n" +
                "\t\t\t\t<li class=\"item-content item-input\">\n" +
                "\t\t\t\t\t<div class=\"item-inner\">\n" +
                "\t\t\t\t\t\t<div class=\"item-title item-label\">Password</div>\n" +
                "\t\t\t\t\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t\t\t\t\t<input type=\"password\" name=\"password\" id=\"password\" placeholder=\"Type Here\">\n" +
                "\t\t\t\t\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t\t\t\t\t</div>\n" +
                "\t\t\t\t\t</div>\n" +
                "\t\t\t\t</li>\n" +
                "\t\t\t</ul>\n" +
                "\t\t\t<ul>\n" +
                "\t\t\t\t<li style=\"padding: 10px 10px 0px 10px;\">\n" +
                "\t\t\t\t\t<a id=\"btn-sign-in\" class=\"item-link button button-fill text-color-white\">Sign In</a>\n" +
                "\t\t\t\t</li>\n" +
                "\t\t\t</ul>\n" +
                "\t\t\t<div class=\"row padding\">\n" +
                "\t\t\t\t<div class=\"col-50 text-align-left text-color-gray\">New user? <a class=\"text-color-deeporange\" href=\"#\">Sign Up</a></div>\n" +
                "\t\t\t\t<div class=\"col-50 text-align-right text-color-gray\">Forget password? <a class=\"text-color-deeporange\" href=\"#\">Reset</a></div>\n" +
                "\t\t\t</div>\n" +
                "\t\t</form>\n" +
                "\t</div>\n",
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-page-navbar', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "\t<div class=\"navbar no-shadow no-border\">\n" +
                "\t\t<div class=\"navbar-bg\"></div>\n" +
                "\t\t<div class=\"navbar-inner\">\n" +
                "\t\t\t<div class=\"left\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">chevron_left</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div class=\"title\">Title</div>\n" +
                "\t\t\t<div class=\"right\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">info</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"page-content\"></div>\n",
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-page-navbar-search', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "\t<div class=\"navbar no-shadow no-border\">\n" +
                "\t\t<div class=\"navbar-bg\"></div>\n" +
                "\t\t<div class=\"navbar-inner\">\n" +
                "\t\t\t<div class=\"left\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">chevron_left</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div class=\"title\">Title</div>\n" +
                "\t\t\t<div class=\"right\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">info</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<form class=\"searchbar\">\n" +
                "\t\t<div class=\"searchbar-inner\">\n" +
                "\t\t\t<div class=\"searchbar-input-wrap\">\n" +
                "\t\t\t\t<input type=\"search\" placeholder=\"Search\">\n" +
                "\t\t\t\t<i class=\"searchbar-icon\"></i>\n" +
                "\t\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<span class=\"searchbar-disable-button\">Cancel</span>\n" +
                "\t\t</div>\n" +
                "\t</form>\n" +
                "\t<div class=\"page-content\"></div>\n",
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-page-navbar-search-panel-right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "\t<div class=\"navbar no-shadow no-border\">\n" +
                "\t\t<div class=\"navbar-bg\"></div>\n" +
                "\t\t<div class=\"navbar-inner\">\n" +
                "\t\t\t<div class=\"left\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">chevron_left</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div class=\"title\">Title</div>\n" +
                "\t\t\t<div class=\"right\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">info</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<form class=\"searchbar\">\n" +
                "\t\t<div class=\"searchbar-inner\">\n" +
                "\t\t\t<div class=\"searchbar-input-wrap\">\n" +
                "\t\t\t\t<input type=\"search\" placeholder=\"Search\">\n" +
                "\t\t\t\t<i class=\"searchbar-icon\"></i>\n" +
                "\t\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<span class=\"searchbar-disable-button\">Cancel</span>\n" +
                "\t\t</div>\n" +
                "\t</form>\n" +
                "\t<div class=\"panel panel-right panel-cover panel-init mypanel-right\">\n" +
                "\t\t<div class=\"block\">\n" +
                "\t\t\t<p>Right Panel content here</p>\n" +
                "\t\t\t<p><a class=\"panel-close\" href=\"#\">Close Panel</a></p>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"page-content\">\n" +
                "\t\t<a class=\"button button-fill panel-open margin\" href=\"#\" data-panel=\".mypanel-right\">Open Right Panel</a>\n" +
                "\t</div>\n",
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-page-navbar-search-panel-left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "\t<div class=\"navbar no-shadow no-border\">\n" +
                "\t\t<div class=\"navbar-bg\"></div>\n" +
                "\t\t<div class=\"navbar-inner\">\n" +
                "\t\t\t<div class=\"left\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">chevron_left</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div class=\"title\">Title</div>\n" +
                "\t\t\t<div class=\"right\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">info</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<form class=\"searchbar\">\n" +
                "\t\t<div class=\"searchbar-inner\">\n" +
                "\t\t\t<div class=\"searchbar-input-wrap\">\n" +
                "\t\t\t\t<input type=\"search\" placeholder=\"Search\">\n" +
                "\t\t\t\t<i class=\"searchbar-icon\"></i>\n" +
                "\t\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<span class=\"searchbar-disable-button\">Cancel</span>\n" +
                "\t\t</div>\n" +
                "\t</form>\n" +
                "\t<div class=\"panel panel-left panel-cover panel-init mypanel-left\">\n" +
                "\t\t<div class=\"block\">\n" +
                "\t\t\t<p>Left Panel content here</p>\n" +
                "\t\t\t<p><a class=\"panel-close\" href=\"#\">Close Panel</a></p>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"page-content\">\n" +
                "\t\t<a class=\"button button-fill panel-open margin\" href=\"#\" data-panel=\".mypanel-left\">Open Left Panel</a>\n" +
                "\t</div>\n",
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-page-navbar-search-panel-left-right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "\t<div class=\"navbar no-shadow no-border\">\n" +
                "\t\t<div class=\"navbar-bg\"></div>\n" +
                "\t\t<div class=\"navbar-inner\">\n" +
                "\t\t\t<div class=\"left\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">chevron_left</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div class=\"title\">Title</div>\n" +
                "\t\t\t<div class=\"right\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">info</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<form class=\"searchbar\">\n" +
                "\t\t<div class=\"searchbar-inner\">\n" +
                "\t\t\t<div class=\"searchbar-input-wrap\">\n" +
                "\t\t\t\t<input type=\"search\" placeholder=\"Search\">\n" +
                "\t\t\t\t<i class=\"searchbar-icon\"></i>\n" +
                "\t\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<span class=\"searchbar-disable-button\">Cancel</span>\n" +
                "\t\t</div>\n" +
                "\t</form>\n" +
                "\t<div class=\"panel panel-left panel-cover panel-init mypanel-left\">\n" +
                "\t\t<div class=\"block\">\n" +
                "\t\t\t<p>Left Panel content here</p>\n" +
                "\t\t\t<p><a class=\"panel-close\" href=\"#\">Close Panel</a></p>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"panel panel-right panel-cover panel-init mypanel-right\">\n" +
                "\t\t<div class=\"block\">\n" +
                "\t\t\t<p>Right Panel content here</p>\n" +
                "\t\t\t<p><a class=\"panel-close\" href=\"#\">Close Panel</a></p>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"page-content\">\n" +
                "\t\t<a class=\"button button-fill panel-open margin-top margin-horizontal\" href=\"#\" data-panel=\".mypanel-left\">Open Left Panel</a>\n" +
                "\t\t<br />\n" +
                "\t\t<a class=\"button button-fill panel-open margin-horizontal\" href=\"#\" data-panel=\".mypanel-right\">Open Right Panel</a>\n" +
                "\t</div>\n",
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-page-navbar-panel-right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "\t<div class=\"navbar no-shadow no-border\">\n" +
                "\t\t<div class=\"navbar-bg\"></div>\n" +
                "\t\t<div class=\"navbar-inner\">\n" +
                "\t\t\t<div class=\"left\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">chevron_left</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div class=\"title\">Title</div>\n" +
                "\t\t\t<div class=\"right\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">info</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"panel panel-right panel-cover panel-init mypanel-right\">\n" +
                "\t\t<div class=\"block\">\n" +
                "\t\t\t<p>Right Panel content here</p>\n" +
                "\t\t\t<p><a class=\"panel-close\" href=\"#\">Close Panel</a></p>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"page-content\">\n" +
                "\t\t<a class=\"button button-fill panel-open margin\" href=\"#\" data-panel=\".mypanel-right\">Open Right Panel</a>\n" +
                "\t</div>\n",
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-page-navbar-panel-left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "\t<div class=\"navbar no-shadow no-border\">\n" +
                "\t\t<div class=\"navbar-bg\"></div>\n" +
                "\t\t<div class=\"navbar-inner\">\n" +
                "\t\t\t<div class=\"left\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">chevron_left</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div class=\"title\">Title</div>\n" +
                "\t\t\t<div class=\"right\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">info</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"panel panel-left panel-cover panel-init mypanel-left\">\n" +
                "\t\t<div class=\"block\">\n" +
                "\t\t\t<p>Left Panel content here</p>\n" +
                "\t\t\t<p><a class=\"panel-close\" href=\"#\">Close Panel</a></p>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"page-content\">\n" +
                "\t\t<a class=\"button button-fill panel-open margin\" href=\"#\" data-panel=\".mypanel-left\">Open Left Panel</a>\n" +
                "\t</div>\n",
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-page-navbar-panel-left-right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "\t<div class=\"navbar no-shadow no-border\">\n" +
                "\t\t<div class=\"navbar-bg\"></div>\n" +
                "\t\t<div class=\"navbar-inner\">\n" +
                "\t\t\t<div class=\"left\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">chevron_left</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div class=\"title\">Title</div>\n" +
                "\t\t\t<div class=\"right\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">info</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"panel panel-left panel-cover panel-init mypanel-left\">\n" +
                "\t\t<div class=\"block\">\n" +
                "\t\t\t<p>Left Panel content here</p>\n" +
                "\t\t\t<p><a class=\"panel-close\" href=\"#\">Close Panel</a></p>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"panel panel-right panel-cover panel-init mypanel-right\">\n" +
                "\t\t<div class=\"block\">\n" +
                "\t\t\t<p>Right Panel content here</p>\n" +
                "\t\t\t<p><a class=\"panel-close\" href=\"#\">Close Panel</a></p>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"page-content\">\n" +
                "\t\t<a class=\"button button-fill panel-open margin-top margin-horizontal\" href=\"#\" data-panel=\".mypanel-left\">Open Left Panel</a>\n" +
                "\t\t<br />\n" +
                "\t\t<a class=\"button button-fill panel-open margin-horizontal\" href=\"#\" data-panel=\".mypanel-right\">Open Right Panel</a>\n" +
                "\t</div>\n",
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-page-navbar-fab', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "\t<div class=\"navbar no-shadow no-border\">\n" +
                "\t\t<div class=\"navbar-bg\"></div>\n" +
                "\t\t<div class=\"navbar-inner\">\n" +
                "\t\t\t<div class=\"left\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">chevron_left</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div class=\"title\">Title</div>\n" +
                "\t\t\t<div class=\"right\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">info</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"fab fab-right-bottom\">\n" +
                "\t\t<a href=\"#\">\n" +
                "\t\t\t<!-- First icon is visible when Speed Dial actions are closed -->\n" +
                "\t\t\t<i class=\"f7-icons\">plus</i>\n" +
                "\t\t\t<!-- Second icon is visible when Speed Dial actions are opened -->\n" +
                "\t\t\t<i class=\"f7-icons\">multiply</i>\n" +
                "\t\t</a>\n" +
                "\t\t<!-- Speed Dial action buttons -->\n" +
                "\t\t<div class=\"fab-buttons fab-buttons-left\">\n" +
                "\t\t\t<a><i class=\"icon material-icons\">looks_one</i></a>\n" +
                "\t\t\t<a><i class=\"icon material-icons\">looks_two</i></a>\n" +
                "\t\t\t<a><i class=\"icon material-icons\">looks_3</i></a>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"page-content\"></div>\n",
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-page-navbar-fab-search', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "\t<div class=\"navbar no-shadow no-border\">\n" +
                "\t\t<div class=\"navbar-bg\"></div>\n" +
                "\t\t<div class=\"navbar-inner\">\n" +
                "\t\t\t<div class=\"left\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">chevron_left</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div class=\"title\">Title</div>\n" +
                "\t\t\t<div class=\"right\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">info</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<form class=\"searchbar\">\n" +
                "\t\t<div class=\"searchbar-inner\">\n" +
                "\t\t\t<div class=\"searchbar-input-wrap\">\n" +
                "\t\t\t\t<input type=\"search\" placeholder=\"Search\">\n" +
                "\t\t\t\t<i class=\"searchbar-icon\"></i>\n" +
                "\t\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<span class=\"searchbar-disable-button\">Cancel</span>\n" +
                "\t\t</div>\n" +
                "\t</form>\n" +
                "\t<div class=\"fab fab-right-bottom\">\n" +
                "\t\t<a href=\"#\">\n" +
                "\t\t\t<!-- First icon is visible when Speed Dial actions are closed -->\n" +
                "\t\t\t<i class=\"f7-icons\">plus</i>\n" +
                "\t\t\t<!-- Second icon is visible when Speed Dial actions are opened -->\n" +
                "\t\t\t<i class=\"f7-icons\">multiply</i>\n" +
                "\t\t</a>\n" +
                "\t\t<!-- Speed Dial action buttons -->\n" +
                "\t\t<div class=\"fab-buttons fab-buttons-left\">\n" +
                "\t\t\t<a><i class=\"icon material-icons\">looks_one</i></a>\n" +
                "\t\t\t<a><i class=\"icon material-icons\">looks_two</i></a>\n" +
                "\t\t\t<a><i class=\"icon material-icons\">looks_3</i></a>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"page-content\"></div>\n",
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-page-navbar-fab-toolbar', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "\t<div class=\"navbar no-shadow no-border\">\n" +
                "\t\t<div class=\"navbar-bg\"></div>\n" +
                "\t\t<div class=\"navbar-inner\">\n" +
                "\t\t\t<div class=\"left\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">chevron_left</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div class=\"title\">Title</div>\n" +
                "\t\t\t<div class=\"right\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">info</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"toolbar toolbar-top tabbar\">\n" +
                "\t\t<div class=\"toolbar-inner\">\n" +
                "\t\t\t<a href=\"#tab-1\" class=\"tab-link tab-link-active\">Tab1</a>\n" +
                "\t\t\t<a href=\"#tab-2\" class=\"tab-link\">Tab2</a>\n" +
                "\t\t\t<a href=\"#tab-3\" class=\"tab-link\">Tab3</a>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"fab fab-right-bottom\">\n" +
                "\t\t<a href=\"#\">\n" +
                "\t\t\t<!-- First icon is visible when Speed Dial actions are closed -->\n" +
                "\t\t\t<i class=\"f7-icons\">plus</i>\n" +
                "\t\t\t<!-- Second icon is visible when Speed Dial actions are opened -->\n" +
                "\t\t\t<i class=\"f7-icons\">multiply</i>\n" +
                "\t\t</a>\n" +
                "\t\t<!-- Speed Dial action buttons -->\n" +
                "\t\t<div class=\"fab-buttons fab-buttons-left\">\n" +
                "\t\t\t<a><i class=\"icon material-icons\">looks_one</i></a>\n" +
                "\t\t\t<a><i class=\"icon material-icons\">looks_two</i></a>\n" +
                "\t\t\t<a><i class=\"icon material-icons\">looks_3</i></a>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"tabs\">\n" +
                "\t\t<div class=\"page-content tab tab-active\" id=\"tab-1\">\n" +
                "\t\t\tTab 1" +
                "\t\t</div>\n" +
                "\t\t<div class=\"page-content tab\" id=\"tab-2\">\n" +
                "\t\t\tTab 2" +
                "\t\t</div>\n" +
                "\t\t<div class=\"page-content tab\" id=\"tab-3\">\n" +
                "\t\t\tTab 3" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<!--<div class=\"page-content\"></div>-->\n",
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-page-navbar-toolbar-bottom', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "\t<div class=\"navbar no-shadow no-border\">\n" +
                "\t\t<div class=\"navbar-bg\"></div>\n" +
                "\t\t<div class=\"navbar-inner\">\n" +
                "\t\t\t<div class=\"left\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">chevron_left</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div class=\"title\">Title</div>\n" +
                "\t\t\t<div class=\"right\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">info</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"toolbar toolbar-bottom tabbar-labels\">\n" +
                "\t\t<div class=\"toolbar-inner\">\n" +
                "\t\t\t<a href=\"#tab-1\" class=\"tab-link tab-link-active\">\n" +
                "\t\t\t\t<i class=\"icon material-icons\">email</i>\n" +
                "\t\t\t\t<span class=\"tabbar-label\">Inbox</span>\n" +
                "\t\t\t</a>\n" +
                "\t\t\t<a href=\"#tab-2\" class=\"tab-link\">\n" +
                "\t\t\t\t<i class=\"icon material-icons\">today<span class=\"badge color-red\">5</span></i>\n" +
                "\t\t\t\t<span class=\"tabbar-label\">Calendar</span>\n" +
                "\t\t\t</a>\n" +
                "\t\t\t<a href=\"#tab-3\" class=\"tab-link\">\n" +
                "\t\t\t\t<i class=\"icon material-icons\">file_upload</i>\n" +
                "\t\t\t\t<span class=\"tabbar-label\">Upload</span>\n" +
                "\t\t\t</a>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"tabs\">\n" +
                "\t\t<div class=\"page-content tab tab-active\" id=\"tab-1\">\n" +
                "\t\t\tTab 1" +
                "\t\t</div>\n" +
                "\t\t<div class=\"page-content tab\" id=\"tab-2\">\n" +
                "\t\t\tTab 2" +
                "\t\t</div>\n" +
                "\t\t<div class=\"page-content tab\" id=\"tab-3\">\n" +
                "\t\t\tTab 3" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<!--<div class=\"page-content\"></div>-->\n",
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-page-navbar-toolbar-bottom-search', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "\t<div class=\"navbar no-shadow no-border\">\n" +
                "\t\t<div class=\"navbar-bg\"></div>\n" +
                "\t\t<div class=\"navbar-inner\">\n" +
                "\t\t\t<div class=\"left\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">chevron_left</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div class=\"title\">Title</div>\n" +
                "\t\t\t<div class=\"right\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">info</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<form class=\"searchbar\">\n" +
                "\t\t<div class=\"searchbar-inner\">\n" +
                "\t\t\t<div class=\"searchbar-input-wrap\">\n" +
                "\t\t\t\t<input type=\"search\" placeholder=\"Search\">\n" +
                "\t\t\t\t<i class=\"searchbar-icon\"></i>\n" +
                "\t\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<span class=\"searchbar-disable-button\">Cancel</span>\n" +
                "\t\t</div>\n" +
                "\t</form>\n" +
                "\t<div class=\"toolbar toolbar-bottom tabbar-labels\">\n" +
                "\t\t<div class=\"toolbar-inner\">\n" +
                "\t\t\t<a href=\"#tab-1\" class=\"tab-link tab-link-active\">\n" +
                "\t\t\t\t<i class=\"icon material-icons\">email</i>\n" +
                "\t\t\t\t<span class=\"tabbar-label\">Inbox</span>\n" +
                "\t\t\t</a>\n" +
                "\t\t\t<a href=\"#tab-2\" class=\"tab-link\">\n" +
                "\t\t\t\t<i class=\"icon material-icons\">today<span class=\"badge color-red\">5</span></i>\n" +
                "\t\t\t\t<span class=\"tabbar-label\">Calendar</span>\n" +
                "\t\t\t</a>\n" +
                "\t\t\t<a href=\"#tab-3\" class=\"tab-link\">\n" +
                "\t\t\t\t<i class=\"icon material-icons\">file_upload</i>\n" +
                "\t\t\t\t<span class=\"tabbar-label\">Upload</span>\n" +
                "\t\t\t</a>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"tabs\">\n" +
                "\t\t<div class=\"page-content tab tab-active\" id=\"tab-1\">\n" +
                "\t\t\tTab 1" +
                "\t\t</div>\n" +
                "\t\t<div class=\"page-content tab\" id=\"tab-2\">\n" +
                "\t\t\tTab 2" +
                "\t\t</div>\n" +
                "\t\t<div class=\"page-content tab\" id=\"tab-3\">\n" +
                "\t\t\tTab 3" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<!--<div class=\"page-content\"></div>-->\n",
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-page-navbar-toolbar-top-bottom', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "\t<div class=\"navbar no-shadow no-border\">\n" +
                "\t\t<div class=\"navbar-bg\"></div>\n" +
                "\t\t<div class=\"navbar-inner\">\n" +
                "\t\t\t<div class=\"left\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">chevron_left</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div class=\"title\">Title</div>\n" +
                "\t\t\t<div class=\"right\">\n" +
                "\t\t\t\t<a class=\"link icon-only\">\n" +
                "\t\t\t\t\t<i class=\"icon material-icons\">info</i>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"toolbar toolbar-top tabbar\">\n" +
                "\t\t<div class=\"toolbar-inner\">\n" +
                "\t\t\t<a href=\"#tab-1\" class=\"tab-link tab-link-active\">Tab1</a>\n" +
                "\t\t\t<a href=\"#tab-2\" class=\"tab-link\">Tab2</a>\n" +
                "\t\t\t<a href=\"#tab-3\" class=\"tab-link\">Tab3</a>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"toolbar toolbar-bottom tabbar-labels\">\n" +
                "\t\t<div class=\"toolbar-inner\">\n" +
                "\t\t\t<a class=\"tab-link tab-link-active\">\n" +
                "\t\t\t\t<i class=\"icon material-icons\">email</i>\n" +
                "\t\t\t\t<span class=\"tabbar-label\">Inbox</span>\n" +
                "\t\t\t</a>\n" +
                "\t\t\t<a class=\"tab-link\">\n" +
                "\t\t\t\t<i class=\"icon material-icons\">today<span class=\"badge color-red\">5</span></i>\n" +
                "\t\t\t\t<span class=\"tabbar-label\">Calendar</span>\n" +
                "\t\t\t</a>\n" +
                "\t\t\t<a class=\"tab-link\">\n" +
                "\t\t\t\t<i class=\"icon material-icons\">file_upload</i>\n" +
                "\t\t\t\t<span class=\"tabbar-label\">Upload</span>\n" +
                "\t\t\t</a>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"tabs\">\n" +
                "\t\t<div class=\"page-content tab tab-active\" id=\"tab-1\">\n" +
                "\t\t\tTab 1" +
                "\t\t</div>\n" +
                "\t\t<div class=\"page-content tab\" id=\"tab-2\">\n" +
                "\t\t\tTab 2" +
                "\t\t</div>\n" +
                "\t\t<div class=\"page-content tab\" id=\"tab-3\">\n" +
                "\t\t\tTab 3" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<!--<div class=\"page-content\"></div>-->\n",
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-page-tabs-static', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "\t<div class=\"navbar no-shadow no-border\">\n" +
                "\t\t<div class=\"navbar-bg\"></div>\n" +
                "\t\t<div class=\"navbar-inner sliding\">\n" +
                "\t\t\t<div class=\"left\">\n" +
                "\t\t\t\t<a href=\"#\" class=\"link back\">\n" +
                "\t\t\t\t\t<i class=\"icon icon-back\"></i>\n" +
                "\t\t\t\t\t<span class=\"if-not-md\">Back</span>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div class=\"title\">Static Tabs</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"toolbar tabbar toolbar-bottom\">\n" +
                "\t\t<div class=\"toolbar-inner\">\n" +
                "\t\t\t<a href=\"#tab-1\" class=\"tab-link tab-link-active\">Tab 1</a>\n" +
                "\t\t\t<a href=\"#tab-2\" class=\"tab-link\">Tab 2</a>\n" +
                "\t\t\t<a href=\"#tab-3\" class=\"tab-link\">Tab 3</a>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"tabs\">\n" +
                "\t\t<div id=\"tab-1\" class=\"page-content tab tab-active\">\n" +
                "\t\t\t<div class=\"block\">\n" +
                "\t\t\t\t<p>Tab 1 content</p>\n" +
                "\t\t\t\t<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam enim quia molestiae facilis laudantium\n" +
                "\t\t\t\t\tvoluptates obcaecati officia cum, sit libero commodi. Ratione illo suscipit temporibus sequi iure ad\n" +
                "\t\t\t\t\tlaboriosam accusamus?</p>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t\t<div id=\"tab-2\" class=\"page-content tab\">\n" +
                "\t\t\t<div class=\"block\">\n" +
                "\t\t\t\t<p>Tab 2 content</p>\n" +
                "\t\t\t\t<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam enim quia molestiae facilis laudantium\n" +
                "\t\t\t\t\tvoluptates obcaecati officia cum, sit libero commodi. Ratione illo suscipit temporibus sequi iure ad\n" +
                "\t\t\t\t\tlaboriosam accusamus?</p>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t\t<div id=\"tab-3\" class=\"page-content tab\">\n" +
                "\t\t\t<div class=\"block\">\n" +
                "\t\t\t\t<p>Tab 3 content</p>\n" +
                "\t\t\t\t<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam enim quia molestiae facilis laudantium\n" +
                "\t\t\t\t\tvoluptates obcaecati officia cum, sit libero commodi. Ratione illo suscipit temporibus sequi iure ad\n" +
                "\t\t\t\t\tlaboriosam accusamus?</p>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n",
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-page-tabs-animated', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "\t<div class=\"navbar no-shadow no-border\">\n" +
                "\t\t<div class=\"navbar-bg\"></div>\n" +
                "\t\t<div class=\"navbar-inner sliding\">\n" +
                "\t\t\t<div class=\"left\">\n" +
                "\t\t\t\t<a href=\"#\" class=\"link back\">\n" +
                "\t\t\t\t\t<i class=\"icon icon-back\"></i>\n" +
                "\t\t\t\t\t<span class=\"if-not-md\">Back</span>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div class=\"title\">Animated Tabs</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"toolbar tabbar toolbar-bottom\">\n" +
                "\t\t<div class=\"toolbar-inner\">\n" +
                "\t\t\t<a href=\"#tab-1\" class=\"tab-link tab-link-active\">Tab 1</a>\n" +
                "\t\t\t<a href=\"#tab-2\" class=\"tab-link\">Tab 2</a>\n" +
                "\t\t\t<a href=\"#tab-3\" class=\"tab-link\">Tab 3</a>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"tabs-animated-wrap\">\n" +
                "\t\t<div class=\"tabs\">\n" +
                "\t\t\t<div id=\"tab-1\" class=\"page-content tab tab-active\">\n" +
                "\t\t\t\t<div class=\"block\">\n" +
                "\t\t\t\t\t<p>Tab 1 content</p>\n" +
                "\t\t\t\t\t<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam enim quia molestiae facilis laudantium\n" +
                "\t\t\t\t\t\tvoluptates obcaecati officia cum, sit libero commodi. Ratione illo suscipit temporibus sequi iure ad\n" +
                "\t\t\t\t\t\tlaboriosam accusamus?</p>\n" +
                "\t\t\t\t</div>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div id=\"tab-2\" class=\"page-content tab\">\n" +
                "\t\t\t\t<div class=\"block\">\n" +
                "\t\t\t\t\t<p>Tab 2 content</p>\n" +
                "\t\t\t\t\t<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam enim quia molestiae facilis laudantium\n" +
                "\t\t\t\t\t\tvoluptates obcaecati officia cum, sit libero commodi. Ratione illo suscipit temporibus sequi iure ad\n" +
                "\t\t\t\t\t\tlaboriosam accusamus?</p>\n" +
                "\t\t\t\t</div>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div id=\"tab-3\" class=\"page-content tab\">\n" +
                "\t\t\t\t<div class=\"block\">\n" +
                "\t\t\t\t\t<p>Tab 3 content</p>\n" +
                "\t\t\t\t\t<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam enim quia molestiae facilis laudantium\n" +
                "\t\t\t\t\t\tvoluptates obcaecati officia cum, sit libero commodi. Ratione illo suscipit temporibus sequi iure ad\n" +
                "\t\t\t\t\t\tlaboriosam accusamus?</p>\n" +
                "\t\t\t\t</div>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n",
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-page-tabs-swipeable', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "\t<div class=\"navbar no-shadow no-border\">\n" +
                "\t\t<div class=\"navbar-bg\"></div>\n" +
                "\t\t<div class=\"navbar-inner sliding\">\n" +
                "\t\t\t<div class=\"left\">\n" +
                "\t\t\t\t<a href=\"#\" class=\"link back\">\n" +
                "\t\t\t\t\t<i class=\"icon icon-back\"></i>\n" +
                "\t\t\t\t\t<span class=\"if-not-md\">Back</span>\n" +
                "\t\t\t\t</a>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div class=\"title\">Swipeable Tabs</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"toolbar tabbar toolbar-bottom\">\n" +
                "\t\t<div class=\"toolbar-inner\">\n" +
                "\t\t\t<a href=\"#tab-1\" class=\"tab-link tab-link-active\">Tab 1</a>\n" +
                "\t\t\t<a href=\"#tab-2\" class=\"tab-link\">Tab 2</a>\n" +
                "\t\t\t<a href=\"#tab-3\" class=\"tab-link\">Tab 3</a>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "\t<div class=\"tabs-swipeable-wrap\">\n" +
                "\t\t<div class=\"tabs\">\n" +
                "\t\t\t<div id=\"tab-1\" class=\"page-content tab tab-active\">\n" +
                "\t\t\t\t<div class=\"block\">\n" +
                "\t\t\t\t\t<p>Tab 1 content</p>\n" +
                "\t\t\t\t\t<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam enim quia molestiae facilis laudantium\n" +
                "\t\t\t\t\t\tvoluptates obcaecati officia cum, sit libero commodi. Ratione illo suscipit temporibus sequi iure ad\n" +
                "\t\t\t\t\t\tlaboriosam accusamus?</p>\n" +
                "\t\t\t\t</div>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div id=\"tab-2\" class=\"page-content tab\">\n" +
                "\t\t\t\t<div class=\"block\">\n" +
                "\t\t\t\t\t<p>Tab 2 content</p>\n" +
                "\t\t\t\t\t<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam enim quia molestiae facilis laudantium\n" +
                "\t\t\t\t\t\tvoluptates obcaecati officia cum, sit libero commodi. Ratione illo suscipit temporibus sequi iure ad\n" +
                "\t\t\t\t\t\tlaboriosam accusamus?</p>\n" +
                "\t\t\t\t</div>\n" +
                "\t\t\t</div>\n" +
                "\t\t\t<div id=\"tab-3\" class=\"page-content tab\">\n" +
                "\t\t\t\t<div class=\"block\">\n" +
                "\t\t\t\t\t<p>Tab 3 content</p>\n" +
                "\t\t\t\t\t<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam enim quia molestiae facilis laudantium\n" +
                "\t\t\t\t\t\tvoluptates obcaecati officia cum, sit libero commodi. Ratione illo suscipit temporibus sequi iure ad\n" +
                "\t\t\t\t\t\tlaboriosam accusamus?</p>\n" +
                "\t\t\t\t</div>\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n",
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-airplane', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">airplane</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-alarm', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">alarm</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-alarm_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">alarm_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-alt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">alt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-ant', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">ant</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-ant_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">ant_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-ant_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">ant_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-ant_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">ant_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-antenna_radiowaves_left_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">antenna_radiowaves_left_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-app', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">app</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-app_badge', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">app_badge</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-app_badge_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">app_badge_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-app_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">app_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-archivebox', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">archivebox</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-archivebox_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">archivebox_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_2_circlepath', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_2_circlepath</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_2_circlepath_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_2_circlepath_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_2_circlepath_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_2_circlepath_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_2_squarepath', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_2_squarepath</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_3_trianglepath', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_3_trianglepath</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_branch', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_branch</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_clockwise', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_clockwise</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_clockwise_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_clockwise_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_clockwise_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_clockwise_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_counterclockwise', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_counterclockwise</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_counterclockwise_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_counterclockwise_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_counterclockwise_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_counterclockwise_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_doc', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_doc</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_doc_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_doc_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_left_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_left_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_left_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_left_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_left_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_left_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_left_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_left_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_right_arrow_up_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_right_arrow_up_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_right_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_right_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_right_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_right_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_right_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_right_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_right_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_right_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_to_line', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_to_line</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_down_to_line_alt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_down_to_line_alt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_left_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_left_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_left_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_left_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_left_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_left_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_left_right_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_left_right_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_left_right_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_left_right_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_left_right_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_left_right_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_left_right_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_left_right_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_left_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_left_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_left_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_left_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_left_to_line', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_left_to_line</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_left_to_line_alt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_left_to_line_alt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_merge', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_merge</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_right_arrow_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_right_arrow_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_right_arrow_left_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_right_arrow_left_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_right_arrow_left_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_right_arrow_left_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_right_arrow_left_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_right_arrow_left_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_right_arrow_left_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_right_arrow_left_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_right_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_right_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_right_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_right_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_right_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_right_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_right_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_right_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_right_to_line', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_right_to_line</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_right_to_line_alt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_right_to_line_alt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_swap', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_swap</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_turn_down_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_turn_down_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_turn_down_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_turn_down_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_turn_left_down', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_turn_left_down</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_turn_left_up', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_turn_left_up</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_turn_right_down', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_turn_right_down</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_turn_right_up', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_turn_right_up</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_turn_up_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_turn_up_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_turn_up_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_turn_up_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_arrow_down', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_arrow_down</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_arrow_down_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_arrow_down_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_arrow_down_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_arrow_down_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_arrow_down_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_arrow_down_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_arrow_down_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_arrow_down_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_bin', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_bin</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_bin_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_bin_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_doc', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_doc</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_doc_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_doc_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_down', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_down</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_down_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_down_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_down_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_down_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_down_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_down_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_down_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_down_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_left_arrow_down_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_left_arrow_down_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_left_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_left_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_left_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_left_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_left_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_left_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_left_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_left_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_right_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_right_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_right_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_right_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_right_diamond', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_right_diamond</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_right_diamond_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_right_diamond_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_right_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_right_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_right_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_right_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_to_line', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_to_line</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_up_to_line_alt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_up_to_line_alt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_down', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_down</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_down_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_down_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_down_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_down_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_down_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_down_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_down_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_down_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_left_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_left_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_left_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_left_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_left_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_left_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_left_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_left_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_right_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_right_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_right_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_right_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_right_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_right_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_right_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_right_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_up', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_up</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_up_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_up_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_up_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_up_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_up_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_up_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrow_uturn_up_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrow_uturn_up_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowshape_turn_up_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowshape_turn_up_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowshape_turn_up_left_2', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowshape_turn_up_left_2</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowshape_turn_up_left_2_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowshape_turn_up_left_2_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowshape_turn_up_left_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowshape_turn_up_left_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowshape_turn_up_left_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowshape_turn_up_left_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowshape_turn_up_left_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowshape_turn_up_left_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowshape_turn_up_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowshape_turn_up_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowshape_turn_up_right_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowshape_turn_up_right_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowshape_turn_up_right_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowshape_turn_up_right_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowshape_turn_up_right_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowshape_turn_up_right_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_down', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_down</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_down_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_down_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_down_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_down_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_down_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_down_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_down_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_down_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_down_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_down_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_left_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_left_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_left_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_left_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_left_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_left_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_left_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_left_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_left_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_left_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_right_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_right_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_right_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_right_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_right_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_right_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_right_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_right_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_right_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_right_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_up', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_up</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_up_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_up_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_up_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_up_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_up_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_up_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_up_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_up_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-arrowtriangle_up_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">arrowtriangle_up_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-asterisk_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">asterisk_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-asterisk_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">asterisk_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-at', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">at</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-at_badge_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">at_badge_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-at_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">at_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-at_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">at_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-at_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">at_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-backward', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">backward</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-backward_end', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">backward_end</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-backward_end_alt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">backward_end_alt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-backward_end_alt_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">backward_end_alt_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-backward_end_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">backward_end_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-backward_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">backward_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-badge_plus_radiowaves_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">badge_plus_radiowaves_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bag', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bag</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bag_badge_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bag_badge_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bag_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bag_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bag_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bag_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bag_fill_badge_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bag_fill_badge_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bag_fill_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bag_fill_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bandage', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bandage</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bandage_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bandage_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-barcode', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">barcode</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-barcode_viewfinder', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">barcode_viewfinder</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bars', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bars</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-battery_0', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">battery_0</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-battery_100', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">battery_100</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-battery_25', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">battery_25</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bed_double', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bed_double</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bed_double_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bed_double_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bell', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bell</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bell_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bell_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bell_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bell_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bell_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bell_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bell_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bell_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bell_slash_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bell_slash_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bin_xmark', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bin_xmark</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bin_xmark_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bin_xmark_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bitcoin', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bitcoin</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bitcoin_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bitcoin_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bitcoin_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bitcoin_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bold', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bold</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bold_italic_underline', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bold_italic_underline</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bold_underline', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bold_underline</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bolt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bolt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bolt_badge_a', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bolt_badge_a</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bolt_badge_a_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bolt_badge_a_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bolt_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bolt_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bolt_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bolt_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bolt_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bolt_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bolt_horizontal', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bolt_horizontal</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bolt_horizontal_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bolt_horizontal_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bolt_horizontal_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bolt_horizontal_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bolt_horizontal_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bolt_horizontal_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bolt_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bolt_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bolt_slash_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bolt_slash_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-book', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">book</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-book_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">book_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-book_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">book_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-book_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">book_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bookmark', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bookmark</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bookmark_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bookmark_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-briefcase', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">briefcase</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-briefcase_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">briefcase_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bubble_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bubble_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bubble_left_bubble_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bubble_left_bubble_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bubble_left_bubble_right_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bubble_left_bubble_right_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bubble_left_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bubble_left_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bubble_middle_bottom', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bubble_middle_bottom</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bubble_middle_bottom_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bubble_middle_bottom_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bubble_middle_top', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bubble_middle_top</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bubble_middle_top_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bubble_middle_top_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bubble_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bubble_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-bubble_right_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">bubble_right_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-building', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">building</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-building_2', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">building_2</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-building_2_crop_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">building_2_crop_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-building_2_crop_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">building_2_crop_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-building_2_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">building_2_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-building_columns', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">building_columns</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-building_columns_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">building_columns_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-building_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">building_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-burn', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">burn</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-burst', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">burst</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-burst_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">burst_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-calendar', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">calendar</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-calendar_badge_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">calendar_badge_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-calendar_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">calendar_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-calendar_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">calendar_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-calendar_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">calendar_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-calendar_today', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">calendar_today</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-camera', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">camera</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-camera_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">camera_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-camera_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">camera_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-camera_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">camera_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-camera_filters', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">camera_filters</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-camera_on_rectangle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">camera_on_rectangle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-camera_on_rectangle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">camera_on_rectangle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-camera_rotate', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">camera_rotate</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-camera_rotate_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">camera_rotate_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-camera_viewfinder', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">camera_viewfinder</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-capslock', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">capslock</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-capslock_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">capslock_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-capsule', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">capsule</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-capsule_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">capsule_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-captions_bubble', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">captions_bubble</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-captions_bubble_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">captions_bubble_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-car_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">car_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cart', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cart</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cart_badge_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cart_badge_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cart_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cart_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cart_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cart_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cart_fill_badge_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cart_fill_badge_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cart_fill_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cart_fill_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cat', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cat</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chart_bar', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chart_bar</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chart_bar_alt_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chart_bar_alt_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chart_bar_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chart_bar_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chart_bar_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chart_bar_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chart_bar_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chart_bar_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chart_bar_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chart_bar_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chart_bar_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chart_bar_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chart_pie', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chart_pie</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chart_pie_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chart_pie_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chat_bubble', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chat_bubble</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chat_bubble_2', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chat_bubble_2</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chat_bubble_2_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chat_bubble_2_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chat_bubble_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chat_bubble_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chat_bubble_text', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chat_bubble_text</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chat_bubble_text_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chat_bubble_text_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-checkmark', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">checkmark</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-checkmark_2', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">checkmark_2</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-checkmark_alt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">checkmark_alt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-checkmark_alt_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">checkmark_alt_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-checkmark_alt_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">checkmark_alt_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-checkmark_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">checkmark_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-checkmark_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">checkmark_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-checkmark_rectangle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">checkmark_rectangle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-checkmark_rectangle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">checkmark_rectangle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-checkmark_seal', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">checkmark_seal</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-checkmark_seal_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">checkmark_seal_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-checkmark_shield', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">checkmark_shield</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-checkmark_shield_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">checkmark_shield_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-checkmark_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">checkmark_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-checkmark_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">checkmark_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_compact_down', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_compact_down</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_compact_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_compact_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_compact_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_compact_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_compact_up', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_compact_up</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_down', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_down</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_down_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_down_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_down_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_down_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_down_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_down_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_down_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_down_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_left_2', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_left_2</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_left_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_left_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_left_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_left_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_left_slash_chevron_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_left_slash_chevron_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_left_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_left_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_left_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_left_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_right_2', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_right_2</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_right_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_right_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_right_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_right_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_right_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_right_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_right_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_right_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_up', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_up</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_up_chevron_down', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_up_chevron_down</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_up_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_up_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_up_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_up_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_up_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_up_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-chevron_up_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">chevron_up_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-circle_bottomthird_split', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">circle_bottomthird_split</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-circle_grid_3x3', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">circle_grid_3x3</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-circle_grid_3x3_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">circle_grid_3x3_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-circle_grid_hex', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">circle_grid_hex</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-circle_grid_hex_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">circle_grid_hex_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-circle_lefthalf_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">circle_lefthalf_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-circle_righthalf_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">circle_righthalf_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-clear', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">clear</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-clear_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">clear_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-clock', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">clock</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-clock_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">clock_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_bolt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_bolt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_bolt_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_bolt_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_bolt_rain', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_bolt_rain</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_bolt_rain_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_bolt_rain_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_download', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_download</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_download_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_download_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_drizzle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_drizzle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_drizzle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_drizzle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_fog', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_fog</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_fog_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_fog_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_hail', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_hail</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_hail_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_hail_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_heavyrain', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_heavyrain</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_heavyrain_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_heavyrain_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_moon', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_moon</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_moon_bolt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_moon_bolt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_moon_bolt_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_moon_bolt_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_moon_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_moon_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_moon_rain', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_moon_rain</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_moon_rain_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_moon_rain_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_rain', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_rain</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_rain_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_rain_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_sleet', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_sleet</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_sleet_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_sleet_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_snow', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_snow</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_snow_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_snow_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_sun', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_sun</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_sun_bolt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_sun_bolt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_sun_bolt_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_sun_bolt_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_sun_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_sun_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_sun_rain', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_sun_rain</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_sun_rain_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_sun_rain_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_upload', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_upload</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cloud_upload_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cloud_upload_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-command', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">command</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-compass', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">compass</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-compass_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">compass_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-control', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">control</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-creditcard', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">creditcard</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-creditcard_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">creditcard_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-crop', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">crop</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-crop_rotate', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">crop_rotate</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cube', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cube</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cube_box', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cube_box</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cube_box_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cube_box_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cube_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cube_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-cursor_rays', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">cursor_rays</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-decrease_indent', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">decrease_indent</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-decrease_quotelevel', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">decrease_quotelevel</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-delete_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">delete_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-delete_left_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">delete_left_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-delete_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">delete_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-delete_right_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">delete_right_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-desktopcomputer', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">desktopcomputer</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-device_desktop', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">device_desktop</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-device_laptop', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">device_laptop</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-device_phone_landscape', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">device_phone_landscape</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-device_phone_portrait', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">device_phone_portrait</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-device_tablet_landscape', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">device_tablet_landscape</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-device_tablet_portrait', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">device_tablet_portrait</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-dial', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">dial</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-dial_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">dial_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-divide', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">divide</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-divide_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">divide_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-divide_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">divide_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-divide_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">divide_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-divide_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">divide_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_append', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_append</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_chart', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_chart</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_chart_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_chart_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_checkmark', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_checkmark</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_checkmark_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_checkmark_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_on_clipboard', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_on_clipboard</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_on_clipboard_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_on_clipboard_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_on_doc', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_on_doc</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_on_doc_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_on_doc_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_person', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_person</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_person_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_person_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_plaintext', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_plaintext</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_richtext', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_richtext</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_text', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_text</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_text_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_text_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_text_search', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_text_search</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-doc_text_viewfinder', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">doc_text_viewfinder</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-dog', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">dog</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-dot_radiowaves_left_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">dot_radiowaves_left_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-dot_radiowaves_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">dot_radiowaves_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-dot_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">dot_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-dot_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">dot_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-download_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">download_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-download_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">download_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-drop', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">drop</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-drop_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">drop_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-drop_triangle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">drop_triangle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-drop_triangle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">drop_triangle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-ear', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">ear</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-eject', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">eject</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-eject_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">eject_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-ellipses_bubble', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">ellipses_bubble</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-ellipses_bubble_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">ellipses_bubble_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-ellipsis', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">ellipsis</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-ellipsis_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">ellipsis_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-ellipsis_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">ellipsis_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-ellipsis_vertical', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">ellipsis_vertical</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-ellipsis_vertical_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">ellipsis_vertical_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-ellipsis_vertical_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">ellipsis_vertical_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-envelope', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">envelope</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-envelope_badge', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">envelope_badge</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-envelope_badge_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">envelope_badge_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-envelope_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">envelope_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-envelope_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">envelope_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-envelope_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">envelope_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-envelope_open', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">envelope_open</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-envelope_open_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">envelope_open_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-equal', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">equal</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-equal_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">equal_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-equal_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">equal_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-equal_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">equal_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-equal_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">equal_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-escape', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">escape</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-exclamationmark', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">exclamationmark</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-exclamationmark_bubble', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">exclamationmark_bubble</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-exclamationmark_bubble_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">exclamationmark_bubble_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-exclamationmark_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">exclamationmark_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-exclamationmark_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">exclamationmark_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-exclamationmark_octagon', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">exclamationmark_octagon</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-exclamationmark_octagon_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">exclamationmark_octagon_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-exclamationmark_shield', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">exclamationmark_shield</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-exclamationmark_shield_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">exclamationmark_shield_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-exclamationmark_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">exclamationmark_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-exclamationmark_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">exclamationmark_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-exclamationmark_triangle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">exclamationmark_triangle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-exclamationmark_triangle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">exclamationmark_triangle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-expand', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">expand</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-eye', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">eye</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-eye_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">eye_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-eye_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">eye_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-eye_slash_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">eye_slash_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-eyedropper', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">eyedropper</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-eyedropper_full', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">eyedropper_full</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-eyedropper_halffull', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">eyedropper_halffull</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-eyeglasses', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">eyeglasses</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-f_cursive', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">f_cursive</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-f_cursive_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">f_cursive_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-f_cursive_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">f_cursive_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-face_smiling', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">face_smiling</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-face_smiling_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">face_smiling_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-facemask', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">facemask</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-facemask_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">facemask_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-film', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">film</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-film_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">film_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-flag', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">flag</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-flag_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">flag_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-flag_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">flag_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-flag_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">flag_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-flag_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">flag_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-flag_slash_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">flag_slash_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-flame', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">flame</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-flame_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">flame_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-floppy_disk', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">floppy_disk</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-flowchart', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">flowchart</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-flowchart_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">flowchart_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-folder', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">folder</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-folder_badge_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">folder_badge_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-folder_badge_person_crop', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">folder_badge_person_crop</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-folder_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">folder_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-folder_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">folder_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-folder_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">folder_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-folder_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">folder_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-folder_fill_badge_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">folder_fill_badge_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-folder_fill_badge_person_crop', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">folder_fill_badge_person_crop</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-folder_fill_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">folder_fill_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-forward', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">forward</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-forward_end', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">forward_end</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-forward_end_alt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">forward_end_alt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-forward_end_alt_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">forward_end_alt_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-forward_end_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">forward_end_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-forward_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">forward_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-function', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">function</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-funnel', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">funnel</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-funnel_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">funnel_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-fx', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">fx</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gamecontroller', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gamecontroller</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gamecontroller_alt_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gamecontroller_alt_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gamecontroller_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gamecontroller_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gauge', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gauge</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gauge_badge_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gauge_badge_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gauge_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gauge_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gear', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gear</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gear_alt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gear_alt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gear_alt_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gear_alt_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gift', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gift</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gift_alt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gift_alt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gift_alt_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gift_alt_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gift_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gift_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-giftcard', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">giftcard</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-giftcard_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">giftcard_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-globe', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">globe</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gobackward', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gobackward</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gobackward_10', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gobackward_10</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gobackward_15', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gobackward_15</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gobackward_30', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gobackward_30</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gobackward_45', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gobackward_45</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gobackward_60', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gobackward_60</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gobackward_75', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gobackward_75</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gobackward_90', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gobackward_90</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-gobackward_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">gobackward_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-goforward', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">goforward</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-goforward_10', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">goforward_10</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-goforward_15', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">goforward_15</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-goforward_30', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">goforward_30</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-goforward_45', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">goforward_45</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-goforward_60', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">goforward_60</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-goforward_75', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">goforward_75</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-goforward_90', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">goforward_90</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-goforward_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">goforward_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-graph_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">graph_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-graph_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">graph_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-graph_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">graph_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-graph_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">graph_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-greaterthan', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">greaterthan</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-greaterthan_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">greaterthan_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-greaterthan_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">greaterthan_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-greaterthan_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">greaterthan_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-greaterthan_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">greaterthan_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-grid', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">grid</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-grid_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">grid_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-grid_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">grid_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-guitars', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">guitars</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hammer', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hammer</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hammer_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hammer_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hand_draw', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hand_draw</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hand_draw_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hand_draw_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hand_point_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hand_point_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hand_point_left_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hand_point_left_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hand_point_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hand_point_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hand_point_right_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hand_point_right_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hand_raised', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hand_raised</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hand_raised_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hand_raised_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hand_raised_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hand_raised_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hand_raised_slash_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hand_raised_slash_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hand_thumbsdown', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hand_thumbsdown</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hand_thumbsdown_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hand_thumbsdown_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hand_thumbsup', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hand_thumbsup</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hand_thumbsup_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hand_thumbsup_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hare', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hare</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hare_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hare_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-headphones', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">headphones</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-heart', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">heart</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-heart_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">heart_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-heart_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">heart_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-heart_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">heart_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-heart_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">heart_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-heart_slash_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">heart_slash_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-heart_slash_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">heart_slash_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-heart_slash_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">heart_slash_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-helm', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">helm</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hexagon', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hexagon</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hexagon_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hexagon_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hifispeaker', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hifispeaker</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hifispeaker_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hifispeaker_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hourglass', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hourglass</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hourglass_bottomhalf_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hourglass_bottomhalf_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hourglass_tophalf_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hourglass_tophalf_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-house', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">house</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-house_alt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">house_alt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-house_alt_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">house_alt_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-house_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">house_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-hurricane', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">hurricane</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-increase_indent', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">increase_indent</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-increase_quotelevel', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">increase_quotelevel</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-infinite', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">infinite</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-info', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">info</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-info_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">info_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-info_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">info_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-italic', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">italic</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-keyboard', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">keyboard</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-keyboard_chevron_compact_down', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">keyboard_chevron_compact_down</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-largecircle_fill_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">largecircle_fill_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lasso', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lasso</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-layers', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">layers</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-layers_alt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">layers_alt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-layers_alt_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">layers_alt_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-layers_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">layers_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-leaf_arrow_circlepath', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">leaf_arrow_circlepath</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lessthan', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lessthan</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lessthan_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lessthan_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lessthan_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lessthan_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lessthan_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lessthan_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lessthan_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lessthan_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-light_max', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">light_max</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-light_min', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">light_min</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lightbulb', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lightbulb</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lightbulb_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lightbulb_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lightbulb_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lightbulb_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lightbulb_slash_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lightbulb_slash_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-line_horizontal_3', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">line_horizontal_3</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-line_horizontal_3_decrease', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">line_horizontal_3_decrease</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-line_horizontal_3_decrease_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">line_horizontal_3_decrease_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-line_horizontal_3_decrease_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">line_horizontal_3_decrease_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-link', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">link</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-link_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">link_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-link_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">link_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-list_bullet', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">list_bullet</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-list_bullet_below_rectangle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">list_bullet_below_rectangle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-list_bullet_indent', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">list_bullet_indent</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-list_dash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">list_dash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-list_number', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">list_number</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-list_number_rtl', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">list_number_rtl</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-location', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">location</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-location_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">location_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-location_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">location_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-location_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">location_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-location_north', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">location_north</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-location_north_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">location_north_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-location_north_line', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">location_north_line</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-location_north_line_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">location_north_line_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-location_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">location_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-location_slash_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">location_slash_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lock', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lock</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lock_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lock_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lock_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lock_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lock_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lock_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lock_open', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lock_open</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lock_open_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lock_open_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lock_rotation', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lock_rotation</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lock_rotation_open', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lock_rotation_open</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lock_shield', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lock_shield</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lock_shield_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lock_shield_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lock_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lock_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-lock_slash_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">lock_slash_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-logo_android', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">logo_android</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-logo_android_text', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">logo_android_text</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-logo_apple', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">logo_apple</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-logo_facebook', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">logo_facebook</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-logo_github', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">logo_github</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-logo_google', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">logo_google</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-logo_google_text', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">logo_google_text</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-logo_googleplus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">logo_googleplus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-logo_instagram', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">logo_instagram</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-logo_ios', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">logo_ios</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-logo_linkedin', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">logo_linkedin</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-logo_macos', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">logo_macos</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-logo_microsoft', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">logo_microsoft</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-logo_rss', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">logo_rss</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-logo_stackoverflow', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">logo_stackoverflow</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-logo_twitter', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">logo_twitter</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-logo_windows', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">logo_windows</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-macwindow', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">macwindow</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-map', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">map</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-map_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">map_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-map_pin', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">map_pin</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-map_pin_ellipse', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">map_pin_ellipse</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-map_pin_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">map_pin_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-memories', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">memories</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-memories_badge_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">memories_badge_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-memories_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">memories_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-menu', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">menu</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-metronome', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">metronome</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-mic', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">mic</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-mic_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">mic_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-mic_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">mic_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-mic_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">mic_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-mic_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">mic_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-mic_slash_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">mic_slash_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-minus_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">minus_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-minus_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">minus_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-minus_rectangle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">minus_rectangle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-minus_rectangle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">minus_rectangle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-minus_slash_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">minus_slash_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-minus_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">minus_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-minus_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">minus_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-money_dollar', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">money_dollar</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-money_dollar_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">money_dollar_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-money_dollar_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">money_dollar_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-money_euro', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">money_euro</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-money_euro_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">money_euro_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-money_euro_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">money_euro_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-money_pound', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">money_pound</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-money_pound_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">money_pound_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-money_pound_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">money_pound_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-money_rubl', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">money_rubl</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-money_rubl_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">money_rubl_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-money_rubl_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">money_rubl_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-money_yen', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">money_yen</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-money_yen_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">money_yen_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-money_yen_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">money_yen_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-moon', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">moon</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-moon_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">moon_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-moon_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">moon_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-moon_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">moon_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-moon_stars', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">moon_stars</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-moon_stars_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">moon_stars_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-moon_zzz', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">moon_zzz</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-moon_zzz_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">moon_zzz_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-move', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">move</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-multiply', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">multiply</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-multiply_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">multiply_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-multiply_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">multiply_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-multiply_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">multiply_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-multiply_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">multiply_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-music_albums', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">music_albums</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-music_albums_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">music_albums_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-music_house', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">music_house</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-music_house_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">music_house_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-music_mic', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">music_mic</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-music_note', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">music_note</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-music_note_2', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">music_note_2</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-music_note_list', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">music_note_list</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-nosign', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">nosign</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-number', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">number</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-number_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">number_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-number_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">number_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-number_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">number_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-number_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">number_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-option', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">option</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-paintbrush', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">paintbrush</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-paintbrush_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">paintbrush_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-pano', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">pano</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-pano_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">pano_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-paperclip', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">paperclip</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-paperplane', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">paperplane</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-paperplane_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">paperplane_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-paragraph', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">paragraph</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-pause', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">pause</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-pause_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">pause_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-pause_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">pause_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-pause_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">pause_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-pause_rectangle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">pause_rectangle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-pause_rectangle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">pause_rectangle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-paw', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">paw</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-pencil', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">pencil</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-pencil_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">pencil_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-pencil_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">pencil_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-pencil_ellipsis_rectangle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">pencil_ellipsis_rectangle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-pencil_outline', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">pencil_outline</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-pencil_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">pencil_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-percent', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">percent</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_2', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_2</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_2_alt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_2_alt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_2_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_2_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_2_square_stack', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_2_square_stack</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_2_square_stack_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_2_square_stack_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_3', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_3</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_3_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_3_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_alt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_alt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_alt_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_alt_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_alt_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_alt_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_badge_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_badge_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_badge_minus_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_badge_minus_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_badge_plus_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_badge_plus_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_crop_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_crop_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_crop_circle_badge_checkmark', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_crop_circle_badge_checkmark</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_crop_circle_badge_exclam', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_crop_circle_badge_exclam</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_crop_circle_badge_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_crop_circle_badge_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_crop_circle_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_crop_circle_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_crop_circle_badge_xmark', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_crop_circle_badge_xmark</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_crop_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_crop_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_crop_circle_fill_badge_checkmark', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_crop_circle_fill_badge_checkmark</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_crop_circle_fill_badge_exclam', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_crop_circle_fill_badge_exclam</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_crop_circle_fill_badge_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_crop_circle_fill_badge_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_crop_circle_fill_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_crop_circle_fill_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_crop_circle_fill_badge_xmark', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_crop_circle_fill_badge_xmark</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_crop_rectangle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_crop_rectangle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_crop_rectangle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_crop_rectangle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_crop_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_crop_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_crop_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_crop_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-person_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">person_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-personalhotspot', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">personalhotspot</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-perspective', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">perspective</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-phone', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">phone</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-phone_arrow_down_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">phone_arrow_down_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-phone_arrow_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">phone_arrow_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-phone_arrow_up_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">phone_arrow_up_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-phone_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">phone_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-phone_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">phone_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-phone_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">phone_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-phone_down', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">phone_down</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-phone_down_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">phone_down_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-phone_down_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">phone_down_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-phone_down_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">phone_down_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-phone_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">phone_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-phone_fill_arrow_down_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">phone_fill_arrow_down_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-phone_fill_arrow_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">phone_fill_arrow_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-phone_fill_arrow_up_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">phone_fill_arrow_up_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-phone_fill_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">phone_fill_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-photo', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">photo</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-photo_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">photo_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-photo_fill_on_rectangle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">photo_fill_on_rectangle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-photo_on_rectangle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">photo_on_rectangle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-piano', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">piano</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-pin', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">pin</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-pin_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">pin_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-pin_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">pin_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-pin_slash_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">pin_slash_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-placemark', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">placemark</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-placemark_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">placemark_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-play', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">play</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-play_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">play_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-play_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">play_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-play_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">play_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-play_rectangle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">play_rectangle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-play_rectangle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">play_rectangle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-playpause', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">playpause</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-playpause_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">playpause_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plus_app', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plus_app</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plus_app_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plus_app_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plus_bubble', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plus_bubble</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plus_bubble_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plus_bubble_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plus_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plus_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plus_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plus_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plus_rectangle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plus_rectangle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plus_rectangle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plus_rectangle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plus_rectangle_fill_on_rectangle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plus_rectangle_fill_on_rectangle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plus_rectangle_on_rectangle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plus_rectangle_on_rectangle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plus_slash_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plus_slash_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plus_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plus_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plus_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plus_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plus_square_fill_on_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plus_square_fill_on_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plus_square_on_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plus_square_on_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plusminus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plusminus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plusminus_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plusminus_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-plusminus_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">plusminus_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-poultry_leg', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">poultry_leg</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-power', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">power</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-printer', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">printer</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-printer_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">printer_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-projective', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">projective</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-purchased', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">purchased</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-purchased_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">purchased_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-purchased_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">purchased_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-qrcode', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">qrcode</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-qrcode_viewfinder', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">qrcode_viewfinder</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-question', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">question</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-question_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">question_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-question_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">question_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-question_diamond', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">question_diamond</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-question_diamond_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">question_diamond_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-question_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">question_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-question_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">question_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-quote_bubble', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">quote_bubble</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-quote_bubble_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">quote_bubble_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-radiowaves_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">radiowaves_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-radiowaves_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">radiowaves_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rays', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rays</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-recordingtape', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">recordingtape</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_3_offgrid', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_3_offgrid</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_3_offgrid_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_3_offgrid_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_arrow_up_right_arrow_down_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_arrow_up_right_arrow_down_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_arrow_up_right_arrow_down_left_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_arrow_up_right_arrow_down_left_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_badge_checkmark', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_badge_checkmark</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_badge_xmark', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_badge_xmark</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_compress_vertical', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_compress_vertical</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_dock', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_dock</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_expand_vertical', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_expand_vertical</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_fill_badge_checkmark', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_fill_badge_checkmark</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_fill_badge_xmark', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_fill_badge_xmark</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_fill_on_rectangle_angled_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_fill_on_rectangle_angled_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_fill_on_rectangle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_fill_on_rectangle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_grid_1x2', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_grid_1x2</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_grid_1x2_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_grid_1x2_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_grid_2x2', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_grid_2x2</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_grid_2x2_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_grid_2x2_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_grid_3x2', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_grid_3x2</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_grid_3x2_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_grid_3x2_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_on_rectangle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_on_rectangle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_on_rectangle_angled', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_on_rectangle_angled</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_paperclip', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_paperclip</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_split_3x1', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_split_3x1</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_split_3x1_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_split_3x1_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_split_3x3', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_split_3x3</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_split_3x3_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_split_3x3_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_stack', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_stack</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_stack_badge_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_stack_badge_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_stack_badge_person_crop', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_stack_badge_person_crop</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_stack_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_stack_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_stack_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_stack_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_stack_fill_badge_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_stack_fill_badge_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_stack_fill_badge_person_crop', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_stack_fill_badge_person_crop</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_stack_fill_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_stack_fill_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_stack_person_crop', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_stack_person_crop</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rectangle_stack_person_crop_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rectangle_stack_person_crop_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-repeat', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">repeat</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-repeat_1', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">repeat_1</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-resize', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">resize</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-resize_h', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">resize_h</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-resize_v', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">resize_v</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-return', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">return</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rhombus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rhombus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rhombus_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rhombus_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rocket', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rocket</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rocket_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rocket_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rosette', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rosette</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rotate_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rotate_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rotate_left_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rotate_left_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rotate_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rotate_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-rotate_right_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">rotate_right_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-scissors', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">scissors</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-scissors_alt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">scissors_alt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-scope', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">scope</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-scribble', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">scribble</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-search', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">search</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-search_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">search_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-search_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">search_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-selection_pin_in_out', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">selection_pin_in_out</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-shield', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">shield</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-shield_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">shield_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-shield_lefthalf_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">shield_lefthalf_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-shield_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">shield_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-shield_slash_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">shield_slash_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-shift', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">shift</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-shift_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">shift_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-shippingbox', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">shippingbox</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-shippingbox_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">shippingbox_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-shuffle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">shuffle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sidebar_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sidebar_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sidebar_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sidebar_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-signature', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">signature</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-skew', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">skew</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-slash_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">slash_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-slash_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">slash_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-slider_horizontal_3', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">slider_horizontal_3</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-slider_horizontal_below_rectangle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">slider_horizontal_below_rectangle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-slowmo', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">slowmo</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-smallcircle_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">smallcircle_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-smallcircle_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">smallcircle_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-smallcircle_fill_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">smallcircle_fill_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-smallcircle_fill_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">smallcircle_fill_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-smiley', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">smiley</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-smiley_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">smiley_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-smoke', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">smoke</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-smoke_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">smoke_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-snow', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">snow</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sort_down', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sort_down</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sort_down_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sort_down_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sort_down_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sort_down_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sort_up', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sort_up</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sort_up_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sort_up_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sort_up_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sort_up_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sparkles', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sparkles</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-speaker', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">speaker</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-speaker_1', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">speaker_1</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-speaker_1_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">speaker_1_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-speaker_2', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">speaker_2</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-speaker_2_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">speaker_2_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-speaker_3', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">speaker_3</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-speaker_3_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">speaker_3_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-speaker_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">speaker_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-speaker_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">speaker_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-speaker_slash_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">speaker_slash_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-speaker_slash_fill_rtl', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">speaker_slash_fill_rtl</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-speaker_slash_rtl', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">speaker_slash_rtl</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-speaker_zzz', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">speaker_zzz</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-speaker_zzz_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">speaker_zzz_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-speaker_zzz_fill_rtl', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">speaker_zzz_fill_rtl</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-speaker_zzz_rtl', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">speaker_zzz_rtl</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-speedometer', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">speedometer</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sportscourt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sportscourt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sportscourt_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sportscourt_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_arrow_down', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_arrow_down</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_arrow_down_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_arrow_down_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_arrow_down_on_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_arrow_down_on_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_arrow_down_on_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_arrow_down_on_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_arrow_left', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_arrow_left</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_arrow_left_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_arrow_left_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_arrow_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_arrow_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_arrow_right_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_arrow_right_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_arrow_up', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_arrow_up</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_arrow_up_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_arrow_up_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_arrow_up_on_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_arrow_up_on_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_arrow_up_on_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_arrow_up_on_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_favorites', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_favorites</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_favorites_alt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_favorites_alt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_favorites_alt_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_favorites_alt_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_favorites_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_favorites_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_fill_line_vertical_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_fill_line_vertical_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_fill_line_vertical_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_fill_line_vertical_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_fill_on_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_fill_on_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_fill_on_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_fill_on_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_grid_2x2', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_grid_2x2</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_grid_2x2_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_grid_2x2_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_grid_3x2', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_grid_3x2</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_grid_3x2_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_grid_3x2_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_grid_4x3_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_grid_4x3_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_lefthalf_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_lefthalf_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_line_vertical_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_line_vertical_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_line_vertical_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_line_vertical_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_list', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_list</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_list_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_list_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_on_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_on_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_on_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_on_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_pencil', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_pencil</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_pencil_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_pencil_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_righthalf_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_righthalf_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_split_1x2', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_split_1x2</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_split_1x2_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_split_1x2_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_split_2x1', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_split_2x1</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_split_2x1_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_split_2x1_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_split_2x2', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_split_2x2</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_split_2x2_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_split_2x2_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_stack', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_stack</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_stack_3d_down_dottedline', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_stack_3d_down_dottedline</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_stack_3d_down_right', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_stack_3d_down_right</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_stack_3d_down_right_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_stack_3d_down_right_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_stack_3d_up', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_stack_3d_up</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_stack_3d_up_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_stack_3d_up_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_stack_3d_up_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_stack_3d_up_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_stack_3d_up_slash_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_stack_3d_up_slash_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-square_stack_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">square_stack_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-star', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">star</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-star_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">star_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-star_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">star_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-star_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">star_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-star_lefthalf_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">star_lefthalf_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-star_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">star_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-star_slash_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">star_slash_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-staroflife', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">staroflife</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-staroflife_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">staroflife_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-status', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">status</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sticker', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sticker</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-stop', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">stop</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-stop_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">stop_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-stop_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">stop_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-stop_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">stop_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-stopwatch', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">stopwatch</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-stopwatch_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">stopwatch_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-strikethrough', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">strikethrough</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-suit_club', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">suit_club</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-suit_club_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">suit_club_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-suit_diamond', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">suit_diamond</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-suit_diamond_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">suit_diamond_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-suit_heart', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">suit_heart</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-suit_heart_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">suit_heart_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-suit_spade', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">suit_spade</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-suit_spade_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">suit_spade_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sum', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sum</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sun_dust', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sun_dust</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sun_dust_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sun_dust_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sun_haze', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sun_haze</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sun_haze_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sun_haze_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sun_max', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sun_max</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sun_max_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sun_max_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sun_min', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sun_min</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sun_min_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sun_min_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sunrise', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sunrise</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sunrise_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sunrise_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sunset', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sunset</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-sunset_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">sunset_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-t_bubble', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">t_bubble</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-t_bubble_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">t_bubble_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-table', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">table</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-table_badge_more', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">table_badge_more</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-table_badge_more_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">table_badge_more_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-table_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">table_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tag', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tag</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tag_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tag_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tag_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tag_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tag_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tag_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-text_aligncenter', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">text_aligncenter</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-text_alignleft', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">text_alignleft</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-text_alignright', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">text_alignright</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-text_append', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">text_append</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-text_badge_checkmark', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">text_badge_checkmark</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-text_badge_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">text_badge_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-text_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">text_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-text_badge_star', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">text_badge_star</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-text_badge_xmark', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">text_badge_xmark</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-text_bubble', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">text_bubble</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-text_bubble_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">text_bubble_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-text_cursor', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">text_cursor</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-text_insert', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">text_insert</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-text_justify', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">text_justify</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-text_justifyleft', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">text_justifyleft</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-text_justifyright', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">text_justifyright</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-text_quote', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">text_quote</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-textbox', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">textbox</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-textformat', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">textformat</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-textformat_123', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">textformat_123</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-textformat_abc', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">textformat_abc</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-textformat_abc_dottedunderline', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">textformat_abc_dottedunderline</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-textformat_alt', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">textformat_alt</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-textformat_size', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">textformat_size</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-textformat_subscript', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">textformat_subscript</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-textformat_superscript', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">textformat_superscript</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-thermometer', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">thermometer</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-thermometer_snowflake', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">thermometer_snowflake</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-thermometer_sun', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">thermometer_sun</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-ticket', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">ticket</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-ticket_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">ticket_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tickets', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tickets</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tickets_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tickets_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-timelapse', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">timelapse</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-timer', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">timer</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-timer_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">timer_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-today', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">today</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-today_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">today_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tornado', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tornado</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tortoise', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tortoise</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tortoise_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tortoise_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tram_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tram_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-trash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">trash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-trash_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">trash_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-trash_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">trash_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-trash_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">trash_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-trash_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">trash_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-trash_slash_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">trash_slash_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tray', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tray</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tray_2', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tray_2</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tray_2_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tray_2_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tray_arrow_down', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tray_arrow_down</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tray_arrow_down_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tray_arrow_down_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tray_arrow_up', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tray_arrow_up</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tray_arrow_up_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tray_arrow_up_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tray_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tray_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tray_full', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tray_full</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tray_full_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tray_full_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tree', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tree</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-triangle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">triangle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-triangle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">triangle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-triangle_lefthalf_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">triangle_lefthalf_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-triangle_righthalf_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">triangle_righthalf_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tropicalstorm', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tropicalstorm</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tuningfork', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tuningfork</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tv', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tv</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tv_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tv_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tv_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tv_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tv_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tv_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tv_music_note', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tv_music_note</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-tv_music_note_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">tv_music_note_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-uiwindow_split_2x1', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">uiwindow_split_2x1</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-umbrella', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">umbrella</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-umbrella_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">umbrella_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-underline', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">underline</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-upload_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">upload_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-upload_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">upload_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-videocam', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">videocam</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-videocam_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">videocam_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-videocam_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">videocam_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-videocam_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">videocam_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-view_2d', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">view_2d</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-view_3d', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">view_3d</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-viewfinder', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">viewfinder</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-viewfinder_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">viewfinder_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-viewfinder_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">viewfinder_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-wallet', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">wallet</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-wallet_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">wallet_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-wand_rays', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">wand_rays</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-wand_rays_inverse', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">wand_rays_inverse</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-wand_stars', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">wand_stars</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-wand_stars_inverse', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">wand_stars_inverse</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-waveform', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">waveform</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-waveform_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">waveform_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-waveform_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">waveform_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-waveform_path', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">waveform_path</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-waveform_path_badge_minus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">waveform_path_badge_minus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-waveform_path_badge_plus', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">waveform_path_badge_plus</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-waveform_path_ecg', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">waveform_path_ecg</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-wifi', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">wifi</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-wifi_exclamationmark', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">wifi_exclamationmark</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-wifi_slash', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">wifi_slash</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-wind', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">wind</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-wind_snow', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">wind_snow</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-wrench', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">wrench</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-wrench_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">wrench_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-xmark', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">xmark</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-xmark_circle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">xmark_circle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-xmark_circle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">xmark_circle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-xmark_octagon', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">xmark_octagon</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-xmark_octagon_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">xmark_octagon_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-xmark_rectangle', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">xmark_rectangle</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-xmark_rectangle_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">xmark_rectangle_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-xmark_seal', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">xmark_seal</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-xmark_seal_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">xmark_seal_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-xmark_shield', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">xmark_shield</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-xmark_shield_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">xmark_shield_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-xmark_square', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">xmark_square</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-xmark_square_fill', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">xmark_square_fill</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-zoom_in', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">zoom_in</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-zoom_out', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">zoom_out</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '#btn-element-add-icon-zzz', function () {
    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<i class="f7-icons">zzz</i>',
            "action": "inner"
        });
    }
});

$$(document).on('click', '.btn-element-add-menu-list-basic', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<div class="list menu-list">\n' +
                '\t<ul>\n' +
                '\t\t<li>\n' +
                '\t\t\t<a href="#" class="item-content item-link item-selected">\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title">Item 1</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t</li>\n' +
                '\t\t<li>\n' +
                '\t\t\t<a href="#" class="item-content item-link">\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title">Item 2</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t</li>\n' +
                '\t</ul>\n' +
                '</div>\n',
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-menu-list-icon', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<div class="list menu-list">\n' +
                '\t<ul>\n' +
                '\t\t<li>\n' +
                '\t\t\t<a href="#" class="item-content item-link item-selected">\n' +
                '\t\t\t\t<div class="item-media">\n' +
                '\t\t\t\t\t<i class="icon f7-icons">house</i>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title">Item 1</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t</li>\n' +
                '\t\t<li>\n' +
                '\t\t\t<a href="#" class="item-content item-link">\n' +
                '\t\t\t\t<div class="item-media">\n' +
                '\t\t\t\t\t<i class="icon f7-icons">gear</i>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title">Item 2</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t</li>\n' +
                '\t</ul>\n' +
                '</div>\n',
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-menu-list-icon-subtitle', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '<div class="list media-list menu-list">\n' +
                '\t<ul>\n' +
                '\t\t<li>\n' +
                '\t\t\t<a href="#" class="item-content item-link item-selected">\n' +
                '\t\t\t\t<div class="item-media">\n' +
                '\t\t\t\t\t<i class="icon f7-icons">house</i>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title-wrap">\n' +
                '\t\t\t\t\t\t<div class="item-title">Item 1</div>\n' +
                '\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t<div class="item-subtitle">Menu subtitle</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t</li>\n' +
                '\t\t<li>\n' +
                '\t\t\t<a href="#" class="item-content item-link">\n' +
                '\t\t\t\t<div class="item-media">\n' +
                '\t\t\t\t\t<i class="icon f7-icons">gear</i>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title-wrap">\n' +
                '\t\t\t\t\t\t<div class="item-title">Item 2</div>\n' +
                '\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t<div class="item-subtitle">Menu subtitle</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t</li>\n' +
                '\t</ul>\n' +
                '</div>\n',
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-menu-list-item-basic', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '\t\t<li>\n' +
                '\t\t\t<a href="#" class="item-content item-link">\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title">Item 2</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t</li>\n',
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-menu-list-item-icon', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '\t\t<li>\n' +
                '\t\t\t<a href="#" class="item-content item-link">\n' +
                '\t\t\t\t<div class="item-media">\n' +
                '\t\t\t\t\t<i class="icon f7-icons">gear</i>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title">Item 2</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t</li>\n',
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-menu-list-item-icon-subtitle', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": '\t\t<li>\n' +
                '\t\t\t<a href="#" class="item-content item-link">\n' +
                '\t\t\t\t<div class="item-media">\n' +
                '\t\t\t\t\t<i class="icon f7-icons">gear</i>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="item-inner">\n' +
                '\t\t\t\t\t<div class="item-title-wrap">\n' +
                '\t\t\t\t\t\t<div class="item-title">Item 2</div>\n' +
                '\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t<div class="item-subtitle">Menu subtitle</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</a>\n' +
                '\t\t</li>\n',
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-inline', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<form>\n" +
                "\t<div class=\"list inline-labels no-hairlines no-hairlines-between\">\n" +
                "\t\t<ul>\n" +
                "\t\t\t<!-- Form Item Here -->\n" +
                "\t\t\t<li class=\"item-content item-input\">\n" +
                "\t\t\t\t<div class=\"item-media\">\n" +
                "\t\t\t\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t\t\t\t</div>\n" +
                "\t\t\t\t<div class=\"item-inner\">\n" +
                "\t\t\t\t\t<div class=\"item-title item-label\">Name</div>\n" +
                "\t\t\t\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t\t\t\t<input type=\"text\" placeholder=\"Your name\" />\n" +
                "\t\t\t\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t\t\t\t</div>\n" +
                "\t\t\t\t</div>\n" +
                "\t\t\t</li>\n" +
                "\t\t</ul>\n" +
                "\t</div>\n" +
                "</form>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<form>\n" +
                "\t<div class=\"list no-hairlines no-hairlines-between\">\n" +
                "\t\t<ul>\n" +
                "\t\t\t<!-- Form Item Here -->\n" +
                "\t\t\t<li class=\"item-content item-input\">\n" +
                "\t\t\t\t<div class=\"item-media\">\n" +
                "\t\t\t\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t\t\t\t</div>\n" +
                "\t\t\t\t<div class=\"item-inner\">\n" +
                "\t\t\t\t\t<div class=\"item-title item-label\">Name</div>\n" +
                "\t\t\t\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t\t\t\t<input type=\"text\" placeholder=\"Your name\" />\n" +
                "\t\t\t\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t\t\t\t</div>\n" +
                "\t\t\t\t</div>\n" +
                "\t\t\t</li>\n" +
                "\t\t</ul>\n" +
                "\t</div>\n" +
                "</form>",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-inline-item-text', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Name</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"text\" placeholder=\"Your name\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-inline-item-password', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Password</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"password\" placeholder=\"Your password\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-inline-item-email', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">E-mail</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"email\" placeholder=\"Your e-mail\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-inline-item-url', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">URL</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"url\" placeholder=\"URL\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-inline-item-phone', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Phone</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"tel\" placeholder=\"Your phone number\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});


$$(document).on('click', '.btn-element-add-form-inline-item-option', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Gender</div>\n" +
                "\t\t<div class=\"item-input-wrap input-dropdown-wrap\">\n" +
                "\t\t\t<select placeholder=\"Please choose...\">\n" +
                "\t\t\t\t<option value=\"Male\">Male</option>\n" +
                "\t\t\t\t<option value=\"Female\">Female</option>\n" +
                "\t\t\t</select>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-inline-item-date', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Birthday</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"date\" value=\"2014-04-30\" placeholder=\"Please choose...\" />\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-inline-item-date-time', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Date time</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"datetime-local\" placeholder=\"Please choose...\" />\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-inline-item-range', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Range</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<div class=\"range-slider range-slider-init\" data-label=\"true\">\n" +
                "\t\t\t\t<input type=\"range\" value=\"50\" min=\"0\" max=\"100\" step=\"1\" />\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-inline-item-textarea', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Textarea</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<textarea placeholder=\"Bio\"></textarea>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-inline-item-textearea-grow', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Resizable</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<textarea class=\"resizable\" placeholder=\"Bio\"></textarea>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-stack-item-text', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Name</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"text\" placeholder=\"Your name\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-stack-item-password', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Password</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"password\" placeholder=\"Your password\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-stack-item-email', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">E-mail</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"email\" placeholder=\"Your e-mail\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-stack-item-url', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">URL</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"url\" placeholder=\"URL\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-stack-item-phone', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Phone</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"tel\" placeholder=\"Your phone number\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-stack-item-option', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Gender</div>\n" +
                "\t\t<div class=\"item-input-wrap input-dropdown-wrap\">\n" +
                "\t\t\t<select placeholder=\"Please choose...\">\n" +
                "\t\t\t\t<option value=\"Male\">Male</option>\n" +
                "\t\t\t\t<option value=\"Female\">Female</option>\n" +
                "\t\t\t</select>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-stack-item-date', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Birthday</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"date\" value=\"2014-04-30\" placeholder=\"Please choose...\" />\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-stack-item-datetime', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Date time</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"datetime-local\" placeholder=\"Please choose...\" />\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-stack-item-range', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Range</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<div class=\"range-slider range-slider-init\" data-label=\"true\">\n" +
                "\t\t\t\t<input type=\"range\" value=\"50\" min=\"0\" max=\"100\" step=\"1\" />\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-stack-item-textarea', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Textarea</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<textarea placeholder=\"Bio\"></textarea>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-stack-item-textarea-grow', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Resizable</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<textarea class=\"resizable\" placeholder=\"Bio\"></textarea>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-float-item-text', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-floating-label\">Name</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"text\" placeholder=\"Your name\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-float-item-password', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-floating-label\">Password</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"password\" placeholder=\"Your password\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-float-item-email', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-floating-label\">E-mail</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"email\" placeholder=\"Your e-mail\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-float-item-url', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-floating-label\">URL</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"url\" placeholder=\"URL\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-float-item-phone', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-floating-label\">Phone</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"tel\" placeholder=\"Your phone number\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-float-item-option', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-floating-label\">Gender</div>\n" +
                "\t\t<div class=\"item-input-wrap input-dropdown-wrap\">\n" +
                "\t\t\t<select placeholder=\"Please choose...\">\n" +
                "\t\t\t\t<option value=\"Male\">Male</option>\n" +
                "\t\t\t\t<option value=\"Female\">Female</option>\n" +
                "\t\t\t</select>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-float-item-date', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-floating-label\">Birthday</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"date\" value=\"2014-04-30\" placeholder=\"Please choose...\" />\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-float-item-datetime', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-floating-label\">Date time</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"datetime-local\" placeholder=\"Please choose...\" />\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-float-item-range', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-floating-label\">Range</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<div class=\"range-slider range-slider-init\" data-label=\"true\">\n" +
                "\t\t\t\t<input type=\"range\" value=\"50\" min=\"0\" max=\"100\" step=\"1\" />\n" +
                "\t\t\t</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-float-item-textarea', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-floating-label\">Textarea</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<textarea placeholder=\"Bio\"></textarea>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-float-item-textarea-grow', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-floating-label\">Resizable</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<textarea class=\"resizable\" placeholder=\"Bio\"></textarea>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-validate-item-text', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input item-input-with-info\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Name</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"text\" placeholder=\"Your name\" required validate/>\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t\t<div class=\"item-input-info\">Default required validation</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-validate-item-pattern', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input item-input-with-info\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Fruit</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"text\" placeholder=\"Type 'apple' or 'banana'\" required validate pattern=\"apple|banana\"/>\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t\t<div class=\"item-input-info\">Pattern validation (<b>apple|banana</b>)</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-validate-item-email', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input item-input-with-info\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">E-mail</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"email\" placeholder=\"Your e-mail\" required validate/>\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t\t<div class=\"item-input-info\">Default e-mail validation</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-validate-item-url', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input item-input-with-info\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">URL</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"url\" placeholder=\"URL\" required validate/>\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t\t<div class=\"item-input-info\">Default URL validation</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-validate-item-phone', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input item-input-with-info\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Phone</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"text\" placeholder=\"Your phone number\" required validate pattern=\"[0-9]*\" data-error-message=\"Only numbers please!\"/>\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t\t<div class=\"item-input-info\">With custom error message</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-simple-item-text', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"text\" placeholder=\"Your name\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-simple-item-icon', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-media\">\n" +
                "\t\t<i class=\"icon f7-icons\">pencil_ellipsis_rectangle</i>\n" +
                "\t</div>\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"text\" placeholder=\"Your name\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-simple-item-label', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input\">\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-title item-label\">Name</div>\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"text\" placeholder=\"Your name\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});

$$(document).on('click', '.btn-element-add-form-simple-item-info', function () {
    var action = $$(this).attr('data-action');

    if (element_id_selected === null) {
        app.dialog.alert('Choose element to modify!');
    } else {
        uibuilder.send({
            "topic": "add_element_component",
            "element_id": element_id_selected,
            "component": "<li class=\"item-content item-input item-input-with-info\">\n" +
                "\t<div class=\"item-inner\">\n" +
                "\t\t<div class=\"item-input-wrap\">\n" +
                "\t\t\t<input type=\"text\" placeholder=\"Your name\" />\n" +
                "\t\t\t<span class=\"input-clear-button\"></span>\n" +
                "\t\t\t<div class=\"item-input-info\">Full name please</div>\n" +
                "\t\t</div>\n" +
                "\t</div>\n" +
                "</li>\n",
            "action": action
        });
    }
});