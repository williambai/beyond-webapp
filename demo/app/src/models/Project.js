var Backbone = require('backbone');
var _ = require('underscore');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	url: '/projects',

	validate: function(attrs, options){
		var errors = {};
		if(attrs.name.length < 2){
			errors.name = '名称太短，取一个能代表项目的短语';
		}
		if(attrs.description.length < 20){
			errors.description = '描述过于简单，再多写点...';
		}
		if(!_.isEmpty(errors)) return errors;
	},
});