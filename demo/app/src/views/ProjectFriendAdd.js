var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    addFriendTemplate = require('../../assets/templates/projectFriendAdd.tpl'),
    AccountListView = require('./_ListProjectAccount'),
    Project = require('../models/Project');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'submit form': 'search'
	},
	initialize: function(options){
		var that = this;
		this.pid = options.pid;
		this.account = options.account;
		this.project = new Project();
		this.project.url = config.api.host + '/projects/' + options.pid;
		var that = this;
		this.project.fetch({
			xhrFields: {
				withCredentials: true
			},
			success: function(model){
				if(that.account.id == model.get('accountId')){
					that.project.set('isOwner', true);
				}
			}
		});
	},

	search: function(){
		var emailDomain = this.account.email.substr(this.account.email.indexOf('@'));
		var url = config.api.host + '/accounts?type=search' + 
				'&searchStr=' + 
				$('input[name=searchStr]').val() + emailDomain;
		var accountListView = new AccountListView({url: url, pid: this.pid});
		accountListView.trigger('load');
		return false;
	},

	render: function(){
		this.$el.html(addFriendTemplate({model:{_id: this.pid}}));
		return this;
	}
});