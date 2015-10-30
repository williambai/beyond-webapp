var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
	loadingTemplate = require('../templates/loading.tpl'),
    addMemberTemplate = require('../templates/projectMemberAdd.tpl'),
    AccountListView = require('./_ListProjectAccount'),
    Project = require('../models/Project');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loaded: false,

	authorized: false,

	events: {
		'submit form': 'search'
	},
	initialize: function(options){
		var that = this;
		this.pid = options.pid;
		this.account = options.account;
		this.on('load', this.load, this);
	},

	load: function(){
		var that = this;
		this.loaded = true;
		this.project = new Project();
		this.project.url = config.api.host + '/projects/' + this.pid;
		this.project.fetch({
			xhrFields: {
				withCredentials: true
			},
			success: function(model){
				var createby = model.get('createby') || {};
				if(that.account.id == createby.uid){
					that.authorized = true;
					that.project.set('isOwner', true);
				}
				that.render();
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
		if(!this.loaded){
			this.$el.html(loadingTemplate());
			return this;
		}
		if(!this.authorized){
			this.$el.html('401 unauthorized.');
			return this;
		}
		this.$el.html(addMemberTemplate({model:{_id: this.pid}}));
		return this;
	}
});