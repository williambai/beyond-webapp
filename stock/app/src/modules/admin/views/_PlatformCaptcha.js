var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone');

var	loadingTpl = require('../templates/__loading.tpl'),
	templateTpl = require('../templates/captcha.tpl');

var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',
	loaded: false,

	template: _.template(templateTpl),
	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.on('load', this.load, this);
	},
	
	events: {
		'click input[type="submit"]': 'submit',		
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
	},

	submit: function(){
		captcha = this.$('input[name=captcha]').val();
		if(captcha.length < 1) return false;
		$.ajax({
			url: config.api.host + '/captcha',
			type: 'POST',
			data: {
				captcha: captcha,
			},
			xhrFields: {
				withCredentials: true
			},
		}).done(function() {
		}).fail(function(err) {
		});
		return false;
	},

	render: function() {
		if (!this.loaded) {
			this.$el.html(this.loadingTemplate());
		} else {
			this.$el.html(this.template());
		}
		return this;
	},
});