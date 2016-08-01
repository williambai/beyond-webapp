var _ = require('underscore');
var $ = require('jquery');
var	Backbone = require('backbone');
var FormView = require('../../_base/__FormView');

var config = require('../../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#wechatTemplate',
	template: _.template($('#tpl-login-wechat').html()),

	initialize: function(options) {
		this.router = options.router;
		this.appCode = options.appCode;
		this.on('load', this.load, this);
	},

	events: {
		'click .back': 'back',
	},

	load: function(){
		var that = this;
		$.ajax({
			url: config.api.host + '/public/wechat/'+ config.wechat.appid +'/qrcode/100002',
			type: 'POST',
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
		}).done(function(data) {
			if(data.code) return that.$('#wechat').html(data.errmsg);
			that.$('#wechat').html('<p class="text-center"><img src="'+ data.src +'"></p><h4 class="text-center">请打开微信，扫一扫</h4>');
			var ticket = data.ticket;
			var refresh = function(ticket){
				if(that.$('#wechat').length > 0){
					$.ajax({
						url: config.api.host + '/public/wechat/'+ config.wechat.appid +'/qrcode/'+ ticket,
						type: 'GET',
						xhrFields: {
							withCredentials: true
						},
						crossDomain: true,
					}).done(function(data) {
						var success = data.success;
						if(success){
							window.location.reload();
						}else{
							setTimeout(function(){
								refresh(ticket);
							},2000);
						}
					});
				}
			};
			refresh(ticket);
		});
	},

	back: function(){
		this.router.navigate('login',{trigger: true,replace: true});
		return false;
	},

	render: function(){
		this.$el.html(this.template());
		return this;
	},
});