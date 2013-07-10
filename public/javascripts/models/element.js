define(
[
	'backbone'
], function(Backbone){

	var Element = Backbone.Model.extend({
		urlRoot: "/insights/api/element"
	});

	return Element;

});