console.log('alchemy.js starting');

var $ = require("component/jquery");
var _ = require("component/underscore");
var Backbone = require("brighthas/backbone");

var masonry = require("danzajdband/vanilla-masonry");


var Users = require("troyth/users");






var Elements = require("troyth/elements").Elements;
var ElementsView = require("troyth/elements").ElementsView;



exports.renderInquiryContent = function(_id){
    console.log('Alchemy.js::renderCollectionContent()');
    var elements = new Elements();
    elements.fetch({
        data: $.param({ _id: _id}),
        success: function(collection){
            var collection_view = new ElementsView({
                collection: collection,
                el: '#collection-el',
                _elementViewEl: '.elements-list-el'
            });

            console.log('about to call render collection_view');
            collection_view.render();
        }
    });
}

/////////////////////////////
/////// LOCAL HELPERS ///////
/////////////////////////////

function getSelf(){
    window.SELF = new User({
        isSelf: true
    });

    window.SELF.fetch({
        success: function(model){
            console.log('*** SELF!');
            console.dir(model);
        }
    });
}

function getUsers(){
    window.USERS = new Users();
    window.USERS.fetch();
}


/////////////////////////////
////////// EXPORTS //////////
/////////////////////////////




exports.init = function(){
    console.log('alchemy.js::init()');
    var that = this;

    //populate the window.USERS collection and window.SELF model
    this.getUsers();
    this.getSelf();

    //@todo: later, do this with the insights collection (fetch at site load) and a new InsightsMenuView
    /*
    $.ajax({
        url: 'http://therrienbarley.com/insights/air/api/insight',
        type: 'GET',
        success:function(data){
            console.log('alchmey init returned');

            var $menu = $('<div id="insights-menu" class="insights-menu"><h6>Add to insight</h6></div>');
            $menu.append('<div class="new-insight"></div>');
            $menu.append('<ul class="insights-options"></ul>');

            _.each(data, function(insight, index){
                var insight_title = (insight.title.length > 30) ? insight.title.substr(0, 30) + '...' : insight.title;

                $menu.find('.insights-options').append('<li id="insight-'+insight._id+'" class="insights-option">'+insight_title+'</li>');
            });

            $('body').append($menu);
        }
    })*/

}


exports.initFeedNav = function(){
    $('#feed-nav .add').click(function(){
        
    });
}

exports.renderInquiries = function(){
    console.log('Alchemy.js::renderInquiries()');
    var inquiries = new Inquiries();
    inquiries.fetch({
        success: function(collection, response, options){
            var inquiries_view = new InquiriesView({
                collection: collection,
                el: '#inquiries-el',
                _inquiryViewEl: '.inquiries-list-el'
            });

            inquiries_view.render();
        }
    });

    $('#main .add').click(function(event){
        
        if(!$(this).hasClass('disabled')){
            console.log('clicked add');
            $(this).addClass('disabled');

            var inquiry = new Inquiry();

            var inquiry_view = new InquiryView({
                model: inquiry,
                el: '#new-inquiries-el'
            });

            if(typeof inquiry_view.render() !== 'undefined'){
                $('#new-inquiries-el #inquiry-new').addClass('edit-mode new');
                $('#new-inquiries-el #inquiry-new .editable').attr('contenteditable', 'true');
            }
        }


    });
}