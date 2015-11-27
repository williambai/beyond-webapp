var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    strategyTpl = require('../templates/_entityStrategy.tpl'),
	TradingStrategy = require('../models/TradingStrategy');

exports = module.exports = FormView.extend({

	el: '#strategyForm',

	initialize: function(options) {
		var page = $(strategyTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		this.model = new TradingStrategy();
		this.model._id = options.id;
		FormView.prototype.initialize.apply(this, options);
		this.model.on('sync', this.render, this);
	},

	events: {
		'submit form': 'submit',
	},

	load: function(){
		if(this.model._id){
			this.model.url = this.model.url + '/' + this.model._id;
			this.model.fetch({
				xhrFields: {
					withCredentials: true
				},
			});
		}else{
			this.render();
		}
	},

	submit: function() {
		var that = this;
		//clean errors
		that.$('.form-group').removeClass('has-error');
		that.$('.form-group span.help-block').empty();
		//set model
		this.model.set('symbol', that.$('input[name=symbol]').val());
		this.model.set('stock', {
			name: that.$('input[name=stock_name]').val(),
			code: that.$('input[name=stock_code]').val(),
		});
		this.model.set('params', {
			name: that.$('input[name=name]').val(),
			description: that.$('input[name=description]').val(),
			init_p: that.$('input[name=init_p]').val(),
			init_v: that.$('input[name=init_v]').val(),
			risk_h: that.$('input[name=risk_h]').val(),
			risk_l: that.$('input[name=risk_l]').val(),
			buy_lt: that.$('input[name=buy_lt]').val(),
			sell_gt: that.$('input[name=sell_gt]').val(),
			quantity: that.$('input[name=quantity]').val(),
			times_max: that.$('input[name=times_max]').val(),
			depth: that.$('input[name=depth]').val(),
			method: that.$('input[name=method]').val(),
		});
		var status_code = that.$('input[name=status]:checked').val() || 0;
		var status_message = status_code == 1 ? '正常交易' : '停止交易';
		this.model.set('status', {
			code: status_code,
			message: status_message,
		});
		console.log('+++++')
		var attrs = this.model.changed;
		console.log(attrs);
		return false;

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
	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});