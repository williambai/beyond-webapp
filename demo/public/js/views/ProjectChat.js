define(['text!templates/projectChat.html','views/ChatSession'], function(projectChatTemplate,ChatSessionView){
	var ProjectChatView = ChatSessionView.extend({

		template: _.template(projectChatTemplate),

		events: {
			'submit form': 'sendChat',
			'click .chat-toggle': 'changeToolbar'
		},

		changeToolbar: function(){
			var toolbars = this.$('.navbar-absolute-bottom');
			toolbars.each(function(index){
				var toolbar = toolbars[index];
				if($(toolbar).hasClass('hidden')){
					$(toolbar).removeClass('hidden');
				}else{
					$(toolbar).addClass('hidden');				
				}
			});
			return false;
		}

	});
	return ProjectChatView;
});