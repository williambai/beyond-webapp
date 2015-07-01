define(['text!templates/status.html','text!templates/commentForm.html'],function(statusTemplate,commentFormTemplate){
	var StatusView = Backbone.View.extend({
		// tagName: 'li',
		template: _.template(statusTemplate),
		templateCommentForm: _.template(commentFormTemplate),
		templateGood: '<hr><p class="has-good"><i class="fa fa-heart-o"></i>&nbsp;<span class="user-list"></span></p>',
		templateExpand: '<a class="expand"><p>展开</p></a>',
		templatePackup: '<a class="packup"><p>收起</p></a>',

		events: {
			'click .good': 'voteGood',
			'click .comment-toggle': 'commentToggle',
			'submit form': 'submitComment',
			'click .expand': 'expand',
			'click .packup': 'packup',
		},

		initialize: function(options){
			this.account = options.account;
			this._convertStatus();
		},

		_convertStatus: function(){
			var model = this.model;
			var statusJsonString = model.get('status');
			if(!statusJsonString){
				return;
			}
			statusJsonString = statusJsonString.trim();

			if(!/^\{.*\}$/.test(statusJsonString)){
				if(!/^http/.test(statusJsonString)){
					return;
				}

				if(/^http.*(png|jpg|git)$/.test(statusJsonString)){
					this.model.set('status', {
						MsgType:'image',
						PicUrl: statusJsonString
					});
				}else if(/^http.*(mp4|mov)$/.test(statusJsonString)){

				}else if(/^http.*(mp3|amr)$/.test(statusJsonString)){

				}else{
					$.get('/website/thumbnail?url=' + encodeURIComponent(statusJsonString),
						function success(response){
							console.log(response);
						}
					);
				}
			}else{
				// console.log('===')
				// console.log(statusJsonString)
				try{
					var statusObject = JSON.parse(statusJsonString);
					if(statusObject && statusObject.MsgType){
						//is wechat message
						if(statusObject.MsgType == 'text'){
							this.model.set('status',statusObject.Content);
						}else{
							this.model.set('status',statusObject);
						}
					}
				}catch(e){
					console.log(statusStatusString);
				}
			}
		},

		voteGood: function(){
			var that = this;

			$.ajax({
				url: '/status/'+ that.model.get('_id'),
				type: 'POST',
				data: {
						good: 1	
					}
			}).done(function(){
				that.onVoterAdded({
					accountId: that.account.id,
					username: that.account.username
				});
			});
			return false;
		},

		onVoterAdded: function(voter){
			var that = this;
			if(that.$('.has-good').length == 0){
				that.$('.comments').before(that.templateGood);
			}
			that.$('.user-list').append('&nbsp;<a href="#profile/'+ voter.accountId +'">'+ voter.username +'</a>;');
		},

		onCommenAdded: function(comment){
			this.$('.comments').append('<p><a href="#profile/'+ comment.accountId +'">'+ comment.username + '</a>: ' + comment.comment + '</p>');
		},

		commentToggle: function(){
			if(this.$('.comment-editor form').length == 0){
				this.$('.comment-editor').html(this.templateCommentForm());
			}else{
				this.$('.comment-editor').html('');
			}
			return false;
		},

		submitComment: function(){
			var comment = this.$('textarea[name=comment]').val() || '';
			if(comment.length>0){
				$.ajax({
					url: '/status/' + this.model.get('_id') + '/comment',
					type: 'POST',
					data: {
						comment: comment
					}
				}).done(function(){

				});
				this.onCommenAdded({
					accountId: this.account.id,
					username: this.account.username,
					comment: comment
				});
				this.$('.comment-editor').html('');
			}else{
				this.$('textarea[name=comment]').attr('placeholder','没写评论哦');
			}
			return false;
		},

		render: function(){
			var that = this;
			this.$el.html(this.template(this.model.toJSON()));
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