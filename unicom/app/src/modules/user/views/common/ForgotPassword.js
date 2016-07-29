var _ = require('underscore');
var $ = require('jquery');
var	Backbone = require('backbone');
var	FormView = require('./__FormView');
var config = require('../../conf');

//** 模型
var ForgotPassword = Backbone.Model.extend({

	url: config.api.host + '/forgotPassword',

	validation: {
		'email': {
			required: true,
			pattern: /^(1\d{10}|[a-zA-Z0-9_\.]+@[a-zA-Z0-9-]+[\.a-zA-Z]+)$/,
			msg: '请输入有效的手机号码或电子邮件'
		},
	},
});

//** 主视图
exports = module.exports = FormView.extend({

	el: '#forgotPasswordForm',
	template: _.template($('#tpl-forgot-password').html()),
	successTemplate: _.template($('#tpl-forgot-password-success').html()),

	initialize: function(options) {
		this.router = options.router;
		this.model = new ForgotPassword();
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'submit form': 'forgotPassword',
		'click #login': 'gotoLogin',
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

	forgotPassword: function() {
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

		var object = this.$('form').serializeJSON();
		this.model.set(object);
		// console.log(this.model.attributes);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},

	gotoLogin: function() {
		this.router.navigate('login', {
			trigger: true,
			replace: true
		});
		return false;
	},

	done: function() {
		this.$el.html(this.successTemplate());
	},
	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
		return this;
	},
});