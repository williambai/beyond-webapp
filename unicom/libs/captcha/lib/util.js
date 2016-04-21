/**
 * 判断像素是否是白色
 * @param  {[type]}  colorInt [description]
 * @return {Boolean}          [description]
 */
exports.isWhite = isWhite = function(rgb) {
	if (rgb[0] + rgb[1] + rgb[2] > 330) {
		return 1;
	}
	return 0;
};
/**
 * 判断像素是否是黑色
 * @param  {[type]}  colorInt [description]
 * @return {Boolean}          [description]
 */
exports.isBlack = function(rgb) {
	if (rgb[0] + rgb[1] + rgb[2] <= 330) {
		return 1;
	}
	return 0
};
/**
 * 将图像设置为黑白图片
 * @param  {[type]} pic [description]
 * @return {[type]}     [description]
 */
exports.removeBackground = function(mat) {
	var width = mat.width();
	var height = mat.height();
	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			// console.log(mat.pixel(x,y))
			// if (mat.pixel(x,y) > 200) {
			// 	mat.set(x,y,255);
			// } else {
			// 	// mat.set(x,y,300);
			// }
			// console.log(mat.pixel(x,y))
		}
	}
	return mat;
};

module.exports = exports;