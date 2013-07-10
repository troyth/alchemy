var Obj = require(__dirname + '/models').Obj;

/////// GLOBALS ///////
var GET_LIMIT = 600;


//post request
exports.create = function(req, res){
    console.log('obj.js::create()');
    var obj = new Obj({
        type: req.body.type,
        data: req.body.data,
        description: req.body.description,
        source_type: req.body.source_type,//feed, bookmarklet, another obj, etc.
        source_feed: req.body.source_feed,//name of feed (eg. ifthisthenth-ey)
        source_obj: req.body.source_obj,//id of object, feed, etc.
        source_url: req.body.source_url,//url to original source on the web
        source_filter_tag: req.body.source_filter_tag,//tag used to filter the source feed
        inquiry_id: req.body.inquiry_id,//id of collection it belongs to
        source_timestamp: req.body.source_timestamp,//create time from the original source (eg. date published on tumblr)
    });

    obj
        .save(function(err){
            if(err){
                console.log('Error: attempted to save new obj with msg:'+ err);
                res.send(500, 'Error: attempted to save new obj with msg:'+ err);
            }else{  
                console.log('Success: created new obj');
                res.json(200, 'Success: created new obj');
            }
        });
}


exports.update = function(req, res, _id){
    console.log('obj.js::update()');

    var timestamp_now = new Date().getTime();

    Obj
        .update({ 'id': _id }, {
            insight_ids: req.body.insight_ids,//should be an array
            annotation: req.body.annotation,
            order: parseInt(req.body.order),
            caption: req.body.caption,
            featured: req.body.featured,
            updated: timestamp_now
        }, function(err, user) {
            if(err){
                console.log('error: obj.js::create() with msg: '+ err);
                res.send(500, 'Error attempting to update obj with error message: '+ err);
            }else{
                console.log('Success: updated obj');
                res.json(200);
            }
  });//end Obj.update()

}//end exports.update()


exports.delete = function(req, res, _id){
    console.log('obj.js::delete() with _id: '+ _id);

    Obj
        .findByIdAndRemove({ _id: _id }, function(err){
            if (err) {
                console.log('error: obj.js::delete() with msg: '+ err);
                res.send(500, 'Error attempting to delete obj with error message: '+ err);
            } else {
                console.log('Success: deleted obj');
                res.json(200, removed);
            }
        });
}




//This is necessary because I load all obj at the beginning of an insights page load
//to save time
exports.get = function(req, res, _id){
    console.log('obj.js::get() with _id: '+ _id);

    Obj
        .findById(_id, function(err, obj) {
            if (err) {
                res.send(500, 'Error attempting to get obj by fragment_id with error message: '+ err);
            } else {
                console.log('Success: got obj');
                res.json(200, obj);
            }
        });
}


exports.getRelated = function(req, res){

    Obj
        .find({ relations.id: {$in : req.body.related } })
        .sort('id')
        .exec(function(err, objs){
            if (err) {
                console.log('error: obj.js::get() by element_id with msg: '+ err);
                res.send(500, 'Error attempting to get objs by element_id with error message: '+ err);
            } else {
                console.log('Success: got '+ objs.length + ' objs');
                res.json(200, objs);
            }
        });
}















