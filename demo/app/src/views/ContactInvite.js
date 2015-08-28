var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    contactInviteTemplate = require('../../assets/templates/contactInvite.tpl'),
    contactInviteSucessTemplate = require('../../assets/templates/contactInviteSuccess.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	template_newline: '<div class="form-group"><div class="input-group"><input type="text" name="email" class="form-control" placeholder="好友邮箱地址"/><span class="input-group-addon"></span></div></div>',

	events: {
		'click #add-line': 'addLine',
		'submit form': 'submit',
	},

	addLine: function(){
		this.$el.find('#add-line').prepend(this.template_newline);
		return false;
	},

	submit: function(){
		var emails = [];
		$('input[name="email"]').each(function(){
			var email = $(this).val();
			if(email.length>0 && email.indexOf('@') != -1){
				emails.push($(this).val());
			}
		});
		$.post('/account/invite/friend',{
				emails: emails
			},function(){

			}
		);
		this.$el.html(contactInviteSucessTemplate());
		return false;
	},

	render: function(){
		this.$el.html(contactInviteTemplate());
		return this;
	}
});