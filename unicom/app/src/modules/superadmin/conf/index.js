var _ = require('underscore');

var config = require('../../../conf');

_.extend(config,{
	app: {
		name: '系统管理员',
		nickname: 'superadmin',
		description: '',
	}
});

exports = module.exports = config;