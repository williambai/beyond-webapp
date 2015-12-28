var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery'),
    customerTpl = require('../templates/_entityCustomer.tpl'),
    SearchView = require('./__SearchView');
var config = require('../conf');

var SearchModel = Backbone.Model.extend({

});

exports = module.exports = SearchView.extend({
	el: '#import',

	initialize: function(options){
		this.router = options.router;
		var page = $(customerTpl);
		var importTemplate = $('#importTemplate', page).html();
		this.template = _.template(_.unescape(importTemplate || ''));
		this.model = new SearchModel();
		this.on('load', this.load,this);
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
			url: config.api.host + '/upload',
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
				url: config.api.host + '/upload',
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


	submit: function() {
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
		this.router.navigate('customer/index',{trigger: true, replace: true});
		return false;
	},

	done: function(response){
		//reset form
		that.$('input[name=file]').val('');
		that.$('.attachments').empty();

	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
	},
});