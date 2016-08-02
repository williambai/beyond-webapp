var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    layoutTemplate = require('../templates/__layout.tpl'),
    loadingTemplate = require('../templates/__loading.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: 'body',
	loaded: false,

	layoutTemplate: _.template(layoutTemplate),
	loadingTemplate: _.template(loadingTemplate),

	initialize: function(options){
		this.appEvents = options.appEvents;

		this.$el
			.addClass('has-navbar-top');
		this.appEvents.on('set:brand', this.updateBrand,this);
		this.on('load', this.load,this);
	},

	load: function(){
		this.loaded = true;
		this.render();
	},

	updateBrand: function(brand){
		this.$('.navbar-brand').text(brand || '');
	},

	render: function(){
		if(!this.loaded){
			this.$el.html(this.loadingTemplate());
		}else{
			this.$el.html(this.layoutTemplate());
		}
		return this;
	}
});