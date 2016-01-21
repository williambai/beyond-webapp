var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    accountTpl = require('../templates/_entityAccount.tpl'),
	Account = require('../models/Account');
var config = require('../conf');

var RoleCollection = require('../models/RoleCollection');
var PlatformAppCollection = require('../models/PlatformAppCollection');

exports = module.exports = FormView.extend({

	el: '#accountForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new Account({_id: options.id});
		var page = $(accountTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'blur input[type=text]': 'inputText',
		'keyup input[type=password]': 'inputText',
		'click #send-file': 'showFileExplorer',
		'change input[type=file]': 'uploadAvatar',
		'click .unbind': 'unbind',
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		if(this.model.isNew()){
			this.loadApps();
			this.loadRoles();
			this.modelFilled = true;
			return;
		}
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	loadApps: function(callback){
		var that = this;
		var platformAppCollection = new PlatformAppCollection();
		platformAppCollection.fetch({
			xhrFields: {
				withCredentials: true
			},
			success: function(collection){
				collection = collection || [];
				var appsView = '';
				collection.each(function(model){
					appsView += '<input type="checkbox" name="apps[]" value="'+ model.get('nickname') +'">&nbsp;'+ model.get('name') +'&nbsp;&nbsp;&nbsp;';
				});
				that.$('#apps').html(appsView);
				callback && callback();
			}
		});
	},

	loadRoles: function(callback){
		var that = this;
		var roleCollection = new RoleCollection();
		roleCollection.fetch({
			xhrFields: {
				withCredentials: true
			},
			success: function(collection){
				collection = collection || [];
				var rolesView = '';
				collection.each(function(model){
					rolesView += '<input type="checkbox" name="roles[]" value="'+ model.get('nickname') +'">&nbsp;'+ model.get('name') +'&nbsp;&nbsp;&nbsp;';
				});
				that.$('#roles').html(rolesView);
				callback && callback();
			}
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
			url: config.api.host + '/platform/accounts/'+ this.model.get('_id') +'?type=avatar',
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

	unbind: function(){
		var that = this;
		$.ajax({
			url: config.api.host + '/platform/accounts/'+ this.model.get('_id') +'?type=unbind',
			type: 'PUT',
			xhrFields: {
				withCredentials: true
			},
		}).done(function(data) {
			that.$('#wechat').html('<label for="openid">微信绑定：</label><span>未绑定</span>');
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
		var that = this;
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
		
		// console.log(this.model.attributes);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},
	

	cancel: function(){
		this.router.navigate('account/index',{trigger: true, replace: true});
		return false;
	},

	//fetch event: done
	done: function(response){
		var that = this;
		if(!this.modelFilled){
			//first fetch: get model
			this.modelFilled = true;
			this.render();
			//get apps
			this.loadApps(function(){
				//set apps
				var apps = that.model.get('apps');
				_.each(apps, function(app){
					that.$('input[name="apps[]"][value="'+ app +'"]').attr('checked', true);
				});
			});
			//get roles
			this.loadRoles(function(){
				//set roles
				var roles = that.model.get('roles');
				_.each(roles, function(role){
					that.$('input[name="roles[]"][value="'+ role +'"]').attr('checked', true);
				});
			});
		}else{
			//second fetch: submit
			this.router.navigate('account/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		var that = this;
		this.$el.html(this.template({model: this.model.toJSON()}));
		var openid = this.model.get('openid');
		if(openid){
			this.$('#wechat').html('<label for="openid">微信绑定：</label><button class="btn btn-danger unbind">解除绑定</button>');
		}else{
			this.$('#wechat').html('<label for="openid">微信绑定：</label><span>未绑定</span>');
		}
		var avatar = this.model.get('avatar');
		this.$('img#avatar').attr('src',avatar);
		var status = this.model.get('status');
		this.$('input[name="status"][value="'+ status +'"]').attr('checked',true);
		if(this.model.isNew()) this.$('input[name=email]').attr('readonly', false);
		if(this.model.isNew()) this.$('.panel-title').text('新增用户');
		var histories = this.model.get('histories');
		histories = _.sortBy(histories,'time');
		var historyView = '';
		_.each(histories,function(history){
			historyView += '<p>' + history.time + ': ' + history.message + '</p>';
		});
		that.$('#history').html(historyView);
		return this;
	},
});