var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	FormView = require('./__FormView'),
	accountTpl = require('../templates/_entityAccount.tpl'),
	Account = require('../models/Account');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = FormView.extend({

	el: '#accountForm',

	modelFilled: false,

	initialize: function(options) {
		var page = $(accountTpl);
		var editTemplate = $('#editTemplate', page).html();
		this.template = _.template(_.unescape(editTemplate || ''));
		this.model = new Account();
		FormView.prototype.initialize.apply(this, options);
	},

	load: function() {
		this.model.url = this.model.url +'/me';
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	events: {
		'change input[name=avatar]': 'uploadAvatar',
		'submit form': 'submit',
	},

	uploadAvatar: function(evt) {
		var that = this;
		var formData = new FormData();
		formData.append('files', evt.currentTarget.files[0]);
		$.ajax({
			url: config.api.host + '/accounts/me?type=avatar',
			type: 'PUT',
			xhrFields: {
				withCredentials: true
			},
			data: formData,
			cache: false, //MUST be false
			processData: false, //MUST be false
			contentType: false, //MUST be false
		}).done(function(data) {
			that.model.set('avatar', data);
		}).fail(function(err) {
			console.log(err);
		});
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

	//fetch event: done
	done: function(response){
		if(!this.modelFilled){
			//first fetch: get model
			this.modelFilled = true;
			this.render();
		}else{
			//second fetch: submit
			window.location.hash = 'profile/me';
		}
	},

	render: function() {
		this.$el.html(this.template({model:this.model.toJSON()}));
		return this;
	}
});