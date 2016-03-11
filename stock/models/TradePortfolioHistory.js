module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		backup: {},//** TradePortfolio 实例
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});
	schema.set('collection','trade.portfolio.histroies');
	return mongoose.model('TradePortfolioHistroy',schema);//** 保存TradePortfolio历史记录
};