var _ = require('underscore');

var $ = require('jquery');
var Backbone = require('backbone');
var orderEditTemplate = require('../../assets/templates/orderEdit.tpl');
var Order = require('../models/Order');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'click button.ltype': 'changeLtype',
		'blur input[name=periods]': 'changePeroids',
		'change input[name=sms]': 'changeSms',
		'submit form': 'submit',
	},

	initialize: function(options){
		this.router = options.router;
		this.account = options.account;
		this.model = new Order();
		if(options.id){
			this.model.url = '/orders/' + options.id; 
			this.model.fetch();
		}
		this.model.on('invalid',this.onInvalid, this);
		this.model.on('change:game', this.onGameChanged, this);
		this.model.on('change', this.render, this);
		this.on('load', this.load, this);
	},

	load: function(){
		this.model.trigger('change:game');
		this.render();
	},

	onInvalid: function(model,errors,options){
		//username valid
		if(!!errors.username){
			this.$('#username')
				.addClass('has-error');
			this.$('#username span.help-block')
				.text(errors.username);
		}else{
			this.$('#username')
				.removeClass('has-error');
			this.$('#username span.help-block')
				.empty();
		}
		//email valid
		if(!!errors.email){
			this.$('#email')
				.addClass('has-error');
			this.$('#email span.help-block')
				.text(errors.email);
		}else{
			this.$('#email')
				.removeClass('has-error');
			this.$('#email span.help-block')
				.empty();
		}
	},

	changeLtype: function(evt){
		var current = evt.currentTarget;
		var ltype = $(current).attr('id');
		var game = this.model.get('game');
		game.ltype = ltype;
		this.model.set('game', game);
		this.model.trigger('change:game');
		return false;
	},

	changePeroids: function(){
		var periods = this.$('input[name=periods]').val();
		var game = this.model.get('game');
		game.periods = periods;
		this.model.set('game', game);
		this.model.trigger('change:game');
		return false;
	},

	changeSms: function(evt){
		var current = evt.currentTarget;
		var checked = $(current).val();
		var game = this.model.get('game');
		var periods = game.periods;

		if(checked == 'every'){
			game.sms = 'every';
		}else if(checked == 'first'){
			game.sms = 'first';
		}else{
			game.sms = '';
		}
		this.model.set('game', game);
		this.model.trigger('change:game');
		return false;
	},

	onGameChanged: function(){
		var game = this.model.get('game');
		var periods = game.periods;
		var lottery_cost = 2*parseInt(periods);
		var sms_cost;
		if(game.sms == 'every'){
			sms_cost = 0.1* parseInt(periods);
		}else if(game.sms == 'first'){
			sms_cost = 0.1;
		}else{
			sms_cost = 0;
		}
		var total_cost = lottery_cost + sms_cost;
		this.model.set('lottery_cost', Number(lottery_cost).toFixed(2));
		this.model.set('sms_cost', Number(sms_cost).toFixed(2));
		this.model.set('total_cost', Number(total_cost).toFixed(2));
		this.model.trigger('change');
	},

	submit: function(){
		var customer = this.model.get('customer');
		customer.email = this.$('input[name=email]').val();
		customer.username = this.$('input[name=username]').val()
		this.model.set('customer', customer);
		if(this.model.save()){
			this.router.navigate('order/index',{trigger: true,replace: true});
		};
		return false;
	},

	render: function(){
		this.$el.html(orderEditTemplate({order: this.model.toJSON()}));
		return this;
	}

});