/**
 * RegExp 字符串转义
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
exports.escape = function(str) { 
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); 
};
exports = module.exports;