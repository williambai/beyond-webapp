var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	FormView = require('./__FormView'),
	accountTpl = require('../templates/_entityAccount.tpl'),
	Account = require('../models/Account');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = FormView.extend({

	el: '#accountForm',

	modelFilled: false,

	initialize: function(options) {
		var page = $(accountTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		this.model = new Account({_id: options.id});
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'keyup textarea': 'inputText',
		'click #send-file': 'showFileExplorer',
		'change input[type=file]': 'uploadAvatar',
		'submit form': 'submit',
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
		if(!_.isEmpty(password)){
			if(password.length < 5){
				console.log(password.length)
				var error = '密码长度至少五位';
				that.$('[name="password"]').parent().addClass('has-error');
				that.$('[name="password"]').parent().find('span.help-block').text(error);
				return false;
			}
			if(password != cpassword){
				var error = '两次输入不一致';
				that.$('[name="cpassword"]').parent().addClass('has-error');
				that.$('[name="cpassword"]').parent().find('span.help-block').text(error);
				return false;			
			}
		}else{
			this.model.unset('password',{silent: true});
			this.model.unset('cpassword',{silent: true});			
		}
		// console.log(this.model.toJSON());
		this.model.save(this.model.changedAttributes(), {
			xhrFields: {
				withCredentials: true
			},
		});
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
			window.location.hash = 'profile/me';
		}
	},

	render: function() {
		this.$el.html(this.template({model:this.model.toJSON()}));
		this.$('img#avatar').attr('src', this.model.get('avatar'));
		return this;
	}
});