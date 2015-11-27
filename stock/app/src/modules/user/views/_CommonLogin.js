var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
	Login = require('../models/Login');
var commonTpl = require('../templates/_common.tpl');

exports = module.exports = FormView.extend({

	el: '#loginForm',

	events: {
		'submit form': 'login',
		'swiperight': 'toRegisterForm',
	},

	initialize: function(options) {
		var page = $(commonTpl);
		var loginTemplate = $('#loginTemplate', page).html();
		this.template = _.template(_.unescape(loginTemplate || ''));
		this.appEvents = options.appEvents;
		this.model = new Login();
		FormView.prototype.initialize.apply(this, options);
	},

	login: function() {
		var that = this;
		//clean errors
		that.$('.form-group').removeClass('has-error');
		that.$('.form-group span.help-block').empty();
		//set model
		this.model.set('email', $('input[name=email]').val());
		this.model.set('password', $('input[name=password]').val());

		if(this.model.isValid()){
			var xhr = this.model.save(null, {
				xhrFields: {
					withCredentials: true
				},
			});
			if(xhr){
				xhr
					.success(function(data){
						if(!!data.code){
							that.$('#error').html('<div class="alert alert-danger">' + data.errmsg + '</div>');
							that.$('#error').slideDown();
							return;
						}
						//update UI
						that.done();
						//trigger socket.io
						that.appEvents.trigger('logined',data);
					})
					.error(function(xhr){
						that.$('#error').html('<div class="alert alert-danger">' + xhr.status + ': ' + xhr.responseText + '</div>');
						that.$('#error').slideDown();
					});
			}			
		}
		return false;
	},

	toRegisterForm: function() {
		window.location.hash = 'register';
		return false;
	},

	done: function(){
		window.location.hash = 'index';
	},
	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});