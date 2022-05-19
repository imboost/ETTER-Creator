// Research dont throw first
// console.log(html_file);
// console.log(html_file.find('#' + msg.element_id));

// function childNodesFinder(data) {
//     var element = $(data);
//     if (element[0].childNodes.length !== 0) {
//         var nodes_length = element[0].childNodes.length;
//         var i = 0;
//         for (i = 0; i < nodes_length; i++) {
//             if (element[0].childNodes[i].nodeName === '#text') {
//                 // Do Nothing
//             } else {
//                 if (element[0].id === msg.element_id) {
//                     console.log(element[0].id);

//                     // Replace element example
//                     element.empty();
//                     element.html(msg.component);

//                     // Append element example
//                     // element.append(msg.component);

//                     // Prepend element example
//                     // element.prepend(msg.component);

//                     i = nodes_length - 1; // Stop looping
//                 } else {
//                     // Loop deeper to find childNodes which component will be add or replace
//                     childNodesFinder(element[0].childNodes[i]);
//                 }
//             }
//         }
//     }
// }

// html_file.getElementById(msg.element_id);
// childNodesFinder(html_file);
// console.log(html_file[0].innerHTML);

// Looking page-content then continue looper
// var i = 0;
// for (i = 0; i < html_file[0].childNodes.length; i++) {
//     var html_child = html_file[0].childNodes[i];
//     html_child = $(html_child);
//     var j = 0;
//     for (j = 0; j < html_child.length; j++) {
//         html_child = $(html_child[j]);
//         looper(html_child);
//         if (html_child[0].className === "page-content") {
//             html_child = html_child[0];
//             looper(html_child);
//         }
//     }
// }

// Not use anymore
// window.theRoom.configure({
//     inspector: '#theroom',
//     blockRedirection: true,
//     click: function (element) {
//         // for attach id
//         if (page_current === null) {
//             file_name = 'index.html'
//         } else {
//             if (page_current.split('/')[1] === "") {
//                 file_name = 'index.html'
//             } else {
//                 file_name = page_current.split('/')[1] + '.html';
//             }
//         }

//         // set filename
//         uibuilder.send({
//             "topic": "set_filename",
//             "payload": file_name
//         });

//         // for attach id
//         let class_value = element.getAttribute("class");
//         if (class_value === "" || class_value === null) {
//             element.removeAttribute("class");
//         }

//         var tag = element.tagName;

//         var counter_id = 0;

//         var attributes = element.getAttributeNames();
//         var attribute_value = {};
//         var i = 0;
//         for (i = 0; i < attributes.length; i++) {
//             // for return attributes
//             attribute_value[attributes[i]] = element.getAttribute(attributes[i]);

//             // for attach id
//             if (attributes[i] === 'id') {
//                 counter_id = counter_id + 1;
//             }
//         }

//         if (counter_id === 0) {
//             var element_string_original = outerHTML(element);
//             element.setAttribute("id", string_randomizer(5, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'));
//             var element_string_replace = outerHTML(element);

//             uibuilder.send({
//                 "topic": "set_element_id",
//                 "payload": {
//                     "element": element_string_original,
//                     "element_replace": element_string_replace
//                 }
//             });
//         } else {
//             // Return element inspected
//             var element_string_original = outerHTML(element);
//             uibuilder.send({
//                 "topic": "inspect_element",
//                 "payload": {
//                     "tag": tag,
//                     "attributes": attribute_value,
//                     "element": element_string_original
//                 }
//             });
//         }
//     }
// });

// if (msg.topic === "enable_inspect") {
//     window.theRoom.start();
// }

// if (msg.topic === "disable_inspect") {
//     window.theRoom.stop(true);
// }



// $(document).on('page:afterin', function (callback) {
//     page_history = app.views.main.history;
//     page_count = page_history.length;
//     page_current = page_history[page_count - 1];
//     page_previous = page_history[page_count - 2];

