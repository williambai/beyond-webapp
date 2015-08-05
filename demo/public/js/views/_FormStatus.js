define(['text!templates/_formStatus.html'],function(statusFormTemplate){
	var StatusFormView = Backbone.View.extend({
		
		el: '.status-editor',

		template: _.template(statusFormTemplate),

		events: {
			'click .send-file': 'showFileExplorer',
			'change input[name=file]': 'addAttachment',
			'click .attachment': 'removeAttachment',
			'submit form': 'submitForm',
		},

		initialize: function(options){
		},

		showFileExplorer: function(){
			$('input[name=file]').click();
			return false;
		},

		addAttachment: function(evt){
			var that = this;
			var formData = new FormData();
			formData.append('files',evt.currentTarget.files[0]);
			$.ajax({
				url: '/attachment/add',
				type: 'POST',
				data: formData,
				cache: false,//MUST be false
				processData: false,//MUST be false
				contentType:false,//MUST be false
				success: function(data){
					if(data && data.type){
						// if(/jpg|png/.test(data.type)){
							that.$('.attachments').append('<span class="attachment"><input type="hidden" name="attachment" value="'+ data.filename +'"><img src="'+ data.filename +'" width="80px" height="80px">&nbsp;</span>');
							that.$('input[name=file]').val('');
						// }
					}
				},
				error: function(err){
				  console.log(err);
				},
			});
          return false;
		},

		removeAttachment: function(evt){
			if(confirm('放弃上传它吗？')){
				var that = this;
				var filename = $(evt.currentTarget).find('img').attr('src');
				$.ajax({
					url: 'attachment/remove',
					type: 'POST',
					data: {
						filename: filename
					}
				}).done(function(){
					//remove attatchment
					$(evt.currentTarget).remove();
				});
			}
			return false;
		},

		submitForm: function(){
			var that = this;
			var statusText = that.$('textarea[name=text]').val();
			var attachments = [];
			var $attachments = that.$('input[name=attachment]') ||[];
			$attachments.each(function(index){
				attachments.push($($attachments[index]).val());
			});

			$('textarea[name=text]').val('');
			that.$('input[name=file]').val('');
			that.$('.attachments').empty();
			that.$('form').addClass('hidden');

			this.trigger('form:submit', {
				text: statusText,
				attachments: attachments,
			});
			return false;
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		},

	});
	return StatusFormView;
});