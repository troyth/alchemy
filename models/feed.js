var Feed = require(__dirname + '/models').Feed;



/////// GLOBALS ///////
var GET_LIMIT = 40;

//post request
exports.create = function(req, res){
    console.log('feed.js::create()');


    var new_feed = new Feed({
        type: req.body.type,
        title: req.body.title,
        source: req.body.source,
        creator: req.user.id,
        visibility: 'private',
        category: req.body.category,

        fetched: null,
        collaborators: req.body.collaborators,
        tags: req.body.tags
    });


    new_feed
        .save(function(err){
            if(err){
                console.log('Error: attempted to save new feed with msg:'+ err);
                res.send(500, 'Error: attempted to save new feed with msg:'+ err);
            }else{  
                console.log('Success: created new feed');
                res.json(200, 'Success: created new feed');
            }
        });
}


exports.update = function(req, res, _id){
    console.log('feed.js::update() with _id: '+ _id);
    var timestamp_now = new Date().getTime();

    Feed
        .findById(_id, function(err, doc){
            doc.type = req.body.type;
            doc.title = req.body.title;
            doc.source = req.body.source;
            doc.category = req.body.category;

            doc.visibility = req.body.visibility;
            doc.updated = timestamp_now;

            for(var i = doc.tags.length-1; i >= 0; i--){
                doc.tags.splice(i, 1);
            }

            for(var i = 0; i < req.body.tags.length; i++){
                doc.tags.addToSet(req.body.tags[i]);
            }

            for(var i = doc.collaborators.length-1; i >= 0; i--){
                doc.collaborators.splice(i, 1);
            }

            for(var i = 0; i < req.body.collaborators.length; i++){
                doc.collaborators.addToSet(req.body.collaborators[i]);
            }            

            doc.save(function(err){
                if(err){
                    console.log('error: feed.js::create() with msg: '+ err);
                    res.send(500, 'Error attempting to update feed with error message: '+ err);
                }else{
                    console.log('Success: updated feed');
                    res.json(200);
                }
            });
        });
}

exports.delete = function(req, res, _id){
    console.log('feed.js::delete()');

    Feed
        .findByIdAndRemove(_id, function(err){
            if (err) {
                console.log('error: feed.js::delete() with msg: '+ err);
                res.send(500, 'Error attempting to delete feed with error message: '+ err);
            } else {
                console.log('Success: deleted feed');
                res.json(200);
            }
        });
}




exports.get = function(req, res){
    console.log('feed.js::get()');
    var id = null;
    if(typeof req.query._id !== 'undefined'){
        id = req.query._id;
        console.log('inquiry.js::get() with an id');
        if(req.user.role == 'admin'){//get all inquiry
            console.log('user has all, so make it happen');

            Feed
                .findOne({ _id: id })
                .exec(function(err, item) {
                    if (err) {
                        console.log('error: feed.js::get() all with msg: '+ err);
                        res.send(500, 'Error: attempting to get all feed with message: '+ err);
                    } else {
                        console.log('Success: got all feed');
                        res.json(200, item);
                    }
                });

        }
    }else{
        console.log('apparently, id == null');

        if(req.user.role == 'admin'){//get all inquiry

            Feed
                .find()
                .limit(GET_LIMIT)
                .sort('updated')
                .exec(function(err, items) {
                    if (err) {
                        console.log('error: feed.js::get() all with msg: '+ err);
                        res.send(500, 'Error: attempting to get all feed with message: '+ err);
                    } else {
                        console.log('Success: got all feed');
                        res.json(200, items);
                    }
                });

        }else{//not admin
            console.log('return all inquiry for NON ADMIN');

            Feed
                .find({$or: [{ creator: req.user.id }, { "collaborators.id": req.user.id }]})
                .limit(GET_LIMIT)
                .sort('updated')
                .exec(function(err, items) {
                    if (err) {
                        console.log('error: feed.js::get() all with msg: '+ err);
                        res.send(500, 'Error: attempting to get all feed with message: '+ err);
                    } else {
                        console.log('Success: got all feed');
                        res.json(200, items);
                    }
                });
        }
    }

}//end get




/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////// SYNCING /////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

/*

exports.sync = function(req, res){
    var _id = '51b33d266e80adbc55000001';

    Inquiry
        .findOne({ _id: _id })
        .exec(function(err, collect) {
            var flag = false;
            //check for permissions
            if( req.user.role != 'admin' ){
                for(var i = 0; i < collect.collaborators.length; i++){
                    if(collect.collaborators[i].id == req.user.id){
                        flag = true;
                        break;
                    }
                }
            }
            if( (req.user.role == 'admin') || flag == true){

                console.log('collect.sources: ');
                console.dir(collect.sources);

                for(var i = 0; i < collect.sources.length; i++){
                    console.log('source: '+ i);
                    console.dir(collect.sources[i]);
                    //type, source, tag
                    switch(collect.sources[i].type){
                        case 'tumblr':
                            console.log('fetching from tumblr host: '+ collect.sources[i].source+' with tag: '+ collect.sources[i].tag);
                            tumblr.fetch(collect.sources[i].source, collect.sources[i].tag, 20, 0, req, res, _id);
                            break;
                    }
                }

            }else{
                res.send(404, 'Error, you dont have permission to sync this inquiry');
            }
        });

}

exports.download = function(req, res){
    var _id = '51b33d266e80adbc55000001';

    Inquiry
        .findOne({ _id: _id })
        .exec(function(err, collect) {
            var flag = false;
            //check for permissions
            if( req.user.role != 'admin' ){
                for(var i = 0; i < collect.collaborators.length; i++){
                    if(collect.collaborators[i].id == req.user.id){
                        flag = true;
                        break;
                    }
                }
            }
            if( (req.user.role == 'admin') || flag == true){

                for(var i = 0; i < collect.sources.length; i++){
                    //type, source, tag
                    switch(collect.sources[i].type){
                        case 'tumblr':
                            console.log('downloading tumblr posts');
                            tumblr.download(req, res, collect.id);
                            break;
                    }
                }

            }else{
                res.send(404, 'Error, you dont have permission to sync this inquiry');
            }
        });
}


*/

