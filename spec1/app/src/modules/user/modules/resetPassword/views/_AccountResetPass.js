var _ = require('underscore');
var $ = require('jquery'),
	FormView = require('./__FormView'),
	ResetPassword = require('../models/ResetPassword');
var accountTpl = require('../templates/_entityAccount.tpl');

var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#resetPasswordForm',

	initialize: function(options) {
		var page = $(accountTpl);
		var resetTemplate = $('#resetTemplate', page).html();
		this.template = _.template(_.unescape(resetTemplate || ''));
		var resetSuccessTemplate = $('#resetSuccessTemplate', page).html();
		this.successTemplate = _.template(_.unescape(resetSuccessTemplate || ''));
		this.model = new ResetPassword();
		this.model.set('token', options.token);
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'submit form': 'resetPassword'
	},

	resetPassword: function() {
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

	done: function() {
		this.$el.html(this.successTemplate());
		setTimeout(function(){
			window.location.href = 'index.html';
		},3000);
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
		return this;
	},
});