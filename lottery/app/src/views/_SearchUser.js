var _ = require('underscore');
var $ = require('jquery'),
    SearchView = require('./__SearchView');
var config = require('../conf');

exports = module.exports = SearchView.extend({
	el: '#search',

	events: {
		'submit form': 'search'
	},

	search: function(){
		var url = config.api.host + '/accounts?type=search&searchStr=' + $('input[name=searchStr]').val();
		this.done(url);
		return false;
	},

});