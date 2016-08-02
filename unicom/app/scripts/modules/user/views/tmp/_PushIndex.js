var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    pushTpl = require('../templates/_entityPush.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var ListView = require('./_PushList');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(pushTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));

		this.on('load', this.load, this);
	},

	events: {
		'click #app': 'listApp',
		'click #activity': 'listEvent',
		'scroll': 'scroll',
		'click .view': 'pushView',
		'click .promote': 'promote',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.listView = new ListView({
			el: '#list',
		});
		this.listView.collection.url = config.api.host + '/channel/product/directs?type=category&category=APP';
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},

	listApp: function(){
		this.$('#g3').removeClass('btn-success').addClass('btn-default');
		this.$('#g2').removeClass('btn-default').addClass('btn-success');
		this.listView.trigger('refresh','type=category&category=APP');
		return false;
	},

	listEvent: function(){
		this.$('#g2').removeClass('btn-success').addClass('btn-default');
		this.$('#g3').removeClass('btn-default').addClass('btn-success');
		this.listView.trigger('refresh','type=category&category=EVENT');
		return false;
	},

	pushView: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('push/view/'+ id,{trigger: true});
		return false;
	},

	promote: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		window.location.href = config.api.host + '/sale/page/data/' + config.wechat.appid + '/' + id + '/' + this.router.account.id;
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