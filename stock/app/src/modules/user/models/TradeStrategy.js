var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/trade/strategies',

	defaults: {
		bid: {},
		params: {
			name: 'T0',
			buy_drawdown: 0,
			sell_drawdown: 0,
			method: 'eq',
		},
	},
	validation: {
		'name': {
			required: true,
			msg: '不能为空'
		},
		'symbol': {
			required: true,
			msg: '不能为空'
		},
		'params[name]': {
			required: true,
			msg: '不能为空'
		},
		'params[risk_h]': {
			range: [0, 100],
			msg: '必须为数字',
		},
		'params[risk_l]': {
			range: [0, 100],
			msg: '必须为数字',
		},
		'params[init_p]': {
			range: [0, 100],
			msg: '必须为数字',
		},
		'params[init_v]': {
			range: [1000, 10000],
			msg: '必须为数字',
		},
		'params[buy_lt]': {
			max: 10,
			msg: '必须为数字',
		},
		'params[buy_drawdown]': {
			range: [0, 10],
			msg: '必须为数字',
		},
		'params[sell_gt]': {
			max: 10,
			msg: '必须为数字',
		},
		'params[sell_drawdown]': {
			range: [0, 10],
			msg: '必须为数字',
		},
		'params[quantity]': {
			min: 1000,
			msg: '必须为数字',
		},
		'params[depth]': {
			range: [1, 10],
			msg: '必须为数字',
		},
		'params[times_max]': {
			min: 1,
			msg: '必须为数字',
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