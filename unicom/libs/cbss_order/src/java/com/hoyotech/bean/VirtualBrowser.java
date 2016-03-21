package com.hoyotech.bean;

import java.util.Map;

import org.apache.commons.httpclient.Header;

public class VirtualBrowser {
	private Header[] header;
	private int status;
	private Map<String,String> cookies;
	private String html;
	
	public Header[] getHeader() {
		return header;
	}
	public void setHeader(Header[] header) {
		this.header = header;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	
	public Map<String, String> getCookies() {
        return cookies;
    }
    public void setCookies(Map<String, String> cookies) {
        this.cookies = cookies;
    }
    public String getHtml() {
		return html;
	}
	public void setHtml(String html) {
		this.html = html;
	}
	
}
