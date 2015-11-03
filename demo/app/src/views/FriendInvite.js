var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	friendInviteTemplate = require('../templates/friendInvite.tpl'),
	friendInviteSucessTemplate = require('../templates/friendInviteSuccess.tpl');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	template_newline: '<div class="form-group">' +
		'<input type="text" name="email" class="form-control" placeholder="好友邮箱地址">' +
		'<span class="help-block"></span>' +
		'</div>',

	events: {
		'click #add-line': 'addLine',
		'submit form': 'submit',
	},

	addLine: function() {
		this.$el.find('#add-line').before(this.template_newline);
		return false;
	},

	submit: function() {
		var that = this;
		var emails = [];
		//clean errors
		that.$('#error').empty();
		that.$('.form-group').removeClass('has-error');
		that.$('.form-group span.help-block').empty();
		//set and show errors
		var errors = [];
		$('input[name="email"]').each(function() {
			var email = $(this).val();
			if (_.isEmpty(email)) return;

			if (!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(email))) {
				errors.push({
					name: 'email',
					message: '不是有效的电子邮件',
				});
				var $parent = $(this).parent();
				$($parent).addClass('has-error');
				$('span.help-block', $parent).text('不是有效的电子邮件');
			} else {
				emails.push($(this).val());
			}
		});
		if (!_.isEmpty(errors)) return false;

		//no emails, show error
		if (_.isEmpty(emails)) {
			that.$('#error').html('<div class="alert alert-danger">' + '没有有效的电子邮件' + '</div>');
			that.$('#error').slideDown();
			return false;
		}
		//ok
		$.ajax({
			url: config.api.host + '/invite/friend',
			type: 'POST',
			xhrFields: {
				withCredentials: true
			},
			data: {
				emails: emails
			}
		}).done(function() {

		}).fail(function() {

		});
		this.$el.html(friendInviteSucessTemplate());
		return false;
	},

	render: function() {
		this.$el.html(friendInviteTemplate());
		return this;
	}
});