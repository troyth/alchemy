var Insight = require(__dirname + '/models').Insight;





/////// GLOBALS ///////
var GET_LIMIT = 100;
var SEGMENTS = ['topten', 'toptwenty', 'other'];



//post request
exports.create = function(req, res){
    var position;
    console.log('insights.js::create()');
    if(req.body.position){
        console.log('position exists!');
        position = req.body.position;
    }else{
        console.log('no position exists');
        position = 0;//might need to change this b/c not voting anymore
    }

    console.log('insights.js::create() with position: '+ position);

    var insight = new Insight({
        title: req.body.title,
        tags: req.body.tags,
        description: req.body.description,
        position: parseInt(req.body.position)
        //dates are set automatically to now
    });

    insight
        .save(function(err){
            if(err){
                console.log('Error: attempted to save new insight with msg:'+ err);
                res.send(500, 'Error: attempted to save new insight with msg:'+ err);
            }else{  
                console.log('Success: created new insight');
                res.json(200, 'Success: created new insight');
            }
        });
}


exports.update = function(req, res, _id){
    console.log('insights.js::update() with _id: '+ _id);
    var timestamp_now = new Date().getTime();

    Insight
        .update({ 'id': _id }, {
            title: req.body.title,
            tags: req.body.tags,
            description: req.body.description,
            position: parseInt(req.body.position),
            updated: timestamp_now
        }, function(err, user) {
            if(err){
                console.log('error: insights.js::create() with msg: '+ err);
                res.send(500, 'Error attempting to update insight with error message: '+ err);
            }else{
                console.log('Success: updated insight');
                res.json(200);
            }
  });//end Insight.update()
}//end exports.update()









exports.get = function(req, res, _id){
    var _id = _id || false;
    console.log('insights.js::get() with _id: '+ _id);

    if(_id == false){
        //get all projects
        db.collection(col, function(err, collection) {
            collection.find({'type': 'insight' }).limit(GET_LIMIT).sort({'position': -1}).toArray(function(err, items) {
                if (err) {
                    console.log('error: insights.js::create()');
                    console.log(err);
                    res.send(500, 'Error attempting to get insight with error message: '+ err);
                } else {
                    console.log('Success: got insight');
                    res.json(200, items);
                }
            });
        });
    }else{
        //is one of the SEGMENTS
        if(SEGMENTS.indexOf(_id) > -1){
            var limit, offset;

            switch(_id){
                case 'topten':
                    limit = 10;
                    offset = 0;
                    break;
                case 'toptwenty':
                    limit = 10;
                    offset = 10;
                    break;
                case 'other':
                    limit = 500;
                    offset = 20;
                    break;
                default:
                    limit = 0;
                    offset = 0;
                    break;
            }
            //get single project by _id
            db.collection(col, function(err, collection) {
                collection.find().limit(limit).skip(offset).sort({'position': -1}).toArray(function(err, items) {
                    if (err) {
                        console.log('error: insights.js::create()');
                        console.log(err);
                        res.send(500, 'Error attempting to get insight with error message: '+ err);
                    } else {
                        console.log('Success: g0t insight');
                        res.json(200, items);
                    }
                });
            });
        }else{//is an _id
            //get single project by _id
            db.collection(col, function(err, collection) {
                collection.find({'_id': new ObjectID(_id) }).limit(GET_LIMIT).sort({'position': -1}).toArray(function(err, items) {
                    if (err) {
                        console.log('error: insights.js::create()');
                        console.log(err);
                        res.send(500, 'Error attempting to get insight with error message: '+ err);
                    } else {
                        console.log('Success: g0t insight');
                        res.json(200, items[0]);
                    }
                });
            });
        }    
    }
}



exports.delete = function(req, res, _id){
    console.log('insights.js::delete()');

    Insight
        .findByIdAndRemove({ _id: _id }, function(err){
            if (err) {
                console.log('error: insights.js::delete() with msg: '+ err);
                res.send(500, 'Error attempting to delete insight with error message: '+ err);
            } else {
                console.log('Success: deleted insight');
                res.json(200, removed);
            }
        });
}











