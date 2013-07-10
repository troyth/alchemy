define([
	'backbone',
	'models/insight'
],
function(Backbone, Insight) {

  var Insights = Backbone.Collection.extend({
	model: Insight,
	url:'/insights/air/api/insight',
	segment: null,
	initialize: function(vars){
		if(vars){
			if(vars.segment){
				this.segment = vars.segment;
				this.url = '/insights/air/api/insight/' + vars.segment;
			}
		}
		this.sort_key = 'position';
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



  return Insights;
});

