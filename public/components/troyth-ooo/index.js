var $ = require("component/jquery");
var _ = require("component/underscore");
var Backbone = require("brighthas/backbone");
var markd = require("component/marked");



/*
 *	SensualObject
*/

var SensualObject = Backbone.Model.extend({
	idAttribute: "_id"//for mongo db
});

var SensualQualities = Backbone.Model.extend({
});
