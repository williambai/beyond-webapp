Ajax.Request.prototype.setRequestHeaders = function() {
  var headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'X-Prototype-Version': Prototype.Version,
    'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
  };

  if (this.method == 'post') {
    headers['Content-type'] = this.options.contentType +
      (this.options.encoding ? '; charset=' + this.options.encoding : '');

    /* Force "Connection: close" for older Mozilla browsers to work
     * around a bug where XMLHttpRequest sends an incorrect
     * Content-length header. See Mozilla Bugzilla #246651.
     */
    if (this.transport.overrideMimeType &&
        (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
          headers['Connection'] = 'close';
  }

  // user-defined headers
  if (typeof this.options.requestHeaders == 'object') {
    var extras = this.options.requestHeaders;

    if (typeof extras.push == 'function')
      for (var i = 0, length = extras.length; i < length; i += 2)
        headers[extras[i]] = extras[i+1];
    else
      $H(extras).each(function(pair) { headers[pair.key] = pair.value });

  }
  for (var name in headers){
    if(!/toJSONString/i.test(name)) this.transport.setRequestHeader(name, headers[name]);
  }
};

/**
 * 以下为debug调试所用 
 */

Ajax.Request.prototype.request = function(url) {
  this.url = url;
  this.method = this.options.method;
  var params = Object.clone(this.options.parameters);

  if (!['get', 'post'].include(this.method)) {
    // simulate other verbs over post
    params['_method'] = this.method;
    this.method = 'post';
  }

  this.parameters = params;

  if (params = Hash.toQueryString(params)) {
    // when GET, append parameters to URL
    if (this.method == 'get')
      this.url += (this.url.include('?') ? '&' : '?') + params;
    else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent))
      params += '&_=';
  }

  try {
    if (this.options.onCreate) this.options.onCreate(this.transport);
    Ajax.Responders.dispatch('onCreate', this, this.transport);

    this.transport.open(this.method.toUpperCase(), this.url,
      this.options.asynchronous);

    if (this.options.asynchronous)
      setTimeout(function() { this.respondToReadyState(1) }.bind(this), 10);

    this.transport.onreadystatechange = this.onStateChange.bind(this);

    this.setRequestHeaders();

    this.body = this.method == 'post' ? (this.options.postBody || params) : null;
    console.log('\n\n========request body begin ========\n');
    console.log(this.url + '\n\n');
    console.log(this.body)
    console.log('\n\n========request body end ========\n');
    this.transport.send(this.body);

    /* Force Firefox to handle ready state 4 for synchronous requests */
    if (!this.options.asynchronous && this.transport.overrideMimeType)
      this.onStateChange();
  }
  catch (e) {
    this.dispatchException(e);
  }
};

showResponse = function(response) {
  console.log('\n\n========response body begin ========\n');
  console.log(response.responseText);
  console.log('\n\n========response body end ========\n');
  var scripts = "";
  var root;
  if (Browser.isFF) { 
    var parser = new DOMParser();
    var xml = parser.parseFromString(response.responseText, "text/xml");
    var root = xml.documentElement;
  }
  else{
    root = response.responseXML.documentElement;
  }
  // console.log(root.nodeName)
  if (root == null || root.nodeName!='parts') {
    if (wade_sbtframe != null) {
      document.getElementById("wade_sbtframe").setAttribute("simplePage", "true");
      wade_sbtframe.document.write(response.responseText);
    } else {
      w = window.open("", null, "status=yes,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no");
      w.document.write(response.responseText);
    }
    this.afterAction = "";
  } else {
    var partNodes = root.childNodes;
    for (var i = 0; i < partNodes.length; i++) {
      var part = partNodes.item(i);
      // console.log(part.nodeName + '\n');
      if (part.nodeName == 'JSONDATA' && part.childNodes[0]!=null){
        this.ajaxData=part.childNodes[0].nodeValue.parseJSON();
      }
      if (part.attributes) {
        var partId = part.attributes[0].value;
        // console.log('partId:' + partId);
        var partElement = document.getElementById(partId);
        // console.log(partElement);
        if (partElement) {
          if (part.childNodes != null && part.childNodes.length > 0) {
            var content = "";
            for (var ii = 0; ii < part.childNodes.length; ii++) {
              content += part.childNodes[ii].nodeValue;
            }
            // console.log('content:' + content + '\n')
            // console.log(partElement.innerHTML + '\n');
            if (partElement.innerHTML != content) {
              partElement.innerHTML = content;
            // console.log(partElement.innerHTML + '\n');
              scripts += content.extractScripts().join(";") + ";";
            }
          } else {
            //modi by zhujm 20070720
            //不应该将part删除
            //partElement.parentNode.removeChild(partElement);
            partElement.innerHTML='';
          }
        }
      }
    }
  }
  // console.log(this.afterAction)
  this.afterAction = scripts + (this.afterAction ? this.afterAction : "");
};


