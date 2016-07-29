var _ = require('underscore');
var FormView = require('./__FormView');
var	$ = require('jquery');
var	Backbone = require('backbone');
var config = require('../conf');

Backbone.$ = $;

//** 模型
var ChangePass = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/private/account/changepass',
	validation: {
		'old_password': {
			required: true,
			msg: '请输入原密码'
		},
	}
});

exports = module.exports = FormView.extend({

	el: '#accountForm',
	template: _.template($('#tpl-me-account').html()),
	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new ChangePass();
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		if(this.model.isNew()){
			this.modelFilled = true;
			return;
		}
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
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
				var error = '用户必须设置密码';
				that.$('[name="password"]').parent().addClass('has-error');
				that.$('[name="password"]').parent().find('span.help-block').text(error);
				return false;
			}else {
				this.model.unset('password',{silent: true});
				this.model.unset('cpassword',{silent: true});			
			}
		}
		// console.log(this.model.attributes);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},
	

	cancel: function(){
		this.router.navigate('me/index',{trigger: true, replace: true});
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
			this.router.navigate('me/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});