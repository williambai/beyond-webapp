var Account =  require('../../../models/Account');
var config = require('../conf');
exports = module.exports = Account.extend({
	urlRoot: config.api.host + '/admin/accounts',
});