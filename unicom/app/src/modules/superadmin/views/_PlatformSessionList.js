var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    ListView = require('./__ListView'),
    featureTpl = require('../templates/_entityPlatformSession.tpl'),
    SessionCollection = require('../models/PlatformSessionCollection');

Backbone.$ = $;
	
exports = module.exports = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(featureTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new SessionCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		var session = model.get('session');
		try{
			session = JSON.parse(session);
			model.set('email',session.email);
			model.set('username',session.username);
			model.set('apps',session.apps);
			model.set('grants', _.keys(session.grant).join('; ').slice(0,40) + '...');
		}catch(err){
			model.set('email',session);
		}
		return this.template({model: model.toJSON()});
	},
});
