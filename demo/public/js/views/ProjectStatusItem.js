define(['text!templates/projectStatusItem.html','text!templates/modal.html','views/Util'],function(statusTemplate,modalTemplate,MessageUtil){
	var StatusView = Backbone.View.extend({
		// tagName: 'li',
		template: _.template(statusTemplate),
		templateExpand: '<a class="expand"><p>展开</p></a>',
		templatePackup: '<a class="packup"><p>收起</p></a>',

		events: {
			'click .good': 'voteGood',
			'click .bad': 'voteBad',
			'click .level': 'changeLevel',
			'click .expand': 'expand',
			'click .packup': 'packup',
			'click .media-body img': 'showInModal',
		},

		initialize: function(){
			this._convertContent();
			this._transformTime();
			this._transformAvatar();
		},

		_convertContent: function(){
			var contentObject = this.model.get('content');
			var newContent = MessageUtil.convertContent(contentObject);
			this.model.set('content',newContent);
		},

		_transformTime: function(){
			var createtime = this.model.get('createtime');
			var deltatime = MessageUtil.transformTime(createtime);
			this.model.set('deltatime', deltatime);
		},

		_transformAvatar: function(){
			var fromId = this.model.get('fromId');
			var fromUser = this.model.get('fromUser');
			if(fromUser && fromId){
				this.model.set('avatar', fromUser[fromId].avatar);
				this.model.set('username', fromUser[fromId].username);
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
			$.post(
				'/message/project/vote/'+ this.model.get('_id'),
				{
					good: 1	
				}
			);
			return false;
		},

		voteBad: function(){
			$.post(
				'/message/project/vote/'+ this.model.get('_id'),
				{
					bad: 1	
				}
			);
			return false;
		},

		render: function(){
			this.$el.html(this.template({model:this.model.toJSON()}));
			return this;
		}
	});

	return StatusView;
});