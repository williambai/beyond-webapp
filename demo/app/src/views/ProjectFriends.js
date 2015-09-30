var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    friendsTemplate = require('../../assets/templates/projectFriends.tpl'),
    projectBarTemplate = require('../../assets/templates/_barProject.tpl'),
    FriendListView = require('./_ListFriend'),
    Project = require('../models/Project'),
    FriendCollection = require('../models/FriendCollection');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',
	
	initialize: function(options){
		this.pid = options.pid;
		this.account = options.account;
		this.model = new Project();
		this.model.url = '/projects/' + options.pid;
		this.model.on('change', this.render,this);
		this.on('load',this.load,this);
	},
	
	events: {
		'scroll': 'scroll',
	},

	load: function(){
		this.loaded = true;
		this.render();
		var url = '/accounts/project/' + this.pid;
		var contactListView = new FriendListView({url: url});
		contactListView.trigger('load');
		var that = this;
		// this.model.fetch({
		// 	success: function(model){
		// 		if(that.account.id == model.get('accountId')){
		// 			model.set('isOwner', true);
		// 		}
		// 		that.collection.fetch();
		// 	}
		// });
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
		this.$el.html(friendsTemplate({project:this.model.toJSON()}));
		return this;
	}

});