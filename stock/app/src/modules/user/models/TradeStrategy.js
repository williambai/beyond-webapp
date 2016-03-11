var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/trade/strategies',

	defaults: {
		bid: {},
		params: {},
	},
	validation: {
		'symbol': {
			required: true,
			msg: '不能为空'
		},
		'name': {
			required: true,
			msg: '不能为空'
		},
	},

	// validate: function(model, options){
	// 	var errors = [];
	// 	if(model.symbol.length < 1){
	// 		errors.push({
	// 			name: 'symbol',
	// 			message: '不能为空',
	// 		})
	// 	}
	// 	if(model.stock.name.length < 1){
	// 		errors.push({
	// 			name: 'stock[name]',
	// 			message: '不能为空',
	// 		})
	// 	}
	// 	if(model.stock.code.length < 1){
	// 		errors.push({
	// 			name: 'stock[code]',
	// 			message: '不能为空',
	// 		})
	// 	}
	// 	if(!/^\d+(\.\d+)?$/.test(model.params.risk_h)){
	// 		errors.push({
	// 			name: 'params[risk_h]',
	// 			message: '必须为数字',
	// 		})
	// 	}
	// 	if(!/^\d+(\.\d+)?$/.test(model.params.risk_l)){
	// 		errors.push({
	// 			name: 'params[risk_l]',
	// 			message: '必须为数字',
	// 		})
	// 	}
	// 	if(!/^\d+(\.\d+)?$/.test(model.params.init_p)){
	// 		errors.push({
	// 			name: 'params[init_p]',
	// 			message: '必须为数字',
	// 		})
	// 	}
	// 	if(!/^\d+(\.\d+)?$/.test(model.params.init_v)){
	// 		errors.push({
	// 			name: 'params[init_v]',
	// 			message: '必须为数字',
	// 		})
	// 	}
	// 	if(!/^\d+(\.\d+)?$/.test(model.params.buy_lt)){
	// 		errors.push({
	// 			name: 'params[buy_lt]',
	// 			message: '必须为数字',
	// 		})
	// 	}
	// 	if(!/^\d+(\.\d+)?$/.test(model.params.sell_gt)){
	// 		errors.push({
	// 			name: 'params[sell_gt]',
	// 			message: '必须为数字',
	// 		})
	// 	}
	// 	if(!/^\d+(\.\d+)?$/.test(model.params.quantity)){
	// 		errors.push({
	// 			name: 'params[quantity]',
	// 			message: '必须为数字',
	// 		})
	// 	}
	// 	if(!/^\d+(\.\d+)?$/.test(model.params.depth)){
	// 		errors.push({
	// 			name: 'params[depth]',
	// 			message: '必须为数字',
	// 		})
	// 	}
	// 	if(!/^\d+(\.\d+)?$/.test(model.params.times_max)){
	// 		errors.push({
	// 			name: 'params[times_max]',
	// 			message: '必须为数字',
	// 		})
	// 	}
	// 	if(!_.isEmpty(errors)) return errors;
	// },	
});