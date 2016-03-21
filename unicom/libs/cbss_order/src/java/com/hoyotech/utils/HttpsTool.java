package com.hoyotech.utils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.protocol.Protocol;
import org.apache.log4j.Logger;

import com.hoyotech.bean.SpProduct;
import com.hoyotech.bean.VirtualBrowser;
import com.hoyotech.thread.MySSLProtocolSocketFactory;

public class HttpsTool {
    public static final String phone = "13212712555";
    private static Logger logger = Logger.getLogger(HttpsTool.class);
    /**
     * strean 转换为字符串  
     * @param in
     * @return
     * @throws IOException
     */
    public static String inputStream2String(InputStream in,String encoding) throws IOException {
        StringBuffer out = new StringBuffer();
        byte[] b = new byte[4096];
        for (int n; (n = in.read(b)) != -1;) {
            out.append(new String(b, 0, n,encoding));
        }
        return out.toString();
    }
    /**
     * httpGet请求
     * @param url
     * @param header
     * @return
     */
    public static VirtualBrowser get(String url,Map<String,String> header,String encoding){
        VirtualBrowser vb = new VirtualBrowser();
        HttpClient httpclient = new HttpClient();
        GetMethod httpget = new GetMethod(url);
        try {
            Protocol myhttps = new Protocol("https", new MySSLProtocolSocketFactory(), 443); 
            Protocol.registerProtocol("https", myhttps); 
            for(String li:header.keySet()){
                httpget.addRequestHeader(li, header.get(li));
            }
            String cookieString = header.get("Cookie");
            Map<String,String> cookies = new HashMap<String,String>();
            if(cookieString != null){
                String[] keyValue = cookieString.split(";");
                for(String li:keyValue){
                    if(li.length() > 0 && li.contains("=")){
                        String key = li.substring(0, li.indexOf("="));
                        String value = li.substring(li.indexOf("=")+1,li.length());
                        cookies.put(key,value);
                    }
                }
            }
            int respCode = httpclient.executeMethod(httpget);
            vb.setStatus(respCode);
            Header[] respHeader = httpget.getResponseHeaders();
            InputStream stream = httpget.getResponseBodyAsStream();
            String respString = inputStream2String(stream,encoding);
            vb.setHtml(respString);
            //服务器返回的Set-Cookie字段处理,更新cookie
            for(Header li:respHeader){
                String headerName = li.getName();
                String headerValue = li.getValue();
                if("Set-Cookie".equals(headerName)){
                    String[] cookieKeyValue = headerValue.split(";");
                    for(String cookie:cookieKeyValue){
                        if(cookie.length() > 0 && cookie.contains("=")){
                            String key = cookie.substring(0, cookie.indexOf("="));
                            String value = cookie.substring(cookie.indexOf("=")+1,cookie.length());
                            cookies.put(key,value);
                        }
                    }
                }
            }
            vb.setCookies(cookies);
            httpget.abort();
        }catch(Exception e){
            logger.error(e.getMessage());
        }finally{
            httpget.releaseConnection(); 
//            httpclient.getHttpConnectionManager().closeIdleConnections(0);
        }
        return vb;
    }
    /**
     * httpPost请求
     * @param url
     * @param header
     * @param params
     * @param encoding
     * @return
     */
    public static VirtualBrowser post(String url,Map<String,String> header,Map<String,String> params,String encoding){
        HttpClient httpclient = new HttpClient();
        PostMethod post = new PostMethod(url);
        VirtualBrowser vb = new VirtualBrowser();
        for(String li:header.keySet()){
            post.addRequestHeader(li,header.get(li));
        }
        for(String li:params.keySet()){
            post.addParameter(li,params.get(li));
        }
        //请求中的cookie
        String cookieString = header.get("Cookie");
        Map<String,String> cookies = new HashMap<String,String>();
        if(cookieString != null){
            String[] keyValue = cookieString.split(";");
            for(String li:keyValue){
                if(li.length() > 0 && li.contains("=")){
                    String key = li.substring(0, li.indexOf("="));
                    String value = li.substring(li.indexOf("=")+1,li.length());
                    cookies.put(key,value);
                }
            }
        }
        try {
            Protocol myhttps = new Protocol("https", new MySSLProtocolSocketFactory(), 443); 
            Protocol.registerProtocol("https", myhttps);
            int respCode = httpclient.executeMethod(post);
            vb.setStatus(respCode);
            InputStream stream = post.getResponseBodyAsStream();
            String respString = inputStream2String(stream,encoding);
            vb.setHtml(respString);
            Header[] respHeader = post.getResponseHeaders();
            //服务器返回的Set-Cookie字段处理,更新cookie
            for(Header li:respHeader){
                String headerName = li.getName();
                String headerValue = li.getValue();
                if("Set-Cookie".equals(headerName)){
                    String[] cookieKeyValue = headerValue.split(";");
                    for(String cookie:cookieKeyValue){
                        if(cookie.length() > 0 && cookie.contains("=")){
                            String key = cookie.substring(0, cookie.indexOf("="));
                            String value = cookie.substring(cookie.indexOf("=")+1,cookie.length());
                            cookies.put(key,value);
                        }
                    }
                }
            }
            vb.setCookies(cookies);
            post.abort();
        }
        catch (HttpException e) {
            e.printStackTrace();
        }
        catch (IOException e) {
            e.printStackTrace();
        }finally{
            post.releaseConnection(); 
//            httpclient.getHttpConnectionManager().closeIdleConnections(0);
        }
        
        return vb;
    }
    /**
     * @param url
     * @param header
     * @param savePath
     */
    public static Map<String,String> downloadPicture(String url,Map<String,String> header,String savePath){
        HttpClient httpclient = new HttpClient();
        GetMethod httpget = new GetMethod(url);
        Map<String,String> cookies = new HashMap<String,String>();
        try {
            Protocol myhttps = new Protocol("https", new MySSLProtocolSocketFactory(), 443); 
            Protocol.registerProtocol("https", myhttps); 
            for(String li:header.keySet()){
                httpget.addRequestHeader(li, header.get(li));
            }
            //请求中的cookie
            String cookieString = header.get("Cookie");
            if(cookieString != null){
                String[] keyValue = cookieString.split(";");
                for(String li:keyValue){
                    if(li.length() > 0 && li.contains("=")){
                        String key = li.substring(0, li.indexOf("="));
                        String value = li.substring(li.indexOf("=")+1,li.length());
                        cookies.put(key,value);
                    }
                }
            }
            httpclient.executeMethod(httpget);
            File storeFile = new File(savePath);
            FileOutputStream fileOutputStream = new FileOutputStream(storeFile);
            FileOutputStream output = fileOutputStream;
            InputStream stream = httpget.getResponseBodyAsStream();
            byte[] buf = new byte[1024];
            while (stream.read(buf) != -1) {
                output.write(buf);
            }
            output.close();
            Header[] respHeader = httpget.getResponseHeaders();
            //服务器返回的Set-Cookie字段处理,更新cookie
            for(Header li:respHeader){
                String headerName = li.getName();
                String headerValue = li.getValue();
                if("Set-Cookie".equals(headerName)){
                    String[] cookieKeyValue = headerValue.split(";");
                    for(String cookie:cookieKeyValue){
                        if(cookie.length() > 0 && cookie.contains("=")){
                            String key = cookie.substring(0, cookie.indexOf("="));
                            String value = cookie.substring(cookie.indexOf("=")+1,cookie.length());
                            cookies.put(key,value);
                        }
                    }
                }
            }
            httpget.abort();
        }catch(Exception e){
            logger.error(e.getMessage());
        }finally{
            httpget.releaseConnection(); 
//            httpclient.getHttpConnectionManager().closeIdleConnections(0);
        }
        return cookies;
    }
    /**
     * 
     * 根据cbss系统，对密码进行加密
     * 
     */
    public static String encryptPasswd(String passwd){
        String pass = "";
        ScriptEngineManager sem = new ScriptEngineManager();   
        ScriptEngine se = sem.getEngineByName("js");   
        try   
        {   
          String script = FileHelper.readFile("./doc/js/sha1.js", "utf-8");
          se.eval(script);  
          String CryptoJS = FileHelper.readFile("./doc/js/core-min.js", "utf-8");
          se.eval(CryptoJS);
          script = FileHelper.readFile("./doc/js/enc-base64-min.js", "utf-8");
          se.eval(script);
          Invocable inv2 = (Invocable) se;   
          Object result = inv2.invokeFunction("passwdEncryption", passwd);
          pass = result.toString();
        }
        catch(Exception e)
        {
            e.printStackTrace();  
        }   
        return pass;
    }
    public static String cookieMapToString(Map<String,String> map){
        if(map == null || map.isEmpty()){
            return "";
        }
        StringBuffer sb = new StringBuffer();
        for(String li:map.keySet()){
            sb.append(li);
            sb.append("=");
            sb.append(map.get(li));
            sb.append(";");
        }
        return sb.toString();
    }
    
