var $ = Dom7;

var app = new Framework7({
    name: 'My App', // App name
    theme: 'auto', // Automatic theme detection
    el: '#app', // App root element
    routes: routes, // App routes,
    cache: false,
    cacheDuration: 0,
    touch: {
        fastclick: true,
        materialRipple: false
    },
    view: {
        xhrCache: false,
        browserHistory: true
    },
});