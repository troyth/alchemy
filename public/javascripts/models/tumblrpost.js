define(
[
	'backbone'
], function(Backbone){

	var TumblrPost = Backbone.Model.extend({
		urlRoot: "/insights/air/api/get/tumblrpost"
	});

	return TumblrPost;

});