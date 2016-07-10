function checkSubmit(){
	var AUTH_TYPE_TALK_WEB='1',AUTH_TYPE_ESS='0',authType = $('AUTH_TYPE').value;
	if(AUTH_TYPE_ESS == authType){
	/* 	passwdEncryption(); */
		var actionUrl = $('LOGIN_PROVINCE_REDIRECT_URL').value + '?service=page/LoginProxy&login_type=redirectLogin';
		$('staffLogin').action = actionUrl;
	}else if(AUTH_TYPE_TALK_WEB == authType){
		$('staffLogin').action = $('TALK_WEB_LOGIN_URL').value;
		$('Login').value = $('STAFF_ID').value;
		$('Password').value = $('LOGIN_PASSWORD').value;
		$('Captcha').value = $('VERIFY_CODE').value;
		$('Success').value = $('LOGIN_PROVINCE_REDIRECT_URL').value + '?service=page/LoginProxy&login_type=sso';
		$('Error').value = $('LOGIN_PROVINCE_REDIRECT_URL').value + '?service=page/LoginProxy&login_type=sso&authType=' + AUTH_TYPE_TALK_WEB;
	}
	$('staffLogin').submit();
}
