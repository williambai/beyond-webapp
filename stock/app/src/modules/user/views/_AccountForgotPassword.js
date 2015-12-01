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
		'submit form': 'forgotPassword'
	},

	forgotPassword: function() {
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