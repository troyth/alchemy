define([
	'backbone',
	'models/fragment'
],
function(Backbone, Fragment) {

  var Fragments = Backbone.Collection.extend({
	model: Fragment,
	parent_type: null,
	parent_id: null,
	url: '/insights/api/fragment',
	initialize: function(vars){
		this.parent_type = vars.parent_type;
		this.parent_id = vars.parent_id;
		this.url = this.url + '/' + this.parent_type + '/' + this.parent_id;
	}
  });

  return Fragments;
});

