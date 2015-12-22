var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    accountTpl = require('../templates/_entityAccount.tpl'),
	Account = require('../models/Account');
var config = require('../conf');

var RoleCollection = require('../models/RoleCollection');

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
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		if(this.model.isNew()){
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

		var that = this;
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
		this.$el.html(this.template({model: this.model.toJSON()}));
		var status = this.model.get('status');
		this.$('input[name="status"][value="'+ status +'"]').attr('checked',true);
		if(this.model.isNew()) this.$('.panel-title').text('新增用户');
		return this;
	},
});