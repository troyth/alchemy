define(
[
	'backbone'
], function(Backbone){

	var Feed = Backbone.Model.extend({
		urlRoot: "/insights/api/feed",
		idAttribute: '_id',
		initialize: function(vars){
			if(vars){
				this.set(vars);
			}
		},
	});

	return Feed;

});