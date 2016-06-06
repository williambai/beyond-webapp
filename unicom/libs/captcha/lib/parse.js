var log4js = require('log4js');
var path = require('path');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var util = require('./util');
var getPixels = require('get-pixels');
var savePixels = require('save-pixels');

/**
 * 将输入的验证码图片切分成4个不同字母的图片
 * @param  {[type]} img [description]
 * @return {[type]}     [description]
 */
var splitImage = function(img) {
	var imgs = [];
	imgs.push(img.lo(0, 0).hi(15, 20));
	imgs.push(img.lo(15, 0).hi(15, 20));
	imgs.push(img.lo(30, 0).hi(15, 20));
	imgs.push(img.lo(45, 0).hi(15, 20));
	return imgs;
};

/**
 * 载入训练集，并将图片和对应的字母关联
 * @return {[type]} [description]
 */
var loadTrainData = function(options, done) {
	if(!done){
		done = options;
		options = {};
	}

	var map = [];
	var dirs = fs.readdirSync(path.join(__dirname, '../train'));
	dirs = _.without(dirs, '.DS_Store');
	async.each(dirs, function(directory, callback1) {
		var cha = directory.slice(-1);
		// console.log('char: ' + cha);
		var files = fs.readdirSync(path.join(__dirname, '../train', directory));
		async.each(files, function(file, callback2) {
			var filepath = path.join(__dirname, '../train', directory, file);
			map.push({
				cha: cha,
				file: file,
				path: filepath,
				matrix: fs.readFileSync(filepath)
			});
			callback2();
		}, function(err){
			if(err) console.error('loadTrainData ['+ cha + '] error.');
			callback1();
		});
	},function(err){
		if(err) return done('loadTrainData error.');
		// console.log('map length: ' + map.length);
		done(null,map);
	});
};

/**
 * 载入训练集，并将图片和对应的字母关联
 * @return {[type]} [description]
 */
var loadTrainDataSync = function() {
	var map = [];
	var dirs = fs.readdirSync(path.join(__dirname, '../train'));
	dirs = _.without(dirs, '.DS_Store');
	async.each(dirs, function(directory) {
		var cha = directory.slice(-1);
		var files = fs.readdirSync(path.join(__dirname, '../train', directory));
		async.each(files, function(file) {
			var filepath = path.join(__dirname, '../train', directory, file);
			map.push({
				cha: cha,
				file: file,
				path: filepath,
				matrix: fs.readFileSync(filepath)
			});
		});
	});
	// console.log('map length: ' + map.length);
	return map;
};

/**
 * 判断图片包含的字母
 * @param  {[type]} img       [description]
 * @param  {[type]} trainData [description]
 * @return {[type]}           [description]
 */

var getSingleCharOcr = function(img, map, done) {
	// img.convertGrayscale();
	var result = '';
	var width = (img && img.shape[0]) || 0;
	var height = (img && img.shape[1]) || 0;
	var min = width * height;
	async.each(map, function(img_matrix, callback) {
		getPixels(img_matrix.path,function(err,img_train){
			// img_train.convertGrayscale();
			var count = 0;
			Label1: for (var x = 0; x < width; x++) {
				for (var y = 0; y < height; y++) {
					// if(img.pick(x,y) != img_train.pick(x,y)){
					if (util.isWhite([img.get(x,y,0), img.get(x,y,1), img.get(x,y, 2)]) != util.isWhite([img_train.get(x,y,0), img_train.get(x,y,1), img_train.get(x,y,2)])) {
						count++;
						if (count >= min) break Label1;
					}
				}
			}
			if (count < min) {
				// console.log('count: ' + count);
				min = count;
				result = img_matrix.cha;
				// console.log('result: '+ result);
			}
			callback();
		});
	}, function(err){
		if(err) done(err);
		done(null,result);
	});
};

/**
 * 判断图片包含的字母
 * TODO not ok?
 * @param  {[type]} img       [description]
 * @param  {[type]} trainData [description]
 * @return {[type]}           [description]
 */

var getSingleCharOcrSync = function(img, map) {
	// img.convertGrayscale();
	var result = '';
	var width = img.shape[0] || 0;
	var height = img.shape[1] || 0;
	var min = width * height;
	async.each(map, function(img_matrix) {
		getPixels(img_matrix.path,function(err,img_train){
			// img_train.convertGrayscale();
			var count = 0;
			Label1: for (var x = 0; x < width; x++) {
				for (var y = 0; y < height; y++) {
					// if(img.pick(x,y) != img_train.pick(x,y)){
					if (util.isWhite([img.get(x,y,0), img.get(x,y,1), img.get(x,y, 2)]) != util.isWhite([img_train.get(x,y,0), img_train.get(x,y,1), img_train.get(x,y,2)])) {
						count++;
						if (count >= min) break Label1;
					}
				}
			}
			if (count < min) {
				console.log('count: ' + count);
				min = count;
				result = img_matrix.cha;
				console.log('result: '+ result);
			}
		});
	});
	return result;
};

/**
 * 获取下载的验证码图片并识别出验证码
 * @param  {[type]} img [description]
 * @return {[type]}     [description]
 */
var getAllOcr = function(buf, map, done) {
	getPixels(buf, function(err, pixels) {
		if (err) return done(err);
		var result = '';
		var imgs = splitImage(pixels);
		async.each(imgs, function(img, callback) {
			getSingleCharOcr(img, map, function(err,cha){
				if(err) return callback(err);
				result += cha;
				callback();
			});
		}, function(err){
			if(err) return done(err);
			done(null,result);
		});
	});
};

/**
 * 获取下载的验证码图片并识别出验证码
 * @param  {[type]} img [description]
 * @return {[type]}     [description]
 */
var getAllOcrSimple = function(buf,done) {
	loadTrainData(function(err,map){
		if(err) return done(err);
		getPixels(buf, function(err, pixels) {
			if (err) return done(err);
			var result = '';
			var imgs = splitImage(pixels);
			async.each(imgs, function(img, callback) {
				getSingleCharOcr(img,map, function(err,cha){
					if(err) return callback(err);
					result += cha;
					callback(null);
				});
			}, function(err){
				if(err) return done(err);
				done(null,result);
			});
		});
	});
};

/**
 * 下载图片
 * @return {[type]} [description]
 */
var downloadImage = function() {

};

var parser = {};
parser.splitImage = splitImage;
parser.loadTrainData = loadTrainData;
parser.loadTrainDataSync = loadTrainDataSync;
parser.getSingleCharOcr = getSingleCharOcr;
parser.getAllOcr = getAllOcr;
parser.getAllOcrSimple = getAllOcrSimple;

exports = module.exports = parser;

