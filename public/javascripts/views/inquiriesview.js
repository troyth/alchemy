define([
	'backbone',
	'views/inquiryview',
	'text!../../../views/templates/inquiries.html',
	'collections/inquiries'
],
function(Backbone, InquiryView, template, Inquiries) {

	var InquiriesView = Backbone.View.extend({
		tagName: 'div',
	    className: 'inquiries',
		_inquiryViews: null,
		_inquiryViewEl: null,
		collection: null,
		template: template,

	    initialize: function(vars) {
		    var that = this;
		    this._inquiryViews = [];

		    if(vars._inquiryViewEl){
		    	this._inquiryViewEl = vars._inquiryViewEl;
		    }else{
		    	this._inquiryViewEl = '.inquiries-list-el';
		    }

		    _.each(this.collection.models, function(model, index){
                that._inquiryViews.push(new InquiryView({
                    model: model,
                    tagName: 'div',
                    _inquiryView: that
                }));
            });

            this.collection.on('reset', this.render, this);
		},
		 
		render: function(vars) {
			console.log('inquiriesview.render()');

			var that = this;
		    // Clear out this element.
		    $(this.el).empty();

		    var content = _.template(this.template);
		    console.log('content: '+ content);
			$(this.el).html(content);

			
			_.each(that._inquiryViews, function(inquiryView) {
		    	$(that._inquiryViewEl).append(inquiryView.render().el);
		    });
		 
		    return true;
		}
	});

	return InquiriesView;

});