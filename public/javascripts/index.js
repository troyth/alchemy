console.log('index.js starting');

var $ = require("component/jquery");
var _ = require("component/underscore");
var Backbone = require("brighthas/backbone");


var config = {
        
    verticallyCenter: function(selector){
        console.log('verticallyCenter('+selector+')')
        if($(selector).length > 0){
            var it_height = $(selector).height();

            if(window.innerHeight > it_height){
                var vertical_padding = (window.innerHeight - parseInt($('#main').css('marginTop')) - it_height) / 2 - parseInt($('#nav').height());
                $(selector).css('paddingTop', vertical_padding);
            }
            $(selector).css('opacity', 1);
        }
    },

    verticallyCenterNav: function(){
        var nav_height = 0;

        $('#nav .menu').each(function(i){
            nav_height += $(this).height() + parseInt($(this).css('paddingTop')) + parseInt($(this).css('paddingBottom'));
            if(i > 0){
                nav_height += parseInt($(this).css('marginBottom'));
            }
        });

        if(window.innerHeight > nav_height){
            var vertical_padding = (window.innerHeight - nav_height) / 2;
            $('#nav').css('paddingTop', vertical_padding);
        }

        console.log('nav_height: '+ nav_height);
        console.log('vertical_padding: '+ vertical_padding);
        $('#nav').css('opacity', 1);
    },

    resizeFunc: function(){
        this.verticallyCenter('#intro-text');
        this.verticallyCenter('#login-form');
        //this.verticallyCenterNav();
    },

    initControlsMenuToggle: function(){
        $('.controls-toggle').bind('mouseenter', function(){
            $(this).find('.menu-controls').show();
            $(this).find('i.toggle').hide();
        });

        $('.menu-controls').bind('mouseleave', function(){
            $(this).hide();
            $(this).closest('.controls-toggle').find('i').show();
        });
    },

    init: function(){
        var pathname = window.location.pathname;
        var path_array = pathname.split('/');

        this.resizeFunc();

        $('#nav .login').click(function(){
            location.pathname = 'login';
        });


        $('.tag-elements-icon i').hover(function(){
            var $img = $(this).closest('.tag-elements-icon').find('img');
            $img.show();
            console.log('$img.height() '+ $img.attr('width'));
            $img.height( $img.attr('height') );
            $img.css( 'maxHeight', $img.attr('height') );
            $img.width( $img.attr('width') );
            $img.css( 'maxWidth', $img.attr('width') );
        }, function(){
            $(this).closest('.tag-elements-icon').find('img').hide();
        });

        if($('#overlay').length > 0){
            $('#overlaybg').css('opacity', 0.95);
            $('#overlay-close').bind('click', function(){
                $('#overlay').hide();
            });
        }

        $('#mechanics .image').bind('click', function(){
            $(this).toggleClass('open');
            $('#mechanics .menu').toggle();
        });

        this.initControlsMenuToggle();

        $(window).resize(this.resizeFunc);

        
        $('#user .menu').hover(function(){
            $('li.menu-item', this).show();
            $(this).css('backgroundColor', 'white');
        }, function(){
            $('li.menu-item', this).hide();
            $(this).css('backgroundColor', '');
        });

        this.route();

    },

    route: function(){
        var url_array = window.location.pathname.split('/');

        switch(url_array[1]){
            case 'insights':
                switch(url_array[2]){
                    case 'inquiries':
                        Alchemy.renderInquiries();
                        break;
                    case 'inquiry':
                        Alchemy.renderInquiryContent(url_array[3]);
                        Alchemy.initFeedNav();
                        break;
                }
                break;
        }
    }

}//end init


config.init();

//Alchemy.init();

        















