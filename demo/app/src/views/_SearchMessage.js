var _ = require('underscore');
var $ = require('jquery'),
    SearchView = require('./__SearchView');

exports = module.exports = SearchView.extend({
	el: '#search',

	events: {
		'click #allbox': 'allBox',
		'click #inbox': 'inBox',
		'click #outbox': 'outBox'
	},

	_pre: function(evt){
		this.$('.btn-primary').removeClass('btn-primary').addClass('btn-default');
		$(evt.currentTarget).removeClass('btn-default').addClass('btn-primary');
	},

	allBox: function(evt){
		this._pre(evt);
		var uri = 'messages/account/me?type=all';
		this.done(uri);
		return false;
	},

	inBox: function(evt){
		this._pre(evt);
		var uri = 'messages/account/me?type=inbox';
		this.done(uri);
		return false;
	},

	outBox: function(evt){
		this._pre(evt);
		var uri = 'messages/account/me?type=outbox';
		this.done(uri);
		return false;
	},

});