define(['text!templates/status.html','text!templates/commentForm.html'],function(statusTemplate,commentFormTemplate){
	var StatusBaseView = Backbone.View.extend({
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
			this._transformTime();
		},

		_convertStatus: function(){
			var model = this.model;
			var statusString = model.get('status');
			if(!statusString){
				return;
			}
			if(typeof statusString == 'string'){
				statusString = statusString.trim();
				if(!/^http/.test(statusString)){
					// this.model.set('status', {
					// 	MsgType:'text',
					// 	Content: statusString
					// });
				}else{
					if(/^http.*(png|jpg|git)$/.test(statusString)){
						this.model.set('status', {
							MsgType:'image',
							PicUrl: statusString
						});
					}else if(/^http.*(mp4|mov)$/.test(statusString)){

					}else if(/^http.*(mp3|amr)$/.test(statusString)){

					}else{
						$.get('/website/thumbnail?url=' + encodeURIComponent(statusString),
							function success(response){
								console.log(response);
							}
						);
					}
				}
			}
		},

		_transformTime: function(){
			var createtime = this.model.get('createtime');
			var deltatime = (_.now() - new Date(createtime).getTime())/1000;
			var days = parseInt(deltatime/(24*60*60));
			var hours = parseInt(deltatime/(60*60));
			var mins = parseInt(deltatime/60);
			if(days>0){
				this.model.set('deltatime', days + ' 天之前');
			}else if(hours>0){
				this.model.set('deltatime', hours + ' 小时之前');
			}else if(mins>0){
				this.model.set('deltatime', mins + ' 分钟之前');
			}else{
				this.model.set('deltatime', '刚刚');
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
				this.$('.comment-editor').html(this.templateCommentForm()).hide().fadeIn('slow');
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
			this.$el.html(this.template({model:this.model.toJSON()}));
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

	return StatusBaseView;
});