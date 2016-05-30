var path = require('path');
var logger = require('log4js').getLogger(path.relative(process.cwd(), __filename));
var CBSS = require('../libs/cbss');

var mongoose = require('mongoose');
var connection = mongoose;
var schema = new mongoose.Schema({
	staffId: String,//** cbss账号
	password: String,//** cbss密码
	provinceId: String, //** 省市编码
	province_name: String, //** 省市名称
	city_id: String,//** 城市编码
	cookies: [],
	cookieRaw: String,
	login: {
		type: Boolean,
		default: false
	},
	status: {
		type: String,
		enum: {
			values: '有效|无效'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		}
	},
	lastupdatetime: {
		type: Date,
		default: Date.now
	},
});

schema.set('collection','cbss.accounts');

/**
 * 自动登录
 * @param  {[type]}   options [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
schema.statics.login1 = function(options, done){
	connection.models
		.CbssAccount
		.findOne({
			cityId: options.cityId || '',
		},function(err, account){
			if(err) return done(err);
			if(!account) return done(null, '账号不存在');
			logger.debug(account.staffId + '正在登录...');
			CBSS.login({
				cwd: path.resolve(__dirname,'..'),//** 当前工作路径
				tempdir: './_tmp',
				user: account.staffId,//** 六盘水
				pass: account.password,
				provid: account.provinceId,//** 省份id
			}, function(err, response){
				if(err) return done(err);
				//** {"status":"未登录","login":true,"message":"登录页参数获取成功！","meta":["<meta id=\"pagecontext\" pagename=\"Main\" productmode=\"true\" staffid=\"B90WZSLP\" staffname=\"李奇\" deptid=\"85b26xf\" deptcode=\"85b26xf\" deptname=\"沃助手六盘水运营渠道\" cityid=\"0858\" cityname=\"六盘水\" areacode=\"0858\" areaname=\"六盘水\" epachyid=\"0858\" epachyname=\"六盘水\" loginepachyid=\"0858\" version=\"BSS2PLUS\" provinceid=\"85\" subsyscode=\"BSS\" contextname=\"essframe\" logincheckcode=\"201605308524341354\" loginprovinceid=\"85\">"]}
				logger.debug(account.staffId + ' login response: ' + JSON.stringify(response));
				if(response.login){
					//** 登录成功
					logger.info(account.staffId + '登录成功。');
					done(null,account);
				}else{
					//** 登录失败
					logger.warn(account.staffId + '登录失败。');
					done(null);
				}
			});			
		});
};

/**
 * 自动登录(非数据库)
 * @param  {[type]}   account [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
schema.statics.login = function(account, done){
	logger.debug(account.staffId + '正在登录...');
	CBSS.login({
		cwd: path.resolve(__dirname,'..'),//** 当前工作路径
		tempdir: './_tmp',
		user: account.staffId,//** 六盘水
		pass: account.password,
		provid: account.provinceId,//** 省份id
	}, function(err, response){
		if(err) return done(err);
		//** {"status":"未登录","login":true,"message":"登录页参数获取成功！","meta":["<meta id=\"pagecontext\" pagename=\"Main\" productmode=\"true\" staffid=\"B90WZSLP\" staffname=\"李奇\" deptid=\"85b26xf\" deptcode=\"85b26xf\" deptname=\"沃助手六盘水运营渠道\" cityid=\"0858\" cityname=\"六盘水\" areacode=\"0858\" areaname=\"六盘水\" epachyid=\"0858\" epachyname=\"六盘水\" loginepachyid=\"0858\" version=\"BSS2PLUS\" provinceid=\"85\" subsyscode=\"BSS\" contextname=\"essframe\" logincheckcode=\"201605308524341354\" loginprovinceid=\"85\">"]}
		logger.debug(account.staffId + ' login response: ' + JSON.stringify(response));
		if(response.login){
			//** 登录成功
			logger.info(account.staffId + '登录成功。');
			done(null,account);
		}else{
			//** 登录失败
			logger.warn(account.staffId + '登录失败。');
			done(null);
		}
	});			
};
/**
 * 刷新Cookie
 * @param  {[type]}   options [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
schema.statics.refreshCookie = function(options, done){
	logger.debug(options.staffId + '正在刷新cookie...');
	CBSS.cookieRefresh({
		cwd: path.resolve(__dirname,'..'),
		tempdir: './_tmp',
		staffId: options.staffId,
	}, function(err, response){
		if(err) return done(err);
		//** { meta: [ '<meta id="pagecontext" pagename="Nav" productmode="true" staffid="B90WZSLP" staffname="李奇" deptid="85b26xf" deptcode="85b26xf" deptname="沃助手六盘水运营渠道" cityid="0858" cityname="六盘水" areacode="0858" areaname="六盘水" epachyid="0858" epachyname="六盘水" loginepachyid="0858" version="BSS2PLUS" provinceid="85" subsyscode="BSS" contextname="essframe" logincheckcode="201605308524341354" loginprovinceid="85">' ], status: '已登录' }
		logger.debug(options.staffId + ' refreshCookie response: ' + JSON.stringify(response));
		if(response.status == '已登录'){
			//** 在登录状态
			logger.info(options.staffId + '在登录状态。');
			done(null,true);
		}else{
			//** 未登录状态
			logger.info(options.staffId + '未登录状态。');
			done(null);
		}
	});	
};

module.exports = exports = function(conn){
	connection = conn || mongoose;
	return connection.model('CbssAccount',schema);
};