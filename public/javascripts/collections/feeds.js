define([
	'backbone',
	'models/feed'
],
function(Backbone, Feed) {

  var Feeds = Backbone.Collection.extend({
	model: Feed,
	url:'/insights/api/feed',
	initialize: function(vars){
		this.sort_key = 'title';
	},
	comparator: function(a, b) {
	    // Assuming that the sort_key values can be compared with '>' and '<',
	    // modifying this to account for extra processing on the sort_key model
	    // attributes is fairly straight forward.
	    a = a.get(this.sort_key);
	    b = b.get(this.sort_key);
	    return a > b ? -1
	         : a < b ?  1
	         :          0;
	}    
  });

  return Feeds;
});

