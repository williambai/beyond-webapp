define(['text!templates/status.html'],function(statusTemplate){
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
		},

		initialize: function(){
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
			$.post(
				'/status/'+ this.model.get('_id'),
				{
					good: 1	
				}
			);
			return false;
		},

		voteBad: function(){
			$.post(
				'/status/'+ this.model.get('_id'),
				{
					bad: 1	
				}
			);
			return false;
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});

	return StatusView;
});