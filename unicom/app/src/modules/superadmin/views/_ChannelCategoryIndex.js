var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    channelCategoryTpl = require('../templates/_entityChannelCategory.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var ListView = require('./_ChannelCategoryList');
var AddView = require('./_ChannelCategoryAdd');
var EditView = require('./_ChannelCategoryEdit');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		var page = $(channelCategoryTpl);
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
		'click .add': 'addCategrory',
		'click .edit': 'editCategrory',
		'click .delete': 'removeCategrory',
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
	
	addCategrory: function(){
		this.addView.trigger('load');
	},

	editCategrory: function(){
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