var User = require(__dirname + '/models').User;





exports.create = function(req, res){
  console.log('');console.log('');console.log('');console.log('');console.log('');


  console.log('');console.log('');console.log('');console.log('');console.log('');
  console.log('req.body');
  console.dir(req.body);

  var u = new User({
    username: req.body.username,
    name: req.body.name,
    password: req.body.password,
    role: req.body.role,
    email: req.body.email
  });

  u.save(function(err){
    if(err){
      console.log('Error: attempted to save new username '+ req.body.username +' with msg:'+ err);
      res.send(500, 'Error: attempted to save new username '+ req.body.username +' with msg:'+ err);
    }else{
      console.log('Success: created new username: ' + req.body.username);
      res.json(200, 'Success: created new username: ' + req.body.username);
    }
  });
}

exports.update = function(req, res, _id){
    console.log('insights.js::update() with _id: '+ _id);
    var timestamp_now = new Date().getTime();

    User
        .update({ 'id': _id }, {
            username: req.body.username,
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            role: 'user',
            updated: timestamp_now
        }, function(err, user) {
            if(err){
                console.log('error: users.js::create() with msg: '+ err);
                res.send(500, 'Error attempting to update user with error message: '+ err);
            }else{
                console.log('Success: updated user');
                res.json(200);
            }
  });//end Insight.update()
}//end exports.update()














exports.get = function(req, res, id){
    console.log('users.js::get(id) with id: '+id+' and req.user.username: '+req.user.username);


    id = id || null;

    if(id == null){//get all users

        User
            .find()
            .sort('id')
            .exec(function(err, items) {
                    if (err) {
                        console.log('error: users.js::get() with msg: '+ err);
                        res.send(500, 'Error: attempting to get all users with message: '+ err);
                    } else {
                        console.log('Success: got all users');
                        res.json(200, items);
                    }
                });

    }else{
        if(id == 'self'){
            console.log('******* HUNTING FOR SELF with id: '+id);
            id = req.user._id;
            console.log('******* HUNTING FOR SELF with id: '+id);
            console.dir(req.user);
        }

        User
            .findOne({ _id: id })
            .exec(function(err, user) {
                if (err) {
                    console.log('error: users.js::get()');
                    console.log(err);
                    res.send(500, 'Error: attempting to get one users with message: '+ err);
                } else {
                    console.log('Success: got one user');
                    console.dir(user);
                    console.log('!!!!!!!&&&&&&&')
                    res.json(200, user);
                }
            });
    }
}//end get



exports.delete = function(req, res, _id){
    console.log('collections.js::delete()');

    User
        .findByIdAndRemove({ _id: _id }, function(err){
            if (err) {
                console.log('error: users.js::delete() with msg: '+ err);
                res.send(500, 'Error attempting to delete user with error message: '+ err);
            } else {
                console.log('Success: deleted user');
                res.json(200, removed);
            }
        });
}


exports.update = function(req, res, id){
    console.log('collections.js::update()');
    var timestamp = new Date().getTime();

    if(req.user){
        var updated_user = {
            username: req.body.username,
            name: req.body.name,
            password: req.body.password,
            email: req.body.email
        };

        db.collection(col, function(err, collection) {
            collection.update({'id': req.user.id }, updated_user, {safe:true}, function(err) {
                if (err) {
                    console.log('error: users.js::update()');
                    console.log(err);
                    res.send(500, 'Error attempting to update user with error message: '+ err);
                } else {
                    console.log('Success: updated users');
                    res.send(200);
                }
            });
        });
    }else{
        res.send(400, 'No permissions, req.user doesnt exist');
    }   
}





//post request
exports.create = function(req, res){
    console.log('collections.js::create()');

    //only admins can create other users
    if(req.user){
        if(req.user.role == 'admin'){

            var timestamp = new Date().getTime();
            console.log('time: '+ timestamp);

            db.collection(col, function(err, collection) {
                collection.count(function(err, count) {
                    if(err){
                        console.log("ERROR: in counting number of objects in users collection in users.js::create() with msg: "+ err);
                        res.send(500, "ERROR: in counting number of objects in users collection in users.js::create() with msg: "+ err);
                    }else{
                        var id = count + 1;
                        console.log('adding new user with id: '+ id);
                        var new_user = {
                            id: id,
                            username: req.body.username,
                            name: req.body.name,
                            password: req.body.password,
                            email: req.body.email,
                            role: 'user',
                            created: timestamp,
                            updated: timestamp,
                            collections: []
                        };

                        collection.insert(new_user, function(err, docs) {
                            if (err) {
                                console.log('error: users.js::create()');
                                console.log(err);
                                res.send(500, 'Error attempting to create user with error message: '+ err);
                            } else {
                                console.log('Success: created new user with id: '+ id);
                                console.log(docs);
                                res.json(200, docs[0]);
                            }
                        });

                    }
                });
            });
        }else{
            res.send(400, 'Error: cant create user, not admin role');
        }
    }else{
        res.send(400, 'Error: cant create user, no permissions: req.user doesnt exist');
    }   

                

}
