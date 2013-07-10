define([
	'backbone',
	'views/elementview',
	'text!../../../views/templates/elements.html',
	'collections/elements',
	'collections/fragments'
],
function(Backbone, ElementView, template, Elements, Fragments) {

	var ElementsView = Backbone.View.extend({
		tagName: 'div',
	    className: 'elements',
		_elementViews: null,
		_elementViewEl: null,
		collection: null,
		template: template,

	    initialize: function(vars) {
		    var that = this;
		    this._elementViews = [];

		    if(vars._elementViewEl){
		    	this._elementViewEl = vars._elementViewEl;
		    }else{
		    	_elementViewEl = '.users-list-el';
		    }

		    _.each(this.collection.models, function(model, index){
                that._elementViews.push(new ElementView({
                    model: model,
                    tagName: 'div',
                    _collectionView: that
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

			
			_.each(that._elementViews, function(elementView) {
		    	$(that._elementViewEl).append(elementView.render().el);
		    });

		    //$('.element').each(function(){ $('.annotations', this).height($(this).height()) } );
		 
		    return true;
		}
	});

	return ElementsView;

});