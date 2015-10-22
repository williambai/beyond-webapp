var _ = require('underscore');
var $ = require('jquery'),
    SearchView = require('./__SearchView');
var config = require('../conf');

exports = module.exports = SearchView.extend({
	el: '#search',

	events: {
		'click button': 'submit',
	},

	submit: function(evt){
		var uri = config.api.host + '/projects?type=search&search=';
		this.done(uri);
		return false;
	},

});