var Tumblr = require('tumblrwks');
var request = require('request');
var Obj = require(__dirname + '/models').Obj;

var util = require('util');

var path = require('path');
var mime = require('mime');

process.setMaxListeners(0);

var _  = require('underscore');
var fs = require('fs');
var $ = require('jquery');
var ent = require('ent');

// Import Underscore.string to separate object, because there are conflict functions (include, reverse, contains)
_.str = require('underscore.string');

// Mix in non-conflict functions to Underscore namespace if you want
_.mixin(_.str.exports());

// All functions, include conflict, will be available through _.str object
_.str.include('Underscore.string', 'string'); // => true



/*
  For accessToken and accessSecret, user need to grant access of your app. I recommend to use: https://github.com/jaredhanson/passport-tumblr
*/

var tumblr = new Tumblr(
  {
    consumerKey: 'IMMvdPYHS4s0jniNnAj53aOxWaw5GwqsbwJhnYdXm14DQZfcHc'
  }
  // specify the blog url now or the time you want to use
);


/////// GLOBALS ///////
var inline_images = [];
var MAX_TAGS = 15;
var MAX_PHOTOS = 3;
var MAX_INLINE_PHOTOS = 20;
var MAX_BODY_PARAGRAPHS = 35;


//HELPER FUNCTION

exports.getObjs = function(req, res, inquiry_id){
	Obj
        .find({ inquiry_id: inquiry_id })
        .limit(10)
        .sort('-timestamp')
        .exec(function(err, objs){
            res.json(200, objs);
        });
}




//returns html of the element itself
function getOuterHTML(el, fit){   
    var fit = fit || false;
    var wrapper = '';

    if(el){
        var inner = el.innerHTML;
        var wrapper = '<' + el.tagName;

        for( var i = 0; i < el.attributes.length; i++ ){
            wrapper += ' ' + el.attributes[i].nodeName + '="';
            //fit to 100% width if fit flag set
            if(el.attributes[i].nodeName == 'width' && fit){
                wrapper += '100%' + '"';
            }else{
                wrapper += el.attributes[i].nodeValue + '"';
            }
        }
        wrapper += '>' + inner + '</' + el.tagName + '>';
    }
    return wrapper;
}


function populateArrayPhoto(a,url){
	if(url != null){
		var filename = url;
		filename = filename.split('/').pop();

		if(filename.length > 100){
			filename = 'randomFilename_' + Math.floor(Math.random()*1000000000000000);
		}

		var pathname = __dirname + '/photos/' + filename;
		a.push( 'Users:troytherrien:Insync:info@th-ey.co:GIT:therrienbarley.com:server:projects:air:controllers:photos:'+filename );

		console.log('***************photo url: '+ url);

		if(!fs.existsSync(pathname)){
			setTimeout(function(){
				request( url ).pipe(fs.createWriteStream( pathname ));
			}, 500);
		}else{
			console.log('file exists ------- looking for size now');
			

			  fs.stat(pathname, function (err, stats) {
			  	console.log('++++++++ SIZE: '+ stats.size);
			    if(stats.size == 0 || stats.size == '0'){
			        	console.log('!!!!!!!FETCHING AGAIN!!!!!!!');
			        	console.log('url: '+ url)
			        	setTimeout(function(){
							request( url ).pipe(fs.createWriteStream( pathname ));
						}, 500);
			        }
			  });
	
		}

	}else{
		a.push(' ');
	}
	return a;
}



//strips all images from HTML text and puts in the components array
function populateInlineImages(html){
	var temp_array = [];

	console.log('html:');
	console.log(html);

	var $html = $(html);
	$html.find('img').each(function(i){
		temp_array.push( $(this).attr('src') );
	});

	$html.find('img').remove();

	//add ------- to the beginning of each blockquote
	$html.find('blockquote').each(function(){
		var text = '>>>>>>>' + $(this).text() + '<<<<<<<';
		$(this).text( text );
	});

	if(temp_array.length > 0){
		inline_images.push( temp_array );
	}

	return $html;
}

