define(['text!templates/status.html','text!templates/commentForm.html','text!templates/modal.html'],function(statusTemplate,commentFormTemplate, modalTemplate){
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

			'click .media-body img': 'showInModal',
		},

		initialize: function(options){
			this.account = options.account;
			this._convertStatus();
			this._transformTime();
		},

		_convertStatus: function(){
			var statusObject = this.model.get('status');
			if(!statusObject){
				return;
			}
			if(typeof statusObject == 'string'){
				var statusString = statusObject.trim();
				var newString = '';
				if(!/^http/.test(statusString)){
					newString += '<p>'+ statusString + '</p>'
				}else{
					if(/^http.*(png|jpg|git)$/.test(statusString)){
						newString += '<img src="' + statusString +'" width="50%" target-data="'+ statusString +'" target-type="image">';
					}else if(/^http.*(mp4|mov)$/.test(statusString)){
					}else if(/^http.*(mp3|amr)$/.test(statusString)){

					}else if(/[pdf]$/.test(statusString)){
						newString += '<a href="' + statusString + '">';
						newString += '<img src="images/pdf.png" target-data="'+ statusString +'" target-type="pdf">';
						newString += '</a>'; 
					}else{
						newString += '<a href="' + statusString + '">';
						newString += '<img src="images/unknown.png" target-data="'+ statusString +'" target-type="unknown">';
						newString += '</a>'; 
					}
				}
				this.model.set('status', newString);
			}else{
				var newStatus = '';
				if(statusObject.MsgType == 'text'){
					newStatus += '<p>' + statusObject.Content + '</p>';
				}else if(statusObject.MsgType == 'image'){ 
					if(statusObject.PicUrl){
						newStatus += '<p><img src="' + statusObject.PicUrl + '">';	
					}
				}else if(statusObject.MsgType == 'mixed'){
					newStatus += '<p>' + statusObject.Content + '</p>';
					for(var i=0; i<statusObject.Urls.length; i++){
						if(/[png|jpg]$/.test(statusObject.Urls[i])){
							newStatus += '<img src="' + statusObject.Urls[i] +'" width="' + parseInt(50/statusObject.Urls.length-1) +'%" target-data="'+ statusObject.Urls[i] +'" target-type="image">';
						}else if(/[pdf]$/.test(statusObject.Urls[i])){
							newStatus += '<a href="' + statusObject.Urls[i] + '">';
							newStatus += '<img src="images/pdf.png" target-data="'+ statusObject.Urls[i] +'" target-type="pdf">';
							newStatus += '</a>'; 
						}
					}
				}else if(statusObject.MsgType == 'link'){
					newStatus += '<a href="' + statusObject.Url + '">';
					newStatus += '<h4>' +statusObject.Title + '</h4>';
					newStatus += '<p>'+ statusObject.Description + '</p>';
				}
				this.model.set('status', newStatus);
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

		showInModal: function(evt){
			var targetType = $(evt.currentTarget).attr('target-type');			
			var targetData = $(evt.currentTarget).attr('target-data');
			if(targetType != 'image' && targetType != 'video'){
				window.open(targetData,'_blank');
				return false;
			}
			if(targetType == 'image'){
			    // Create a modal view class
		    	var Modal = Backbone.Modal.extend({
		    	  template: (_.template(modalTemplate))(),
		    	  cancelEl: '.bbm-button'
		    	});
				// Render an instance of your modal
				var modalView = new Modal();
				$('body').append(modalView.render().el);
				$('.bbm-modal__section').html('<img src="' + targetData +'">');
			}
			return false;
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