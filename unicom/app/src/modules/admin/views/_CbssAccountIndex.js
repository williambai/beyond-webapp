var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    accountTpl = require('../templates/_entityCbssAccount.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var Account = require('../models/CbssAccount');
var ListView = require('./_CbssAccountList');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(accountTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .login': 'loginAccount',
		'click .captcha': 'submitCaptchaText',
		'click .add': 'addAccount',
		'click .edit': 'editAccount',
		'click .delete': 'removeAccount',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
		this.listView = new ListView({
			el: '#list',
		});
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	loginAccount: function(evt){
		var that = this;
		var $item = this.$(evt.currentTarget).parent().parent();
		var id = $item.attr('id');
		$item.find('.login').addClass('disabled');
		$item.append('<div class="captchaForm"><p>登录中。。。，请稍后</p></div>');
		$.ajax({
			url: config.api.host + '/cbss/accounts',
			type: 'POST',
			xhrFields: {
				withCredentials: true
			},
			data: {
				action: 'login',
				id: id,
			},
			crossDomain: true,
		}).done(function(data) {
			var interval = setInterval(function(){
				$.ajax({
					url: config.api.host + '/cbss/accounts',
					type: 'POST',
					xhrFields: {
						withCredentials: true
					},
					data: {
						action: 'getImage',
						id: id,
					},
					crossDomain: true,
				}).done(function(data){
					if(data.src){
						$item.find('.captchaForm').html('<img src="'+ data.src +'">&nbsp;&nbsp;验证码：<input type="text" name="captcha">&nbsp;&nbsp;<button class="btn btn-danger captcha">提交</button>');
						clearInterval(interval);
					}
				}).fail(function(err) {
					$item.find('.captchaForm').html('<p>失败，请重新尝试</p>');
					$item.find('.login').addClass('disabled');
					clearInterval(interval);
				});

			},2000);
		}).fail(function() {
			$item.find('.captchaForm').html('<p>失败，请重新尝试</p>');
			$item.find('.login').removeClass('disabled');
		});
		return false;
	},

	submitCaptchaText: function(evt){
		var that = this;
		var $item = this.$(evt.currentTarget).parent().parent();
		var id = $item.attr('id');
		var captchaText = this.$('input[name=captcha]').val();
		$item.find('.captchaForm').html('<p>正在验证...</p>');
		$.ajax({
			url: config.api.host + '/cbss/accounts',
			type: 'POST',
			xhrFields: {
				withCredentials: true
			},
			data: {
				action: 'captchaText',
				id: id,
				plain: captchaText,
			},
			crossDomain: true,
		}).done(function(data) {
			setTimeout(function(){
				window.location.reload();
			},6000);
		}).fail(function() {
			$item.find('.captchaForm').html('<p>失败，请重新尝试</p>');
		});
		return false;
	},

	addAccount: function(evt){
		this.router.navigate('cbss/account/add',{trigger: true});
		return false;
	},

	editAccount: function(evt){
		var $item = this.$(evt.currentTarget).parent().parent();
		var id = $item.attr('id');
		this.router.navigate('cbss/account/edit/'+ id,{trigger: true});
		return false;
	},

	removeAccount: function(evt){
		var $item = this.$(evt.currentTarget).parent().parent();
		var id = $item.attr('id');
		if(window.confirm('您确信要删除吗？')){
			var model = new Account({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
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