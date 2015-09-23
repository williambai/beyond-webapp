var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	callback: function(){
		console.log('form callback is called....');
	},

});