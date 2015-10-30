var _ = require('underscore');
var $ = require('jquery'),
	FormView = require('./__FormView'),
	Message = require('../models/Message'),
	formTemplate = require('../templates/_formStatus.tpl');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '.status-editor',

	events: {
		'click .send-file': 'showFileExplorer',
		'change input[name=file]': 'addAttachment',
		'click .attachment': 'removeAttachment',
		'submit form': 'submitForm',
	},

	initialize: function(options) {
		this.fid = options.fid;
		this.socketEvents = options.socketEvents;
		this.model = new Message({
			fid: options.fid,
		});
	},

	reset: function() {
		this.model = new Message({
			fid: this.fid,
		});
	},

	showFileExplorer: function() {
		$('input[name=file]').click();
		return false;
	},

	addAttachment: function(evt) {
		var that = this;
		var formData = new FormData();
		formData.append('files', evt.currentTarget.files[0]);
		$.ajax({
			url: config.api.host + '/attachments',
			type: 'POST',
			xhrFields: {
				withCredentials: true
			},
			data: formData,
			cache: false, //MUST be false
			processData: false, //MUST be false
			contentType: false, //MUST be false
		}).done(function(data) {
			if (data && data.type) {
				// if(/jpg|png/.test(data.type)){
				that.$('.attachments').append('<span class="attachment"><input type="hidden" name="attachment" value="' + data.filename + '"><img src="' + data.filename + '" width="80px" height="80px">&nbsp;</span>');
				that.$('input[name=file]').val('');
				// }
			}
		}).fail(function(err) {
			console.log(err);
		});
		return false;
	},

	removeAttachment: function(evt) {
		if (confirm('放弃上传它吗？')) {
			var that = this;
			var filename = $(evt.currentTarget).find('img').attr('src');
			$.ajax({
				url: config.api.host + '/attachment',
				type: 'DELETE',
				xhrFields: {
					withCredentials: true
				},
				data: {
					filename: filename
				}
			}).done(function() {
				//remove attatchment
				$(evt.currentTarget).remove();
			}).fail(function() {

			});
		}
		return false;
	},

	submitForm: function() {
		var that = this;
		var text = that.$('textarea[name=text]').val();
		var attachments = [];
		var $attachments = that.$('input[name=attachment]') || [];
		$attachments.each(function(index) {
			attachments.push($($attachments[index]).val());
		});
		this.model.set('type', 'mixed');
		this.model.set('content', {
			body: text,
			urls: attachments,
		});
		if (this.model.isValid()) {
			var xhr = this.model.save(null, {
				xhrFields: {
					withCredentials: true
				},
			});
			if (xhr) {
				xhr
					.success(function(data) {
						if (!!data.code) {
							that.$('#error').html('<div class="alert alert-danger">' + data.errmsg + '</div>');
							that.$('#error').slideDown();
							return;
						}
						//reset form
						$('textarea[name=text]').val('');
						that.$('input[name=file]').val('');
						that.$('.attachments').empty();
						that.$('form').addClass('hidden');

						//update UI
						that.done(new Message(data));
						//trigger socket.io
						that.socketEvents.trigger('socket:message',{
						});
					})
					.error(function(xhr){
						that.$('#error').html('<div class="alert alert-danger">' + xhr.status + ': ' + xhr.responseText + '</div>');
						that.$('#error').slideDown();
					});
			}
		}

		return false;
	},

	render: function() {
		this.$el.html(formTemplate());
		return this;
	},

});