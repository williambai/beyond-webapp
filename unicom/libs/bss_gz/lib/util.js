/**
 * 格式化显示日期时间
 * 参数x : 待显示的日期时间，示例： new Date()
 * 参数y: 需要显示的格式，示例：yyyy-MM-dd hh:mm:ss
 */
exports.date2str = function date2str(x, y) {
   var z = {
      y: x.getFullYear(),
      M: x.getMonth() + 1,
      d: x.getDate(),
      h: x.getHours(),
      m: x.getMinutes(),
      s: x.getSeconds()
   };
   return y.replace(/(y+|M+|d+|h+|m+|s+)/g, function(v) {
      return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2));
   });
};

module.exports = exports;
