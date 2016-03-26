var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Backbone = require('backbone'),
    accountTpl = require('../templates/_entityAccount.tpl');
var config = require('../conf');

Backbone.$ = $;

var RoleCollection = require('../models/RoleCollection');
var PlatformAppCollection = require('../models/PlatformAppCollection');

//** 模型
var Account = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/accounts',
	defaults: {
		apps: [],
		roles: [],
		department: {},
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
	},
	
});

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
		'keyup input[name="department[name]"]': 'getDepartments',
		'click .department': 'selectDepartment',
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
			url: config.api.host + '/protect/accounts/'+ this.model.get('_id') +'?type=avatar',
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