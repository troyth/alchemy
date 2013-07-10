define(
[
	'backbone'
], function(Backbone){

	var Inquiry = Backbone.Model.extend({
		urlRoot: "/insights/api/inquiry",
		idAttribute: '_id',
		initialize: function(vars){
			if(vars){
				this.set(vars);
			}
		},
	});

	return Inquiry;

});