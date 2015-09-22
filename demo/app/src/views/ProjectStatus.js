var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    projectStatusTemplate = require('../../assets/templates/projectStatus.tpl'),
    bottomBarTemplate = require('../../assets/templates/_barProject.tpl'),
    StatusListView = require('./_ListProjectStatus'),
    Status = require('../models/Status'),
    StatusCollection = require('../models/StatusCollection');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	events: {
		'click .editor-toggle': 'editorToggle',
		'submit form': 'updateStatus',
		'scroll': 'scroll',
	},
	
	initialize: function(options){
		this.pid = options.pid;
		options.socketEvents.bind('status:me',this.onSocketStatusAdded, this);
		this.on('load', this.load, this);
	},

	load: function(){
		this.loaded = true;
		this.render();
		this.statusListView = new StatusListView({
			el: 'div.status_list',
			url: '/statuses/project/' + this.pid,
			account: this.account,
		});
		this.statusListView.trigger('load');
	},

	onSocketStatusAdded: function(data){
		var newStatus = data.data;
		this.statusListView.trigger('append', newStatus);
		// this.collection.add(new Status({status: newStatus.status, name: newStatus.name}));
	},


	editorToggle: function(){
		if(this.$('.status-editor').hasClass('hidden')){
			this.$('.status-editor').removeClass('hidden').hide().fadeIn('slow');
		}else{
			this.$('.status-editor').addClass('hidden').hide().fadeOut('slow');
		}
	},

	updateStatus: function(){
		var statusCollection = this.collection;
		var statusText = $('textarea[name=text]').val();
		$.post('/messages/project/'+ this.pid,{text: statusText},function(data){
			// statusCollection.add(new Status({status: statusText,name:{first:'我'}}));
		});
		// var statusModel = new Status({status:statusText,name: {first:'我'}});
		// this.onStatusAdded(statusModel);
		$('textarea[name=text]').val('');
		this.$('.status-editor').addClass('hidden').hide().fadeOut('slow');
		return false;
	},

	scroll: function(){
		this.statusListView.scroll();
		return false;
	},

	render: function(){
		//增加 bottom Bar
		if($('.navbar-absolute-bottom').length == 0){
			var bottomBarHtml = bottomBarTemplate({id:this.pid});
			$('.app').prepend('<div class="bottom-bar">' +bottomBarHtml + '</div>');
			if(!$('body').hasClass('has-navbar-bottom')){
				$('body').addClass('has-navbar-bottom');
			}
		}
		this.$el.html(projectStatusTemplate({model:{_id: this.pid, name: '动态'}}));
		return this;
	},
});