// Ajax.Request.prototype.setRequestHeaders = function() {
//     console.log('------1------!\n')
//   var headers = {
//     'X-Requested-With': 'XMLHttpRequest',
//     'X-Prototype-Version': Prototype.Version,
//     'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
//   };

//     console.log('------2------!\n')
//   if (this.method == 'post') {
//     headers['Content-type'] = this.options.contentType +
//       (this.options.encoding ? '; charset=' + this.options.encoding : '');

//     console.log('------3------!\n')
//     /* Force "Connection: close" for older Mozilla browsers to work
//      * around a bug where XMLHttpRequest sends an incorrect
//      * Content-length header. See Mozilla Bugzilla #246651.
//      */
//     if (this.transport.overrideMimeType &&
//         (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
//           headers['Connection'] = 'close';
//   }
//     console.log('------4------!\n')

//   // user-defined headers
//   if (typeof this.options.requestHeaders == 'object') {
//     var extras = this.options.requestHeaders;
//     console.log('------5------!\n')

//     if (typeof extras.push == 'function')
//       for (var i = 0, length = extras.length; i < length; i += 2)
//         headers[extras[i]] = extras[i+1];
//     else
//       $H(extras).each(function(pair) { headers[pair.key] = pair.value });

//   }
//     console.log('------6------!\n')
//   for (var name in headers){
//     if(!/toJSONString/i.test(name)) this.transport.setRequestHeader(name, headers[name]);
//   }
//     console.log('------7------!\n')

// };
// Ajax.Request.prototype.setOptions = function(options) {
// 	console.log('++++++++op ++++++++')					
// 	    this.options = {
// 	      method:       'post',
// 	      asynchronous: true,
// 	      contentType:  'application/x-www-form-urlencoded',
// 	      encoding:     'UTF-8',
// 	      parameters:   ''
// 	    }
// 	    Object.extend(this.options, options || {});

// 	    this.options.method = this.options.method.toLowerCase();
// 	    if (typeof this.options.parameters == 'string')
// 	      this.options.parameters = this.options.parameters.toQueryParams();
// 	  }

// Ajax.Request.prototype.request = function(url) {
//    console.log('*******')
//   this.url = url;
//   this.method = this.options.method;
//   var params = Object.clone(this.options.parameters);

//   if (!['get', 'post'].include(this.method)) {
//     // simulate other verbs over post
//     params['_method'] = this.method;
//     this.method = 'post';
//   }
//    console.log('***2****')

//   this.parameters = params;

//   if (params = Hash.toQueryString(params)) {
//     // when GET, append parameters to URL
//     if (this.method == 'get')
//       this.url += (this.url.include('?') ? '&' : '?') + params;
//     else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent))
//       params += '&_=';
//   }
//    console.log(JSON.stringify(this.parameters))
//    console.log('***3****')

//   try {
//     if (this.options.onCreate) this.options.onCreate(this.transport);
//     Ajax.Responders.dispatch('onCreate', this, this.transport);
//    console.log('***4****')

//     this.transport.open(this.method.toUpperCase(), this.url,
//       this.options.asynchronous);
//    console.log('***5****')

//     if (this.options.asynchronous)
//       setTimeout(function() { this.respondToReadyState(1) }.bind(this), 10);
//    console.log('***6****')

//     this.transport.onreadystatechange = this.onStateChange.bind(this);

//     this.setRequestHeaders();
//    console.log('***7****')

//     this.body = this.method == 'post' ? (this.options.postBody || params) : null;
//     console.log(this.body)
//     this.transport.send(this.body);
//    console.log('***8****')

//     /* Force Firefox to handle ready state 4 for synchronous requests */
//     if (!this.options.asynchronous && this.transport.overrideMimeType)
//       this.onStateChange();
//   }
//   catch (e) {
//     this.dispatchException(e);
//   }
// };


