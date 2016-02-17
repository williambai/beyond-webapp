/**
 * 计算奖励的金币
 * @param  {[type]}   type     [description]
 * @param  {[type]}   revenue  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var bonus = function(category, type, revenue, callback) {
	var category = category || '';
	var bonus = 0;
	switch (category) {
		case 'phone':
			var type = type || '';
			switch (type) {
				case 'CFSJ'://存费送机
					if(revenue > 599){
						bonus = 20;//套餐金额96元及以上,消费金额599元以上（不含599）店员激励（金币）20
					}else{
						bonus = 10;//套餐金额96元以下,消费金额不限
					}
					break;
				case 'GJSF'://购机送费,套餐金额46元及以上
					if(revenue >= 200){//消费金额200元及以上
						bonus = 20;
					}else if(revenue > 100){//消费金额100元以上，200元以下
						bonus = 10;
					}else{
						bonus = 0;
					}
					break;
				case 'JKBD'://2G/3G融合套餐机卡绑定,套餐金额不限
					if(revenue > 140){//消费金额140元以上
						bonus = 10
					}
					break;
				default:
					break;
			}
			break;
		case 'data':

			break;
		default:
			break;
	}
	callback && callback(null,bonus);
	return bonus;
};
exports = module.exports =bonus;