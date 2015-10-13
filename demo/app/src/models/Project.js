var Backbone = require('backbone');
var _ = require('underscore');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	url: '/projects',
	
	default: {
		isOwner: false,
	},

	validate: function(attrs, options){
		var errors = [];
		if(attrs.name.length < 2){
			errors.push({
				name: 'name',
				message: '名称太短，取一个能代表项目的短语',
			});
		}
		if(attrs.description.length < 20){
			errors.push({
				name: 'description',
				message: '描述过于简单，再多写点...',
			});
		}
		if(!_.isEmpty(errors)) return errors;
	},
});