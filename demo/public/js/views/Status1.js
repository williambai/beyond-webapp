define(['views/Status','text!templates/status1.html','text!templates/commentForm.html'],function(StatusView,statusTemplate,commentFormTemplate){
	var StatusView = StatusView.extend({

		template: _.template(statusTemplate),

		uiControl: {},

		initialize: function(options){
			this.account = options.account;
			this._convertStatus();
			if(this.model.get('fromId') == this.account.id){
				this.uiControl.showToUser = true;
			}else{
				this.uiControl.showToUser = false;
			}
		},

		render: function(){
			var that = this;
			this.$el.html(this.template({ui: this.uiControl, model:this.model.toJSON()}));
			var votes = this.model.get('votes') || [];
			var comments = this.model.get('comments') || [];
			votes.forEach(function(vote){
				that.onVoterAdded(vote);
			});
			comments.forEach(function(comment){
				that.onCommenAdded(comment);
			});
			return this;
		}
	});

	return StatusView;
});