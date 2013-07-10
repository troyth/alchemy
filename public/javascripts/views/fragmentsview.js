define([
	'backbone',
	'jquery-masonry',
	'views/fragmentview',
	'text!../../../views/templates/fragments.html',
	'text!../../../views/templates/featuredfragment.html'
],
function(Backbone, masonry, FragmentView, template, featuredTemplate) {
	var FragmentsView = Backbone.View.extend({
		tagName: 'div',
	    className: 'fragment',
	    parent_type: null,//the type of node it is attached to
	    parent_id: null,
		collection: null,
		template: template,

	    initialize : function(vars) {
		    var that = this;
		    this._fragmentViews = [];
		    this.parent_type = vars.parent_type;
		    this.parent_id = vars.parent_id;

		    var that = this;

		    var el = '#'+ this.parent_type +'-' + this.parent_id + ' .annotations .fragments-el';

		    _.each(this.collection.models, function(model, index){
	    		that._fragmentViews.push( new FragmentView({
                    model: model,
                    el: el,
			    	_fragmentsView: that
                }));
            });
	
		},
		 
		render: function(vars) {
			var that = this;
		    // Clear out this element.
		    $(this.el).empty();


		    var attr = {};

		    var content = _.template(this.template, attr);
			$(this.el).html(content);

			var el = '#'+ this.parent_type +'-' + this.parent_id + ' .annotations .fragments-el';

	 		// Render each sub-view and append it to the parent view's element.
		    _.each(this._fragmentViews, function(fragmentView) {
			    $(el).append(fragmentView.render().el);
		    });

		    /*

		    var $container = $('.masonry-wrapper');

            $container.masonry({
                itemSelector: '.fragment',
                columnWidth: 250,
                gutterWidth:17
            });

			$container.imagesLoaded( function(){
			  	$container.masonry();
			});*/  

		    return true;
		}
	});

	return FragmentsView;

});