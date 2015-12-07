var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    roleTpl = require('../templates/_entityRole.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var ListView = require('./_RoleList');
var AddView = require('./_RoleAdd');
var EditView = require('./_RoleEdit');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		var page = $(roleTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));

		this.addView = new AddView({
			el: '#content',
		});
		this.editView = new EditView({
			el: '#content',
		});
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
		this.addView.trigger('load');
	},

	editRole: function(){
		this.editView.id = 'id';
		this.editView.trigger('load');
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