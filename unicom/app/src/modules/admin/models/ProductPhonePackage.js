var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: function(){
		return config.api.host + '/product/phone/'+ this.get('pid') + '/packages';
	},	
	defaults: {
		goods: {}
	},
	validation: {
	    'package[name]': {
	    	minLength: 2,
	    	msg:'长度至少两位'
	    },
	    'package[goods][id]': {
			required: true,
			msg: '请选择一个物料'
	    }
	},

});