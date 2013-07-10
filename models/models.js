GLOBAL = require('../controllers/globals').GLOBAL;

  console.log('models.initDbConnection');
console.dir(GLOBAL.db_uri);
console.log('');
console.log('');
console.log('');

/////// SET UP DATABASE CONNECTION WITH MONGOOSE ///////
var mongoose = require('mongoose');
mongoose.connect('mongodb://'+ GLOBAL.db_uri);
var Schema = mongoose.Schema;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('models.js::opened insights-staging db with mongoose!');
});



var UserSchema = new Schema({
  name:  String,
  username: String,
  role: String,
  password: String,
  email: String,
  created: { type: Date, default: Date.now },
  last_login: { type: Date, default: Date.now }
}, { 
  autoIndex: false
});

var User = mongoose.model('user', UserSchema);
exports.User = User;


var InquirySchema = new Schema({
    title: String,
    description: String,
    updated_by: String,
    creator: String,
    sources: {
        type: Array,
        'default': []
    },
    collaborators: {
        type: Array,
        'default': []
    },
    visibility: String,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
}, { 
  autoIndex: false
});

var Inquiry = mongoose.model('inquiry', InquirySchema);
exports.Inquiry = Inquiry;


var ObjSchema = new Schema({
    type: String,//tumblr_post, instagram_photo, tweet, image, vide, quote, insight, etc.
    data: Schema.Types.Mixed,
    description: String,
    source_type: String,//feed, bookmarklet, another obj, etc.
    source_feed: String,//name of feed (eg. ifthisthenth-ey)
    source_obj: String,//id of object, feed, etc.
    source_url: String,//url to original source on the web
    source_filter_tag: String,//tag used to filter the source feed
    inquiry_id: String,//id of collection it belongs to
    source_timestamp: String,//create time from the original source (eg. date published on tumblr)
    fetched: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    relations: [{
      id: String,
      caption: String,
      order: Number,
      featured: Boolean,
      created: { type: Date, default: Date.now },
      updated: { type: Date, default: Date.now } 
    }]
}, { 
  autoIndex: false
});

var Obj = mongoose.model('obj', ObjSchema);
exports.Obj = Obj;


var FeedSchema = new Schema({
    type: String,
    title: String,
    source: String,
    creator: String,
    collaborators: {
        type: Array,
        'default': []
    },
    category: String,
    tags: {
        type: Array,
        'default': []
    },
    visibility: String,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    fetched: { type: Date, default: Date.now }
}, { 
  autoIndex: false
});

var Feed = mongoose.model('feed', FeedSchema);
exports.Feed = Feed;

