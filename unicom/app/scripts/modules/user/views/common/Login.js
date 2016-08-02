var _ = require('underscore');
var Backbone = require('backbone');
var FormView = require('./__FormView');
var	$ = require('jquery');
var config = require('../../conf');
var validation = require('backbone-validation');
_.extend(Backbone.Model.prototype, validation.mixin);

//** 模型
var Login = Backbone.Model.extend({
	url: config.api.host + '/login',

	initialize: function(options) {
		if (options && options.appCode)
			this.url = this.url + '/' + options.appCode;
	},

	validation: {
		'email': {
			pattern: /^(1\d{10}|[a-zA-Z0-9_\.]+@[a-zA-Z0-9-]+[\.a-zA-Z]+)$/,
			msg: '请输入有效的手机号码或电子邮件'
		},
		'password': {
			required: true,
			minLength: 5,
			msg: '密码长度至少五位'
		}
	},
});

//** 主视图
exports = module.exports = FormView.extend({

	el: '#loginForm',
	template: _.template($('#tpl-login').html()),

	initialize: function(options) {
		this.router = options.router;
		this.appCode = options.appCode;
		this.appEvents = options.appEvents;
		this.model = new Login({
			appCode: this.appCode,
		});
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'blur input[type=text]': 'inputText',
		'keyup input[type=password]': 'inputText',
		'submit form': 'login',
		'click #wechatLogin': 'wechatLogin',
		'click #register': 'gotoRegister',
		'click #forgot': 'gotoForgot',
	},

	inputText: function(evt){
		var that = this;
		//clear error
		this.$(evt.currentTarget).parent().removeClass('has-error');
		this.$(evt.currentTarget).parent().find('span.help-block').empty();
		var arr = this.$(evt.currentTarget).serializeArray();
		_.each(arr,function(obj){
			var error = that.model.preValidate(obj.name,obj.value);
			if(error){
				//set error
				this.$(evt.currentTarget).parent().addClass('has-error');
				this.$(evt.currentTarget).parent().find('span.help-block').text(error);				
			}
		})
		return false;
	},

	login: function() {
		var that = this;
		//clear errors
		this.$('.form-group').removeClass('has-error');
		this.$('.form-group').find('span.help-block').empty();
		var arr = this.$('form').serializeArray();
		var errors = [];
		_.each(arr,function(obj){
			var error = that.model.preValidate(obj.name,obj.value);
			if(error){
				errors.push(error);
				that.$('[name="' + obj.name + '"]').parent().addClass('has-error');
				that.$('[name="' + obj.name + '"]').parent().find('span.help-block').text(error);
			}
		});
		if(!_.isEmpty(errors)) return false;
		//validate finished.

		var object = this.$('form').serializeJSON();
		this.model.set(object);
		// console.log(this.model.toJSON());
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},

	wechatLogin: function(){
		this.router.navigate('wechat/login',{trigger: true,replace: true});
		return false;
	},

	gotoRegister: function() {
		this.router.navigate('register',{trigger: true,replace: true});
		return false;
	},
	gotoForgot: function() {
		this.router.navigate('forgotpassword',{trigger: true,replace: true});
		return false;
	},

	done: function(data) {
		this.appEvents.trigger('logined',data);
		this.router.navigate('index',{trigger: true,replace: true});
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
		return this;
	},
});