var _ = require('underscore');
var __Layout = require('../../../views/__Layout');
var layoutTemplate = _.template(require('../templates/__layout.tpl'));

exports = module.exports = __Layout.extend({
	layoutTemplate: layoutTemplate,	
});
