var path = require('path');
var logger = require('log4js').getLogger(path.relative(process.cwd(), __filename));
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	backup: {},//** TradePortfolio 实例
	lastupdatetime: {
		type: Date,
		default: Date.now
	},
});
schema.set('collection','trade.portfolio.histroies');

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('TradePortfolioHistory',schema);//** 保存TradePortfolio历史记录
};