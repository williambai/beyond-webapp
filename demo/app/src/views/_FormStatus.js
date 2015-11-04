var _ = require('underscore');
var $ = require('jquery'),
	FormView = require('./__FormView'),
	Status = require('../models/Status'),
	statusFormTemplate = require('../templates/_formStatus.tpl');
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
		this.model = new Status();
		this.socketEvents = options.socketEvents;
		FormView.prototype.initialize.apply(this, options);
	},

	reset: function() {
		this.model = new Status();
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
			data: formData,
			xhrFields: {
				withCredentials: true
			},
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
				data: {
					filename: filename
				},
				xhrFields: {
					withCredentials: true
				},
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
		//set model
		var text = that.$('textarea[name=text]').val();
		var attachments = [];
		var $attachments = that.$('input[name=attachment]') || [];
		$attachments.each(function(index) {
			attachments.push($($attachments[index]).val());
		});
		this.model.set('type', 'mixed');
		this.model.set('content', {
			body: text,
			urls: attachments
		});
		if (this.model.isValid()) {
			//clean errors
			that.$('.form-group').removeClass('has-error');
			that.$('.form-group span.help-block').empty();

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
						that.done(new Status(data));
						//trigger socket.io
						that.socketEvents.trigger('socket:out:status', data);
					})
					.error(function(xhr) {
						that.$('#error').html('<div class="alert alert-danger">' + xhr.status + ': ' + xhr.responseText + '</div>');
						that.$('#error').slideDown();
					});
			}
		}

		return false;
	},

	render: function() {
		this.$el.html(statusFormTemplate());
		return this;
	},

});