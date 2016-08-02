var _ = require('underscore');

var config = require('../../../conf');

_.extend(config,{
	app: {
		name: '渠道销售微信端',
		nickname: 'channel',
		description: '',
	}
});

exports = module.exports = config;