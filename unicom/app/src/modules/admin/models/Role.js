var Role =  require('../../../models/Role');
var config = require('../conf');
exports = module.exports = Role.extend({
	urlRoot: config.api.host + '/protect/roles',
});
