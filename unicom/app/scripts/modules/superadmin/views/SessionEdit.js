var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Backbone = require('backbone'),
    sessionTpl = require('../templates/_entityPlatformSession.tpl');
var config = require('../conf');
Backbone.$ = $;

//** 模型
var Session = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/sessions',
	validation: {
	},
});

exports = module.exports = FormView.extend({

	el: '#sessionForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new Session({_id: options.id});
		var page = $(sessionTpl);
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
		// console.log(this.model.attributes);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},

	cancel: function(){
		this.router.navigate('session/index',{trigger: true, replace: true});
		return false;
	},
	
	//fetch event: done
	done: function(response){
		var that = this;
		if(!this.modelFilled){
			//first fetch: get model
			this.modelFilled = true;
			this.render();
		}else{
			//second fetch: submit
			this.router.navigate('session/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		var that = this;
		// if(!this.model.isNew()){
			var session = this.model.get('session');
			try{
				session = JSON.parse(session);
				this.model.set('email',session.email);
				this.model.set('username',session.username);
				this.model.set('apps',session.apps);
				this.model.set('grants', _.keys(session.grant).join('; '));
			}catch(err){
				this.model.set('email',session);
			}			
		// }
		this.$el.html(this.template({model: this.model.toJSON()}));
		if(this.model.isNew()) this.$('.panel-title').text('新增功能');
		return this;
	},
});