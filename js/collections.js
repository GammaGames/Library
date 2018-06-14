/*
js/app/collection/libraryCollections.js
==============================================

*/
var com = com || {};
com.library = com.library || {};
com.library.collection = com.library.collection || {};

/*
com.library.collection.Shelf
====
extends __Common.Backbone.Collection__
*/
com.library.collection.Shelf = Backbone.Collection.extend({
    model: com.library.model.Book,

    initialize: function() {
    },

    getLength: function() {
        return "The shelf has " + this.length + " books.";
    },

    getBooks: function() {
        var str = '';
        this.each(function(current) {
            str += current.getTitle() + "\r\n";
        });
        return str;
    },

    comparator: function(a, b) {
        return a.get('year') < b.get('year') ? -1 : 1;
    },
});
