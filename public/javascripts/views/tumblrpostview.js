define([
	'backbone',
	'text!../../../views/templates/tumblrpost.html',
	'taxonomies',
	'models/fragment'
],
function(Backbone, template, TAXONOMIES, Fragment) {

	var TumblrPostView = Backbone.View.extend({
	    className: 'tumblrpost',
		template: template,
		events: {
	    	'mouseenter .insight-menu-icon': 'showInsightsMenu'
	    },
		/*
		initialize: function(){
			_.bind(this.model, 'change', render);
		},
		*/

		showInsightsMenu: function(event){
	    	var that = this;
	    	var $menu = $('#insights-menu').clone();
	    	$menu.attr('id', 'insights-menu-live').show();

	    	var $media = $(event.target).closest('.tumblr-post-media');

	    	$media.append($menu);

	    	$menu.bind('mouseleave', function(){
	    		$(this).remove();
	    	});

	    	$menu.find('li').bind('click', function(){

	    		var content = $media.find('img').attr('src');

	    		var tags = [];
	    		$media.closest('#overlay-post').find('.post-tags span').each(function(i){
	    			tags.push($(this).text());
	    		});

	    		var category = TAXONOMIES.isCategory(tags);

	    		console.log('category: ');
	    		console.log(category);

	    		var fragment = new Fragment({
	    			type: 'image',
	    			content: content,
	    			element: that.model.get('id'),
	    			tags: tags,
	    			category: category,
	    			insight_id: $(this).attr('id').substr(8),
	    			post_url: that.model.get('post_url'),
	    			caption: ''
	    		});
	    		
	    		fragment.save({}, {
	    			success: function(model, response){
	    				console.dir(model);
	    				console.dir(response);
	    			}
	    		});

	    	});
	    },

		render: function(){
			//use Underscore template, pass it the attributes from this model

			var attributes = this.model.attributes;

			var attr = {
				data: attributes
			};

			var content = _.template(this.template, attr);
			$(this.el).html(content);

			//set media wrapper to size of image inside
			$('.tumblr-post-media').each(function(){ $(this).width( $(this).find('img, iframe, object').attr('width') )  });

			// return ```this``` so calls can be chained.
			return true;
	    },
	    unrender: function(){
			//use Underscore template, pass it the attributes from this model
			$(this.el).html('');

			// return ```this``` so calls can be chained.
			return true;
	    },
	});

	return TumblrPostView;

});