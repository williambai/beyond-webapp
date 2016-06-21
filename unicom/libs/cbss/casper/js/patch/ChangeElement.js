/**
 * 生成台帐信息前检查
 * @param 无
 * @return 抛出提示信息
 * @author zhoush
 */
function checkBeforeGeneTrade() {
	console.log('++++ checkBeforeGeneTrade ++++\n')	
	//added by zhoubl
	var _all_infos = $F('_all_infos').evalJSON(true);
	if(_all_infos.RIGHT_CODE == "csExistUserJoinWO" && newProdId == curProductId){
		throw new Error('请选择一个新基本产品！');
	}
	//added by zhoubl end
	
    if($("IsBook").value!="true")
    {
	    if(mProdCount == 0) throw new Error('请选择一个基本产品！');
	    if(mProdCount > 1) throw new Error('只能选择一个基本产品！');
    }
    
    var agreeVaule ="";
    if ($("deviceAgreeArea")){
	    if ($("deviceAgreeArea").innerHTML !=""){
			var x=document.getElementsByName("agreeType");
			for (var i=0;i<x.length;i++){
				if(x[i].checked == true){
					agreeVaule = x[i].value;
					break;
				}
			}
	    }
	}
    if (agreeVaule == "0"){
	    	var deviceProductCount=0;
			$A(document.getElementsByName('_productinfos')).each(function(prod) {
			  if(prod.checked && prod.getAttribute('productMode') == '50'&&prod.getAttribute('parentArea') == "deviceProdutArea") {
				    //循环累积基础产品
				     deviceProductCount++
				 }
		     }); 
		     if(deviceProductCount==0)
		     {
		     	throw new Error('请选择营销产品！');
		     }else if(deviceProductCount>1)
		     {
		     	throw new Error('营销产品只能选择一个！');
		     }  
    }
	/*是否需要展开产品、包判断*/
	$A(document.getElementsByName('_productinfos')).each(function(prod) {
		if(prod.checked) {
			if((prod.getAttribute('needExp') == '1') && $("p"+prod.getAttribute('productId')).getAttribute('first').toUpperCase() == 'TRUE') {
				throw new Error('请展开产品：\"' + prod.getAttribute('productName') + '\"进行选择操作！');
			}
			
			$A($('p'+prod.getAttribute('productId')).all).each(function(elem) {
				if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
					&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'PACKAGE' && elem.needExp == '1'
					&& elem.checked && $("p"+elem.getAttribute('productId')+"k"+elem.getAttribute('packageId')).getAttribute('first').toUpperCase() == 'TRUE') {
						throw new Error('请展开产品：\"' + prod.getAttribute('productName') + '\"的业务包：\"' + elem.getAttribute('packageName') + '\"进行选择操作！');
				}
			});
		}
	});
};
