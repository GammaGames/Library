/*
js/app/view/libraryViews.js
==============================================

*/
var com = com || {};
com.library = com.library || {};
com.library.view = com.library.view || {};

/*
com.library.view.Library
====
extends __Common.Backbone.View__
*/
com.library.view.Library = Backbone.View.extend({
    el: "#library",
    template: _.template($("#library_template").html()),
    collection: null,

    /*
    com.library.view.Library.initialize()
    ====
    Sets every model in the collection's id to their book title before rendering the item
    */
    initialize: function(options) {
        this.collection = new com.library.collection.Shelf(options.bookArray);
        this.subviews = [];
        this.render();
    },

    events: {
        "click .card" : "clickBookEvent",
    },

    /*
    com.library.view.Library.render()
    ====
    Sets every model in the collection's id to their book title before rendering the item

    Returns
    ----
    this : object _[instance of com.library.view.Library]_
    */
    render: function() {
        var output = this.template({"library": this.collection.toJSON()});
        this.$el.append(output);
    },

    /*
    com.library.view.library.clickBookEvent()
    ====
    Show modal for clicked object

    Parameters
    ----
    e : Event
    */
    clickBookEvent: function(e) {
        if(this.subviews[e.currentTarget.id]) {
        }
        else {
            var book = this.collection.get(e.currentTarget.id);
            this.subviews[e.currentTarget.id] = new com.library.view.BookModal({'model' : book});
        }
        $("#" + e.currentTarget.id + "Modal").modal('setting', 'transition', 'fade up');
        $("#" + e.currentTarget.id + "Modal").modal('show');
        setTimeout(function() {
            $("#" + e.currentTarget.id + "Modal").modal('refresh');
        }, 100);
    },
});

/*
com.library.view.BookModal
====
extends __Common.Backbone.object__
*/
com.library.view.BookModal = Backbone.View.extend({
    el: "#libraryModal",
    template: _.template($("#modal_template").html()),
    model: com.library.model.Book,

    initialize: function() {
        this.render();
    },

    render: function() {
        var self = this;
        self.$el.append(self.template({"book": self.model.toJSON()}));
        return self;
    }
});
