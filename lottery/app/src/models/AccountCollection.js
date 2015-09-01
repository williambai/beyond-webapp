var Backbone = require('backbone');
var Account = require('./Account');

exports = module.exports = Backbone.Collection.extend({
	model: Account,

});