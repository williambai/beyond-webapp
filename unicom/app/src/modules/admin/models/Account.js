var Role =  require('../../../models/Account');
var config = require('../conf');
exports = module.exports = Role.extend({
	urlRoot: config.api.host + '/admin/accounts',
});
