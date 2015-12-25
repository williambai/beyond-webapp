var _ = require('underscore');
var Backbone = require('backbone');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Login = require('../models/Login');
var accountTpl = require('../templates/_entityMyAccount.tpl');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#loginForm',

	initialize: function(options) {
		this.router = options.router;
		this.appCode = options.appCode;
		var page = $(accountTpl);
		var loginTemplate = $('#login2Template', page).html();
		this.template = _.template(_.unescape(loginTemplate || ''));
		this.appEvents = options.appEvents;
		this.model = new Login({
			appCode: this.appCode,
		});
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',
		'blur input[type=text]': 'inputText',
		'keyup input[type=password]': 'inputText',
		'submit form': 'login',
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

	login: function() {
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
		// console.log(this.model.toJSON());
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},

	done: function(data) {
		this.appEvents.trigger('logined',data);
		this.router.navigate('index',{trigger: true,replace: true});
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
		return this;
	},
});