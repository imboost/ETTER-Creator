// panel morph left
var panel_left_morph = function () {
    panel_left = app.panel.create({
        el: '.panel-left'
    });

    if (window.innerWidth >= 700) {
        panel_left.open();

        $$(document).find('#btn-panel-left').hide();
    } else if (window.innerWidth < 700) {
        panel_left.close();

        $$(document).find('#btn-panel-left').show();
    }

    panel_left.on('closed', function () {
        $$(document).find('#btn-panel-left').show();
    });
}

// panel morph right
var panel_right_morph = function () {
    panel_right = app.panel.create({
        el: '.panel-right'
    });

    if (window.innerWidth >= 700) {
        panel_right.open();

        $$(document).find('#btn-panel-right').hide();
    } else if (window.innerWidth < 700) {
        panel_right.close();

        $$(document).find('#btn-panel-right').show();
    }

    panel_right.on('closed', function () {
        $$(document).find('#btn-panel-right').show();
    });
}

// randomize text
var string_randomizer = function (length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

// get all html
function outerHTML(node) {
    return node.outerHTML || new XMLSerializer().serializeToString(node);
}

// list search
function list_search(el_input, el_ul) {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById(el_input);
    filter = input.value.toUpperCase();
    ul = document.getElementById(el_ul);
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementById('item-content')[0];
    }
}