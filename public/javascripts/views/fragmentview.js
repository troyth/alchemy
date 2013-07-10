define([
	'underscore',
	'backbone',
	'jquery-masonry',
	'models/fragment',
	'text!../../../views/templates/fragment.html'
],
function(_, Backbone, masonry, Fragment, template) {

	var FragmentView = Backbone.View.extend({
	    className: 'fragment',
	    template: template,
	    _fragmentsView: null,
	    events: {
	    },

	    initialize: function(vars){
	    	if(vars){
	    		if(vars.template){
	    			this.template = vars.template;
	    		}
	    		if(vars._fragmentsView){
		    		this._fragmentsView = vars._fragmentsView;
		    	}
	    	}
		    	
	    	_.bind(this, 'save');
	    },

	    delete: function(){
	    	var conf = confirm("This will remove the fragment from this insight, this cannot be undone. Are you sure you would like to remove this fragment?");
			if (conf==true){
				this.unrender();
  				this.model.destroy({
		    		success: function(model, response, options){
		    			//alert('The fragment has been removed from the insight');
		    		}
		    	});
  			}
	    },

	    showInsightsMenu: function(){
	    	var that = this;
	    	var $menu = $('#insights-menu').clone();
	    	$menu.attr('id', 'insights-menu-live').show();
	    	$(this.el).append($menu);

	    	$menu.bind('mouseleave', function(){
	    		$(this).remove();
	    	});

	    	$menu.find('li').bind('click', function(){

	    		that.model.save({
	    			type: that.model.get('type'),
	    			content: that.model.get('content'),
	    			element: that.model.get('post_id'),
	    			tags: that.model.get('tags'),
	    			insight_id: $(this).attr('id').substr(8),
	    			post_url: that.model.get('post_url'),
	    			caption: ''
	    		}, {
	    			success: function(model, response){
	    			}
	    		});
	    	});
	    },

	    //same as render, but doesn't wipe out the el, just appends to it
	    //used for adding featured fragments
	    append: function(vars, wrapperClass){
	    	var wrapperClass = wrapperClass || null;
			//use Underscore template, pass it the attributes from this model
			var attributes = this.model.attributes;

			if(vars){
				_.extend(attributes, vars);
			}

			_.extend(attributes, { 'new': 'true' });

			var attr = {
				data: attributes
			};

			var content = _.template(this.template, attr);

			//for some reason it doesn't wrap fragments rendered through the feature() and unfeature()
			//functions in the className tag, so I have to do it explicitly
			if(wrapperClass != null){
				content = '<div class="'+ wrapperClass+'">'+content+'</div>';
			}

			$(this.el).append(content);

			$('.caption').attr('contenteditable', 'true');
			
			// return ```this``` so calls can be chained.
			return this;
	    },

		render: function(vars){
			//use Underscore template, pass it the attributes from this model
			var attributes = this.model.attributes;

			if(vars){
				_.extend(attributes, vars);
			}

			var attr = {
				data: attributes
			};

			var content = _.template(this.template, attr);

			$(this.el).html(content);
			
			// return ```this``` so calls can be chained.
			return this;
	    },
	    unrender: function(){
			//use Underscore template, pass it the attributes from this model
			$(this.el).html('');

			// return ```this``` so calls can be chained.
			return true;
	    },
	});

	return FragmentView;

});