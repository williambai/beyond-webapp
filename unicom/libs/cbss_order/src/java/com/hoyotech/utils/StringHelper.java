package com.hoyotech.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.isa.pims.basic.StringUtils;


public class StringHelper {
	private static int phoneProductNum = 19;
	public StringHelper() {
		
	}

	/**
	 * 字符串的长度是否大于0 
	 * @param str
	 * @return 
	 */
	public static boolean hasLength(String str) {
		return (str != null && str.length() > 0);
	}

	/**
	 * 判断字符串是否为null 或者 空白
	 * @param input
	 * @return
	 */
	public static boolean isEmpty(String input){
		return (input == null || "".equals(input.trim()));
	}
	
	/**
	 * xml保留字符轉義
	 * 
	 * @param s
	 * @return
	 */
	public static String tranXMLChars(String s) {
		return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(
				">", "&gt;").replaceAll("'", "&apos;").replaceAll("\"",
				"&quot;");
	}

	public static String convertFromXMLChars(String s) {
		return s.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll(
				"&gt;", ">").replaceAll("&apos;", "'").replaceAll("&quot;",
				"\"");
	}

	/**
	 * input的value轉義,（xml保留字符除'轉義)
	 * @param s
	 * @return
	 */
	public static String tranVALUEChars(String s) {
		return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(
				">", "&gt;").replaceAll("\"", "&quot;");
	}

	/**
	 * 处理Oracle 的转义字符，使like 查询可以正确匹配
	 * ' ——> ''
	 * & ——> '||char(38)||'	（10g中ms 不用转义）
	 * % ——> \% 'escape'\
	 * _ ——> \_ 'escape'\ 
	 * 
	 */
	public static String transformLikeSql(String s) {

		boolean isContain = false;
		String result = (s == null) ? "" : s;
		if (result.indexOf("%") != -1) {
			isContain = true;
		} else if (result.indexOf("_") != -1) {
			isContain = true;
		}
		result = result.replaceAll("'", "''");
		if (!isContain) {
			return "%" + result + "%";
		}

		result = "%" + result.replaceAll("%", "\\\\%").replaceAll("_", "\\\\_")
				+ "%";
		result += "'escape'\\";
		return result;
	}

	/**
	 * 处理普通的sql，解决条件中'的问题，用于非like SQL条件 的拼装
	 * @param s
	 * @return
	 */
	public static String transformSql(String s) {
		String result = (s == null) ? "" : s;
		return result.replaceAll("'", "''");
	}

	
	public static String convertLongArrayIdToString(long[] longArray){
		String result = "";
		for(long input : longArray){
			result += input+ ",";
		}
		if(result.length() == 0){
			return result;
		}else{
			return result.substring(0,result.length()-1);
		}
	}
	
	public static String convertStringArrayIdToString(String[] strArray){
		String result = "";
		for(String input : strArray){
			result += input+ ",";
		}
		return result;
	}
	
	public static String joinStringArray(Object[] strArray, String joinStr) {
		String result = "";
		for(Object str : strArray) {
			result += str.toString() + joinStr;
		}
		return result;
	}
	/**
	 * 截断字符串
	 * 如果字符串长度小于需要长度，则返回字符串本身
	 * @param src
	 * @param length
	 * @param suffix
	 * @return
	 */
	public static String truncate(String src, int length, String suffix){
		if(src == null)
			return src;
		src = src.trim();
		if(src.length() <= length)
			return src;
		return src.substring(0, length) + suffix;
	}
	
	/**
	 * 对html中符号进行转义
	 * @param s
	 * @param replacement
	 * @return
	 */
	public static String escapeHtmlNotation(String s, String replacement){
		return s.replaceAll("<.+?>", replacement);
	}
	
