//** common packages
var path = require('path');
var fs = require('fs');
var net = require('net');
var request = require('request');
var config = {
	db: require('./config/db'),
	sp: require('./config/sp').SGIP12,
};
//** logger packages
var log4js = require('log4js');
log4js.configure(path.join(__dirname, 'config/log4js.json'));
var logger = log4js.getLogger(path.relative(process.cwd(), __filename));
//** MongoDB packages
var mongoose = require('mongoose');
mongoose.connect(config.db.URI, function onMongooseError(err) {
	if (err) {
		logger.error('Error: can not open Mongodb.');
		throw err;
	}
});
//** import MongoDB's models
var models = {};
fs.readdirSync(path.join(__dirname, 'models')).forEach(function(file) {
	if (/\.js$/.test(file)) {
		var modelName = file.substr(0, file.length - 3);
		models[modelName] = require('./models/' + modelName)(mongoose);
	}
});

//** SGIP1.2 protocol
var Receiver = require('./libs/sms').Receiver;
var sms = require('./business/sms');

//** TCP/IP server
var sgipSerice = net.createServer();

sgipSerice.on('error', function(err) {
	logger.error(err);
	sgipSerice.close(function(){
		logger.warn('sgip service is closed.');
	});
});

sgipSerice.on('connection', function(socket) {
	logger.debug('客户端连接成功。');
	//** 设置客户端连接超时
	socket.setTimeout(30000);
	//** 客户端发送FIN
	socket.on('end', function() {
		logger.debug('客户端连接断开。');
	});
	//** 客户端超时，则断开
	socket.on('timeout', function() {
		socket.destroy();
		logger.debug('客户端超时，断开连接');
	});

	var receiver = new Receiver();

	//** receive 'report' command
	receiver.on('report', function(err, command) {
		if (err) return logger.error(err);
		logger.debug('>> report: ' + JSON.stringify(command));
		sms.report(models, {
			command: command,
		}, function(err, result) {
			if (err) return logger.error(err);
		});
	});

	//** receive 'deliver' command
	receiver.on('deliver', function(err, command) {
		if (err) return logger.error(err);
		logger.debug('>> deliver: ' + JSON.stringify(command));
		sms.deliver(models, {
			command: command,
		}, function(err, result) {
			if (err) return logger.error(err);
		});
	});
	receiver.process(socket);
});

/**
 * 以服务模式接收短信中心转发的短信
 */

sgipSerice.listen(config.sp.listener.port, function() {
	logger.info('SGIP短信接收服务启动在 port:' + config.sp.listener.port);
});

/**
 * 周期性发送数据库中的新短信
 * 
 */

//** CronJob package
var CronJob = require('cron').CronJob;

//** send 'new' sms in database
var submit = require('./business/sms').submit;
var sendSMSJob = new CronJob({
	cronTime: '*/10 * * * * *',
	onTick: function(){
		submit(models,function(err,result) {
			if(err || !result) return logger.error(err);
			if (result.count > 0) {
				logger.info('submit ' + (result.count ) + ' SMS successfully.');
			} else {
				logger.info('none SMS need submit till now.');
			}

		});
	},
	start: true,
	runOnInit: true,//** execute right now!
});

//** process uncaughtException
process.on('uncaughtException', function(){
	logger.warn('uncaughtException and process exit.');
	process.exit(1);
});