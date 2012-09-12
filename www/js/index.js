var feedUrl;

Binder = Backbone.Model.extend({});

BinderList = Backbone.Collection.extend({
	model: Binder,
	url: function(){
		return feedUrl;
	},
	parse: function(response){
		return response.binder_list;
	}
});

IndexItemTemplate = _.template($('#listitem-template').html());
ArticleItemTemplate = _.template($('#article-template').html());

BinderIndexView = Backbone.View.extend({
	el: $('#index_list'),
	collection: new BinderList(),
	
	initialize: function () {
        this.collection.bind("reset", this.render, this);
		this.collection.fetch();
    },
    render: function () {
        this.addAll();
    },
    addAll: function () {
        this.collection.each(this.addOne);
    },
    addOne: function (model) {
        $('#index_list').append(IndexItemTemplate(model.toJSON()));        
        $('#pages').append(ArticleItemTemplate(model.toJSON()));
    }
});

    	
/**
 * phone gap:
 */
var app = {		
    initialize: function(feed_link) {
    	feedUrl = feed_link;
    	
        app.report('device','pending');
        this.bind();
    },
    bind: function() {
        document.addEventListener('deviceready', this.deviceready, false);
    },
    report: function(id, state) {
        // Report the event in the console
        console_log("Report: " + id + " : " + state);
        $('.status').hide();
        $('.status.' + id + '.' + state).show();
    },
    deviceready: function() {
        app.report('device','complete');
        app.report('data','pending');
        
        eIndex = new BinderIndexView;
        app.report('data','complete');
        
    }    
};
