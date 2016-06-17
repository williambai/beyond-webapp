//** fix bugs
//点击产品查明细
queryPackageInfo = function(productId){
    closeOpen($("p"+productId),$("closeopen"+productId));    
	if($("p"+productId).getAttribute('first').toUpperCase() == 'FALSE') {
		$("p"+productId).toggle();	 
        closeOpen($("p"+productId),$("closeopen"+productId));   
		return;
	}

	/**
	 * 根据产品标识获取包信息 返回 pkgByPId 节点(modify_tag='0')
	 * 根据用户标识+产品标识获取包信息 返回 pkgByPId 节点(modify_tag='1')
	 * 根据用户标识+产品标识获取包(用户信息与参数信息整合)信息 返回 pkgByPId 节点(modify_tag='2')
	 */
	//QC:96235 BEGIN
	//Cs.Ajax.swallowXmlCache("pkgByPId:"+productId, prodPage, "getPackageByPId", "productId="+productId+"&modifyTag="+$('_p'+productId).modifyTag+"&userId="+userId+"&productMode="+$('_p'+productId).productMode+"&curProductId="+curProductId+"&onlyUserInfos="+onlyUserInfos+"&productInvalid="+$('_p'+productId).productInvalid, "正在查询产品信息，请稍候......", '', noCache);
    Cs.Ajax.swallowXmlCache("pkgByPId:"+productId, prodPage, "getPackageByPId", "productId="+productId+"&modifyTag="+$('_p'+productId).modifyTag+"&userId="+userId+"&productMode="+$('_p'+productId).productMode+"&curProductId="+curProductId+"&onlyUserInfos="+onlyUserInfos+"&productInvalid="+$('_p'+productId).productInvalid+"&tradeTypeCode="+tradeTypeCode, "正在查询产品信息，请稍候......", '', noCache);
    //QC:96235 END
};






// //控制产品展示 ‘+’ ‘-’ 号--miyro_lan
// closeOpen = function(elementId,closeOpeneId){
// 	console.log('+++++closeOpen+++++\n');
// 		if(elementId.visible()== true) {
//         	closeOpeneId.className = "expand";
//         	closeOpeneId.src='/images-custserv/win/open.gif';
// 	    }else {
// 	        closeOpeneId.className = "unexpand";
// 	        closeOpeneId.src='/images-custserv/win/close.gif';
// 	    } 
// 	console.log('+++++closeOpen end +++++\n');
// };
// //点击产品查明细
// queryPackageInfo = function(productId){
// 	console.log('+++++queryPackageInfo+++++\n');
//     closeOpen($("p"+productId),$("closeopen"+productId));    
// 	console.log($("p"+productId).getAttribute('first').toUpperCase());
// 	console.log('+++++queryPackageInfo -- 0 +++++\n');
// 	if($("p"+productId).getAttribute('first').toUpperCase() == 'FALSE') {
// 		$("p"+productId).toggle();	 
//         closeOpen($("p"+productId),$("closeopen"+productId));   
// 		return;
// 	}
// 	console.log('+++++queryPackageInfo -- 1 +++++\n');

// 	/**
// 	 * 根据产品标识获取包信息 返回 pkgByPId 节点(modify_tag='0')
// 	 * 根据用户标识+产品标识获取包信息 返回 pkgByPId 节点(modify_tag='1')
// 	 * 根据用户标识+产品标识获取包(用户信息与参数信息整合)信息 返回 pkgByPId 节点(modify_tag='2')
// 	 */
// 	//QC:96235 BEGIN
// 	//Cs.Ajax.swallowXmlCache("pkgByPId:"+productId, prodPage, "getPackageByPId", "productId="+productId+"&modifyTag="+$('_p'+productId).modifyTag+"&userId="+userId+"&productMode="+$('_p'+productId).productMode+"&curProductId="+curProductId+"&onlyUserInfos="+onlyUserInfos+"&productInvalid="+$('_p'+productId).productInvalid, "正在查询产品信息，请稍候......", '', noCache);
//     Cs.Ajax.swallowXmlCache("pkgByPId:"+productId, prodPage, "getPackageByPId", "productId="+productId+"&modifyTag="+$('_p'+productId).modifyTag+"&userId="+userId+"&productMode="+$('_p'+productId).productMode+"&curProductId="+curProductId+"&onlyUserInfos="+onlyUserInfos+"&productInvalid="+$('_p'+productId).productInvalid+"&tradeTypeCode="+tradeTypeCode, "正在查询产品信息，请稍候......", '', noCache);
//     //QC:96235 END
// 	console.log('+++++queryPackageInfo end+++++\n');
// };
