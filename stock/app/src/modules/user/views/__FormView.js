//exports = module.exports = require('../../../views/__FormView');

var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone');

Backbone.$ = $;

var serializeJSON = require('jquery-serializejson');

exports = module.exports = Backbone.View.extend({

	initialize: function(options){
		this.model.on('invalid', this.renderModelInvalid, this);
		this.model.on('error', this.renderServerError, this);
		this.model.on('sync', this.renderServerInvalid, this);
		this.on('done', this.done, this);
		this.on('load', this.load, this);
	},

	load: function(){
		this.render();
	},

	renderInputInvalid: function(evt) {
		var that = this;
		var parent = $(evt.currentTarget).parent('.form-group');
		var name_value = $(evt.currentTarget).serializeArray();
		// console.log(name_value)
		name_value.forEach(function(item){
			//invalid
			var error = that.validate(item.name,item.value);
			if(error){
				//display error
				parent.addClass('has-error');
				$(parent).find('span.help-block').text(error.message);
				return;
			}
			//clean error
			parent.removeClass('has-error');
			$(parent).find('span.help-block').empty();
			// var attr = {};
			// attr[item.name] = item.value;
			// that.model.set(attr);
			// console.log(that.model.toJSON())
		});
	},

	renderModelInvalid: function(model,errors,options){
		var that = this;
		//clean errors
		that.$('.form-group').removeClass('has-error');
		that.$('.form-group span.help-block').empty();
		//set errors
		_.each(errors,function(error){
			that.$('#' + error.name).addClass('has-error');
			that.$('#' + error.name +' span.help-block').text(error.message);
		});
		return false;
	},

	renderServerInvalid: function(model,response,options){
		//no invalid, trigger 'done'
		if(!response.code) return this.trigger('done',response);
		//has invalid,show it
		this.$('#error').html('<div class="alert alert-danger">' + response.errmsg + '</div>');
		this.$('#error').slideDown();
	},

	renderServerError: function(model,response,options){
		this.$('#error').html('<div class="alert alert-danger">' + response.status + ': ' + response.responseText + '</div>');
		this.$('#error').slideDown();

	},

	/**
	 * need inherit
	 */
	validate: function(data){
		console.log('form validate is called....please implement validate() in view.');
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