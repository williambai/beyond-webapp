var _ = require('underscore');

var $ = require('jquery');
var Backbone = require('backbone');
var recordEditTemplate = require('../../assets/templates/recordEdit.tpl');
var Record = require('../models/Record');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'submit form': 'submit',
	},

	initialize: function(options){
		this.account = options.account;
		this.model = new Record();
		if(options.id){
			this.model.url = '/records/' + options.id; 
			this.model.fetch();
		}
		this.model.on('change', this.render, this);
		this.on('load', this.load, this);
	},

	load: function(){
		this.render();
	},



	submit: function(){
		// var customer = this.model.get('customer');
		// customer.email = this.$('input[name=email]').val();
		// customer.username = this.$('input[name=username]').val()
		// this.model.set('customer', customer);
		this.model.save();
		return false;
	},

	render: function(){
		this.$el.html(recordEditTemplate({record: this.model.toJSON()}));
		return this;
	}

});