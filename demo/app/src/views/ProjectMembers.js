var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    membersTemplate = require('../templates/projectMembers.tpl'),
    projectBarTemplate = require('../templates/_barProject.tpl'),
    MemberListView = require('./_ListProjectMember'),
    Project = require('../models/Project');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',
	
	initialize: function(options){
		this.pid = options.pid;
		this.account = options.account;
		this.project = new Project();
		this.project.url = config.api.host + '/projects/' + options.pid;
		this.project.on('change', this.render,this);
		this.on('load',this.load,this);
	},
	
	events: {
		'scroll': 'scroll',
	},

	load: function(){
		this.loaded = true;
		this.render();
		var that = this;
		this.project.fetch({
			xhrFields: {
				withCredentials: true
			},
			success: function(model){
				var createby = model.get('createby');
				if(that.account.id == createby.uid){
					that.project.set('isOwner', true);
				}
				var url = config.api.host + '/accounts/project/' + that.pid;
				var memberListView = new MemberListView({url: url,project:that.project});
				memberListView.trigger('load');
			}
		});
	},

	render: function(){
		//增加 bottom Bar
		if($('.navbar-absolute-bottom').length == 0){
			// var bottomBarView = new BottomBarView({
			// 		id: this.pid,
			// 		account: this.account,
			// 		project: this.model,
			// 		socketEvents: this.socketEvents,
			// 		parentView: this,
			// 	});
			// $(bottomBarHtml).prependTo('.app');
			var bottomBarHtml = projectBarTemplate({id:this.pid});
			$('.app').prepend('<div class="bottom-bar">' +bottomBarHtml + '</div>');
			if(!$('body').hasClass('has-navbar-bottom')){
				$('body').addClass('has-navbar-bottom');
			}
		}
		this.$el.html(membersTemplate({project:this.project.toJSON()}));
		return this;
	}

});