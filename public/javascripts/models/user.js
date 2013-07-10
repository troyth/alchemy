define(
[
	'backbone'
], function(Backbone){

	var User = Backbone.Model.extend({
		urlRoot: "/insights/api/user",
		idAttribute: 'id',
		isSelf: false,
		initialize: function(vars){
			if(vars){
				this.set(vars);
				if(vars.isSelf == true){
					this.urlRoot = "/insights/api/user/self";
				}
			}
				
		},
	});

	return User;

});