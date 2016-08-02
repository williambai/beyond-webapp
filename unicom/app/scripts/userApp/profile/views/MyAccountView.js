var _ = require('underscore');
var $ = require('jquery');
var	Backbone = require('backbone');
var FormView = require('../../_base/__FormView');
var config = require('../../conf');

Backbone.$ = $;

//** 模型
var Account = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/accounts',

	defaults: {
		status: {},
	},
});

//** 主视图
exports = module.exports = FormView.extend({

	el: '#accountForm',
	template: _.template($('#tpl-account-view').html()),

	initialize: function(options) {
		this.router = options.router;
		this.appEvents = options.appEvents;
		this.model = new Account({_id: options.id});
		if (options.id == 'me') {
			this.model.set('me',true);
		} else {
			this.model.set('me',false);
		}
		FormView.prototype.initialize.apply(this, options);
	},

	load: function() {
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	events: {
		'click .logout': 'logout',
	},

	logout: function() {
		var that = this;
		this.appEvents.trigger('logout');
		$.ajax({
			url: config.api.host +'/logout',
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
		}).done(function() {

		}).fail(function() {

		});
		return false;
	},

	//fetch event: done
	done: function(response) {
		var that = this;
		this.render();
		var openid = this.model.get('openid');
		if(!openid){
			$.ajax({
				url: config.api.host + '/public/wechat/'+ config.wechat.appid +'/qrcode/100001',
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
								that.$('#wechat').html('<p>微信已绑定</p>');
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
		}else{
			that.$('#wechat').html('<p>微信已绑定</p>');
		}
	},

	render: function() {
		this.$el.html(this.template({model: this.model.toJSON()}));
		this.$('img#avatar').attr('src', this.model.get('avatar'));
		return this;
	}
});