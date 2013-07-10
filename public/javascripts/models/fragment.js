define(
[
	'backbone'
], function(Backbone){

	var Fragment = Backbone.Model.extend({
		urlRoot: "/insights/api/fragment/fragment_id",
		idAttribute: '_id',

		initialize: function(vars){
			if(vars){
				this.set(vars);
			}
		}
	});

	return Fragment;

});