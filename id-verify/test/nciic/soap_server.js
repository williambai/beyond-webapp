var soap = require('soap');
var fs = require('fs');
var path = require('path');
var http = require('http');
var _ = require('underscore');
var xml2json = require('xml2json');
var json2xml = require('json2xml');
 var nciicServices = {
      NciicServices: {
          NciicServicesHttpPort: {
              nciicCheck: function(args) {
                  console.log('nciicCheck:');
                  console.log(args);
                  var output = '';
                  if(args.inLicense == '异常'){
                    output = '<?xml version="1.0" encoding="UTF-8" ?>';
                    output += '<RESPONSE errorcode="xxx" code="0" countrows="1">';
                    output += '<ROWS>';
                    output += '<ROW>';
                    output += '<ErrorCode>xxx</ErrorCode>';
                    output += '<ErrorMsg>xxxxxxxxx</ErrorMsg>';
                    output += '</ROW>';
                    output += '</ROWS>';
                    output += '</RESPONSE>';
                    return output;
                  }

                  var input = xml2json.toJson(args.inConditions.toLowerCase(),{object: true});
                  // console.log(JSON.stringify(input));
                  var persons = Array.prototype.slice.call(input.rows.row,2);
                  // console.log(persons)

                  output = '<?xml version="1.0" encoding="UTF-8" ?>';
                  output += '<ROWS>';
                  persons.forEach(function(person,index){
                    output += '<ROW no="'+ (++index) +'">';
                    output += '<INPUT>';
                    output += '<gmsfhm>' + person.gmsfhm + '</gmsfhm>';
                    output += '<xm>' + person.xm + '</xm>';
                    output += '</INPUT>';
                    output += '<OUTPUT>';
                    switch(person.xm){
                      case '库中无此号':
                          output += '<ITEM>';
                          output += '<errormesage>服务结果:库中无此号,请到户籍所在地进行核实</errormesage>'; 
                          output += '</ITEM>';
                          output += '<ITEM>';
                          output += '<errormesagecol />'; 
                          output += '</ITEM>';
                          break;
                      case '姓名缺失':
                          output += '<ITEM>';
                          output += '<errormesage>必录项缺失</errormesage>'; 
                          output += '</ITEM>';
                          output += '<ITEM>';
                          output += '<errormesagecol>姓名</errormesagecol>'; 
                          output += '</ITEM>';
                          break;
                      default:
                          output += '<ITEM>';
                          output += '<gmsfhm />';
                          output += '<result_gmsfhm>' + '一致' + '</result_gmsfhm>';
                          output += '</ITEM>';
                          output += '<ITEM>';
                          output += '<xm />';
                          output += '<result_xm>' + '一致' + '</result_xm>';
                          output += '</ITEM>';
                          break;
                    }
                    output += '</OUTPUT>';

                    output += '<RTS>';
                    output += '<RT>';
                    output += '<DN>WS 同住址成员</DN>';
                    output += '<ROWS>';
                    output += '<ROW no="1">';
                    output += '<INPUT />';
                    output += '<OUTPUT>';
                    output += '<ITEM>';
                    output += '<result_xm>高滕美</result_xm>';
                    output += '</ITEM>';
                    output += '<ITEM>';
                    output += '<result_xb>女性</result_xb>';
                    output += '</ITEM>';
                    output += '<ITEM>';
                    output += '<result_mz>汉族</result_mz>';
                    output += '</ITEM>';
                    output += '<ITEM>';
                    output += '<result_csrq>19900109</result_csrq>';
                    output += '</ITEM>';
                    output += '</OUTPUT>';
                    output += '</ROW>';
                    output += '</ROWS>';
                    output += '</RT>';
                    output += '</RTS>';

                    output += '</ROW>';
                  });
                  output += '</ROWS>';
                  return output;
              },
          }
      }
    }

var xml = fs.readFileSync(path.join(__dirname,'NciicLocalServices.wsdl'), 'utf8');
var server = http.createServer(function(request,response) {
        response.end("404: Not Found: " + request.url);
    });
server.listen(9000);
soap.listen(server, '/nciic_ws/services/NciicServices', nciicServices, xml);