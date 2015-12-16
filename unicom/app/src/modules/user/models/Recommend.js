var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/recommends',
	defaults: {
		goods: {}
	},
	validation: {
		'mobile[]': {
			pattern: /^(186|185|156|131|130|155|132)\d{8}$/,
			msg: '请输入有效的联通手机号码'
		},

		// 'mobile': function(val, attr, computedState) {
		// 	console.log('1val=')
		// 	console.log(val)
		// 	console.log('1attr=')
		// 	console.log(attr)
		// 	console.log('1++++')
		// 	// console.log(computedState)
		// 	// console.log('----')
		// 	// if(_.isString(val)){
		// 	// 	if(!/^(186|185|156|131|130|155|132)\d{8}$/.test(val)){
		// 	// 		return '请输入有效的联通手机号码';
		// 	// 	}
		// 	// }
		// 	var mobiles;
		// 	mobiles = _.without(val || [], '');
		// 	console.log(mobiles);
		// 	if (_.isEmpty(mobiles)) {
		// 		console.log('1=====')
		// 		return '请至少输入一手机号';
		// 	} else {
		// 		console.log('1!!!!!!')
		// 		var invalid = false;
		// 		_.each(mobiles, function(mobile) {
		// 			if (!/^(186|185|156|131|130|155|132)\d{8}$/.test(mobile)) {
		// 				invalid = true;
		// 			}
		// 		});
		// 		if(invalid) return '请输入有效的联通手机号码111';
		// 	}
		// },
		// 'mobile[]': function(val,attr,computedState){
		// 	console.log('2val=')
		// 	console.log(val)
		// 	console.log('2attr=')
		// 	console.log(attr)
		// 	console.log('2++++')
		// 	// console.log(computedState)
		// 	// console.log('2----')
		// 	if(!/^(186|185|156|131|130|155|132)\d{8}$/.test(val)){
		// 		return '请输入有效的联通手机号码';
		// 	}
		// },
	}
});