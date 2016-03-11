var Transform = function(){
	this.total = {
		count: 0, //** 总计数
		price: 0,//** 总价格
	};
	this.mean = {}; //** 平均数
	this.median = {}; //** 中位数
	this.sd = {//** 平方差
		price: 0, //** 价格平方差
	};
	this.energy = {//** 能量
		price: 0, //** 价格能量
	};
	//** 信息熵
};

//** 处理单条数据的入口
Transform.prototype.step1 = function(item){
	this.total.count ++;
	this.total.price = this.total.price + Number(item.price);
	this.setPriceEnergy(item);
};
//** step2 处理
Transform.prototype.step2 = function(){
	this.setPriceMean();
};
//** 高级处理
Transform.prototype.step3 = function(item){
	this.setPriceSD(item);
};

//** 设置价格标准平方差
Transform.prototype.setPriceSD = function(item){
	this.sd.price += Math.abs(Number(item.price) - this.mean.price);
};

//** 设置价格能量
Transform.prototype.setPriceEnergy = function(item){
	this.energy.price += Number(item.price) * Number(item.price);
};
//** 计算价格的平均值
Transform.prototype.setPriceMean = function(){
	this.mean.price = this.total.price / this.total.count;
	return this.mean.price;
};

Transform.prototype.getResult = function(){
	return JSON.stringify(this);
};

//** 切割字符串为单个JSON对象格式
var StreamSpliter = function(eventEmitter){
	var left = '';
	return function(trunk){
		//** 最后一个可能不齐，保留并增加在下一个trunk前
		var arrs = (left + trunk.toString('utf8')).split('\n');
		left = arrs.pop();
		// console.log(left);
		arrs.forEach(function(message){
			eventEmitter.emit('message', null, message);
		});
	};
}

//** unit test
if(process.argv[1] == __filename){
	var util = require('util');
	var EventEmitter = require('events').EventEmitter;
	var fs = require('fs');
	var path = require('path');
	var filename = path.join(__dirname,'../../../test/fixtures/_stock/sh601111.json');

	var transform = new Transform;
	//** 第一遍处理
	var eventEmitter = new EventEmitter;
	eventEmitter.on('message',function(err,message){
		if(err) return console.log(err);
		//** json字符串转化为json对象
		try{
			message = JSON.parse(message);
		}catch(e){
			return console.error(e);
		}
		// console.log(message);
		transform.step1(message);
	});

	var readStream = fs.createReadStream(filename);
	readStream.on('end',function(){
		transform.step2();
		//** 第二遍处理
		var eventEmitter2 = new EventEmitter;
		eventEmitter2.on('message',function(err,message){
			if(err) return console.log(err);
			//** json字符串转化为json对象
			try{
				message = JSON.parse(message);
			}catch(e){
				return console.error(e);
			}
			// console.log(message);
			transform.step3(message);
		});

		var readStream2 = fs.createReadStream(filename);
		readStream2.on('end',function(){
			console.log(transform.getResult());
			console.log('end successfully.');
		});
		readStream2.on('data',new StreamSpliter(eventEmitter2));
	});
	readStream.on('data',new StreamSpliter(eventEmitter));
}