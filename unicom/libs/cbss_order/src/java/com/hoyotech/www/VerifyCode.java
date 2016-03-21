package com.hoyotech.www;

public class VerifyCode {
	static{
//		System.loadLibrary("libtesseract302");
//		System.loadLibrary("liblept168");
		System.loadLibrary("VerifyCode");
	}
	public native String parseVerifyFile(String path);
	
	public static void main(String[] args) {
		VerifyCode test = new VerifyCode();		
		String path = "./pic/ff4e8dc5-3dae-4b1e-bb77-5732121cc6bb.jpg";
		System.out.println(test.parseVerifyFile(path));
	}
}
