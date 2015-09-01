var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    userInfoTemplate = require('../../assets/templates/lotteryUser.tpl'),
    lottery3dTemplate = require('../../assets/templates/lottery3d.tpl');
var config = require('../conf');

Backbone.$ = $;


exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {

		'submit form.user': 'userForm',
		'submit form.lottery': 'lotteryForm',
	},

	initialize: function(options){
		this.id = options.id;
		this.account = options.account;
		this.on('load', this.load,this);
	},

	load: function(){
	},

	userForm: function(){
		this.$el.html(lottery3dTemplate());
		return false;
	},

	lotteryForm: function(){
		window.location.hash = 'order/detail';
		return false;
	},

	render: function(){
		this.$el.html(userInfoTemplate());
		return this;
	}

});