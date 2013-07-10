define(
[
	'backbone'
], function(Backbone){

	var Insight = Backbone.Model.extend({
		urlRoot: "/insights/air/api/insight",
		idAttribute: '_id',
		initialize: function(vars){
			
			//initialize the model if vars passed in
			if(vars){
				this.set(vars);
			}
		},
	});

	return Insight;

});