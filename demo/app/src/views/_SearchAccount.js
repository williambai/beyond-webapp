var _ = require('underscore');
var $ = require('jquery'),
	SearchView = require('./__SearchView');
var config = require('../conf');

exports = module.exports = SearchView.extend({
	el: '#search',

	initialize: function(options) {
		options = options || {};
		this.searchStr = options.searchStr || '';
		this.$('input[name=searchStr]').val(this.searchStr);
	},

	events: {
		'submit form': 'submit',
	},

	submit: function(evt) {
		this.searchStr = this.$('input[name=searchStr]').val();
		var query = {
			type: 'search',
			searchStr: this.searchStr
		};
		this.done(query);
		return false;
	},

});