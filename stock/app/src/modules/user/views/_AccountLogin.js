var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Login = require('../models/Login');
var accountTpl = require('../templates/_entityAccount.tpl');

exports = module.exports = FormView.extend({

	el: '#loginForm',

	initialize: function(options) {
		var page = $(accountTpl);
		var loginTemplate = $('#loginTemplate', page).html();
		this.template = _.template(_.unescape(loginTemplate || ''));
		this.appEvents = options.appEvents;
		this.model = new Login();
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'renderInputInvalid',
		'blur input[type=text]': 'renderInputInvalid',
		'keyup input[type=password]': 'renderInputInvalid',
		'submit form': 'login',
		'swiperight': 'toRegisterForm',
	},

	login: function() {
		var that = this;
		var arr = this.$('form').serializeArray();
		arr.forEach(function(item){
			that.model.set(item.name,item.value);
		});
		// console.log(this.model.changed);
		if (this.model.hasChanged()) {
			this.model.save(this.model.changed, {
				xhrFields: {
					withCredentials: true
				},
			});
		}
		return false;
	},

	toRegisterForm: function() {
		window.location.hash = 'register';
		return false;
	},

	validate: function(name, val) {
		var error;
		switch (name) {
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
			default:
				break;
		}
		if(!_.isEmpty(error))return error;
	},

	done: function(data) {
		this.appEvents.trigger('logined',data);
		window.location.hash = 'index';
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
		return this;
	},
});