var once = true;

function populateArray(a,value,htmlValues){
	htmlValues = htmlValues || false;

	var vStr = '' + value;

	if(value == "tech" || value == "Tech" || value == "TECH"){
		value = "technology";
	}

	if(value != null){//get rid of the IFTTT tags

		if(htmlValues){
			var done = populateInlineImages(vStr);
			vStr = _(vStr).stripTags();		
		}

		vStr = vStr.replace(/,/g, '');//replace all commas with empty string
		vStr = vStr.replace(/\n/g, ' ');//replace all carriage returns with empty string

		vStr = ent.decode( vStr );
		a.push( vStr );
	}else{
		a.push(' ');
	}
	return a;
}


function populateBodyCaption(a,value){
	var valueStr = '' + value;
	if(value != null){//get rid of the IFTTT tags

		
		valueStr = ent.decode( valueStr );
		valueStr = _.trim( valueStr );

		var $html = populateInlineImages(valueStr);//strips out all images and populates the image array, returns html string without img tags

		var html_text = $html.text();

		var paras = html_text.split('\n');

		//remove any empty elements from the array
		for(var j = 0; j < paras.length; j++){
			if((paras[j] == '') || (paras[j].length < 3)){
				paras.splice(j, 1);
			}
		}

		for(var t = 0; t < MAX_BODY_PARAGRAPHS; t++){
			if(paras[t] != undefined){

				//vStr = _(vStr).stripTags();	
				
				paras[t] = paras[t].replace(/,/g, '');//replace all commas with empty string
				paras[t] = paras[t].replace(/,/g, '');//replace all commas with empty string
				paras[t] = paras[t].replace(/—/g, '-');//replace all commas with empty string
				paras[t] = paras[t].replace(/—/g, '-');//replace all commas with empty string
				paras[t] = paras[t].replace(/“/g, '"');//replace all commas with empty string
				paras[t] = paras[t].replace(/”/g, '"');//replace all commas with empty string
				paras[t] = paras[t].replace(/’/g, "'");//replace all commas with empty string
				paras[t] = paras[t].replace(/‘/g, "'");//replace all commas with empty string

				paras[t] = paras[t].replace(/</g, '');//replace all commas with empty string
				paras[t] = paras[t].replace(/>/g, '');//replace all commas with empty string
				paras[t] = paras[t].replace(/&nbsp;/g, ' ');//replace all commas with empty string

				paras[t] = paras[t].replace(/í/g, 'i');//replace all commas with empty string
				paras[t] = paras[t].replace(/•/g, '-');//replace all commas with empty string
				paras[t] = paras[t].replace(/»/g, '');//replace all commas with empty string

				//paras[t] = ent.decode( paras[t] );

				a.push( paras[t] );
			}else{
				a.push(' ');
			}
		}
	}else{
		for(var t = 0; t < MAX_BODY_PARAGRAPHS; t++){
			a.push(' ');
		}
	}
	return a;
}


function createCSV(s, res){
	var d = new Date();
	var month = d.getMonth()+1;
	var date = ''+d.getFullYear()+month+d.getDate();

	var path = __dirname+'/spreadsheets/';
	var filename = date + 'spreadsheet_'+ Math.floor(Math.random()*10000) +'.csv';
	var filepath = path+filename;

	fs.writeFile(filepath, s, { encoding: 'utf8'}, function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file was saved!");

			var mimetype = mime.lookup(filepath);

			res.setHeader('Content-disposition', 'attachment; filename=' + filename);
			res.setHeader('Content-type', mimetype);

			var filestream = fs.createReadStream(filepath);
			filestream.pipe(res);
	    }
	});
}




