var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
var crypto = require('crypto');
var async = require('async');

var url = 'mongodb://localhost:27017/lottery';

var admin = {
		id: new ObjectID(),
		email: 'admin@pdbang.cn',
		username: 'admin',
		cardid: '123456789012345'
	};
var agent = {
		id: new ObjectID(),
		email: 'agent@pdbang.cn',
		username: '中国移动浙江分公司温州子公司',
		cardid: '123456789012345'
	};
var users = [];
for(var i=0; i< 200; i++){
	if(i<10){
		users.push({
			id: new ObjectID(),
			mobile: '13900' + i,
			username: 'real13900' + i,
			cardid: '123456789012345'
		});
	}else if(i<100){
		users.push({
			id: new ObjectID(),
			mobile: '1390' + i,
			username: 'real1390' + i,
			cardid: '123456789012345'
		});
	}else{
		users.push({
			id: new ObjectID(),
			mobile: '139' + i,
			username: 'real139' + i,
			cardid: '123456789012345'
		});
	}
}

var dropAccounts = function(db,callback){
	var accounts = db.collection('accounts');
	accounts.drop(function(err,result){
		callback(null,true);
	});
};
var dropOrders = function(db,callback){
	var orders = db.collection('orders');
	orders.drop(function(err,result){
		callback(null,true);
	});
};
var dropRecords = function(db,callback){
	var records = db.collection('records');
	records.drop(function(err,result){
		callback(null,true);
	});
};

var upsertAdmin = function(db,callback){
		var accounts = db.collection('accounts');
		accounts.findOneAndUpdate(
			{
				_id: admin.id,
			},
			{
				createby: {
					id: admin.id.toString('hex'),
					username: admin.username,
					avatar: '',
				},
				email: admin.email,
				username: admin.username,
				password: crypto.createHash('sha256').update('123456').digest('hex'),
				cardid: admin.cardid,
				avatar: '',
				roles: {
					admin: true,
					agent: true,
					user: true
				},
				business: {
					stage: 'prod',
					times: -1,
					expired: -1
				},
				balance: 100000,
				enable: true,
			},
			{
				upsert: true
			},
			callback
		);
	};

var upsertAgent = function(db,callback){
		var accounts = db.collection('accounts');
		accounts.findOneAndUpdate(
			{
				_id: agent.id
			},
			{
				createby: {
					id: admin.id.toString('hex'),
					username: admin.username,
					avatar: '',
				},
				email: agent.email,
				username: agent.username,
				password: crypto.createHash('sha256').update('123456').digest('hex'),
				cardid: agent.cardid,
				avatar: '',
				roles: {
					admin: true,
					agent: true,
					user: true
				},
				business: {
					stage: 'prod',
					times: -1,
					expired: -1
				},
				balance: 100000,
				enable: true,
			},
			{
				upsert: true
			},
			callback
		);
	};

var upsertAccounts = function(db,callback){
		var accounts = db.collection('accounts');
		var upsertAccount = function(index){
				var user = users[index];
				accounts.findOneAndUpdate(
					{
						_id: user.id,
					},
					{
						createby: {
							id: agent.id.toString('hex'),
							username: agent.username,
							avatar: '',
						},
						email: user.mobile,
						username: user.username,
						password: crypto.createHash('sha256').update('123456').digest('hex'),
						cardid: user.cardid,
						avatar: '',
						roles: {
							admin: false,
							agent: false,
							user: true
						},
						business: {
							stage: 'prod',
							times: -1,
							expired: -1
						},
						balance: 100000,
						enable: !!(index%4) ? true: false,
					},
					{
						upsert: true
					},
					function(err,result){
						if(index > 198){
							callback(null,result);
							return;
						}
						upsertAccount(++index);
					}
				);
			};
		upsertAccount(0);	
	};

var upsertOrders = function(db,callback){
	var orders = db.collection('orders');
	var upsertOrder = function(index){
		var user = users[index];
		orders.findOneAndUpdate(
			{
				'customer.email': user.mobile,
			},
			{
				customer: {
					id: user.id.toString('hex'),
					email: user.mobile,
					username: user.username,
				},
				game: {
					name: '双色球',
					ltype: 'QGSLTO',
					playtype: 1,
					chipintype: 0,
					content: '01|02|03|04|05|06-07',
					periods: 4,
					sms: 'every',
					remained: 4
				},
				createby: {
					id: agent.id.toString('hex'),
					email: agent.email,
					username: agent.username,
				},
				histroies: [],
				records: [],
				status: 0, //0: enable, -1: disable
				expired: new Date((new Date()).getTime() + 1000*3600*24*10), 
				lastupdatetime: new Date(),
			},
			{
				upsert: true
			},
			function(err,result){
				if(index > 198){
					callback(null,result);
					return;
				}
				upsertOrder(++index);
			}
		);
	}
	upsertOrder(0);
};

var upsertRecords = function(db,callback){
	var records = db.collection('records');
	var upsertRecord = function(index){
		var user = users[index];
		records.findOneAndUpdate(
			{
				'customer.email': user.mobile,
			},
			{
				customer: {
					id: user.id.toString('hex'),
					email: user.mobile,
					username: user.username,
					cardid: user.cardid,
				},
				game: {
					name: '双色球',
					ltype: 'QGSLTO',
					periodnum: '20150701',
					playtype: 1,
					chipintype: 0,
					content: '01|02|03|04|05|06-07',
					amount: index%5,
					sms: !!(index%2) ? true : false
				},
				createby: {
					id: agent.id.toString('hex'),
					email: agent.email,
					username: agent.username,
				},
				histroies: [],
				status: index%4, // 0: created, 1: requested, 2: responsed: success, -1: responsed: failure
				bonus: (index%16 == 3) ? 20.00 : 0,
				lastupdatetime: new Date(),
			},
			{
				upsert: true
			},
			function(err,result){
				if(index > 198){
					callback(null,result);
					return;
				}
				upsertRecord(++index);
			}
		);
	}
	upsertRecord(0);
};


MongoClient.connect(url, function(err,db){
	async.waterfall(
		[
			function(callback){
				callback(null,true);
			},
			function(data,callback){
				dropAccounts(db,callback);
			},
			function(data,callback){
				dropOrders(db,callback);
			},
			function(data,callback){
				dropRecords(db,callback);
			},
			function(data,callback){
				upsertAdmin(db,callback);
			},
			function(data,callback){
				upsertAgent(db,callback);
			},
			function(data,callback){
				upsertAccounts(db,callback);
			},
			function(data,callback){
				upsertOrders(db,callback);
			},
			function(data,callback){
				upsertRecords(db,callback);
			}
		],
		function(err,result){
			if(err) {
				console.error(err);
			}
			db.close();
		}
	);
});