// var request = new Ajax.Request('http://localhost:9200',{
// 	method: 'get',
// 	// parameters: {},
// 	asynchronous: true,
// 	onComplete: function(res){
// 		console.log('-----')
// 		console.log(res.responseText);
// 	},
// 	onException: function(exception){
// 		console.log('11111111111');
// 	}
// });

// ajaxSubmit = function(page,listener,params,partids,formIds,israw){
// 	console.log('+++-------1------+++')
// 	if (document.forms.length == 0) {
// 		alert('form tag not exist');
// 		return;
// 	}
// 	console.log('+++-------2------+++')
// 	if (page == null || page != null && typeof(page) != "string") {
// 		page = pagevisit.getAttribute("pagename");
// 	}
// 	console.log('+++-------3------+++')
// 	console.log(page)
// 	var obj = getElementBySrc();
// 	console.log('+++-------3--1----+++')
// 	console.log(JSON.stringify(obj));
// 	console.log(getContextName)
// 	//var url = window.location.protocol + '//' + window.location.host + '/' + getContextName() +
// 	// zhangqing modify by 20071113
// 	var url = getContextName() +
// 	// var url = 'https://gz.cbss.10010.com/acctmanm' +
// 	 "?service=ajaxDirect/1/" + page + '/' + page + '/javascript/' + partids;
// 	console.log('+++-------3-2-----+++')
// 	console.log(url)
// 	if (page != null) url += "&pagename=" + page;
// 	if (listener != null) url += "&eventname=" + listener;
// 	if (israw == null || !israw) url = getSysAddr(url,obj == null ? null : obj.subsys);
// 	console.log('+++-------4------+++')
	
// 	var ele='';
	
// 	console.log('+++-------5------+++')
// 	if (formIds) {
// 		formIds = formIds.split(",");
// 		for(i=0;i<formIds.length;i++){
// 			if (!$(formIds[i])){
// 				alert("can't get form (" + formIds[i] + ")");
// 				continue;
// 			}
// 			ele += Form.serialize(formIds[i]) + '&';
// 			ele = delElement(ele, "service");
// 			ele = delElement(ele, "sp");
// 		}
// 	} else {
// 		//formId为空默认为链接所在表单
// 		formNode = getParentForm(obj);
// 		if (formNode=='null'){
// 			formNode = document.forms[0];
// 		}
// 		ele = Form.serialize(formNode);
// 		ele = delElement(ele, "service");
// 		ele = delElement(ele, "sp");
// 	}
	
// 	console.log('+++-------6------+++')
// 	if (params != null) ele += params;
	
// 	url = url + '&partids=' + partids;
// 	url += "&random=" + getRandomParam();
// 	console.log('+++-------7------+++\n')
// 	console.log(url)
// 	console.log('+++-------8------+++\n')
// 	console.log(ele)
// 	ajaxRequest(url,ele,'post');
// 	console.log('+++-------9------+++\n')
// };

// ajaxRequest = function(reqUrl,params,method){
// 	console.log('--------a-------')
// 	if (method==null || !method) method='get';
// 	if (method=='get'){
// 		reqUrl = reqUrl+'&ajaxSubmitType=get';
// 		var myAjax = new Ajax.Request(reqUrl, {
// 			method:"get", 
// 			parameters:params,
// 			onComplete: showResponse
// 		});
// 	}
// 	else if (method=='post'){
// 		reqUrl = encodeURI(reqUrl+'&ajaxSubmitType=post');
// 		console.log(reqUrl);
// 	console.log('--------a-11111------')
// 		console.log(params);
// 	console.log('--------a--22222-----')
// 		var myAjax = new Ajax.Request(reqUrl, {method:"post", parameters:params,onComplete:showResponse});
// 	}
// 	else{
// 	console.log('--------b-------')
// 		alert('错误的提交方式'+method);
// 		return false;
// 	}
// 	console.log(reqUrl);
// 	console.log('--------c-------')
// }
// ajaxRequest('https://gz.cbss.10010.com/scripts-custserv/core/Cs.js?',{},'get');
// ajaxRequest('http://localhost:9200?',{asynchronous: true},'get');


// var request = new XMLHttpRequest();
// request.open('GET','http://localhost:9200',false);
// request.send(null);
// console.log(request.responseText);
