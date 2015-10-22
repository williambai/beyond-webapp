var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    friendsTemplate = require('../../assets/templates/projectFriends.tpl'),
    projectBarTemplate = require('../../assets/templates/_barProject.tpl'),
    FriendListView = require('./_ListProjectFriend'),
    Project = require('../models/Project'),
    FriendCollection = require('../models/FriendCollection');
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
		var url = config.api.host + '/accounts/project/' + this.pid;
		var friendListView = new FriendListView({url: url});
		friendListView.trigger('load');
		var that = this;
		this.project.fetch({
			success: function(model){
				var createby = model.get('createby');
				if(that.account.id == createby.uid){
					that.project.set('isOwner', true);
				}
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
		this.$el.html(friendsTemplate({project:this.project.toJSON()}));
		return this;
	}

});