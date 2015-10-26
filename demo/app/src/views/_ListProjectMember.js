var _ = require('underscore');
var ListView = require('./__ListView'),
    ItemView = require('./_ItemProjectMember'),
    ProjectMemberCollection = require('../models/ProjectMemberCollection');

exports = module.exports = ListView.extend({
	el: '#list',

	initialize: function(options){
		this.project = options.project;
		this.collection = new ProjectMemberCollection();
		this.collection.url = options.url;
		ListView.prototype.initialize.apply(this,options);
	},

	getNewItemView: function(model){
		return new ItemView({project: this.project, model: model});
	},

});