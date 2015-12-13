var _ = require('underscore');
var FormView = require('./__FormView'),
	$ = require('jquery'),
    dataTpl = require('../templates/_entityPromoteMedia.tpl'),
	PromoteMedia = require('../models/PromoteMedia');
var config = require('../conf');

exports = module.exports = FormView.extend({

	el: '#dataForm',

	initialize: function(options) {
		this.router = options.router;
		this.model = new PromoteMedia();
		var page = $(dataTpl);
		var addTemplate = $('#addTemplate', page).html();
		this.template = _.template(_.unescape(addTemplate || ''));
		FormView.prototype.initialize.apply(this, options);
	},

	events: {
		'click .send-file': 'showFileExplorer',
		'change input[name=file]': 'addAttachment',
		'click .attachment': 'removeAttachment',
		'submit form': 'submit',
		'click .back': 'cancel',
	},

	load: function(){
		this.render();
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
			if (data) {
				// if(/jpg|png/.test(data.type)){
				that.model.set(data);
				that.render();
				that.$('.attachments').html('<span class="attachment"><img src="' + data.url + '" width="200px" height="200px">&nbsp;</span><p>点击照片可以删除重选。</p>');
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
				url: config.api.host + '/attachments',
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
		that.$('.attachments').html('<button class="btn btn-promary send-file"> <i class="fa fa-5x fa-plus-circle"></i></button>');
		that.model.clear();
		that.render();
		return false;
	},

	submit: function() {
		var that = this;
		var object = this.$('form').serializeJSON();
		this.model.set(object);
		// console.log(this.model.attributes);
		this.model.save(null, {
			xhrFields: {
				withCredentials: true
			},
		});
		return false;
	},

	cancel: function(){
		this.router.navigate('promote/media/index',{trigger: true, replace: true});
		return false;
	},

	done: function(response){
		this.router.navigate('promote/media/index',{trigger: true, replace: true});
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});