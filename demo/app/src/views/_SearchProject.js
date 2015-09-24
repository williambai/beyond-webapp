var _ = require('underscore');
var $ = require('jquery'),
    SearchView = require('./__SearchView');

exports = module.exports = SearchView.extend({
	el: '#search',

	events: {
		'click button': 'submit',
	},

	submit: function(evt){
		var uri = 'projects?type=search&search=';
		this.done(uri);
		return false;
	},

});