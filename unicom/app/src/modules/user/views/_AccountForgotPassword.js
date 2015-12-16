var _ = require('underscore');
var $ = require('jquery'),
	FormView = require('./__FormView'),
	ForgotPassword = require('../models/ForgotPassword');
var accountTpl = require('../templates/_entityAccount.tpl');

var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#forgotPasswordForm',

	initialize: function(options) {
		var page = $(accountTpl);
		var forgotPasswordTemplate = $('#forgotPasswordTemplate', page).html();
		this.template = _.template(_.unescape(forgotPasswordTemplate || ''));
		var forgotPasswordSuccessTemplate = $('#forgotPasswordSuccessTemplate', page).html();
		this.successTemplate = _.template(_.unescape(forgotPasswordSuccessTemplate || ''));
		this.model = new ForgotPassword();
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'keyup input[type=text]': 'inputText',		
		'submit form': 'forgotPassword'
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

	forgotPassword: function() {
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

	done: function(){
		this.$el.html(this.successTemplate());
	},
	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});