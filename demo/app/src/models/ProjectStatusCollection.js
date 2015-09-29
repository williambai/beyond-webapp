var Backbone = require('backbone');
var ProjectStatus = require('./ProjectStatus');

exports = module.exports = Backbone.Collection.extend({
	model: ProjectStatus
});