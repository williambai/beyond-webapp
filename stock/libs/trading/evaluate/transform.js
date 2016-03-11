var Transform = function(){
	this.total = {
		count: 0, //** 总计数
		price: 0,//** 总价格
	};
	this.max = {//** 全局最大值
		price: 0,
	};
	this.min = {//** 全局最小值
		price: 10000,
	};
	this.mean = {}; //** 平均数
	this.median = {}; //** 中位数
	this.sd = {//** 平方差
		price: 0, //** 价格平方差
	};
	this.energy = {//** 能量
		price: 0, //** 价格能量
	};
	this.entropy = {//** 信息熵
	};
	this.transcount = {//** 交易次数
		'range_3': {//** 振幅3%
			'down_0': { //** 0% 回调
				sell: 0, //** 上涨卖出次数
				buy: 0 //** 下跌买入次数
			},
			'down_1': 0, //** 1% 回调
		},
		'range_5': {//** 振幅5%
			'down_0': { 
				sell: 0, 
				buy: 0 
			},
			'down_1': 0, 
		},
		'range_7': {//** 振幅7%
			'down_0': { 
				sell: 0, 
				buy: 0 
			},
			'down_1': 0,
		},
	}
};

//** 当前 item 对象
var _item;
var _stage = '待定';//** "待定"、"上涨"趋势 或者 "下跌"趋势
var _stageTrans ={ //** 最近一次交易点
		'range_3': {
			'down_0': {
				price: 0,
			}
		},
		'range_5': {
			'down_0': {
				price: 0,
			}
		},
		'range_7': {
			'down_0': {
				price: 0,
			}
		}
	};
var _stageMax = {//** 局部最大值
		price: 0,
	};
var _stageMin = {//** 局部最小值
		price: 10000,
	};	

//** 处理单条数据的入口
Transform.prototype.step1 = function(item){
	var that = this;
	//** 保存当前 item 对象
	_item = item;
	//** 仅第一次记录属性
	if(!this.stock) this.stock = {
		symbol: item.symbol,
		name: item.name,
		startdate: item.date,
	};
	var priceItem =  Number(item.price);
	this.total.count ++;
	this.total.price = this.total.price + priceItem;
	//** 记录全局最大、最小值
	if(priceItem > this.max.price) this.max.price = priceItem;
	if(priceItem < this.min.price) this.min.price = priceItem;
	//** 记录局部最大、最小值
	if(priceItem > _stageMax.price) _stageMax.price = priceItem;
	if(priceItem < _stageMin.price) _stageMin.price = priceItem;

	//** 固定涨幅交易 3%,5%,7%
	var percents = [3,5,7];
	percents.forEach(function(percent){
		if(priceItem > _stageTrans['range_'+ percent]['down_0'].price * (1 + 0.01*percent)){
			//** 卖出交易+1
			that.transcount['range_'+ percent]['down_0'].sell ++;
			_stageTrans['range_'+ percent]['down_0'].price = priceItem;
		}else if(priceItem < _stageTrans['range_'+ percent]['down_0'].price * (1 - 0.01*percent)){
			//** 买入交易+1
			that.transcount['range_'+ percent]['down_0'].buy ++;
			_stageTrans['range_'+ percent]['down_0'].price = priceItem;
		}
	});
};
//** step2 处理
Transform.prototype.step2 = function(){
	this.setPriceMean();
};
//** 高级处理
Transform.prototype.step3 = function(item){
	this.setPriceSD(item);
	this.setPriceEnergy(item);
};

//** 设置价格标准平方差
Transform.prototype.setPriceSD = function(item){
	var priceItem =  Number(item.price);
	this.sd.price += Math.abs(priceItem - this.mean.price);
};

//** 设置价格能量
Transform.prototype.setPriceEnergy = function(item){
	var priceItem =  Number(item.price);
	this.energy.price += priceItem * priceItem;
};
//** 计算价格的平均值
Transform.prototype.setPriceMean = function(){
	this.mean.price = this.total.price / this.total.count;
	return this.mean.price;
};

Transform.prototype.getResult = function(){
	//** 仅最后一次需要记录的属性
	this.stock.enddate = _item.date;
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
	var filename = path.join(__dirname,'../../../test/fixtures/_stock/sh600218.json');

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