var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	done: function(uri){
		console.log('search done is called. uri:' + uri);
	},

});