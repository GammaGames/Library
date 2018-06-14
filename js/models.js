/*
js/app/model/libraryModels.js
==============================================

*/
var com = com || {};
com.library = com.library || {};
com.library.model = com.library.model || {};

/*
com.library.model.Book
====
extends __Common.Backbone.Model__
*/
com.library.model.Book = Backbone.Model.extend({
    defaults: {
        title: null,
        author: null,
        description: null,
        year: null,
        cover: null,
    },

    /*
    Book.initialize(title, author, year, cover)
    ====

    Description
    ----
    A book, it knows about itself

    Parameters
    ----
    title : string
    author : string
    description : description
    year : int
    cover : string
    */
    initialize: function(options) {
        options = options || {};
        if(options.title) {
            this.set('title', options.title);
            this.set('author', options.author);
            this.set('description', options.description);
            this.set('year', options.year);
            this.set('cover', options.cover);
            this.set("id", this.get('title').replace(/\s|\'|\"/g, ""));
        }
    },

    print: function() {
        console.log(this.getTitle());
    },

    getTitle: function() {
        return this.get('title') + " by " + this.get('author');
    },
});
