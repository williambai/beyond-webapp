var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    loadingTemplate = require('../../assets/templates/loading.tpl');


Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: 'body',

	loaded: false,
	initialize: function(options){
		this.find('#content').html(loadingTemplate());
		this.appEvents = options.appEvents;
		this.appEvents.on('set:brand', this.updateBrand,this);
	},

	events: {
	},

	updateBrand: function(brand){
		this.$('.navbar-brand').text(brand || '');
	},

	render: function(){
		return this;
	}
});
