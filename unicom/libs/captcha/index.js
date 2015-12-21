var log4js = require('log4js');
var path = require('path');
log4js.configure(path.join(__dirname, '../../config/log4js.json'));
var logger = log4js.getLogger('captcha');
logger.setLevel('DEBUG');

var parser = {};
var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var opencv = require('opencv');

var Color = function(colorInt) {
	var hex = colorInt.toString(16);
	this.red = hex.slice(2, 4);
	this.green = hex.slice(4, 6);
	this.blue = hex.slice(6, 8);
};

Color.prototype.getRed = function() {
	return parseInt(this.red, 16);
};

Color.prototype.getGreen = function() {
	return parseInt(this.green, 16);
};

Color.prototype.getBlue = function() {
	return parseInt(this.blue, 16);
};

/**
 * [Color description]
 * @type {[type]}
 */
parser.Color = Color;

/**
 * 判断像素是否是白色
 * @param  {[type]}  colorInt [description]
 * @return {Boolean}          [description]
 */
var isWhite = function(rgb) {
	if (rgb[0] + rgb[1] + rgb[2] > 330) {
		return 1;
	}
	return 0;
};
parser.isWhite = isWhite;
/**
 * 判断像素是否是黑色
 * @param  {[type]}  colorInt [description]
 * @return {Boolean}          [description]
 */
var isBlack = function(rgb) {
	if (rgb[0] + rgb[1] + rgb[2] <= 330) {
		return 1;
	}
	return 0
};
parser.isBlack = isBlack;
/**
 * 将图像设置为黑白图片
 * @param  {[type]} pic [description]
 * @return {[type]}     [description]
 */
var removeBackground = function(matrix) {
	var width = matrix.getWidth();
	var height = maxtrix.getHeight();
	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			if (isWhite(matrix[x][y]) == 1) {
				matrix[x][y] = Color.WHITE;
			} else {
				matrix[x][y] = Color.BLACK;
			}
		}
	}
	return matrix;
};
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
	var result = '';
	var width = img.width();
	var height = img.height();
	var min = width * height;
	async.each(map, function(img_matrix) {
		opencv.readImage(img_matrix.path,function(err,img_train){
			var count = 0;
			Label1: for (var x = 0; x < width; x++) {
				for (var y = 0; y < height; y++) {
					if (isWhite(img.pixel(x, y)) != isWhite(img_train.pixel(x, y))) {
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

parser.getSingleCharOcr1 = function(img, map) {
	var result = '';
	var width = img.width();
	var height = img.height();
	var min = width * height;
	for (var cha in map) {
		for (var img_train in cha) {
			opencv.readImage(img_train, function(err, mat) {

			});
			Label1: for (var x = 0; x < width; x++) {
				for (var y = 0; y < height; y++) {
					if (isWhite(parseInt(img.get(x, y), 16)) != isWhite(parseInt(img_train.get(x, y), 16))) {
						count++;
						if (count >= min) break Label1;
					}
				}
			}
			if (count < min) {
				min = count;
				result = char;
			}
		}
	}
	return result;

};

/**
 * 获取下载的验证码图片并识别出验证码
 * @param  {[type]} img [description]
 * @return {[type]}     [description]
 */
parser.getAllOcr = function(buf,map,callback) {
	opencv.readImage(buf, function(err, mat) {
		if (err) return logger.error(err);
		var result = '';
		var imgs = splitImage(mat);
		async.each(imgs, function(img) {
			result += getSingleCharOcr(img,map);
		});
		mat.save(path.join(__dirname, '../../test/captcha/_output/result.jpg'));
		callback && callback(null,result);
	});
};

/**
 * 下载图片
 * @return {[type]} [description]
 */
var downloadImage = function() {

};
exports = module.exports = parser;