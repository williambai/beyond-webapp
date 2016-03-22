var _ = require('underscore');
var __Layout = require('../../../views/__Layout');
var layoutTemplate = require('../templates/__layout.tpl');

exports = module.exports = __Layout.extend({
	layoutTemplate: _.template(layoutTemplate),	

	rightSideBarToggle: function(){
		window.location.hash="index";
		return false;
	},
});
