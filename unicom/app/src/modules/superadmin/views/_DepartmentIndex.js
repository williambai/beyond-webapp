var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    deparmentTpl = require('../templates/_entityDepartment.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var ListView = require('./_DepartmentList');
var AddView = require('./_DepartmentAdd');
var EditView = require('./_DepartmentEdit');
var SearchView = require('./_DepartmentSearch');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		var page = $(deparmentTpl);
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
		'click .add': 'addDepartment',
		'click .edit': 'editDepartment',
		'click .delete': 'removeDepartment',
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
	
	addDepartment: function(){
		this.addView.trigger('load');
	},

	editDepartment: function(){
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