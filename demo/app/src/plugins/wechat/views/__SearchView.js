var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	initialize: function(options){
		this.on('load', this.load, this);
	},

	load: function(){
		this.render();
	},

	done: function(query){
		console.log('search done is called. query:' + query);
	},

	render: function(){
		return this;
	},

});