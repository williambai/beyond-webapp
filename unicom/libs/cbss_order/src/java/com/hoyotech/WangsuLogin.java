package com.hoyotech;

import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.hoyotech.bean.VirtualBrowser;
import com.hoyotech.utils.HttpsTool;

public class WangsuLogin {
	public static void login(){
		String startCookie = "JSESSIONID=22C440A5A29611C491928E0556A58565";
		String encoding = "utf-8";
		String url = "https://portal.chinanetcenter.com/cas/login?service=https%3A%2F%2Fportal.chinanetcenter.com%2Fuuc%2Fr_sec_login";
		Map<String,String> header = new HashMap<String,String>();
		header.put("Accept,text/html","application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
//		header.put("Accept-Encoding","gzip, deflate");
		header.put("Accept-Language","zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3");
		header.put("Connection","keep-alive");
		header.put("Cookie",startCookie);
		header.put("Host","portal.chinanetcenter.com");
//		header.put("Referer","https://portal.chinanetcenter.com/cas/login?service=https%3A%2F%2Fportal.chinanetcenter.com%2Fuuc%2Fr_sec_login");
		header.put("User-Agent","Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0");
		VirtualBrowser vb = HttpsTool.get(url, header, encoding);
		Pattern pattern = Pattern.compile(".*input type=\"hidden\" name=\"lt\" value=\"(.+?)\"/>.*",Pattern.DOTALL);
		Matcher matcher = pattern.matcher(vb.getHtml());
//		System.out.println(vb.getHtml());
		String lt = "";
		if(matcher.matches()){
			lt = matcher.group(1);
			System.out.println(lt);
		}
		String imageUrl = "https://portal.chinanetcenter.com/cas/captchaImage?randomId="+Math.random();
		Map<String,String> imageHeader = new HashMap<String,String>();
		imageHeader.put("Accept","image/png,image/*;q=0.8,*/*;q=0.5");
		imageHeader.put("Accept-Encoding","gzip, deflate");
		imageHeader.put("Accept-Language","zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3");
		imageHeader.put("Connection","keep-alive");
		imageHeader.put("Cookie",startCookie);
		imageHeader.put("Host","portal.chinanetcenter.com");
		imageHeader.put("Referer","https://portal.chinanetcenter.com/cas/login?service=https%3A%2F%2Fportal.chinanetcenter.com%2Fuuc%2F");
		imageHeader.put("User-Agent","Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0");
		String savePath = "./pic/"+UUID.randomUUID().toString()+".jpg";
		System.out.println(savePath);
		HttpsTool.downloadPicture(imageUrl, imageHeader, savePath);
		savePath = "./pic/"+UUID.randomUUID().toString()+".jpg";
		System.out.println(savePath);
		HttpsTool.downloadPicture(imageUrl, imageHeader, savePath);
		Scanner scanner = new Scanner(System.in);
		String captcha = scanner.nextLine();
		System.out.println(captcha + " "+captcha.length() );
		scanner.close();
		Map<String,String> loginHeader = new HashMap<String,String>();
		loginHeader.put("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
//		loginHeader.put("Accept-Encoding","gzip, deflate");
		loginHeader.put("Accept-Language","zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3");
		loginHeader.put("Connection","keep-alive");
		loginHeader.put("Cookie",startCookie);
		loginHeader.put("Host","portal.chinanetcenter.com");
		loginHeader.put("Referer","https://portal.chinanetcenter.com/cas/login?service=https%3A%2F%2Fportal.chinanetcenter.com%2Fuuc%2Fr_sec_login");
		loginHeader.put("User-Agent","Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0");
		Map<String,String> params = new HashMap<String,String>();
		params.put("jcaptcha",captcha);
		params.put("lt",lt);
		params.put("password","whqm_123!@#");
		params.put("submit","登录");
		params.put("username","whqm_app");
		VirtualBrowser vbr = HttpsTool.post(url, loginHeader, params, encoding);
		System.out.println(vbr.getHtml());
	}
	public static void main(String[] args) {
		login();
	}
}
