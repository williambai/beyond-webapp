var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    loadingTemplate = require('../../assets/templates/loading.tpl'),
    profileTemplate = require('../../assets/templates/profile.tpl'),
    StatusView = require('./_ItemStatus'),
    Status = require('../models/Status'),
    StatusCollection = require('../models/StatusCollection'),
    Account = require('../models/Account');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loaded: false,

	events: {
		'click .logout': 'logout',
	},

	uiControl: {},

	initialize: function(options){
		this.appEvents = options.appEvents;
		if(options.id == 'me') {
			this.uiControl.me = true;
		}else{
			this.uiControl.me = false;
		}
		this.socketEvents = options.socketEvents;
		this.model = new Account();
		this.model.url = '/accounts/'+ options.id;

		this.statusCollection = new StatusCollection();
		this.statusCollection.url = '/messages/account/status/' + options.id;

		this.model.on('change',this.render,this);
		this.statusCollection.on('add', this.onStatusAdded, this);
		this.statusCollection.on('reset', this.onStatusCollectionReset, this);
		this.on('load',this.load,this);
	},

	load: function(){
		this.loaded = true;
		this.render();
		this.model.fetch();
		this.statusCollection.fetch();
	},

	logout: function(){
		this.appEvents.trigger('logout');
		this.socketEvents.trigger('app:logout');
		$.get('/logout');
		return false;
	},

	onStatusAdded: function(statusModel){
		var statusHtml = (new StatusView({model: statusModel})).render().el;
		$(statusHtml).prependTo('.status-list').hide().fadeIn('slow');
	},

	onSocketStatusAdded: function(data){
		var newStatus = data.data;
		this.onStatusAdded(new Status({
			status: newStatus.status,
			name: newStatus.name
		}));
	},

	render: function(){
		if(!this.loaded){
			this.$el.html(loadingTemplate());
		}else{
			// if(this.model.get('_id')){
			// 	this.socketEvents.bind('status' + this.model.get('_id'), this.onSocketonStatusAdded, this);
			// }
			this.$el.html(profileTemplate({
				ui: this.uiControl,
				account: this.model.toJSON()
			}));
			// var that = this;
			// var statusCollection = this.model.get('status');
			// if(null != statusCollection){
			// 	_.each(statusCollection,function(statusJson){
			// 		var statusModel = new Status(statusJson);
			// 		that.onStatusAdded(statusModel);
			// 	});
			// }
		}
		return this;
	}
});