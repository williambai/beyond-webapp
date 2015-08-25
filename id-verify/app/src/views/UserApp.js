var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    userAppTemplate = require('../../assets/templates/userApp.tpl'),
    Account = require('../models/Account');
var config = require('../conf');

Backbone.$ = $;


exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'submit form': 'submit',
		'click .regenerate': 'regenerate',
	},

	initialize: function(options){
		this.id = options.id;
		this.account = options.account;
		this.model = new Account();
		this.on('load', this.load,this);
		this.model.on('change', this.render,this);
	},

	load: function(){
		this.model.url = config.api.host + '/accounts/' + this.id;
		this.model.fetch();
		this.render();
	},

	render: function(){
		this.$el.html(userAppTemplate({user: this.model.toJSON()}));
		return this;
	}

});