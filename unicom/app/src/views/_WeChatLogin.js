var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	FormView = require('./__FormView');
var accountTpl = require('../templates/_entityMyAccount.tpl');

var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#wechatTemplate',

	initialize: function(options) {
		this.router = options.router;
		this.appCode = options.appCode;
		var page = $(accountTpl);
		var wechatTemplate = $('#wechatLoginTemplate', page).html();
		this.template = _.template(_.unescape(wechatTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'click .back': 'back',
	},

	load: function(){
		var that = this;
		$.ajax({
			url: config.api.host + '/platform/wechat/'+ config.wechat.appid +'/qrcode/100002',
			type: 'POST',
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
		}).done(function(data) {
			that.$('#wechat').html('<p class="text-center"><img src="'+ data.src +'"></p><h4 class="text-center">请打开微信，扫一扫</h4>');
			var ticket = data.ticket;
			var refresh = function(ticket){
				if(that.$('#wechat').length > 0){
					$.ajax({
						url: config.api.host + '/platform/wechat/'+ config.wechat.appid +'/qrcode/'+ ticket,
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
		this.router.navigate('back',{trigger: true,replace: true});
		return false;
	},

	render: function(){
		this.$el.html(this.template());
		return this;
	},
});