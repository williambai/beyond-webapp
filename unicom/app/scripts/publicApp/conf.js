/**
 * Page 配置文件
 * @type {[type]}
 */
var _ = require('underscore');

var config = require('../conf');

_.extend(config,{
	app: {
		name: '移动客户端',
		nickname: 'public',
		description: '',
	},
});

exports = module.exports = config;