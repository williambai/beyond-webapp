var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Register = require('../models/Register');
var accountTpl = require('../templates/_entityMyAccount.tpl');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#registerForm',

	initialize: function(options) {
		this.router = options.router;
		this.appCode = options.appCode;
		var page = $(accountTpl);
		var registerTemplate = $('#registerTemplate', page).html();
		this.template = _.template(_.unescape(registerTemplate || ''));
		var registerSuccessTemplate = $('#registerSuccessTemplate', page).html();
		this.successTemplate = _.template(_.unescape(registerSuccessTemplate || ''));
		this.model = new Register({
			appCode: this.appCode,
		});
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'blur input[type=text]': 'inputText',
		'keyup input[type=password]': 'inputText',
		'keyup input[name="department[name]"]': 'getDepartments',
		'click .department': 'selectDepartment',
		'click #refreshCaptcha': 'refreshCaptcha',
		'submit form': 'register',
		'click #login': 'gotoLogin',
	},

	inputText: function(evt){
		var that = this;
		//clear error
		this.$(evt.currentTarget).closest('.form-group').removeClass('has-error');
		this.$(evt.currentTarget).closest('.form-group').find('span.help-block').empty();
		var arr = this.$(evt.currentTarget).serializeArray();
		_.each(arr,function(obj){
			var error = that.model.preValidate(obj.name,obj.value);
			if(error){
				//set error
				this.$(evt.currentTarget).closest('.form-group').addClass('has-error');
				this.$(evt.currentTarget).closest('.form-group').find('span.help-block').text(error);				
			}
		})
		return false;
	},

	refreshCaptcha: function(evt){
		var that = this;
		//** 校验手机号码有效性
		var keyup = that.$('input[name=email]').keyup();
		if(that.$(evt.currentTarget).closest('.form-group').hasClass('has-error')) return false;
		//** 获取手机号码
		var mobile = that.$('input[name=email]').val();
		//** 发送手机验证码
		$.ajax({
			url: config.api.host + '/register/captcha',
			type: 'POST',
			xhrFields: {
				withCredentials: true
			},
			data: {
				mobile: mobile
			},
		}).done(function(data){
			//** 服务器端返回业务逻辑错误的处理
			if(data && data.code){
				return false;
			}
			var func = function(i){
				if(i < 0) return that.$('#captcha').html('<a href="#" id="refreshCaptcha">获取验证码</a>');
				that.$('#captcha').html('<i class="fa fa-spinner fa-spin"></i>&nbsp;' + i + '&nbsp;秒');
				setTimeout(function(){
					func(--i);
				},1000);
			};
			func(60);
		});
		return false;
	},

	getDepartments: function(evt){
		this.$('#departments').empty();
		this.$('input[name="department[address]"]').val('');
		var that = this;
		var searchStr = this.$(evt.currentTarget).val() || '';
		if(searchStr.length >1){
			$.ajax({
				url: config.api.host + '/protect/departments?type=search&searchStr=' + searchStr,
				type: 'GET',
				xhrFields: {
					withCredentials: true
				},
			}).done(function(data){
				data = data || [];
				var departmentsView = '<ul>';
				data.forEach(function(item){
					departmentsView += '<li class="department" id="'+ item._id +'" addr="'+ item.address +'" name="'+ item.name +'">' + item.path + '</li>';
				});
				departmentsView += '</ul>';
				that.$('#departments').html(departmentsView);
			});				
		}
		return false;
	},

	selectDepartment: function(evt){
		var id = this.$(evt.currentTarget).attr('id');
		var path = this.$(evt.currentTarget).text();
		var name = this.$(evt.currentTarget).attr('name');
		var address = this.$(evt.currentTarget).attr('addr');
		this.$('input[name="department[name]"]').val(name);
		this.$('input[name="department[path]"]').val(path);
		this.$('input[name="department[address]"]').val(address);
		this.$('#departments').empty();
		return false;
	},

	register: function() {
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
				that.$('[name="' + obj.name + '"]').closest('.form-group').addClass('has-error');
				that.$('[name="' + obj.name + '"]').closest('.form-group').find('span.help-block').text(error);
			}
		});
		if(!_.isEmpty(errors)) return false;
		//validate finished.

		var object = this.$('form').serializeJSON();
		this.model.set(object);
		// console.log(this.model.toJSON());
		var password = this.model.get('password');
		var cpasword = this.model.get('cpassword');
		if(password != cpasword){
			var error = '两次输入不同';
			that.$('[name="cpassword"]').closest('.form-group').addClass('has-error');
			that.$('[name="cpassword"]').closest('.form-group').find('span.help-block').text(error);			
			return false;
		}
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},

	gotoLogin: function() {
		this.router.navigate('login',{trigger: true,replace: true});
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