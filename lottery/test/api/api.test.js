var expect = require('expect.js');
var crypto = require('crypto');
var request = require('./request');
var secret = '0123456789ABCDEF';

describe('test api commands', function() {
	it('期望：Nodejs 自身处理DES加密和解密正确', function() {
		var decrypt_body = '<?xml version="1.0" encoding="utf-8"?>' +
							'<body>' +
								'<ltype>QGSLTO</ltype>' +
								'<periodnum>2012127</periodnum>' +
								'<begintime>20121025220000</begintime>' +
								'<endtime>20121028200000</endtime>' +
								'<startsaletime>20121029092000</startsaletime>' +
								'<endsaletime>20121028195900</endsaletime>' +
								'<status>1</status>' +
								'<failreason>00</failreason>' +
							'</body>';
		var key = new Buffer('0123456789ABCDEF','hex');
		var iv = new Buffer('0000000000000000','hex');
		// console.log(crypto.getCiphers());
		var cipher = crypto.createCipheriv('des-cbc',key,iv);
		cipher.setAutoPadding(true);
		var expect_encrypt_body = cipher.update(decrypt_body,'utf8','base64');
		expect_encrypt_body += cipher.final('base64');
		// console.log('++++')
		// console.log(expect_encrypt_body);
		var decipher = crypto.createDecipheriv('des-cbc',key,iv);
		decipher.setAutoPadding(true);
		var expect_decrypt_body = decipher.update(expect_encrypt_body, 'base64', 'utf8');
		expect_decrypt_body += decipher.final('utf8');
		// console.log('-----')
		// console.log(expect_decrypt_body)
		expect(expect_decrypt_body).to.be.equal(decrypt_body);
	});
	xit('期望：Nodejs DES解密Java加密的信息正确', function() {
		var encrypt_body = 'TJ7qEj8rUEnghdX59RmYWGNhmnJJ7mrldtVSHcU8jtXHwDRmgOfrwfWDwI2GLOrZBnn+jQJ6xUR 6JFpkVeyKN5vhlXdcxPTXdskr6UZ5vqpsV/qxklD8F3bxy/rBgNdFM22wxDWTGQYwYaRnbrs2Uk4n ONv+nkjgZ/3UibqNIgKqtRyGgfkW0uJ/YELUfOnCTdPfIxgY7mwAoAz0IeyGV+d7KM4dUerPVss7Y p0mRuyUfJ1N0snsN/Hwsr350RNhekjt1V15JHScwts6o3AWQUy3uyL5hwlvaCv9cvsUI27f+VCH+DD4 ygF+vXhwykt4JWsJMcx/cpXPzz7BzH80eh41g5lhQBYLJVgcL4K7k9p/Xdr54h110VpqPpAdy4CzUD+ V4PyDsD3rWVdn/47mMw==';
		var decrypt_body = '<?xml version="1.0" encoding="utf-8"?>' +
							'<body>' +
								'<ltype>QGSLTO</ltype>' +
								'<periodnum>2012127</periodnum>' +
								'<begintime>20121025220000</begintime>' +
								'<endtime>20121028200000</endtime>' +
								'<startsaletime>20121029092000</startsaletime>' +
								'<endsaletime>20121028195900</endsaletime>' +
								'<status>1</status>' +
								'<failreason>00</failreason>' +
							'</body>';
		var key = new Buffer('0123456789ABCDEF','hex');
		// console.log(key.toString('hex'))
		var iv = new Buffer('0000000000000000','hex');
		// expect(key.length).to.be.equal(iv.length);
		var decipher = crypto.createDecipheriv('des-cbc', key, iv);
		// decipher.setAutoPadding(true);
		var expect_decrypt_body = decipher.update(encrypt_body, 'base64', 'utf8');
		// expect_decrypt_body += decipher.final('utf8');
		console.log('-----')
		console.log(expect_decrypt_body)
		// expect(expect_decrypt_body).to.be.equal(decrypt_body);
	});
	it('期望：content-type 设置为 application/xml', function(done) {
		request(
			'<?xml version="1.0" encoding="utf-8"?>'
			,function(err,body,response){
				expect(err).to.not.be.ok();
				expect(response.statusCode).to.be(200);
				done();
			}
		);
	});
	it('期望：必须项数据缺失时，给出错误提示', function(done) {
		request(
			'<?xml version="1.0" encoding="utf-8"?>' +
				'<message>' +
				'</message>'
			,function(err,body,response){
				expect(err).to.not.be.ok();
				expect(response.statusCode).to.be(200);
				expect(body).to.match(/<error>.*<\/error>/);
				done();
			}
		);
	});
	it('期望：不正确的command，给出错误提示', function(done) {
		request(
			'<?xml version="1.0" encoding="utf-8"?>' +
			'<message>' +
				'<head>' +
					'<version>1.0.0.0</version>' +
					'<merchantid>886544</merchantid>' +
					'<command>1123</command>' +
					'<messageid>886544012345678901</messageid>' +
					'<encrypt>0</encrypt>' +
					'<compress>0</compress>' +
					'<timestamp>20121117094823</timestamp>' +
					'<bodymd>67ca03231d2f29f50f087ea585b9026c</bodymd>' +
				'</head>' +
				'<body>' +
					'<ltype>QGSLTO</ltype>' +
					'<periodnum/>' +
				'</body>' +
			'</message>'
			,function(err,body,response){
				expect(err).to.not.be.ok();
				expect(response.statusCode).to.be(200);
				expect(body).to.match(/<error>.*<\/error>/);
				done();
			}
		);
	});
	it('期望：验证不加密的xml，<bodymd>正确', function(done) {
		request('<?xml version="1.0" encoding="utf-8"?>' +
				'<message>' +
					'<head>' +
						'<version>1.0.0.0</version>' +
						'<merchantid>886544</merchantid>' +
						'<command>1000</command>' +
						'<messageid>886544012345678901</messageid>' +
						'<encrypt>0</encrypt>' +
						'<compress>0</compress>' +
						'<timestamp>20121117094823</timestamp>' +
						'<bodymd>67ca03231d2f29f50f087ea585b9026c</bodymd>' +
					'</head>' +
					'<body>' +
						'<ltype>QGSLTO</ltype>' +
						'<periodnum/>' +
					'</body>' +
				'</message>'
		,function(err,body,response){
			expect(err).to.not.be.ok();
			expect(response.statusCode).to.be(200);			
			expect(body).to.match(/<message>.*<head>.*<\/head>.*<\/message>/);
			done();
		});
	});
	xit('期望：验证加密的xml，<bodymd>及<headmd>正确', function(done) {
		request('<?xml version="1.0" encoding="utf-8"?>' +
				'<message>' +
					'<head>' +
						'<version>1.0.0.0</version>' +
						'<merchantid>000000</merchantid>' +
						'<command>1000</command>' +
						'<messageid>886544012345678901</messageid>' +
						'<encrypt>1</encrypt>' +
						'<compress>0</compress>' +
						'<timestamp>20121117094823</timestamp>' +
						'<bodymd>b388e8dba4b88fe5d690dac41634c6d9</bodymd>' +
					'</head>' +
					'<body>' +
						'TJ7qEj8rUEnghdX59RmYWGNhmnJJ7mrldtVSHcU8jtXHwDRmgOfrwfWDwI2GLOrZBnn+jQJ6xUR 6JFpkVeyKN5vhlXdcxPTXdskr6UZ5vqpsV/qxklD8F3bxy/rBgNdFM22wxDWTGQYwYaRnbrs2Uk4n ONv+nkjgZ/3UibqNIgKqtRyGgfkW0uJ/YELUfOnCTdPfIxgY7mwAoAz0IeyGV+d7KM4dUerPVss7Y p0mRuyUfJ1N0snsN/Hwsr350RNhekjt1V15JHScwts6o3AWQUy3uyL5hwlvaCv9cvsUI27f+VCH+DD4 ygF+vXhwykt4JWsJMcx/cpXPzz7BzH80eh41g5lhQBYLJVgcL4K7k9p/Xdr54h110VpqPpAdy4CzUD+ V4PyDsD3rWVdn/47mMw==' +
					'</body>' +
					'<headmd>123456</headmd>' +
				'</message>'
		,function(err,body,response){
			console.log(body)
			expect(err).to.not.be.ok();
			expect(response.statusCode).to.be(200);			
			expect(body).to.match(/<message>.*<head>.*<\/head>.*<\/message>/);
			done();
		});
	});	
	it('期望：command 1000', function(done) {
		request(
			'<?xml version="1.0" encoding="utf-8"?>' +
			'<message>' +
				'<head>' +
					'<version>1.0.0.0</version>' +
					'<merchantid>886544</merchantid>' +
					'<messageid>886544012345678901</messageid>' +
					'<command>1000</command>' +
					'<encrypt>0</encrypt>' +
					'<compress>0</compress>' +
					'<timestamp>20121026214317</timestamp>' +
					'<bodymd>edf0c1582465d01043db58d4cded89ab</bodymd>' +
				'</head>' +
				'<body>' +
					'<ltype>QGSLTO</ltype>' +
					'<periodnum>2012127</periodnum>' +
					'<merchantuserid>11111111</merchantuserid>' +
					'<username>andy</username>' +
					'<idno>130324********4517</idno>' +
					'<mobile>13888888888</mobile>' +
					'<records>' +
						'<record>' +
							'<orderno>ABC13531168011521</orderno>' +
							'<playtype>1,1,1,1,1</playtype>' +
							'<chipintype>2</chipintype>' +
							'<content>01|09|10|15|25|31-01*1,05|14|16|23|27|32-04*1,04|08|10|13|22|30-11*1,01|04|05|13|24|26-09*1,01|10|12|15|20|25-13*1</content>' +
							'<orderamount>1000</orderamount>' +
						'</record>' +
					'</records>' +
				'</body>' +
			'</message>'
			,function(err,body,response){
				expect(err).to.not.be.ok();
				expect(response.statusCode).to.be(200);
				expect(body).to.match(/<message>.*<head>.*<\/head>.*<\/message>/);
				expect(body).to.be.equal(
					'<?xml version="1.0" encoding="utf-8"?>' +
					'<message>' +
						'<head>' +
							'<messageid>886544012345678901</messageid>' +
							'<command>1000</command>' +
							'<encrypt>0</encrypt>' +
							'<compress>0</compress>' +
							'<timestamp>20121026214317</timestamp>' +
							'<bodymd>51b36064d5a66976e2758269cce2aa84</bodymd>' +
						'</head>' +
						'<body>' +
							'<ltype>QGSLTO</ltype>' +
							'<periodnum>2012127</periodnum>' +
							'<allprintresult>0</allprintresult>' +
							'<records>' +
								'<record>' +
									'<orderno>ABC13531168011521</orderno>' +
									'<printresult>0</printresult>' +
									'<printtime>20121026214134</printtime>' +
									'<failreason>00</failreason>' +
									'<orderamount>1000</orderamount>' +
									'<cpserial/>' +
								'</record>' +
							'</records>' +
						'</body>' +
					'</message>'
				);
				done();
			}
		);
	});
});