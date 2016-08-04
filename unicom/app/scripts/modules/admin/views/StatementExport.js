var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Backbone = require('backbone'),
    statementTpl = require('../templates/_entityStatement.tpl');
var config = require('../conf');

Backbone.$ = $;

//** 模型
var Bonus = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/finance/statements',
});

//** 主视图
exports = module.exports = FormView.extend({

	el: '#exportForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new (Backbone.Model.extend({}));
		var page = $(statementTpl);
		var exportTemplate = $('#statementExportTemplate', page).html();
		this.template = _.template(_.unescape(exportTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function() {
		if (this.model.isNew()) {
			this.modelFilled = true;
			return;
		}
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	inputText: function(evt) {
		var that = this;
		//clear error
		this.$(evt.currentTarget).parent().removeClass('has-error');
		this.$(evt.currentTarget).parent().find('span.help-block').empty();
		var arr = this.$(evt.currentTarget).serializeArray();
		_.each(arr, function(obj) {
			var error = that.model.preValidate(obj.name, obj.value);
			if (error) {
				//set error
				this.$(evt.currentTarget).parent().addClass('has-error');
				this.$(evt.currentTarget).parent().find('span.help-block').text(error);
			}
		})
		return false;
	},

	submit: function() {
		var that = this;
		//clear errors
		this.$('.form-group').removeClass('has-error');
		this.$('.form-group').find('span.help-block').empty();
		var arr = this.$('form').serializeArray();
		var errors = [];
		_.each(arr, function(obj) {
			var error = that.model.preValidate(obj.name, obj.value);
			if (error) {
				errors.push(error);
				that.$('[name="' + obj.name + '"]').parent().addClass('has-error');
				that.$('[name="' + obj.name + '"]').parent().find('span.help-block').text(error);
			}
		});
		if (!_.isEmpty(errors)) return false;
		//validate finished.

		var query = this.$('form').serialize();
		//download file
		window.location.href = config.api.host + '/protect/finance/statements?' + query;
		return false;
	},

	cancel: function() {
		window.history.back();
		return false;
	},

	//fetch event: done
	done: function(response) {
		var that = this;
		if (!this.modelFilled) {
			//first fetch: get model
			this.modelFilled = true;
			this.render();

		} else {
			//second fetch: submit
			this.router.navigate('statement/index', {
				trigger: true,
				replace: true
			});
		}
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
		var columns = [{
                header: '账期',
                key: 'month',
                width: 10
            }, {
                header: '城市',
                key: 'city',
                width: 10,
            }, {
                header: '用户ID',
                key: 'userCode',
                width: 10,
            }, {
                header: '号码',
                key: 'mobile',
                width: 20,
            }, {
                header: '当前套餐编码',
                key: 'mainProductCode',
                width: 10,
            }, {
                header: '当前套餐名称',
                key: 'mainProductName',
                width: 10,
            }, {
                header: '入网套餐编码',
                key: 'originProductCode',
                width: 10,
            }, {
                header: '入网套餐名称',
                key: 'originproductName',
                width: 10,
            }, {
                header: '入网时间',
                key: 'originTime',
                width: 15,
             }, {
                header: '发展人编码',
                key: 'vandorCode',
                width: 20,
            }, {
                header: '发展人名称',
                key: 'vandorName',
                width: 20,
            }, {
                header: '发展渠道编码',
                key: 'vandorChannelCode',
                width: 20,
            }, {
                header: '发展渠道名称',
                key: 'vandorChannelName',
                width: 10,
            }, {
                header: '支付渠道编码',
                key: 'paymentChannelCode',
                width: 10,
            }, {
                header: '支付渠道名称',
                key: 'paymentChannelName',
                width: 20,
            }, {
                header: '政策名称',
                key: 'policyName',
                width: 20,
            }, {
                header: '受理时间',
                key: 'createDate',
                width: 10,
            }, {
                header: '佣金类型',
                key: 'bonusType',
                width: 10,
            }, {
                header: '佣金净额',
                key: 'bonusNet',
                width: 10,
            }, {
                header: '佣金税额',
                key: 'bonusTax',
                width: 10,
            }, {
                header: '佣金总额',
                key: 'bonusTotal',
                width: 10,
            }, {
                header: '增值业务产品编码',
                key: 'productCode',
                width: 20,
            }, {
                header: '增值业务产品名称',
                key: 'productName',
                width: 20,
            }, {
                header: '营业员姓名',
                key: 'sellerName',
                width: 10,
            }, {
                header: '营业员手机',
                key: 'sellerMobile',
                width: 10,
            }, {
                header: '更新时间',
                key: 'lastupdatetime',
                width: 10,
            }];
        columns.forEach(function(row, index) {
            this.$('tbody').append('<tr><td>' + (1 + index) + '</td><td>' + row.header + '</td><td>' + (row.description ? row.description : '') + '</td></tr>');
        });
        return this;
	},
});