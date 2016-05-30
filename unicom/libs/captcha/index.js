var log4js = require('log4js');
var path = require('path');
log4js.configure({
		"type": "logLevelFilter",
		"level": "ALL",
		"appender": {
			"type": "file",
			"filename": "log/all.log",
			"maxLogSize": 20480,
			"backups": 3
		}
	});
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var opencv = require('opencv');
var util = require('./lib/util');
var parser = {};

/**
 * 将输入的验证码图片切分成4个不同字母的图片
 * @param  {[type]} img [description]
 * @return {[type]}     [description]
 */
var splitImage = function(img) {
	var imgs = [];
	imgs.push(img.crop(0, 0, 15, 20));
	imgs.push(img.crop(15, 0, 15, 20));
	imgs.push(img.crop(30, 0, 15, 20));
	imgs.push(img.crop(45, 0, 15, 20));
	return imgs;
};
parser.splitImage = splitImage;
/**
 * 载入训练集，并将图片和对应的字母关联
 * @return {[type]} [description]
 */
parser.loadTrainData = function() {
	var map = [];
	var dirs = fs.readdirSync(path.join(__dirname, 'train'));
	dirs = _.without(dirs, '.DS_Store');
	async.each(dirs, function(directory) {
		var cha = directory.slice(-1);
		var files = fs.readdirSync(path.join(__dirname, 'train', directory));
		async.each(files, function(file) {
			var filepath = path.join(__dirname, 'train', directory, file);
			map.push({
				cha: cha,
				file: file,
				path: filepath,
				matrix: fs.readFileSync(filepath)
			});
		});
	});
	return map;
};

/**
 * 判断图片包含的字母
 * @param  {[type]} img       [description]
 * @param  {[type]} trainData [description]
 * @return {[type]}           [description]
 */

var getSingleCharOcr = function(img, map) {
	// img.convertGrayscale();
	var result = '';
	var width = img.width();
	var height = img.height();
	var min = width * height;
	async.each(map, function(img_matrix) {
		opencv.readImage(img_matrix.path,function(err,img_train){
			// img_train.convertGrayscale();
			var count = 0;
			Label1: for (var x = 0; x < width; x++) {
				for (var y = 0; y < height; y++) {
					// if(img.pixel(x,y) != img_train.pixel(x,y)){
					if (util.isWhite(img.pixel(x, y)) != util.isWhite(img_train.pixel(x, y))) {
						count++;
						if (count >= min) break Label1;
					}
				}
			}
			if (count < min) {
				min = count;
				result = img_matrix.cha;
			}
		});
	});
	return result;
};
parser.getSingleCharOcr = getSingleCharOcr;

/**
 * 获取下载的验证码图片并识别出验证码
 * @param  {[type]} img [description]
 * @return {[type]}     [description]
 */
parser.getAllOcr = function(buf,map,callback) {
	//** TODO 如果buf == undefined?
	opencv.readImage(buf, function(err, mat) {
		if (err) return logger.error(err);
		var result = '';
		var imgs = splitImage(mat);
		async.each(imgs, function(img) {
			result += getSingleCharOcr(img,map);
		});
		mat.save(path.join(__dirname, '../../test/captcha/_output/result.jpg'));
		if(callback) return callback && callback(null,result);
	});
};

/**
 * 下载图片
 * @return {[type]} [description]
 */
var downloadImage = function() {

};
exports = module.exports = parser;