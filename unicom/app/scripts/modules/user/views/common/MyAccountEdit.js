var _ = require('underscore');
var $ = require('jquery');
var	Backbone = require('backbone');
var	FormView = require('./__FormView');
var config = require('../../conf');

Backbone.$ = $;

//** 模型
var Account = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/accounts',

	defaults: {
		status: {},
	},

	validation: {
		'username': {
			required: true,
			msg: '请输入用户名'
		},
		'email': {
			pattern: /^(1\d{10}|[a-zA-Z0-9_\.]+@[a-zA-Z0-9-]+[\.a-zA-Z]+)$/,
			msg: '请输入有效的手机号码或电子邮件'
		},
		biography: {
			minLength: 5,
			msg: '字数太少了'
		},
	},
});

//** 主视图
exports = module.exports = FormView.extend({

	el: '#accountForm',
	template: _.template($('#tpl-account-edit').html()),

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new Account({_id: options.id});
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'keyup textarea': 'inputText',
		'click #send-file': 'showFileExplorer',
		'change input[type=file]': 'uploadAvatar',
		'submit form': 'submit',
		'click .cancel': 'cancel',
	},

	load: function() {
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	showFileExplorer: function(evt){
		this.$('input[type=file]').click();
		return false;
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

	uploadAvatar: function(evt) {
		var that = this;
		var formData = new FormData();
		formData.append('files', evt.currentTarget.files[0]);
		$.ajax({
			url: config.api.host + '/accounts/me?type=avatar',
			type: 'PUT',
			xhrFields: {
				withCredentials: true
			},
			data: formData,
			cache: false, //MUST be false
			processData: false, //MUST be false
			contentType: false, //MUST be false
		}).done(function(data) {
			var src = data.src;
			that.model.set('avatar', src);
			// console.log(data)
			that.$('img#avatar').attr('src', src);
		}).fail(function(err) {
			console.log(err);
		});
		return false;
	},

	submit: function() {
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
		
		var password = this.model.get('password');
		var cpassword = this.model.get('cpassword');
		if(password != cpassword){
			var error = '两次输入不一致';
			that.$('[name="cpassword"]').parent().addClass('has-error');
			that.$('[name="cpassword"]').parent().find('span.help-block').text(error);
			return false;			
		}
		if(!_.isEmpty(password) && password.length < 5){
			var error = '密码长度至少五位';
			that.$('[name="password"]').parent().addClass('has-error');
			that.$('[name="password"]').parent().find('span.help-block').text(error);
			return false;
		}
		if(_.isEmpty(password)){
			if(that.model.isNew()){
				var error = '新用户必须设置密码';
				that.$('[name="password"]').parent().addClass('has-error');
				that.$('[name="password"]').parent().find('span.help-block').text(error);
				return false;
			}else {
				this.model.unset('password',{silent: true});
				this.model.unset('cpassword',{silent: true});			
			}
		}

		// console.log(this.model.toJSON());
		this.model.save(this.model.changedAttributes(), {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},
	
	cancel: function(){
		this.router.navigate('profile/me',{trigger: true, replace: true});
		return false;
	},

	//fetch event: done
	done: function(response){
		if(!this.modelFilled){
			//first fetch: get model
			this.modelFilled = true;
			this.render();
		}else{
			//second fetch: submit
			this.router.navigate('profile/me',{trigger: true, replace: true});
		}
	},

	render: function() {
		this.$el.html(this.template({model:this.model.toJSON()}));
		this.$('img#avatar').attr('src', this.model.get('avatar'));
		return this;
	}
});