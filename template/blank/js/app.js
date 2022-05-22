var $ = Dom7;

var app = new Framework7({
    name: 'My App',
    theme: 'auto',
    el: '#app',
    routes: routes,
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