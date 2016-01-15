var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    smsTpl = require('../templates/_entitySms.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var Sms = require('../models/PlatformSms');
var ListView = require('./_SmsList');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(smsTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addSms',
		'click .edit': 'editSms',
		'click .delete': 'removeSms',
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

	addSms: function(evt){
		this.router.navigate('sms/add',{trigger: true});
		return false;
	},

	editSms: function(evt){
		var $item = this.$(evt.currentTarget).parent().parent();
		var id = $item.attr('id');
		this.router.navigate('sms/edit/'+ id,{trigger: true});
		return false;
	},

	removeSms: function(evt){
		var $item = this.$(evt.currentTarget).parent().parent();
		var id = $item.attr('id');
		if(window.confirm('您确信要删除吗？')){
			var model = new Sms({_id: id});
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