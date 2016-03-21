/**
 * 检查和处理财务平衡
 * 
 */

var Finance = {};
var async = require('async');

/**
 * 检查每个用户的总账平衡
 * 即：FinanceAccount与FianceJournal的平衡
 */
Finance.checkAccountBalance = function(models,options, done){
	async.series(
		[
			function getFinanceAccountBalances(callback){
				//** 聚合FinaaceAccount的balance 
				models.FinanceAccount
					.aggregate({
						$group: {
							_id: '$uid',
							balance: {
								$sum: '$amount'
							}
						}
					})
					.exec(function(err,accountBalances){
						if(err) return callback(err);
						callback(accountBalances);
					});				
			},
			function getFinanceJournalBalances(callback){
				//** 聚合FinaaceJournal的balance 
				model.FinanceJournal
					.aggregate({
						$group: {
							_id: '$uid',
							balance: {
								$sum: '$amount'
							}
						}
					})
					.exec(function(err,journalBalances){
						if(err) return callback(err);
						callback(journalBalances);
					});
			},
		]
		,function(err,results){
			if(err) return done(err);
			//** 比较accountBalances和journalBalances的不同，返回不相等的异常数据
			//TODO 
			done(null,null);
		});
};

/**
 * 检查佣金发放平衡
 * 即：FinanceJournal与FinanceBonus的平衡
 */
Finance.checkBonusBalance = function(models, options, done){

};

exports = module.exports = Finance;