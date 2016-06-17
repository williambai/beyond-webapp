// Cs.ctrl.Trade.doBeforeSubmitCheckHack = function(){
//     //特殊判断固网移机、移机改号，跳过错误信息，直接提交
//     if( $("_rightCode") && ($F("_rightCode")=="csMove" || $F("_rightCode")=="csModifyMphonecodeGWTrade" || $F("_rightCode")=="csChangeUserItem")){
// 		if($('_locker') && $('_locker').style && $('_locker').style.display!="none"){
// 			alert("请先关闭提示窗口，再提交！");
// 			return false;
// 		}

// 		if(!Cs.ctrl.Web.needChkCustAfter()){
// 			return false;
// 		}
//     }
// console.log('++++++++1111111++++++\n');
//     return true;
// };
// Cs.ctrl.Trade.doBeforeSubmitCheckCustId = function(){  //处理win.confirm的js事件不停止
//     var cache = new Cs.flower.DataCache();
//     if (cache){
//         var custInfo = cache.get("custInfo");
//         if (!custInfo){
//         }else{
//             if($("_CUST_ID")!=null && $("_CUST_ID").value!="" && custInfo.custId!=$("_CUST_ID").value)
//             {
//                 return false;
//             }
//         }
//     }
// 	console.log('++++++++22222++++++\n');
//     return true;
// };
// Cs.ctrl.Trade.doBeforeSubmit= function(param){
//  	//add by taomunan TFS:284955         
//     if($("hasActorArea")!=null && $("actorArea")!=null)	
//     {
//       if($("hasActorArea").style.display =="none")
//       {
   	   
//       }
//       else 
//    	   {
//    	if($("jbrId")!=null && $("jbrId").checked==true){
//    		if(($("ACTOR_NAME")!=null && $F("ACTOR_NAME").blank())||($("ACTOR_PHONE")!=null && $F("ACTOR_PHONE").blank())||
//    				($("ACTOR_CERTTYPEID")!=null && $F("ACTOR_CERTTYPEID").blank())||($("ACTOR_CERTNUM")!=null && $F("ACTOR_CERTNUM").blank()))
//    		  {
//    			alert("请展开并完善经办人信息");
//    			return;
//    		  }
//    	   }
//    	}
//     }
//     console.log('++++++++3333333++++++\n');
	
//     if (param!='otherCheckCustId'){
//         var cache = new Cs.flower.DataCache();
//         if (cache){
//             var custInfo = cache.get("custInfo");
//             if (!custInfo){
//             }else{
//                 if($("_CUST_ID")!=null && $("_CUST_ID").value!="" && custInfo.custId!=$("_CUST_ID").value)
//                 {
//                     if(!window.confirm("提示：办理此业务的客户不是首页认证的客户!是否继续受理业务？"))
//                     {
//                         return false;
//                     }
//                 }
//             }
//         }
//     }
    
//     Cs.ctrl.Web.showInfo('提交业务数据，请稍候......');
    
//     try {
//         //子类业务界面其他操作
//         if (typeof doChildValidate != 'undefined' && doChildValidate instanceof Function) 
//             if(doChildValidate()===false) {
//                 Cs.ctrl.Web.hideInfo();
//             return false;
//         }        	
    	
//         if (!Cs.ctrl.Validate.verifyData("workarea")){//此处请不要乱改.
//             Cs.ctrl.Web.hideInfo();
//             return false;
//         }
        
//          if (typeof doChildAfterValidate != 'undefined' && doChildAfterValidate instanceof Function) 
//             if(doChildAfterValidate()===false) {
//                 Cs.ctrl.Web.hideInfo();
//             return false;
//         }        	
//     }catch(e) {        

//         Cs.ctrl.Web.hideInfo();
        
//         if (e != $TradeExit)
//         {
//             var win = new Cs.flower.Win();
//             win.alert(e.message);
//         }
        
//         return false;
//     }
//     console.log('++++++++444444++++++\n');			    
//     return true;
// };
// 
// Cs.ctrl.BatTrade.doSubmitBatTrade = function(){
// 	console.log('-----submit begin------\n')
//        var pagename = $('pagecontext').pagename;    
    
//     try{
//         Cs.ctrl.Trade.clearInfo();
//         //子类业务界面其他操作
//         if (typeof finishBatChildSave != 'undefined' && finishBatChildSave instanceof Function){ 
//             if(finishBatChildSave()===false){
//             	throw $TradeExit;
//             }
// 		}
// 	}catch(ex){if (ex!=$TradeExit)win.alert(ex.message);Cs.ctrl.Web.hideInfo();return}
	
// 	var str ="_batTradeBase="+encodeURIComponent($F("_batTradeBase"))+Form.serialize("workarea");
			
// 	if(Cs.ctrl.Trade._tradeInfo!='undefined' && Cs.ctrl.Trade._tradeInfo!=null)
// 	{
// 		str+="&_tradeInfo="+encodeURIComponent(Object.toJSON(Cs.ctrl.Trade._tradeInfo));					                       
// 	}
	
// 	//数据从前台WEB端获取	
// 	if($F("_batTradeBase").evalJSON()["MODE"]=="1"||$F("_saveData")!=''){
// 		str +="&Ext="+$F("_saveData");
// 	}
// 	console.log(pagename)
// 	console.log(str);			
//        // Cs.Ajax.swallowXml(pagename, "submitTrade", str);		
// 	console.log('-----submit end------\n')
// };


