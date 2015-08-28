var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    loadingTemplate = require('../../assets/templates/loading.tpl'),
    projectAddTemplate = require('../../assets/templates/projectAdd.tpl'),
    Account = require('../models/Account');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'submit form': 'addProject'
	},

	initialize: function(options){
		this.socketEvents = options.socketEvents;
	},

	addProject: function(){
		var name = $('input[name=name]').val();
		var description = $('textarea[name=description]').val();
		if(name.length<2){
			console.log('name too short.');
			return false;
		}
		var that = this;
		$.post('/projects',{
			name: name,
			description: description 
		},function success(){
			that.socketEvents.trigger('app:projects:reload');
		});
		window.location.hash = 'contact/add';
		return false;
	},

	render: function(){
		this.$el.html(projectAddTemplate());
		return this;
	}
});