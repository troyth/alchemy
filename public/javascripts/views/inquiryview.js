define([
	'backbone',
	'globals',
	'text!../../../views/templates/inquiry.html',
	'taxonomies',
	'models/inquiry'
],
function(Backbone, GLOBAL, template, TAXONOMIES, Inquiry) {

	var InquiryView = Backbone.View.extend({
	    className: 'inquiry row-fluid',
	    tagName: 'li',
		template: template,
		events: {
	    	'click .editbutton': 'edit',
	    	'click .save': 'save',
	    	'click .cancel': 'cancel',
	    	'click .delete': 'delete',
	    	'click .addsource': 'addSource',
	    	'click .deletesource': 'deleteSource',
	    	'mouseenter .inner': 'showEditButton',
	    	'mouseleave .inner': 'hideEditButton',
	    	'click .addcollaborator': 'addCollaborator',
	    	'click .deletecollaborator': 'deleteCollaborator'
	    },

	    showEditButton: function(){
	    	if(!this.model.isNew()){
	    		var this_selector = '#inquiry-'+this.model.get('_id');
	    		$(this_selector).addClass('showeditbutton');
	    	}	
	    },

	    hideEditButton: function(){
	    	if(!this.model.isNew()){
	    		var this_selector = '#inquiry-'+this.model.get('_id');
	    		$(this_selector).removeClass('showeditbutton');
	    	}	
	    },

	    deleteCollaborator: function(event){
	    	console.log('deleteCollaborator()');
	    	console.dir(event.target);
	    	var $cc = $(event.target).closest('.collaborator-container');
	    	$cc.remove();
	    	this._collaborators[$cc.find('.name').attr('userid')].status = 'deleted';

	    },

	    addCollaborator: function(){
	    	console.log('addcollaborator()');
	    	var this_selector;
	    	if(this.model.isNew()){
	    		this_selector = '#inquiry-new';
	    	}else{
	    		this_selector = '#inquiry-'+this.model.get('_id');
	    	}

	    	console.log('GLOBAL.USERS');
	    	console.dir(GLOBAL.USERS);

	    	console.log('GLOBAL.SELF');
	    	console.dir(GLOBAL.SELF);

	    	var $names_select = $('<div><select class="collaborator-select"></select></div>');//wrap in div b/c .html() will strip the outer

	    	_.each(GLOBAL.USERS.models, function(model){
	    		if( (model.get('_id') != GLOBAL.SELF.get('_id')) && (model.get('username') != 'admin') ){//don't include self
		    		var $option = $('<option value="'+ model.get("_id") +'">'+ model.get("name")+'</option>');
		    		$names_select.find('select').append( $option );
		    	}
	    	});


	    	var html = '<li class="row-fluid collaborator-container new"><div class="span2"><i class="icon-user" style="color:black;"></i></div><div class="name span9 select-container">'+ $names_select.html() +'</div><div class="role span4 select-container"><select class="roles-list"><option value="editor">Editor</option><option value="viewer">Viewer</option></select></div><div class="span1 deletecollaborator"><i class="icon-remove"></i></div></li>';

	    	$('.collaborators', this_selector).append(html);
	    },

	    addSource: function(){
	    	var this_selector;
	    	if(this.model.isNew()){
	    		this_selector = '#inquiry-new';
	    	}else{
	    		this_selector = '#inquiry-'+this.model.get('_id');
	    	}

	    	$('.sources', this_selector).append('<li class="row-fluid source-container"><ul class="source-type-menu span2"><li class="selected" type="tumblr"><i class="icon-tumblr"></i></li></ul><div class="editable source-source span9" contenteditable="true">source</div><div class="span4 editable source-tag" contenteditable="true">tag</div><div class="span1 deletesource"><i class="icon-remove"></i></div></li>');

	    },

	    deleteSource: function(event){
	    	console.log('deleteSource()');
	    	console.dir(event.target);
	    	$(event.target).closest('.source-container').remove();
	    },

	    delete: function(){
	    	if(this.model.isNew()){
	    		this.model = null;
		    	this.remove();
	    	}else{
	    		this.model.destroy();
	    		this.remove();
	    	}
	    },

	    cancel: function(){
	    	console.log('cancel inquiry');
	    	if(this.model.isNew()){
	    		this.model = null;
	    		this.undelegateEvents();
		    	this.unrender();
		    	//remove disabling from Add Inquiry button
	    		$('#main .add').removeClass('disabled');
	    	}else{
	    		this.model.set( this.model.previousAttributes() );
	    		this.render();
	    	}

	    },

	    save: function(){
	    	console.log('save inquiry');
	    	var this_selector;
	    	if(this.model.isNew()){
	    		this_selector = '#inquiry-new';
	    	}else{
	    		this_selector = '#inquiry-'+this.model.get('_id');
	    	}

	    	var sources = [];
	    	$('.source-container', this_selector).each(function(i){
	    		var new_source = {
		    		type: $('.source-type-menu .selected', this).attr('type'),
		    		source: $('.source-source', this).text(),
		    		tag: $('.source-tag', this).text()
		    	};
		    	sources.push(new_source);
	    	});

	    	var collaborators = [];

	    	$('.collaborator-container', this_selector).each(function(i){
	    		if($(this).hasClass('new')){
		    		var new_collaborator = {
			    		id: $('.collaborator-select', this).val(),
			    		role: $('.roles-list', this).val()
			    	};
			    	console.log('collaborator._id: '+ $('.collaborator-select', this).val());
			    	console.log('role: '+ $('.roles-list', this).val());
			    	collaborators.push(new_collaborator);
			    }else{
			    	var new_collaborator = {
			    		id: $('.name', this).attr('userid'),
			    		role: $('.role', this).text()
			    	};

			    	console.log('role: '+ $('.roles', this).text());
			    	collaborators.push(new_collaborator);
			    }
	    	});

	    	console.log('collaborators!!!!!!!');
	    	console.dir(collaborators);

	    	this.model.set({
	    		title: $('.title', this_selector).text().replace(/(\r\n|\n|\r)/gm,"").replace(/(\r\t|\t|\r)/gm,""),
	    		description: $('.description', this_selector).text().replace(/(\r\n|\n|\r)/gm,"").replace(/(\r\t|\t|\r)/gm,""),
	    		sources: sources,
	    		collaborators: collaborators
	    	});

	    	var that = this;

	    	this.model.save({},{
	    		success: function(model){
	    			console.log('saved! with _id');
	    			console.log(model.get('_id'));
	    			console.log('this_selector: '+ this_selector);

	    			$(this_selector).removeClass('edit-mode');
	    			$('.editable', this_selector).attr('contenteditable', 'false');

	    			if(this_selector == '#inquiry-new'){

	    				that.unrender();
	    				var new_view = new InquiryView({
	    					model: model,
		                    tagName: 'div'
		                });

		                $('.inquiries-list-el').append(new_view.render().el);

		                that = null;

	    				//remove disabling from Add Inquiry button
	    				$('#main .add').removeClass('disabled');
	    			}
	    		},
	    		error: function(){
	    			alert('Error attempting to save. Please retry.');
	    		}
	    	});
	    },

		edit: function(event){
	    	console.log('edit inquiry');
	    	var this_selector;
	    	if(this.model.isNew()){
	    		this_selector = '#inquiry-new';
	    	}else{
	    		this_selector = '#inquiry-'+this.model.get('_id');
	    	}

	    	$(this_selector).addClass('edit-mode');
	    	$('.editable', this_selector).attr('contenteditable', 'true');

	    },

		render: function(){
			//use Underscore template, pass it the attributes from this model

			var attributes = this.model.attributes;

			

			var users = [];

			_.each(GLOBAL.USERS.models, function(model, i){
				console.log('adding model with _id: '+ model.get("_id"));
				users[model.get("_id")] = model.attributes;
			});

			


			var attr = {
				data: attributes,
				users: users
			};

			console.log('render with && attr: ');
			console.dir(attr);

			var content = _.template(this.template, attr);
			$(this.el).html(content);

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

	return InquiryView;

});