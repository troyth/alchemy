define([
	'backbone',
	'models/inquiry'
],
function(Backbone, Inquiry) {

  var Inquiries = Backbone.Collection.extend({
	model: Inquiry,
	url:'/insights/api/inquiry',
	initialize: function(vars){
		this.sort_key = 'updated';
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

  return Inquiries;
});