    public static List<SpProduct> extractProductResult(String html){
        List<SpProduct> list = new ArrayList<SpProduct>();
        Pattern productPattern = Pattern.compile("<tr class=\"row_odd\".+?>(.+?)</tr>",Pattern.DOTALL);
        Matcher productMatcher = productPattern.matcher(html);
        while(productMatcher.find()){
            String productString = productMatcher.group(1);
            Pattern prdouctDetailPattern = Pattern.compile("<td id='SP_PRODUCT_ID'>(.+?)</td>.*" +
                  "<td id='SP_ID' style=\"display: none;\">(.+?)</td>.*" +
                  "<td id='PARTY_ID' style=\"display: none;\">(.+?)</td>.*" +
                  "<td id='FIRST_BUY_TIME' style=\"display: none;\">(.+?)</td>.*" +
                  "<td id='SP_SERVICE_ID' style=\"display: none;\">(.+?)</td>.*" +
                  "<td id='PAY_SERIAL_NUMBER' style=\"display: none;\">(.+?)</td>.*" +
                  "<td id='START_DATE' style=\"display: none;\">(.+?)</td>.*" +
                  "<td id='END_DATE' style=\"display: none;\">(.+?)</td>.*" +
                  "<td id='SP_PRODUCT_NAME'>(.+?)</td>.*" +
                  "<td id='PRICE_DESCRIBE'>(.+?)</td>"
                      ,Pattern.DOTALL);
            Matcher productDetailMatcher = prdouctDetailPattern.matcher(productString);
            if(productDetailMatcher.find()){
                SpProduct product = new SpProduct(productDetailMatcher.group(1).trim(),
                    productDetailMatcher.group(2).trim(),productDetailMatcher.group(3).trim(),
                    productDetailMatcher.group(4).trim(),productDetailMatcher.group(5).trim(),
                    productDetailMatcher.group(6).trim(),productDetailMatcher.group(7).trim(),
                    productDetailMatcher.group(8).trim(),productDetailMatcher.group(9).trim(),
                    productDetailMatcher.group(10).trim());
                list.add(product);
            }
        }
        return list;
    }
    
