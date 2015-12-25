var _ = require('underscore');

var config = require('../../../conf');

_.extend(config,{
	app: {
		name: '管理后台',
		nickname: 'admin',
		description: '',
	}
});

exports = module.exports = config;