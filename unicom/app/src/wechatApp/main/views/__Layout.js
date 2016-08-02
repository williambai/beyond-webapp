var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: 'body',

	initialize: function(options){
		this.appEvents = options.appEvents;

		this.$el.addClass('has-navbar-top');
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
		return this;
	}
});