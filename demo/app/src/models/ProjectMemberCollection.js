var Backbone = require('backbone');
var ProjectMember = require('./ProjectMember');

exports = module.exports = Backbone.Collection.extend({
	model: ProjectMember
});