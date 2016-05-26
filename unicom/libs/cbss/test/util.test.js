var expect = require('expect.js');
var util = require('../lib/util');

describe('util.regexMath()功能测试: ', function() {
	it('没有匹配结果', function() {
		var html = 'abd';
		var result = util.regexMatch(/c/,html);
		expect(result).to.be.an(Array);
		expect(result).to.have.length(0);
	});
	it('没有匹配结果，区分大小写', function() {
		var html = 'abcccd';
		var result = util.regexMatch(/C/,html);
		expect(result).to.be.an(Array);
		expect(result).to.have.length(0);
	});
	it('有匹配结果，且仅匹配第一个', function() {
		var html = 'abcccd';
		var result = util.regexMatch(/c/,html);
		// console.log(result);
		expect(result[0]).to.be.equal('c');
		expect(result).to.have.length(1);
	});
	it('有匹配结果，区分大小写，且仅匹配第一个', function() {
		var html = 'abcCcCd';
		var result = util.regexMatch(/C/,html);
		expect(result[0]).to.be('C');
		expect(result).to.have.length(1);
	});
	it('有匹配结果，带有g参数，匹配多个，且个数正确',function(){
		var html = 'abccCcd';
		var result = util.regexMatch(/c/g,html);
		expect(result).to.be.an(Array);
		expect(result).to.have.length(3);
	});
	it('有匹配结果，带有ig参数，不区分大小写，匹配多个，且个数正确', function() {
		var html = 'abCcCd';
		var result = util.regexMatch(/c/ig,html);
		// console.log(result);
		expect(result).to.be.an(Array);
		expect(result).to.have.length(3);
	});
});

describe('util.getResourceParam()功能测试', function() {
	it('没有匹配结果', function() {
		var html = '';
		var result = util.getResourceParam(html);
		expect(result).to.be.an(Object);
	});
	it('具体情况1', function() {
		var html = '';
		var result = util.getResourceParam(html);
		expect(result).to.be.an(Object);
	});
});

describe('util.getRandomParam()功能测试', function() {
	it('获取正确', function() {
		var random = util.getRandomParam();
		// console.log(random);
	});
});

describe('pageNav.htm页面正则测试', function() {
	it('正常情况下', function() {
		//** 含指定正则数据
		var fs = require('fs');
		var path = require('path');
		var html = fs.readFileSync(path.resolve(__dirname,'res/pageNav.htm'),{
			encoding: 'utf8'
		});
		var result = util.regexMatch(/<meta.*provinceId.*?>/i,html);
		// console.log(result);
		expect(result).to.have.length(1);
		var resourceUrl = util.regexMatch(/.*clickMenuItem\(this\);openmenu\('(.+?OrderGprsRes.+?)'\).*/i,
                html);
		// console.log(resourceUrl[1]);
		expect(resourceUrl).to.have.length(2);
	});
	xit('异常情况下-1', function() {
		//** 不含指定正则数据
		var fs = require('fs');
		var path = require('path');
		var html = fs.readFileSync(path.resolve(__dirname,'res/pageNav_exception1.htm'),{
			encoding: 'utf8'
		});
		var result = util.regexMatch(/<meta.*provinceId.*?>/i,html);
		expect(result).to.have.length(0);
	});
});

describe('pageSidebar.htm页面正则测试', function() {
	it('正常情况下', function() {
		//** 含指定正则数据
		var fs = require('fs');
		var path = require('path');
		var html = fs.readFileSync(path.resolve(__dirname,'res/pageSidebar.htm'),{
			encoding: 'utf8'
		});
		var menuaddr = util.regexMatch(/menuaddr="(.+?)"/i, html);
		// console.log(menuaddr[1]);
		expect(menuaddr).to.have.length(2);
		var loginRandomCode =  util.regexMatch(/LOGIN_RANDOM_CODE=(\d+)/i, html);
		// console.log(loginRandomCode[1]);
		expect(loginRandomCode).to.have.length(2);
		var loginCheckCode =  util.regexMatch(/LOGIN_CHECK_CODE=(\d+)/i, html);
		// console.log(loginCheckCode[1]);
		expect(loginCheckCode).to.have.length(2);
	});
	xit('异常情况下-1', function() {
		//** 不含指定正则数据
		var fs = require('fs');
		var path = require('path');
		var html = fs.readFileSync(path.resolve(__dirname,'res/pageSidebar_exception1.htm'),{
			encoding: 'utf8'
		});
		var menuaddr = util.regexMatch(/menuaddr="(.+?)"/i, html);
		expect(menuaddr).to.have.length(0);
	});
});

describe('pageAcctmanm_*.htm页面正则测试', function() {
	it('正常情况下，用户能订购', function() {
		//** 含指定正则数据
		var fs = require('fs');
		var path = require('path');
		var html = fs.readFileSync(path.resolve(__dirname,'res/pageAcctmanm.htm'),{
			encoding: 'utf8'
		});
		//** 不包含以下内容，表示用户能订购
		var content = util.regexMatch(/<div class="content">(.+?)<\/div>/i, html);
		expect(content).to.have.length(0);
		//** 用户已订购产品
		var resourceList = util.extractResourceInfo(html);
		// console.log(resourceList);
		expect(resourceList).to.be.an(Array);
		var resTableList = util.extractResTableInfo(html);
		// console.log(resTableList);
		expect(resTableList).to.be.an(Array);
		var resourceParam = util.getResourceParam(html);
		// console.log(resourceParam);
		expect(resourceParam).to.be.an(Object);
		var xCodingString = util.getXcodingString(resTableList);
		// console.log(xCodingString);
	});
	xit('异常情况下，用户不能订购', function() {
		//** 含指定正则数据
		var fs = require('fs');
		var path = require('path');
		var html = fs.readFileSync(path.resolve(__dirname,'res/pageAcctmanm_exception1.htm'),{
			encoding: 'utf8'
		});
		//** 包含以下内容，表示用户不能订购
		var content = util.regexMatch(/<div class="content">(.+?)<\/div>/i, html);
		console.log(content);
		expect(content).to.have.length(2);
	});
});

describe('ajaxDirectOrderGprsRes1.xml页面正则测试', function() {
	it('正常情况下', function() {
		//** 含指定正则数据
		var fs = require('fs');
		var path = require('path');
		var xml = fs.readFileSync(path.resolve(__dirname,'res/ajaxDirectOrderGprsRes1.xml'),{
			encoding: 'utf8'
		});
		var price = util.queryPrice(xml);
		// console.log(price);
		expect(price).to.be.an(Array);
	});
	it('异常情况下', function() {
		//** 不含指定正则数据
		result = util.queryPrice('');
		expect(result).to.have.length(0);
	});
});

describe('ajaxDirectOrderGprsRes2.xml页面正则测试', function() {
	it('正常情况下', function() {
		//** 含指定正则数据
		var fs = require('fs');
		var path = require('path');
		var xml = fs.readFileSync(path.resolve(__dirname,'res/ajaxDirectOrderGprsRes2.xml'),{
			encoding: 'utf8'
		});
		// console.log(xml);
		var rMap = util.getResourceParam(xml);
		// console.log(rMap);
		expect(rMap).to.be.an(Object);
	});
	it('异常情况下', function() {
		//** 不含指定正则数据
		result = util.getResourceParam('');
		// console.log(result);
		expect(result).to.be.an(Object);
	});
});

describe('flux订单POST结果页面正则测试', function() {
	
});