//populates array with headers for CSV to datamerge
function populateCSVHeaders(comp_array){
	var components_array = [];
	components_array.push( 'item' );
	components_array.push( 'id' );
	components_array.push( 'date' );
	components_array.push( 'post_url' );
	components_array.push( 'type' );

	//components_array.push( 'note_count' );
	components_array.push( 'title' );
	//components_array.push( 'body' );
	//components_array.push( 'caption' );

	/*
	components_array.push( 'word count' );
	components_array.push( 'image count' );
	components_array.push( 'link count' );
	*/

	//components_array.push( 'timestamp' );

	for(var t = 0; t < MAX_BODY_PARAGRAPHS; t++){
		components_array.push( 'body' + t );
	}

	for(var t = 0; t < MAX_BODY_PARAGRAPHS; t++){
		components_array.push( 'quote' + t );
	}


	for(var t = 0; t < MAX_TAGS; t++){
		components_array.push( 'tag' + t );
	}

	for(var p = 0; p < MAX_PHOTOS; p++){
		components_array.push( '@photo' + p );
	}

	for(var p = 0; p < MAX_INLINE_PHOTOS; p++){
		components_array.push( '@inlinePhoto' + p );
	}

	comp_array.push( components_array.join(',') );

	return comp_array;
}

	

	
function forLoop(res, comp_array, components, items, i){
	console.log('i: '+ i);

	var components_array = [];

	components_array = populateArray(components_array, items.length-i+1);//give oldest item = 1
	components_array = populateArray(components_array, items[i].id);
	components_array = populateArray(components_array, items[i].date);
	components_array = populateArray(components_array, items[i].post_url);
	components_array = populateArray(components_array, items[i].type);
	//components_array = populateArray(components_array, items[i].note_count);
	components_array = populateArray(components_array, items[i].title);

	//strips out photos and puts in inline_images array
	switch(items[i].type){
		case 'text':
			components_array = populateBodyCaption(components_array, items[i].body);
			break;
		case 'photo':
			components_array = populateBodyCaption(components_array, items[i].caption);
			break;
		case 'video':
			components_array = populateBodyCaption(components_array, items[i].caption);
			break;
		case 'link':
			components_array = populateBodyCaption(components_array, items[i].description);
			break;
		case 'quote':
			components_array = populateBodyCaption(components_array, items[i].source);
			break;
	}
	//populate quote
	switch(items[i].type){
		case 'text':
			components_array = populateBodyCaption(components_array, null);
			break;
		case 'photo':
			components_array = populateBodyCaption(components_array, null);
			break;
		case 'video':
			components_array = populateBodyCaption(components_array, 'Video');
			break;
		case 'link':
			components_array = populateBodyCaption(components_array, '<p>'+items[i].title+'</p>');
			break;
		case 'quote':
			components_array = populateBodyCaption(components_array, '<p>'+items[i].text+'</p>');
			break;
	}
	//components_array = populateArray(components_array, items[i].timestamp);

	var tags_length = (items[i].tags.length < MAX_TAGS) ? items[i].tags.length : MAX_TAGS;
	
	for(var k = 0; k < MAX_TAGS; k++){
		if(k < tags_length){
			populateArray(components_array, items[i].tags[k]);
		}else{
			populateArray(components_array, null);
		}
	}
	
	//if photo post, fill photos columns with photos
	if(items[i].type == 'photo'){
		var photos_length = (items[i].photos.length < MAX_PHOTOS) ? items[i].photos.length : MAX_PHOTOS;
	
		for(var x = 0; x < MAX_PHOTOS; x++){
			if(x < photos_length){
				populateArrayPhoto(components_array, items[i].photos[x].alt_sizes[0].url);
			}else{
				populateArray(components_array, null);
			}
		}
	}else{//if not photo post, fill with empty strings
		for(var k = 0; k < MAX_PHOTOS; k++){
			components_array.push( 'none' );
		}
	}

	var inline_image_array = inline_images.pop();
	if(inline_image_array != undefined){
		for(var p = 0; p < MAX_INLINE_PHOTOS; p++){
			if(inline_image_array[p] != undefined){
				populateArrayPhoto(components_array, inline_image_array[p]);
			}else{
				populateArray(components_array, null);
			}
		}
	}else{
		for(var p = 0; p < MAX_INLINE_PHOTOS; p++){
			populateArray(components_array, null);
		}
	}
	
	components.push( components_array.join(',') );

	i++;
	if(i < items.length){
		setTimeout(function(){
			forLoop(res, comp_array, components, items, i);
		}, 500);
	}else{
		comp_array.push( components.join('\n') );//main storage array

		var final_string = comp_array.join('\n');
		createCSV(final_string, res);
	}
}


