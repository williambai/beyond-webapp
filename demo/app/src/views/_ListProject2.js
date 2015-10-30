var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    ListView = require('./__ListView'),
    projectItemTemplate = require('../templates/_itemProject2.tpl'),
    ProjectCollection = require('../models/ProjectCollection');
var config = require('../conf');

exports = module.exports = ListView.extend({

	el: '#project-widget',

	initialize: function(options){
		this.socketEvents = options.socketEvents;
		this.collection = new ProjectCollection();
		this.collection.url = options.url;
		ListView.prototype.initialize.apply(this,options);
	},

	getNewItemView: function(model){
		var ItemView = Backbone.View.extend({
			render: function(){
				this.$el.html(projectItemTemplate(this.model.toJSON()));
				return this;
			},
		});
		return new ItemView({model:model});
	},

});