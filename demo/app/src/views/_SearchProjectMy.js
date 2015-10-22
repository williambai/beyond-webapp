var _ = require('underscore');
var $ = require('jquery'),
    SearchView = require('./__SearchView');
var config = require('../conf');

exports = module.exports = SearchView.extend({
	el: '#search',

	events: {
		'click #all': 'all',
		'click #presenter': 'presenter',
		'click #attendee': 'attendee'
	},

	_pre: function(evt){
		this.$('.btn-primary').removeClass('btn-primary').addClass('btn-default');
		$(evt.currentTarget).removeClass('btn-default').addClass('btn-primary');
	},

	all: function(evt){
		this._pre(evt);
		var uri = config.api.host + '/projects/account/me?type=all';
		this.done(uri);
		return false;
	},

	presenter: function(evt){
		this._pre(evt);
		var uri = config.api.host + '/projects/account/me?type=presenter';
		this.done(uri);
		return false;
	},

	attendee: function(evt){
		this._pre(evt);
		var uri = config.api.host + '/projects/account/me?type=attendee';
		this.done(uri);
		return false;
	},

});