/*
 * buy stock
 */
var fs = require('fs');
var system = require('system');
var casper = require('casper').create({
	pageSettings: {
		webSecurityEnabled: false,
		javascriptEnabled: true,
		loadImages: true,
		loadPlugins: false
	},
	timeout: 100000,
	waitTimeout: 30000,
	logLevel: "debug",
	verbose: true
});

phantom.cookiesEnabled = true;
//** load cookie
var data = fs.read('./_tmp/_cookie.txt') || "[]";
// console.log(data);

try {
	phantom.cookies = JSON.parse(data);
} catch (e) {
	console.error(e);
}
// console.log(JSON.stringify(phantom.cookies));

//** !WARNING only for testing
var stock = {
	symbol: '600218',
	price: '1.21',
	quantity: '100',
};

var response = {};

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

casper.start('https://etrade.cs.ecitic.com/ymtrade/professional.jsp');

casper.then(function checkLogin(){
	this.waitFor(
		function(){
			return this.exists('#menuTD');
		},function signin(){
			response.status = '已登录';
		},function signout(){
			//** 未登录，退出
			response.status = '未登录';
			this.echo(JSON.stringify(response));
			this.exit();
		},2000);
});

// casper.then(function inputBuyOrder() {
// 	var confirm = '';
// 	while (confirm != 'yes') {
// 		this.echo('please input stock symbol(buy): ', 'INFO');
// 		stock.symbol = system.stdin.readLine();
// 		this.echo('please input "' + stock.symbol + '" price(buy): ', 'INFO');
// 		stock.price = system.stdin.readLine();
// 		this.echo('please input "' + stock.symbol + '" quantity(buy): ', 'INFO');
// 		code = system.stdin.readLine();
// 		this.echo('you will buy the stock: ');
// 		this.echo('stock symbol(buy): ' + stock.symbol, 'INFO');
// 		this.echo('stock price(buy): ' + stock.price, 'INFO');
// 		this.echo('stock quantity(buy): ' + stock.quantity, 'INFO');
// 		this.echo('do you confirm, yes or no?', 'WARNING');
// 		confirm = system.stdin.readLine();
// 	}
// });

casper.then(function getHQ(){
	this.open('https://etrade.cs.ecitic.com/ymtrade/trade/stockAction.do', {
		method: 'post',
		data: {
			method:'getHQ',
			stkcode: stock.symbol,
			bsflag: 1,
			bsprop: 0,
		}
	});
});

casper.then(function getHQPageContent(){
	response.hq = this.getPageContent();
});

// casper.then(function submitOrder(){
// 	this.open('https://etrade.cs.ecitic.com/ymtrade/trade/stockAction.do',{
// 		method: 'post',
// 		data: {
// 			method: 'submitOrder',
// 			market: 1,
// 			secuid: '',
// 			stkcode: stock.symbol,
// 			price: stock.price,
// 			qty: stock.quantity,
// 			bsflag: 1
// 			bsprop: 0
// 			type: 'stock'
// 		}
// 	});
// });

casper.run(function(){
	this.echo(JSON.stringify(response));
	casper.exit();
});


// casper.then(function clickBuy(){
// 	// this.echo('buy');
// 	this.click('#gp_buy');
// });

// //** 填充购买表单并提交
// casper.withFrame('mainFrame',function gotoMainFrame(){
// 	casper.then(function buyForm(){
// 		//** 保存页面
// 		fs.write('./_tmp/buyOrderForm.html', this.getHTML(), 644);
// 	});

// 	casper.then(function buyFormFillCode(){
// 		this.sendKeys('input[name="stkcode"]',stock.symbol,{reset:true});
// 	});

// 	casper.then(function(){
// 		casper.waitFor(function buyFormFillPrice(){
// 			var priceInputNode = this.getElementInfo('input[name="price"]');
// 			var price = priceInputNode.attributes['value'] || '';
// 			console.log('price: ' + price);
// 			return /\d/.test(parseInt(price));
// 			// return this.evaluate(function(){
// 			// 	var priceInputNode = document.querySelector('input[name="price"]');
// 			// 	var price = priceInputNode.getAttibute('value') || '';
// 			// 	console.log('price: ' + price);
// 			// 	return /\d/.test(parseInt(price));
// 			// });
// 		}, function(){
// 			this.sendKeys('input[name="price"]',stock.price,{reset:true});
// 			this.capture('./_tmp/buyFormPriceFilled.png');
// 		},function(){
// 			console.log('1超时错误。');
// 			this.sendKeys('input[name="price"]',stock.price,{reset:true});
// 			this.capture('./_tmp/buyFormPriceFilled.png');
// 		});
// 	});	

// 	casper.then(function(){
// 		casper.waitFor(function waitForQuantity(){
// 			return this.evaluate(function(){
// 				var quantityInputNode = document.querySelector('input[name="qty"]') || '';
// 				return /\d/.test(parseInt(quantityInputNode.getAttibute('value')));
// 			});
// 		}, function(){
// 			this.sendKeys('input[name="qty"]',stock.quantity,{reset:true});
// 			this.capture('./_tmp/buyFormQuantityFilled.png');
// 		},function(){
// 			console.log('2超时错误。');
// 			this.sendKeys('input[name="qty"]',stock.quantity,{reset:true});
// 			this.capture('./_tmp/buyFormQuantityFilled.png');
// 		});
// 	});

// 	casper.then(function buyFormFillQuantity(){
// 		this.wait(1000);
// 	});

// 	casper.then(function buyFormSubmit(){
// 		this.click('input[type="button"]');
// 	});

// 	casper.then(function buyFormSubmitConfirm(){
// 		fs.write('./_tmp/buyOrderSubmit.html', this.getHTML(), 644);
// 		casper.waitForSelector('div#popup_container',
// 		 function buyFormSubmitPopup(){
// 			this.click('#popup_ok');
// 		},function(){
// 			this.capture('./_tmp/buyPopupConfirmed.png');
// 		},function(){
// 			console.log('3超时错误。');
// 			this.capture('./_tmp/buyPopupConfirmed.png');		
// 		});
// 	});

// 	casper.then(function buyFormSubmitResult() {
// 		//** 检查是否买入下单成功，并输出成功/失败标志
// 		//** <div id="message" class="error" style="display: block; opacity: 1;"><ul><li>HsErrCode(-59)_HsErrMsg([120147][当前时间不允许委托] and  and [curr_time;163425] )</li></ul></div>
// 		var success = this.evaluate(function(){
// 			var messageNode = document.querySelector('#message');
// 			var classAttr = messageNode.getAttribute('class');
// 			if('error' == classAttr) return false;
// 			return true;
// 		});
// 		if (success) {
// 			//** 成功
// 			this.echo('order_buy:true');
// 		}else{
// 			//** 失败
// 			this.echo('order_buy:false');
// 		}
// 	});
// });