//     // for attach id
//     if (page_current === null) {
//         file_name = 'index.html'
//     } else {
//         if (page_current.split('/')[1] === "") {
//             file_name = 'index.html'
//         } else {
//             file_name = page_current.split('/')[1] + '.html';
//         }
//     }

//     // set filename
//     uibuilder.send({
//         "topic": "set_filename",
//         "payload": file_name
//     });

//     var data_name_status = app.views.main.el.lastChild.attributes.hasOwnProperty('data-name');
//     if (data_name_status === true) {
//         // return page data_name
//         var data_name = app.views.main.el.lastChild.attributes['data-name'].value;
//         uibuilder.send({
//             "topic": "page_data_name",
//             "payload": data_name
//         });

//         // Replace id page element
//         var page_id = app.views.main.el.lastChild.attributes.hasOwnProperty('id');
//         if (page_id === false) {
//             var page_element_original = app.views.main.el.lastChild;
//             page_element_original.class = "page";
//             var page_element_string_original = outerHTML(page_element_original);
//             page_element_string_original = page_element_string_original.split('\n')[0];
//             page_element_string_original = page_element_string_original.replace(" page-current", "");
//             page_element_string_original = page_element_string_original.replace(" page-with-subnavbar", "");

//             page_element_original.id = string_randomizer(5, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
//             var page_element_string_replace = outerHTML(page_element_original);
//             page_element_string_replace = page_element_string_replace.split('\n')[0];
//             page_element_string_replace = page_element_string_replace.replace(" page-current", "");
//             page_element_string_replace = page_element_string_replace.replace(" page-with-subnavbar", "");

//             uibuilder.send({
//                 "topic": "set_element_id_page",
//                 "payload": {
//                     "element": page_element_string_original,
//                     "element_replace": page_element_string_replace
//                 }
//             });
//         } else {
//             var page_element_original = app.views.main.el.lastChild;
//             page_element_original.class = "page";
//             var page_element_string_original = outerHTML(page_element_original);
//             page_element_string_original = page_element_string_original.replace(" page-current", "");
//             page_element_string_original = page_element_string_original.replace(" page-with-subnavbar", "");

//             uibuilder.send({
//                 "topic": "get_element_id",
//                 "payload": app.views.main.el.lastChild.id,
//                 "element": page_element_string_original
//             });
//         }
//     }
// });

// if (msg.topic === "element_add_component") {
//     uibuilder.send({
//         "topic": "element_inject_component",
//         "element_id": msg.element_id,
//         "component": msg.component,
//         "action": msg.action
//     });
// }

// // add new ui component
// if (msg.topic === "element_inject_component") {
//     var html_file = $(msg.payload);

//     if (msg.action === "inner") {
//         html_file.find("[id='" + msg.element_id + "']").html(msg.component);
//     } else if (msg.action === "append") {
//         html_file.find("[id='" + msg.element_id + "']").append(msg.component);
//     } else if (msg.action === "prepend") {
//         html_file.find("[id='" + msg.element_id + "']").prepend(msg.component);
//     } else if (msg.action === "before") {
//         html_file.find("[id='" + msg.element_id + "']").parent().prepend(msg.component);
//     } else if (msg.action === "after") {
//         html_file.find("[id='" + msg.element_id + "']").parent().append(msg.component);
//     }

//     uibuilder.send({
//         "topic": "element_inject_update",
//         "payload": html_beautify(html_file[0].outerHTML)
//     });
// }

// if (msg.topic === "element_inject_update") {
//     var path = msg.payload;

//     app.views.main.router.navigate(app.views.main.router.currentRoute.url, {
//         reloadCurrent: true,
//         ignoreCache: true
//     });
// }

// if (msg.topic === "reload_page") {
//     app.views.main.router.navigate(app.views.main.router.currentRoute.url, {
//         reloadCurrent: true,
//         ignoreCache: true
//     });
// }