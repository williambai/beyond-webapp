var expect = require('expect.js');

describe('测试正则表达式', function() {
	it('期望：替换邮件确认地址正确', function() {
		var register_confirm_uri = 'http://{host}/register/confirm?email={email}&code={code}';
		var host = 'localhost:8080';
		var email = 'a@b.com';
		var code = 'cooooooooode';
		var result = register_confirm_uri.replace(/\{[(a-z]+\}/ig,function(name){
			if(name == '{host}') return host;
			if(name == '{email}') return email;
			if(name == '{code}') return code;
		});
		// console.log(result);
	});
});