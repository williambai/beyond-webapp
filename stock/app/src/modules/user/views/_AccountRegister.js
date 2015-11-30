var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Register = require('../models/Register');
var accountTpl = require('../templates/_entityAccount.tpl');

exports = module.exports = FormView.extend({

	el: '#registerForm',

	initialize: function(options) {
		var page = $(accountTpl);
		var registerTemplate = $('#registerTemplate', page).html();
		this.template = _.template(_.unescape(registerTemplate || ''));
		var registerSuccessTemplate = $('#registerSuccessTemplate', page).html();
		this.successTemplate = _.template(_.unescape(registerSuccessTemplate || ''));
		this.model = new Register();
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'renderInputInvalid',
		'blur input[type=text]': 'renderInputInvalid',
		'keyup input[type=password]': 'renderInputInvalid',
		'submit form': 'register',
		'swipeleft': 'swipeToLoginForm',
	},

	register: function() {
		var that = this;
		var arr = this.$('form').serializeArray();
		arr.forEach(function(item) {
			that.model.set(item.name, item.value);
		});
		// console.log(this.model.attributes);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},

	swipeToLoginForm: function() {
		window.location.hash = 'login';
		return false;
	},

	validate: function(name, val) {
		var error;
		switch (name) {
			case 'username':
				if (!/^([a-zA-Z0-9_-])+$/.test(val)) {
					error = {
						name: 'username',
						message: '用户名不合法'
					};
				}
				break;
			case 'email':
				if (!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(val))) {
					error = {
						name: 'email',
						message: '不是有效的电子邮件',
					};
				}
				break;
			case 'password':
				if (val.length < 5) {
					error = {
						name: 'password',
						message: '密码长度不正确',
					};
				}
				break;
			case 'cpassword':
				var password = this.$('input[name=password]').val();
				console.log(password)
				console.log(val)
				if (val != password) {
					error = {
						name: 'cpassword',
						message: '两次输入不一致',
					};
				}
				break;
			default:
				break;
		}
		if (!_.isEmpty(error)) return error;
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