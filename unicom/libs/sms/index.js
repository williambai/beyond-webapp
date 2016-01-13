var sp = {

};

sp.send = function(doc,callback){
	callback(null,{id: '1234567890'});
};

sp.checkReport = function(doc,callback){
	callback(null,{id: '1234567890', status: '已确认'});
	// callback(null,{id: '1234567890', status: '失败'});
};

sp.checkReply = function(doc,callback){
	callback(null,{id: '1234567890', status: '已订购'});
	// callback(null,{id: '1234567890', status: '已取消'});
};

exports = module.exports = sp;