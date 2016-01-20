var _ = require('underscore');

var config = require('../../../conf');

_.extend(config,{
	app: {
		name: '渠道销售微信端',
		nickname: 'channel',
		description: '',
	},
	wechat: {
		appid: 'wx0179baae6973c5e6'
	}
});

exports = module.exports = config;