function download(req, res, _id){

	var comp_array = [];

	comp_array = populateCSVHeaders(comp_array);

	Element
		.find({ type: tumblr, inquiry_id: _id })
		.sort('-timestamp')
		.exec(function(err, items) {
        	//array to store all post date from this call to Tumblr API
			var components = [];

			//cycle through all the posts returned
			setTimeout(function(){
				forLoop(res, comp_array, components, items, 0);
			}, 500);
        });//end find

}

exports.download = download;





var fetched_total_posts = 0;

function fetchCallback(host, tag, limit, offset, req, res, fetched_posts, inserted_posts, total_posts, inquiry_id){
	fetched_total_posts++;
	//if fetched everything, finish by sending 205 status
	if(fetched_total_posts >= total_posts){
		fetched_total_posts = 0;//reset for the next sync
		res.send(205);//status 205 = Reset Content
	}else{
		//if not fetched everything, check to see if inserted everything in present fetch
		//and call fetch again
		if(inserted_posts >= fetched_posts){
			fetch(host, tag, limit, fetched_total_posts, req, res, inquiry_id);
		}
	}
}

function fetch(host, tag, limit, offset, req, res, inquiry_id){
	console.log('fetchtumblr.js::fetch() from inquiry with _id: '+ inquiry_id);

	var query; 
	if(tag == ''){
		query = {hostname: host+'.tumblr.com', offset: offset, limit: limit};
	}else{
		query = {hostname: host+'.tumblr.com', offset: offset, limit: limit, tag: tag};
	}

	tumblr.get('/posts', query, function(json){
		console.log('returned from fetch with:');
		console.dir(json);
		if(json.posts.length == 0){
			//incase private posts, total_posts will never be reached
			fetched_total_posts = 0;//reset for the next sync
			res.send(205);//status 205 = Reset Content
		}else{
			console.log('got some posts! total: ' + json.total_posts);
			var inserted_posts = 0;

			var total_posts = json.total_posts;
			var fetched_posts = json.posts.length;

			//cycle through all the posts returned
			for(var i = 0; i < fetched_posts; i++){

				//sanitize tags
				for(var t = 0; t < json.posts[i].tags.length; t++){
	                json.posts[i].tags[t] = json.posts[i].tags[t].toLowerCase();
	                //convert all instances of 'technology' to 'tech'
	                if(json.posts[i].tags[t] == 'technology'){
	                	json.posts[i].tags[t] = 'tech';
	                }
	                //remove all sort tag and t tags
	                if(json.posts[i].tags[t] == tag || json.posts[i].tags[t] == 't'){
	                	json.posts[i].tags.splice(t, 1);
	                }
	            }


				Obj
					.update({ source_id: json.posts[i].id }, {
						type: 'tumblr_post',
						source_type: 'feed',
						source_feed: host,
						source_url: json.posts[i].post_url,
						source_filter_tag: tag,
						inquiry_id: inquiry_id,//inquiry _id
						source_timestamp: json.posts[i].timestamp,
						data: json.posts[i],
					}, {upsert: true}, function(err, result) {
	                    if (err) {
	                        console.log('error: An error has occurred in trying to upsert into the '+inquiry_id+' inquiry with msg: '+ err);
	                        res.send(500, 'error: An error has occurred in trying to upsert into the '+inquiry_id+' inquiry with msg: '+ err);
	                    } else {
	                        console.log('Success: added a post to to '+inquiry_id+' inquiry');
	                    	inserted_posts++;
	                    	fetchCallback(host, tag, limit, offset, req, res, fetched_posts, inserted_posts, total_posts, inquiry_id);
	                    }
	                });

			}//end for loop over all posts
		}
	});
}

exports.fetch = fetch;
