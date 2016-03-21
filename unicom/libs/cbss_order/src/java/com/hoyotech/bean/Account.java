package com.hoyotech.bean;

import java.util.HashMap;
import java.util.Map;

public class Account {

    private String provinceId;
    private String userName;
    private String passWord;
    private Map<String,String> cookie = new HashMap<String,String>();
    private Map<String,String> metaInfo = new HashMap<String,String>();
    public boolean isLogin = false;

    public Account(String provinceId,String userName, String passWord) {
        super();
        this.provinceId = provinceId;
        this.userName = userName;
        this.passWord = passWord;
    }

    public synchronized void login(){
        if(!isLogin){
            this.userLogin();
        }
    }
    private void userLogin(){
        
    }

    public String getProvinceId() {
		return provinceId;
	}

	public void setProvinceId(String provinceId) {
		this.provinceId = provinceId;
	}

	public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassWord() {
        return passWord;
    }

    public void setPassWord(String passWord) {
        this.passWord = passWord;
    }

    public Map<String, String> getCookie() {
        return cookie;
    }

    public void setCookie(Map<String, String> cookie) {
        this.cookie = cookie;
    }

    public boolean isLogin() {
        return isLogin;
    }

    public void setLogin(boolean isLogin) {
        this.isLogin = isLogin;
    }

    public Map<String, String> getMetaInfo() {
        return metaInfo;
    }

    public void setMetaInfo(Map<String, String> metaInfo) {
        this.metaInfo = metaInfo;
    }

    public static void main(String[] args) {
	}
    
}
