define(['text!templates/contactInvite.html','text!templates/contactInviteSuccess.html'],function(contactInviteTemplate,contactInviteSucessTemplate){
	var ContactInviteView = Backbone.View.extend({
		el: '#content',
		template: _.template(contactInviteTemplate),
		template_newline: '<div class="form-group"><div class="input-group"><input type="text" name="email" class="form-control" placeholder="好友邮箱地址"/><span class="input-group-addon"></span></div></div>',
		template_success: _.template(contactInviteSucessTemplate),

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
			this.$el.html(this.template_success);
			return false;
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});

	return ContactInviteView;
});