    public static List<SpProduct> extractProductList(String html){
        List<SpProduct> list = new ArrayList<SpProduct>();
        Pattern productPattern = Pattern.compile("<tr sp_product_id.+?>(.+?)</tr>",Pattern.DOTALL);
        Matcher productMatcher = productPattern.matcher(html);
        while(productMatcher.find()){
            String productString = productMatcher.group(1);
            Pattern prdouctDetailPattern = Pattern.compile("<td id='SP_PRODUCT_ID'>(.+?)</td>.*" +
                  "<td id='SP_ID' style=\"display: none;\">(.+?)</td>.*" +
                  "<td id='PARTY_ID' style=\"display: none;\">(.+?)</td>.*" +
                  "<td id='FIRST_BUY_TIME' style=\"display: none;\">(.+?)</td>.*" +
                  "<td id='SP_SERVICE_ID' style=\"display: none;\">(.+?)</td>.*" +
                  "<td id='PAY_SERIAL_NUMBER' style=\"display: none;\">(.+?)</td>.*" +
                  "<td id='SP_PRODUCT_NAME'>(.+?)</td>.*" +
                  "<td id='PRICE_DESCRIBE'>(.+?)</td>.*" +
                  "<td id='START_DATE'>(.+?)</td>.*" +
                  "<td id='END_DATE'>(.+?)</td>.*" +
                  "<td id='ITEM_ID' style=\"display: none;\">(.+?)</td>.*" +
                  "<td id='IS_BOOKED_CANCELSP' style=\"display: none;\">(.+?)</td>"
                      ,Pattern.DOTALL);
            Matcher productDetailMatcher = prdouctDetailPattern.matcher(productString);
            if(productDetailMatcher.find()){
                SpProduct product = new SpProduct(productDetailMatcher.group(1).trim(),
                    productDetailMatcher.group(2).trim(),productDetailMatcher.group(3).trim(),
                    productDetailMatcher.group(4).trim(),productDetailMatcher.group(5).trim(),
                    productDetailMatcher.group(6).trim(),productDetailMatcher.group(7).trim(),
                    productDetailMatcher.group(8).trim(),productDetailMatcher.group(9).trim(),
                    productDetailMatcher.group(10).trim(),productDetailMatcher.group(11).trim(),
                    productDetailMatcher.group(12).trim());
                list.add(product);
            }
        }
        return list;
    }
}
