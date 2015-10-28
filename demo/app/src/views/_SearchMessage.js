var _ = require('underscore');
var $ = require('jquery'),
    SearchView = require('./__SearchView');
var config = require('../conf');

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
		var query = 'type=all';
		this.done(query);
		return false;
	},

	inBox: function(evt){
		this._pre(evt);
		var query = 'type=inbox';
		this.done(query);
		return false;
	},

	outBox: function(evt){
		this._pre(evt);
		var query = 'type=outbox';
		this.done(query);
		return false;
	},

});