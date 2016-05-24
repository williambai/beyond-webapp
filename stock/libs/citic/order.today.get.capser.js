/**
 * 获取当天全部委托订单
 */
var fs = require('fs');
var system = require('system');
var casper = require('casper').create({
	// clientScripts: ['jquery.js'],
	pageSettings: {
		webSecurityEnabled: false,
		javascriptEnabled: true,
		loadImages: true,
		loadPlugins: false
	},
	timeout: 100000,
	logLevel: "info",
	verbose: true
});

//** setup params
console.log(JSON.stringify(casper.cli.options));
var id = casper.cli.options['id'] || '';
var cookie = casper.cli.options['cookie'] || '';
var direction = casper.cli.options['direction'] || '';
var code = casper.cli.options['code'] || '';
var price = casper.cli.options['price'] || '';
var quantity = casper.cli.options['quantity'] || '';
var debug = casper.cli.options['debug'] || false;

var cookies = [];
try {
	cookies = JSON.parse(cookie);
} catch (e) {

}
// console.log(cookie);
// console.log('+++')
// console.log(JSON.stringify(cookies));
phantom.cookiesEnabled = true;
phantom.cookies = cookies;

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

casper.start('https://etrade.cs.ecitic.com/ymtrade/professional.jsp');

casper.then(function(){
	casper.wait(2000);
});

casper.waitFor(function(){
	return casper.exists('#menuTD');
});

//** 点击"查询查询"菜单
casper.then(function clickBuy(){
	this.echo('check buy order');
	this.click('#gp_search');
});

//** 点击"当日委托"子菜单
casper.then(function clickBuy(){
	this.echo('check buy order');
	this.click('#gp_search_drwt');
});

//** 转到mainFrame
casper.withFrame('mainFrame',function(){
	if(debug){
		//** 截图
		casper.then(function buyForm(){
			this.capture('../_tmp/buyForm.png');
		});
	}
	casper.then(function(){
		//** 获取页面内容
		var mainHtml = this.getHTML().replace(/\n/g,'') || '';
		//** 判断当前页面是"当日委托"页面
		if(/当日委托/.test(mainHtml)){
			//** 构造能检查当日委托存在的正则表达式
			var orderMatchRegex = new RegExp('<table.*</table>');
			//** 检查正则表达式是否存在
			var orderMatched = mainHtml.match(orderMatchRegex);
			if (orderMatched) {
				//** 成功
				this.echo('confirm_buy:true');
			}else{
				//** 失败
				this.echo('confirm_buy:false');
			}
		}else{
			this.echo('confirm_buy:false');
		}
	});
});

casper.run();