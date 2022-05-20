var $$ = Dom7;

var app = new Framework7({
    name: 'UI Builder',
    theme: 'aurora',
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
    panel: {
        leftBreakpoint: 700,
        rightBreakpoint: 700,
        visibleBreakpoint: 700,
        collapsedBreakpoint: 700,
        swipe: true
    }
});