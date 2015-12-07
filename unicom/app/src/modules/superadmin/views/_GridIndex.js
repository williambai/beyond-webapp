var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    gridTpl = require('../templates/_entityGrid.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var ListView = require('./_GridList');
var AddView = require('./_GridAdd');
var EditView = require('./_GridEdit');
var SearchView = require('./_GridSearch');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		var page = $(gridTpl);
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
		'click .add': 'addGrid',
		'click .edit': 'editGrid',
		'click .delete': 'removeGrid',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.searchView = new SearchView({
			el: '#search',
		});
		this.listView = new ListView({
			el: '#list',
		});
		this.searchView.trigger('load');
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	addGrid: function(){
		this.addView.trigger('load');
	},

	editGrid: function(){
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