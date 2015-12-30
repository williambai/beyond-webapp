var _ = require('underscore');

var config = require('../../../conf');

_.extend(config,{
	api: {
		host: 'http://192.168.0.150:8092',
	},
	app: {
		name: '渠道销售移动客户端',
		nickname: 'channel',
		description: '',
	}
});

exports = module.exports = config;