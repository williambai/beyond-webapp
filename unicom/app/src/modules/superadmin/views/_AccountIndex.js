var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    acccountTpl = require('../templates/_entityAccount.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var Account = require('../models/Account');
var SearchView = require('./_AccountSearch');
var ListView = require('./_AccountList');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(acccountTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));

		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addAccount',
		'click .edit': 'editAccount',
		'click .delete': 'removeAccount',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
		this.listView = new ListView({
			el: '#list',
		});
		this.listView.trigger('load');
		this.searchView = new SearchView({
			el: '#search',
		});
		this.searchView.done = function(query){
			that.listView.trigger('refresh', query);
		};
		this.searchView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	addAccount: function(){
		this.router.navigate('account/add',{trigger: true});
		return false;
	},

	editAccount: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('account/edit/'+ id,{trigger: true});
		return false;
	},

	removeAccount: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new Account({_id: id});
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