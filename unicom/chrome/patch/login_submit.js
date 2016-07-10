function onKeyPressEventByDefault() {
    onKeyPressEvent(null);
}
addObjEventListener("document", "keypress", onKeyPressEventByDefault);

function onContextMenuEventByDefault() {
    window.event.returnValue = false;
}
addObjEventListener("document", "contextmenu", onContextMenuEventByDefault);
var pagevisit = getPageVisit();
completePageLoad();

	// document.onreadystatechange = function() {
	// 		//QC:17848 BEGIN
	// 		if(getElementValue('IPASS_CHECK_MESSAGE')!=''){
	// 			alert(getElementValue('IPASS_CHECK_MESSAGE'));
	// 		}
	// 		if(getElementValue('NEED_INSTALL_CERT')!=''){
	// 			installIpassCert();
	// 		}
	// 		//QC:17848 END
	// 		if (document.readyState == "complete") {
	// 				$('btnProxyLogin').click();
	// 		}
	// 	}
		
	// 	function installIpassCert(){
	// 		var installResult = installcert(getElementValue('NEED_INSTALL_CERT'));
	// 		getElement('IPASS_INSTALL_RESULT').value = installResult.code;
	// 		getElement('IPASS_INSTALL_MESSAGE').value = installResult.message;
	// 		//证书安装成功，由证书申请转为证书校验模式，并将安装证书清空
	// 		if(installResult.code == '1'){
	// 			getElement('IPASS_LOGIN').value = true;
	// 			getElement('IPASS_ACTIVATE').value = true;
	// 			getElement('NEED_INSTALL_CERT').value = '';
	// 			getElement('IPASS_CHECK_MESSAGE').value = '';
	// 		}else{
	// 			if(window.confirm(installResult.message+'点击确定重试或者返回主页')){
	// 				installIpassCert();
	// 			}
	// 		}
	// 	}