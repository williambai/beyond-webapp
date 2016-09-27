var mongoose = require('mongoose');
var connection = mongoose;

var schema = new mongoose.Schema({
		name: String,
		first: String, //** 小写首字母排序
		description: String,
		address: String,
		city: String,
		province: String,
		country: String,
		zipcode: String,
		point: {}, //** 经纬度
		stars: {  //** 景点几星级
			type: Number, 
			default: 0
		},
	});

schema.set('collection','spots');

//** 获取全部国家集合
schema.statics.getAllCountries = function(done){
	var Spot = connection.model('Spot');
	Spot.distinct('country', function(err,countries){
		done(err,countries);
	});
};

//** 获取全部省份集合
schema.statics.getAllProvinces = function(done){
	var Spot = connection.model('Spot');
	Spot.distinct('province', function(err,provinces){
		done(err,provinces);
	});
};

//** 获取全部城市集合
schema.statics.getAllCities = function(done){
	var Spot = connection.model('Spot');
	Spot.distinct('city', function(err,cities){
		var i= 0;
		var citiesNew = [];
		cities.forEach(function(city){
			citiesNew.push({_id: ++i, name: city});
		});
		done(err,citiesNew);
	});
};


//** 获取指定城市景点列表
schema.statics.getSpotsByCity = function(city, options, done){
	options = options || {};
	var per = options.per || 10;
	var page = (!options.page || options.page < 0) ? 0 : options.page;
	var Spot = connection.model('Spot');
	Spot.find({
			city: city
		})
		.select({
			name: 1
		})
		.skip(per*page)
		.limit(per)
		.exec(done);
};

//** 获取指定经纬度附近的景点列表
schema.statics.getSpotsByPoint = function(point, options, done){

};

//** 获取指定经纬度最近的一个景点
schema.statics.getNearestSpotByPoint = function(point, done){
	var Spot = connection.model('Spot');
	Spot.findOne(function(err,doc){
		done(err,doc);
	});
};

module.exports = exports = function(conn) {
	connection = conn || mongoose;
	return connection.model('Spot', schema);
};
