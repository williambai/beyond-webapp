var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	registerConfirmResultTemplate = require('../templates/registerConfirmResult.tpl');
var loadingTemplate = require('../templates/loading.tpl');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',
	loaded: false,

	initialize: function(options) {
		this.email = options.email;
		this.code = options.code;
		this.on('load', this.load, this);
	},

	load: function() {
		var that = this;
		this.load = true;
		$.ajax({
			url: config.api.host + '/register/confirm',
			type: 'POST',
			xhrFields: {
				withCredentials: true
			},
			data: {
				email: that.email,
				code: that.code,
			},
			crossDomain: true,
		}).done(function(data) {
			if (!!data.code) {
				that.$el.html(registerConfirmResultTemplate({success:false, message: data}));
				return;
			}
			that.$el.html(registerConfirmResultTemplate({success: true, message: data}));
		}).error(function(xhr) {
			that.$el.html(registerConfirmResultTemplate({success: false, message: data}));
		});
	},

	render: function() {
		this.$el.html(loadingTemplate());
		return this;
	},

});