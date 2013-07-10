define([
	'backbone',
	'views/insightview',
	'text!../../../views/templates/insights.html',
	'collections/fragments'
],
function(Backbone, InsightView, template, Fragments) {

	var InsightsView = Backbone.View.extend({
		tagName: 'div',
	    className: 'insights',
		_insightViews: null,
		_insightViewEl: null,
		collection: null,
		template: template,
		segment: null,//topten, toptwenty, other, default: all

	    initialize: function(vars) {
		    var that = this;
		    this._insightViews = [];

		    if(vars._insightViewEl){
		    	this._insightViewEl = vars._insightViewEl;
		    }else{
		    	_insightViewEl = '.insights-list-el';
		    }

		    _.each(this.collection.models, function(model, index){
                that._insightViews.push(new InsightView({
                    model: model,
                    tagName: 'div',
                    el: this._insightViewEl,
                    _insightsView: that
                }));
            });

            this.collection.on('reset', this.render, this);
		},
		 
		render: function(vars) {
			var that = this;
		    // Clear out this element.
		    $(this.el).empty();

		    var content = _.template(this.template);
			$(this.el).html(content);

			var segment = this.collection.segment;
			console.log('segment: '+ segment);
			console.dir(this);

	    	var fragments = new Fragments({
	    		segment: segment
	    	});

	    	//only get the fragments from the models in the collection
	    	var insight_ids = [];
	    	_.each(this.collection.models, function(model){
	    		insight_ids.push(model.get('_id'));
	    	});

	    	var params = { 'insight_ids' : insight_ids };


	    	fragments.fetch({
	    		data: params,
	    		type: 'POST',

	    		success: function(collection, response, options){
			    	var frags;//will be the array of models that match the given insight _id

			    	// Render each sub-view and append it to the parent view's element.
				    _.each(that._insightViews, function(insightView) {
				    	frags = collection.where({ insight_id : insightView.model.get('_id') });

				    	if((insightView.model.get('_id') == '5181471e2d6723084b00005b')  ){
				    		console.log('PRINTS ARE NO LONGER CHEAP FRAGS');
				    		console.dir(frags);
				    	}

				    	$(that._insightViewEl).append(insightView.render(null, frags).el);
				    });
	    		}
	    	});
		 
		    return true;
		}
	});

	return InsightsView;

});