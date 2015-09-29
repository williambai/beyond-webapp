var _ = require('underscore');
var $ = require('jquery'),
	FormView = require('./__FormView'),
	Status = require('../models/Status'),
    statusFormTemplate = require('../../assets/templates/_formStatus.tpl');

exports = module.exports = FormView.extend({
	
	el: '.status-editor',

	events: {
		'click .send-file': 'showFileExplorer',
		'change input[name=file]': 'addAttachment',
		'click .attachment': 'removeAttachment',
		'submit form': 'submitForm',
	},

	initialize: function(options){
		this.model = new Status();
	},

	reset: function(){
		this.model = new Status();
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
			url: '/attachments',
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
				url: 'attachment',
				type: 'DELETE',
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
		this.model.set('type','text');
		this.model.set('content',{
			body: statusText,
		});
		if(this.model.isValid()){
			// that.socketEvents.trigger('socket:message',{
			// });

			var xhr = this.model.save();
			if(xhr){
				xhr
					.success(function(model){
						if(!!model.code){
							that.$('#error').html('<div class="alert alert-danger">' + model.message + '</div>');
							that.$('#error').slideDown();
							return;
						}
						//reset form
						$('textarea[name=text]').val('');
						that.$('input[name=file]').val('');
						that.$('.attachments').empty();
						that.$('form').addClass('hidden');

						that.success(new Status(model));
					})
					.error(function(err){
						console.log(err);
						that.$('#error').html('<div class="alert alert-danger">unknown error</div>');
						that.$('#error').slideDown();
					});
			}			
		}

		return false;
	},

	render: function(){
		this.$el.html(statusFormTemplate());
		return this;
	},

});