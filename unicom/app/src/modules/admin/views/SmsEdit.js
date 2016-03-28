var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Backbone = require('backbone'),
    smsTpl = require('../templates/_entitySms.tpl');
var config = require('../conf');
Backbone.$ = $;

//** 模型
var Sms = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/smses',
	validation: {
		sender: {
			pattern: /^\d*$/,
			msg: '输入业务代码，仅数字部分',
		},
		receiver: {
			pattern: /^(\d{11}\D+)*\d{11}$/,
			msg: '11位手机号码，以;隔开',
		}
	}
});

exports = module.exports = FormView.extend({

	el: '#accountForm',

	modelFilled: false,

	initialize: function(options) {
		this.router = options.router;
		this.model = new Sms({_id: options.id});
		var page = $(smsTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'keyup textarea': 'inputText',
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
		this.router.navigate('sms/index',{trigger: true, replace: true});
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
			this.router.navigate('sms/index',{trigger: true, replace: true});
		}
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		if(this.model.isNew()){
			this.$('.panel-title').text('新增SMS');
			this.$('input').removeAttr('readonly');
			this.$('textarea').removeAttr('readonly');
		}else{
			var status = this.model.get('status');
			this.$('input[name="status"][value="'+ status +'"]').attr('checked',true);
		} 
		return this;
	},
});