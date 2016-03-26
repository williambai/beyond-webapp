var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    roleTpl = require('../templates/_entityRole.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var Role = require('../models/Role');
var ListView = require('./_RoleList');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(roleTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addRole',
		'click .edit': 'editRole',
		'click .delete': 'removeRole',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.listView = new ListView({
			el: '#list',
		});

		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	addRole: function(){
		this.router.navigate('role/add',{trigger: true});
		return false;
	},

	editRole: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('role/edit/'+ id,{trigger: true});
		return false;
	},

	removeRole: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new Role({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
		return false;
	},

	render: function() {
		if (!this.loaded) {
			this.$el.html(this.loadingTemplate());
		} else {
			this.$el.html(this.template());
		}
		return this;
	},
});