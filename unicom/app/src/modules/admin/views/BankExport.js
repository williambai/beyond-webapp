var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Backbone = require('backbone'),
    bankTpl = require('../templates/_entityBank.tpl');
var config = require('../conf');

Backbone.$ = $;

//** 模型
var Bank = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/bank',	
	defaults: {
	},
	validation: {
	    'name': {
	    	minLength: 2,
	    	msg:'长度至少两位'
	    },
	    'barcode': {
			required: true,
			msg: '请输入运营商系统的物料号'
	    }
	},
});

//** 主页面
exports = module.exports = FormView.extend({

	el: '#exportForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new (Backbone.Model.extend({}));
		var page = $(bankTpl);
		var exportTemplate = $('#exportTemplate', page).html();
		this.template = _.template(_.unescape(exportTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
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
		window.location.href = config.api.host + '/protect/finance/banks?' + query;
		return false;
	},

	cancel: function() {
		this.router.navigate('bank/index', {
			trigger: true,
			replace: true
		});
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
			this.router.navigate('bank/index', {
				trigger: true,
				replace: true
			});
		}
	},

	render: function() {
		var that = this;
		this.$el.html(this.template({model: this.model.toJSON()}));
        var rows = [{
            name: '序号',
            description: '可以为空'
        }, {
            name: '用户姓名'
        }, {
            name: '手机号码'
        }, {
            name: '银行卡姓名',
            description: ''
        }, {
            name: '银行卡号码',
            description: '',
        }, {
            name: '银行卡有效期',
            description: '如，2019-12',
        }, {
            name: '身份证号码',
            description: '银行卡实名制',
        }, {
            name: '银行名称',
            description: '',
        }, {
            name: '银行代码',
            description: ''
        }, {
            name: '银行地址',
            description: '',
        }];
        rows.forEach(function(row, index) {
            this.$('tbody').append('<tr><td>' + (1 + index) + '</td><td>' + row.name + '</td><td>' + (row.description ? row.description : '') + '</td></tr>');
        });
		return this;
	},
});