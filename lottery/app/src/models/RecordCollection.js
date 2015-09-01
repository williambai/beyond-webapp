var Backbone = require('backbone');
var Record = require('./Record');

exports = module.exports = Backbone.Collection.extend({
	model: Record,

});