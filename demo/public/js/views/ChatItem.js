define(['text!templates/chatItem.html','text!templates/chatItemImage.html'],function(chatItemTemplate,chatItemImageTemplate){
	var ChatItemView = Backbone.View.extend({
		tagName: 'div',
		template: _.template(chatItemTemplate),
		templateImage: _.template(chatItemImageTemplate),

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

		render: function(){
			var content = this.model.get('status');
			if(typeof content =='string'){
				this.$el.addClass('textType');
				this.$el.html(this.template(this.model.toJSON()));
			}else{
				if(content.MsgType == 'image'){
					this.$el.addClass('imageType');
					this.$el.html(this.templateImage(this.model.toJSON()));
				}
			}
			return this;
		}
	});

	return ChatItemView;
});