var Alipay = require('alipay').Alipay;
var config = require('../config/alipay');

var alipay = new Alipay(config);

exports = module.exports = alipay;
