var Backbone = require('backbone');
var Status = require('./Status');

exports = module.exports = Backbone.Collection.extend({
	model: Status
});