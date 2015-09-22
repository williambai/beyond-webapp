var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    loadingTemplate = require('../../assets/templates/loading.tpl'),
    projectAddTemplate = require('../../assets/templates/projectAdd.tpl'),
    Project = require('../models/Project');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'submit form': 'addProject'
	},

	initialize: function(options){
		this.socketEvents = options.socketEvents;
		this.model = new Project();
		this.model.on('invalid', this.onInvalid, this);
	},

	addProject: function(){
		var that = this;
		this.model.set('name',$('input[name=name]').val());
		this.model.set('description',$('textarea[name=description]').val());
		if(this.model.save()){
			that.socketEvents.trigger('app:projects:reload');
			window.location.hash = 'contact/add';
		}
		return false;
	},

	onInvalid: function(model, error, options){
		//valid name
		if(!!error.name){
			this.$('#name')
				.addClass('has-error');
			this.$('#name span.help-block')
				.text(error.name);
		}else{
			this.$('#name')
				.removeClass('has-error');
			this.$('#name span.help-block')
				.empty();
		}
		//valid description
		if(!!error.description){
			this.$('#description')
				.addClass('has-error');
			this.$('#description span.help-block')
				.text(error.description);
		}else{
			this.$('#description')
				.removeClass('has-error');
			this.$('#description span.help-block')
				.empty();
		}
	},

	render: function(){
		this.$el.html(projectAddTemplate());
		return this;
	}
});