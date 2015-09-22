var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    addContactTemplate = require('../../assets/templates/projectContactSearch.tpl'),
    ContactListView = require('./_ListContact'),
    Project = require('../models/Project');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'submit form': 'search'
	},
	initialize: function(options){
		this.pid = options.pid;
		this.account = options.account;
		this.project = new Project();
		this.project.url = '/projects/' + options.pid;
		var that = this;
		this.project.fetch({
			success: function(model){
				if(that.account.id == model.get('accountId')){
					model.set('isOwner', true);
				}
			}
		});
	},

	search: function(){
		var emailDomain = this.account.email.substr(this.account.email.indexOf('@'));
		var url = '/accounts?type=search' + 
				'&searchStr=' + 
				$('input[name=searchStr]').val() + emailDomain;
		var contactListView = new ContactListView({url: url});
		contactListView.trigger('load');
		return false;
	},

	render: function(){
		this.$el.html(addContactTemplate({model:{_id: this.pid}}));
		return this;
	}
});