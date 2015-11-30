var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	accountTpl = require('../templates/_entityAccount.tpl');
var loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#registerConfirm',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		var page = $(accountTpl);
		var confirmTemplate = $('#registerConfirmTemplate', page).html();
		this.template = _.template(_.unescape(confirmTemplate || ''));

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
				that.$el.html(that.template({success:false, message: data}));
				return;
			}
			that.$el.html(that.template({success: true, message: data}));
		}).error(function(xhr) {
			that.$el.html(that.template({success: false, message: data}));
		});
	},

	render: function() {
		this.$el.html(this.loadingTemplate());
		return this;
	},

});