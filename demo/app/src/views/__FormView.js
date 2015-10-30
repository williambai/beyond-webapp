var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	initialize: function(options){
		this.model.on('invalid', this.onInvalid, this);
		this.on('load', this.load, this);
	},

	load: function(){
		this.render();
	},

	onInvalid: function(model,errors,options){
		var that = this;
		_.each(errors,function(error){
			that.$('#' + error.name).addClass('has-error');
			that.$('#' + error.name +' span.help-block').text(error.message);
		});
		return false;
	},

	done: function(){
		console.log('form done is called....please implement done() on container(parent view).');
	},

	render: function(){
		return this;
	},

});