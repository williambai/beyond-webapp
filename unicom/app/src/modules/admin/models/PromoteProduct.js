var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/promote/products',	
	defaults: {
		goods: {}
	},
	validation: {
	    'subject': {
			required: true,
	    	minLength: 5,
	    	msg:'长度至少五位'
	    },
	},
});