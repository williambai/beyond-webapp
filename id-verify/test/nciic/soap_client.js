var soap = require('soap');
var url = 'http://localhost:9000/nciic_ws/services/NciicServices?wsdl';

var inConditions1 = '<?xml version="1.0" encoding="UTF-8" ?>' +
					'<ROWS>' +
						'<INFO>' +
						 	'<SBM>******</SBM>' +
						 '</INFO>' +
						'<ROW>' +
							'<GMSFHM>公民身份号码</GMSFHM>' +
							'<XM>姓名</XM>' +
						'</ROW>' +
						'<ROW FSD="*" YWLX="*">' +
							'<GMSFHM>****</GMSFHM>' +
							'<XM>*****</XM>' +
						'</ROW>' +
						'<ROW FSD="**" YWLX="**">' +
							'<GMSFHM>********</GMSFHM>' +
							'<XM>********</XM>' +
						'</ROW>' +
					'</ROWS>';

//expect: <?xml version="1.0" encoding="UTF-8" ?><RESPONSE errorcode="xxx" code="0" countrows="1"><ROWS><ROW><ErrorCode>xxx</ErrorCode><ErrorMsg>xxxxxxxxx</ErrorMsg></ROW></ROWS></RESPONSE>
var args1 = {inLicense: '异常', inConditions: inConditions1};
soap.createClient(url, function(err, client) {
  client.nciicCheck(args1, function(err, result){
      console.log(result);
  });
});

var inConditions2 = '<?xml version="1.0" encoding="UTF-8" ?>' +
					'<ROWS>' +
						'<INFO>' +
						 	'<SBM>******</SBM>' +
						 '</INFO>' +
						'<ROW>' +
							'<GMSFHM>公民身份号码</GMSFHM>' +
							'<XM>姓名</XM>' +
						'</ROW>' +
						'<ROW FSD="*" YWLX="*">' +
							'<GMSFHM>*****</GMSFHM>' +
							'<XM>库中无此号</XM>' +
						'</ROW>' +
						'<ROW FSD="**" YWLX="**">' +
							'<GMSFHM>********</GMSFHM>' +
							'<XM>姓名缺失</XM>' +
						'</ROW>' +
						'<ROW FSD="**" YWLX="**">' +
							'<GMSFHM>正确</GMSFHM>' +
							'<XM>正确</XM>' +
						'</ROW>' +
					'</ROWS>';

var args2 = {inLicense: 'inLicense', inConditions: inConditions2};
//expect: <?xml version="1.0" encoding="UTF-8" ?><ROWS><ROW no="1"><INPUT><gmsfhm>********</gmsfhm><xm>姓名缺失</xm></INPUT><OUTPUT><ITEM><errormesage>必录项缺失</errormesage></ITEM><ITEM><errormesagecol>姓名</errormesagecol></ITEM></OUTPUT></ROW><ROW no="2"><INPUT><gmsfhm>正确</gmsfhm><xm>正确</xm></INPUT><OUTPUT><ITEM><gmsfhm /><result_gmsfhm>一致</result_gmsfhm></ITEM><ITEM><xm /><result_xm>一致</result_xm></ITEM></OUTPUT></ROW></ROWS>
soap.createClient(url, function(err, client) {
  client.nciicCheck(args2, function(err, result){
      console.log(result);
  });
});

