var util = {};

var escapeRegExp = function(str) { 
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); 
};

/**
 * 正则表达式匹配
 * @param  {[type]} regex   [description]
 * @param  {[type]} html    [description]
 * @param  {[type]} pattern [description]
 * @return {[type]}         [description]
 */
util.regexMatch = function(regex,html){
	if(typeof html != 'string') html = '';
	//** 规范化html，去除\r\n\t
	html = html.replace(/(\n|\t|\r)/g, '');

    var regExp = regex;
    if(typeof regex == 'string') regExp = new RegExp(escapeRegExp(regex),pattern);
    var matcher = html.match(regExp);
    var result = (matcher && matcher.slice(0)) || [];
    return result;
};

//** 提取homePage的meta信息
util.extractHomePageMeta = function(html){
	if(typeof html != 'string') html = '';
	var result = {};
	//** 规范化html，去除\r\n\t
	html = html.replace(/(\n|\t|\r)/g, '');
	var metaMatched = html.match(/<meta.*?provinceId.*?>/i) || [];
	var meta = (metaMatched[0] || '');
	// console.log(meta);
	var arr = meta.split(/\s/);
	// console.log(arr);
	arr.forEach(function(attr){
		if(/=/.test(attr)){
			attr = attr.replace(/("|')/g,'');
			// console.log(attr);
			var attrs = attr.split('=');
			if(attrs[0] != ''){
				result[(attrs[0]).toLowerCase()] = attrs[1] || '';
			}
		}
	});
	// console.log(JSON.stringify(result));
	return result;
};

util.extractResourceInfo = function(html){
	if(typeof html != 'string') html = '';
	var result = [];
	//** 规范化html，去除\r\n\t
	html = html.replace(/(\n|\t|\r)/g, '');
	var productMatcher = html.match(/<tr class="(row_odd|row_even)".+?<\/tr>/ig) || [];
	// console.log(productMatcher);
	productMatcher.forEach(function(matcher){
		var productDetail = matcher.match(/<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?style="display:none">(.*?)<\/td>.*?<td.*?>(.*?)<\/td>/i);
		// console.log(productDetail);
		var resourceInfo = {};
		//** <th id="col_RESOURCE_INS_ID">
		//**     资源账本实例
		//** </th>
		//** <th id="col_MONEY">
		//**     金额(单位:元)
		//** </th>
		//** <th id="col_RESOURCE_COUNT">
		//**     资源量
		//** </th>
		//** <th id="col_UNIT">
		//**     资源单位
		//** </th>
		//** <th id="col_RESOURCE_TYPE">
		//**     资源类型
		//** </th>
		//** <th id="col_RECEIVE_TIME">
		//**     购买到账时间
		//** </th>
		//** <th id="col_INVALID_TIME">
		//**     资源失效时间
		//** </th>
		//** <th id="col_DEAL_TAG" style="display:none">
		//**     处理状态
		//** </th>
		//** <th id="col_DEAL_TAG1">
		//**     处理状态
		//** </th>
		//** 资源账本实例
		resourceInfo['resourceInsId'] = productDetail[1].trim();
		//** 额(单位:元)
		resourceInfo['money'] = productDetail[2].trim();
		//** 资源量
		resourceInfo['resourceCount'] = productDetail[3].trim();
		//** 资源单位
		resourceInfo['unit'] = productDetail[4].trim();
		//** 资源类型
		resourceInfo['resourceType'] = productDetail[5].trim();
		//** 购买到账时间
		resourceInfo['receiveTime'] = productDetail[6].trim();
		//** 资源失效时间
		resourceInfo['invalidTime'] = productDetail[7].trim();
		//** 处理状态
		resourceInfo['dealIntTag'] = productDetail[8].trim();
		//** 处理状态
		resourceInfo['dealTag'] = productDetail[9].trim();

		// console.log(resourceInfo);
		result.push(resourceInfo);
	});
	return result;
};

/**
 * 可订购流量包产品信息
 * @param  {[type]} html [description]
 * @return {[type]}      [description]
 */
util.extractResTableInfo = function(html){
	if(typeof html != 'string') html = '';
	var result = [];
	//** 规范化html，去除\r\n\t
	html = html.replace(/(\n|\t|\r)/g, '');
	var resTableInfo = html.match(/<table id=\"resInfosTable\".*?<\/table>/i) || [];
	resTableInfo = resTableInfo[0] || '';
	var productMatcher = resTableInfo.match(/<tr class="(row_odd|row_even).+?<\/tr>/ig) || [];
	// console.log(productMatcher);
	productMatcher.forEach(function(matcher){
		var productDetail = matcher.match(/input value="(.*?)".+?>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>/i) || [];
		// console.log(productDetail);
		var info = {};
		info['xTag'] = productDetail[1].trim();
		info['resourceTag'] = productDetail[2].trim();
		info['packageCode'] = productDetail[3].trim();
		info['resourceCode'] = productDetail[4].trim();
		info['resourceCount'] = productDetail[5].trim();
		info['money'] = productDetail[6].trim();
		info['unit'] = productDetail[7].trim();
		info['validTime'] = productDetail[8].trim();
		info['validTimeUnit'] = productDetail[9].trim();
		info['depositRate'] = productDetail[10].trim();
		info['resourceName'] = productDetail[11].trim();

		// console.log(info);
		result.push(info);
	});
	return result;
};

/**
 * 点击选择流量包是的请求参数
 * @param  {[type]} html [description]
 * @return {[type]}      [description]
 */
util.getResourceParam = function(html){
	if(typeof html != 'string') html = '';

	var result = {};
	//** 规范化html，去除\r\n\t
	html = html.replace(/(\n|\t|\r)/g, '');
	html = html.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
	var matcher = html.match(/<input.+?>/ig) || [];
	matcher.forEach(function(div){
		var name = div.match(/name="(.+?)"/i) || ['',''];
		var value = div.match(/value="(.*?)"/i) || ['',''];
		var nameLowerCase = name[1]; //(name[1]).toLowerCase();
		if(nameLowerCase != ''){
			if(result[nameLowerCase] == undefined){
				result[nameLowerCase] = value[1];
			}else if(result[nameLowerCase] ==''){
				result[nameLowerCase] = value[1];
			}
		}
	});
	// console.log(result);
	return result;
};

/**
 * 长度补齐4位
 */
var getStrByPadPrefix = function(len){
	var max = 4;
	var str = '' + len;
	for(var i=0 ; i< max - str.length; i++){
		str = '0' + str;
	}
	return str;
};
/**
 * 获取补齐后的字符串
 */
var getStrByPadLength = function(value){
	value = '' + value;
	var len = value.length;
	return getStrByPadPrefix(len) + value;
}

/**
 * 流量包变更时获得codingString
 * @param  {[type]} resTableList [description]
 * @return {[type]}              [description]
 */
util.getXcodingString = function(resTableList){
	var str = '';
	resTableList = resTableList || [];
	resTableList.forEach(function(li){
		str += getStrByPadLength(li.xTag);
		str += getStrByPadLength(li.resourceTag);
		str += getStrByPadLength(li.packageCode || '');
		str += getStrByPadLength(li.resourceCode);
		str += getStrByPadLength(li.resourceCount);
		str += getStrByPadLength(li.money);
		str += getStrByPadLength(li.unit);
		str += getStrByPadLength(li.validTime);
		str += getStrByPadLength(li.validTimeUnit);
		str += getStrByPadLength(li.depositRate);
		str += getStrByPadLength(li.resourceName);
		str += ' ';
	});
	str = '' + getStrByPadPrefix(11) + getStrByPadPrefix(resTableList.length) + str; 
	// console.log(str);
	return str;
};

/**
 * 产品可能会出现的价格
 */
util.queryPrice = function(html){
	if(typeof html != 'string') html = '';
	var result = [];
	//** 规范化html，去除\r\n\t
	html = html.replace(/(\n|\t|\r)/g, '');
	// console.log(html);
	var productMatcher = html.match(/option value="\d+"/ig) || [];
	// console.log(productMatcher);
	productMatcher.forEach(function(option){
		var price = option.match(/value="(\d+)"/i) || [];
		// console.log(price);
		result.push(price[1] || -1);
	});
	// console.log(result);
	return result;
};

/**
 * 获取时间戳
 * @return {[type]} [description]
 */
util.getRandomParam = function(){
	var date = new Date();
    return '' + date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate() + '' + date.getHours() + '' + date.getMinutes() + '' + date.getSeconds() + '' + String(date.getTime()).substring(10,13);
};

exports = module.exports = util;
