define([
	'backbone',
	'views/userview',
	'text!../../../views/templates/users.html',
	'collections/users'
],
function(Backbone, UserView, template, Users) {

	var UsersView = Backbone.View.extend({
		tagName: 'div',
	    className: 'users',
		_userViews: null,
		_userViewEl: null,
		collection: null,
		template: template,

	    initialize: function(vars) {
		    var that = this;
		    this._userViews = [];

		    if(vars._userViewEl){
		    	this._userViewEl = vars._userViewEl;
		    }else{
		    	_userViewEl = '.users-list-el';
		    }

		    _.each(this.collection.models, function(model, index){
                that._userViews.push(new UserView({
                    model: model,
                    tagName: 'div',
                    _userView: that
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

			
			_.each(that._userViews, function(userView) {
		    	$(that._userViewEl).append(userView.render().el);
		    });
		 
		    return true;
		}
	});

	return UsersView;

});