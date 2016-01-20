var Role =  require('../../../models/Role');
var config = require('../conf');
exports = module.exports = Role.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/platform/roles',
});
