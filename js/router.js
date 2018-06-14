/*
js/app/router/libraryRouter.js
==============================================

*/
var com = com || {};
com.library = com.library || {};
com.library.router = com.library.router || {};

/*
com.library.router.Router
====
extends __Common.Backbone.object__
*/
LibraryRouter = Backbone.Router.extend({
    routes: {
        'open:id' : 'openBook',
        '' : 'start',
        '*default' : 'defaultRoute',
    },

    /*
    com.library.router.Router.openBook()
    ====
    Supposed to open modal for book id provided in url

    Parameters
    ----
    parameter : type

    Returns
    ----
    parameter : type

    */
    openBook: function() {
        //TODO
    },

    start: function() {
    },

    defaultRoute: function() {
        console.log("Route not handled!");
    },
});