	/**
	 * 翻页起止
	 * @param pageNo
	 * @param totalPage
	 * @param maxLen
	 * @return
	 */
	public static int[] getPager(int pageNo,int maxLen,int totalPage) {
		int startPos = 1, endPos = 1;
		int midPos = (maxLen%2 == 0) ? maxLen/2 : maxLen/2+1;
		if(totalPage <= maxLen) {
			endPos = totalPage;
		} else {
			if(pageNo <= midPos) {
				endPos = maxLen;
			} else {
				startPos = (pageNo - midPos +1) > (totalPage - maxLen) ? (totalPage - maxLen + 1) : (pageNo - midPos +1);
				endPos = (pageNo + midPos) > totalPage ? totalPage : (pageNo + midPos - 1);
			}
		}
		return new int[]{startPos, endPos};
	}
	
	
	
	/**
	 * 截取字符串中的数字
	 * @param str
	 * @return
	 */
	public static String getNumFromString(String str){
		String num = null;
		Pattern pattern = Pattern.compile("\\d+(\\.\\d+)?");
		Matcher matcher = pattern.matcher(str);
		if (matcher.find()) {
			num = matcher.group(0);
		}
		return num;
	}
	
	/**
	 * 判断是否是电信手机号码
	 * @param mobiles
	 * @return
	 */
	public static boolean isMobileNO(String mobiles){
		Pattern p = Pattern.compile("^(133|153|(18[0-1,9]))\\d{8}$");  
		Matcher m = p.matcher(StringUtils.$C(mobiles,""));  
		return m.matches();
	}
	
	/**
	 * 获得验证码
	 * @return
	 */
	public String getVerificationCode(){
		Random random = new Random(System.currentTimeMillis());
		String code = new Integer(random.nextInt()).toString().replace("-", "");
		if(code.length()<6){
			String temp = "";
			for(int i=0;i<6-code.length();i++){
				temp += "0";
			}
			code +=temp; 
		}else{
			code = code.substring(0,6);
		}
		return code;
	}
	
	public String getEncryptId(String id){
		String code = getVerificationCode();
		StringBuilder sb = new StringBuilder();
		sb.append(id).append(code);
		return sb.toString();
	}
	
	public String getPhoneProduct(String phone,String productId){
		StringBuilder result = new StringBuilder();
		StringBuilder phoneProduct = new StringBuilder();
		phoneProduct = phoneProduct.append(phone).append(productId);
		if(phoneProduct.length() < 19){
			StringBuilder character = new StringBuilder();
			for(int i=0;i<phoneProductNum - phoneProduct.length();i++){
				character.append("0");
			}
			result = result.append(phone).append(character).append(productId);
		}else{
			result = phoneProduct;
		}
		return result.toString();
	}
	
	public String getPhoneHot(String phone,String type,String hotId){
		StringBuilder result = new StringBuilder();
		StringBuilder phoneProduct = new StringBuilder();
		phoneProduct = phoneProduct.append(phone).append(type).append(hotId);
		if(phoneProduct.length() < 19){
			StringBuilder character = new StringBuilder();
			for(int i=0;i<phoneProductNum - phoneProduct.length();i++){
				character.append("0");
			}
			result = result.append(phone).append(type).append(character).append(hotId);
		}else{
			result = phoneProduct;
		}
		return result.toString();
	}
	public static List<String> transFromStringToList(String input){
		List<String> list = null;
		if(input == null || input.isEmpty()){
			return list;
		}
		input = input.replace("]","").replace("]","").replace("\"","");
		if(!input.isEmpty()){
			list = new ArrayList<String>();
			for(String li:input.split(",")){
				list.add(li);
			}
		}
		return list;
	}
	public static void main(String[] args) {
//		int page[] = StringHelper.getPager(0, 20, 4);
//		System.out.println(page[0]+" # "+page[1]);
//		System.out.println(StringHelper.getShortURLByourls("http://hb189.mobi//yourls-api.php?signature=695be61582&action=shorturl&format=json&url=http://hb.vnet.cn/w3g.apk"));
//		System.out.println(getNumFromString("上网流量677.59M，"));
		StringHelper sh = new StringHelper();
//		System.out.println(sh.getEncryptId("534"));
//		System.out.println(sh.getPhoneHot("18040588360", "1","1965907"));
		sh.getVerificationCode();
	}
	
}