var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	TradingStrategy = require('../models/TradingStrategy');

exports = module.exports = FormView.extend({

	el: '#strategyForm',

	initialize: function(options) {
		this.model = new TradingStrategy();
		if(options.symbol){
			console.log('+++++')
			this.model.url = this.model.url + '/' + options.symbol;
			this.model.fetch({
				xhrFields: {
					withCredentials: true
				},
			});
		}
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'register',
	},

	register: function() {
		var that = this;
		//clean errors
		that.$('.form-group').removeClass('has-error');
		that.$('.form-group span.help-block').empty();
		//set model
		this.model.set('symbol', $('input[name=symbol]').val());
		this.model.set('stock', {
			name: $('input[name=stock_name').val(),
			code: $('input[name=stock_code').val(),
		});
		this.model.set('params', {
			name: $('input[name=name').val(),
			description: $('input[name=description').val(),
			init_p: $('input[name=init_p]').val(),
			init_v: $('input[name=init_v]').val(),
			risk_h: $('input[name=risk_h]').val(),
			risk_l: $('input[name=risk_l]').val(),
			buy_lt: $('input[name=but_lt]').val(),
			sell_gt: $('input[name=sell_gt]').val(),
			quantity: $('input[name=quantity]').val(),
			times_max: $('input[name=times_max]').val(),
			depth: $('input[name=depth]').val(),
			method: $('input[name=method]').val(),
		});
		var status_code = $('input[name=status]:checked').val() || 0;
		var status_message = status_code == 1 ? '正常交易' : '停止交易';
		this.model.set('status', {
			code: status_code,
			message: status_message,
		});

		if (this.model.isValid()) {
			var xhr = this.model.save(null, {
				xhrFields: {
					withCredentials: true
				},
			});
			if (xhr) {
				xhr
					.success(function(data) {
						if (!!data.code) {
							if (data.code == 11000) {
								that.$('#error').html('<div class="alert alert-danger">' + '该邮箱已注册' + '</div>');
							} else {
								that.$('#error').html('<div class="alert alert-danger">' + data.errmsg + '</div>');
							}
							that.$('#error').slideDown();
							return;
						}
						//update UI
						that.done();
					})
					.error(function(xhr) {
						that.$('#error').html('<div class="alert alert-danger">' + xhr.status + ': ' + xhr.responseText + '</div>');
						that.$('#error').slideDown();
					});
			}
		}
		return false;
	},

});