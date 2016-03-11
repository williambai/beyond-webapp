var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone');

Backbone.$ = $;

var serializeJSON = require('jquery-serializejson');
var validation = require('backbone-validation');
_.extend(Backbone.Model.prototype,validation.mixin);

exports = module.exports = Backbone.View.extend({

	initialize: function(options){
		this.model.on('error', this.renderServerError, this);
		this.model.on('sync', this.renderServerInvalid, this);
		this.on('done', this.done, this);
		this.on('load', this.load, this);
	},

	load: function(){
		this.render();
	},

	renderServerInvalid: function(model,response,options){
		//clean error
		this.$('.error').empty();
		//no invalid, trigger 'done'
		if(!response.code) return this.trigger('done',response);
		//has invalid,set error
		this.$('form').prepend('<div class="error"><div class="alert alert-danger">' + response.errmsg + '</div></div>');
		this.$('.error').slideDown();
	},

	renderServerError: function(model,response,options){
		//clean error
		this.$('.error').empty();
		//set error
		console.log(response)
		this.$('form').prepend('<div class="error"><div class="alert alert-danger">' + response.status + ': ' + response.responseText + '</div></div>');
		this.$('.error').slideDown();
	},

	/**
	 * need inherit
	 */
	done: function(data){
		console.log('form done is called....please implement done() in view.');
	},

	render: function(){
		return this;
	},

});