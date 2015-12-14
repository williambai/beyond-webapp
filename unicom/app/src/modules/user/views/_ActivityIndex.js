var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    activityTpl = require('../templates/_entityActivity.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var ListView = require('./_ActivityList');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(activityTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .view': 'activityView',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
		var carousel =	setInterval(function(){
			var current = that.$('.carousel-inner .item.active');
			if(current.length == 0) return clearInterval(carousel);
			var next = that.$('.carousel-inner .item.active').next();
			if(next.length == 0) next = that.$('.carousel-inner .item')[0];
			$(next).addClass('active');
			$(current).removeClass('active');
			console.log('carousel running.');
		},5000);
		this.listView = new ListView({
			el: '#list',
		});
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},

	activityView: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('activity/view/'+ id,{trigger: true});
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