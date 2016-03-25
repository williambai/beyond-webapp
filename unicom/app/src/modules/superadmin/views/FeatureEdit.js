var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Backbone = require('backbone'),
    roleTpl = require('../templates/_entityPlatformFeature.tpl'),
	Feature = require('../models/PlatformFeature');
var PlatformAppCollection = require('../models/PlatformAppCollection');
var config = require('../conf');

Backbone.$ = $;

//** 模型
var Feature = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/features',
	defaults: {
	},
	validation: {
		name: {
			required: true,
			msg: '请输入名称'
		},
		nickname: {
			required: true,
			msg: '请输入编码(字母、_与数字的组合)'
		}
	},
});

//** 主视图
exports = module.exports = FormView.extend({

	el: '#featureForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new Feature({_id: options.id});
		var page = $(roleTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		if(this.model.isNew()){
			//get apps
			this.loadApps();
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
		callback && callback();
		return;
		
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
					appsView += '<input type="checkbox" name="app[]" value="'+ model.get('nickname') +'">&nbsp;'+ model.get('name') +'&nbsp;&nbsp;&nbsp;';
				});
				that.$('#apps').html(appsView);
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
		this.router.navigate('feature/index',{trigger: true, replace: true});
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
				var apps = that.model.get('app');
				_.each(apps, function(app){
					that.$('input[name="app[]"][value="'+ app +'"]').attr('checked', true);
				});
			});
		}else{
			//second fetch: submit
			this.router.navigate('feature/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		var that = this;
		this.$el.html(this.template({model: this.model.toJSON()}));
		var status = this.model.get('status');
		that.$('input[name="status"][value="'+ status +'"]').attr('checked',true);
		if(this.model.isNew()) this.$('.panel-title').text('新增资源');
		return this;
	},
});