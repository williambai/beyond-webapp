var Backbone = require('backbone');
var Project = require('./Project');

exports = module.exports = Backbone.Collection.extend({
	model: Project
});