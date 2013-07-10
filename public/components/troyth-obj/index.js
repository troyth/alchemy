var $ = require("component/jquery");
var _ = require("component/underscore");
var Backbone = require("brighthas/backbone");
var markd = require("component/marked");


exports.Model = Backbone.Model.extend({
	urlRoot: "/api/obj",
	_parent: null,
	initialize: function(opts){
		if(opts){
			_.extend(this, opts);
		}
	}
});



exports.ModelView = Backbone.View.extend({
    className: 'obj',
    tagName: 'li',
	template: template,
	_objsView: null,
    _objs: null,
	events: {
    	'click .delete': 'delete',
    	'click .cancel': 'cancel',
    	'click .save': 'save',
    	'click .edit': 'edit'
    },

    initialize: function(vars){
    	this._objs = new Model({
        	_parent: this.model.get('_id')
        });

    },

    //delete model and unrender view
    delete: function(){
    	if(this.model.isNew()){
    		this.model = null;
	    	this.remove();
    	}else{
    		this.model.destroy();
    		this.remove();
    	}
    },

    //cancel editing
    cancel: function(){
    	if(this.model.isNew()){
    		this.model = null;
    		this.undelegateEvents();
	    	this.unrender();
    	}else{
    		this.model.set( this.model.previousAttributes() );
    		this.render();
    	}
    },

    //save model
    save: function(){
    	var this_selector;
    	if(this.model.isNew()){
    		this_selector = '#collection-new';
    	}else{
    		this_selector = '#collection-'+this.model.get('_id');
    	}

    	var sources = [];
    	$('.source-container', this_selector).each(function(i){
    		var new_source = {
	    		type: $('.source-type-menu .selected', this).attr('type'),
	    		source: $('.source-source', this).text(),
	    		tags: $('.source-tags', this).text().split(',')
	    	};
	    	sources.push(new_source);
    	});


    	this.model.set({
    		title: $('.title', this_selector).text().replace(/(\r\n|\n|\r)/gm,"").replace(/(\r\t|\t|\r)/gm,""),
    		description: $('.description', this_selector).text().replace(/(\r\n|\n|\r)/gm,"").replace(/(\r\t|\t|\r)/gm,""),
    		sources: sources

    	});

    	var that = this;

    	this.model.save({},{
    		success: function(model){
    			console.log('saved! with _id');
    			console.log(model.get('_id'));
    			console.log('this_selector: '+ this_selector);

    			$(this_selector).removeClass('edit-mode');
    			$('.editable', this_selector).attr('contenteditable', 'false');

    			if(this_selector == '#collection-new'){

    				that.unrender();
    				var new_view = new CollectionView({
    					model: model,
	                    tagName: 'div'
	                });

	                $('.collections-list-el').prepend(new_view.render().el);

	                that = null;

    				//remove disabling from Add Collection button
    				$('#main .add').removeClass('disabled');
    			}
    		},
    		error: function(){
    			alert('Error attempting to save. Please retry.');
    		}
    	});
    },

    //enter edit-mode
	edit: function(event){
    	var this_selector;
    	if(this.model.isNew()){
    		this_selector = '#collection-new';
    	}else{
    		this_selector = '#collection-'+this.model.get('_id');
    	}

    	$(this_selector).addClass('edit-mode');
    	$('.editable', this_selector).attr('contenteditable', 'true');
    },


    renderFragments: function(){
    	var element_id = this.model.get('_id');

        this._fragments.fetch({
        	success:function(collection){
        		var fragments_view = new FragmentsView({
        			collection: collection,
        			el: '#'+ element_id + ' .annotations',
        			_parent_type: 'element',
        			_parent_id: element_id
        		});
        		fragments_view.render();
        	}
        });
    },

	render: function(){
		this.template = templateTumblr;

		var attributes = this.model.attributes;

		var attr = {
			data: attributes.data,
			_id: {
				value: attributes._id
			}
		};

		var content = _.template(this.template, attr);
		$(this.el).html(content);

		var that = this;
		setTimeout(function(){
			that.initDraggable();
			that.initDraggableIframes();
			that.initDroppable();
		}, 100);

		this.renderFragments();

		// return ```this``` so calls can be chained.
		return this;
    },

    unrender: function(){
		//use Underscore template, pass it the attributes from this model
		$(this.el).html('');

		// return ```this``` so calls can be chained.
		return this;
    },
});

exports.Models = Backbone.Collection.extend({
	model: Model,
	url:'/api/model',
	initialize: function(vars){
		this.sort_key = 'timestamp';
	},
	comparator: function(a, b) {
	    a = a.get(this.sort_key);
	    b = b.get(this.sort_key);
	    return a > b ? -1
	         : a < b ?  1
	         :          0;
	}    
});


