package com.hoyotech.thread;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.log4j.Logger;

import com.hoyotech.bean.Account;
import com.hoyotech.bean.SpProduct;
import com.hoyotech.bean.VirtualBrowser;
import com.hoyotech.image.ImagePreProcess;
import com.hoyotech.utils.FileHelper;
import com.hoyotech.utils.HttpsTool;

public class HttpService {
    
    private static Logger logger = Logger.getLogger(HttpService.class);
    public static synchronized VirtualBrowser login(Account account){
    	String encoding = "utf-8";
        String userName = account.getUserName();
        String passWd = account.getPassWord();
        String provinceId = account.getProvinceId();
        Map<String,String> header = new HashMap<String,String>();
        header.put("Accept-Language", "zh-CN");
        header.put("Accept", "text/html, application/xhtml+xml, */*");
        header.put("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
//        header.put("Accept-Encoding", "gzip, deflate");
        header.put("Connection", "Keep-Alive");
        header.put("Host", "cbss.10010.com");
        String url = "https://cbss.10010.com";
        VirtualBrowser vb = HttpsTool.get(url, header,encoding);
        Map<String,String> cookies = vb.getCookies();
        System.out.println(cookies);
        String picUrl = "https://gz.cbss.10010.com/image?mode=validate&width=60&height=20";
        String savePath = "./pic/"+UUID.randomUUID().toString()+".jpg";
        Map<String,String> picHeader = new HashMap<String,String>();
        String cookie = HttpsTool.cookieMapToString(cookies);
        picHeader.put("Accept", "image/png, image/svg+xml, image/*;q=0.8, */*;q=0.5");
        picHeader.put("Referer", "https://cbss.10010.com/essframe");
        picHeader.put("Accept-Language", "zh-CN");
        picHeader.put("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
//        picHeader.put("Accept-Encoding", "gzip, deflate");
        picHeader.put("Host", "gz.cbss.10010.com");
        picHeader.put("Connection", "Keep-Alive");
        picHeader.put("Cache-Control", "no-cache");
        picHeader.put("Cookie", cookie);
        cookies = HttpsTool.downloadPicture(picUrl, picHeader, savePath);
        System.out.println(cookies);
        picUrl = "https://gz.cbss.10010.com/image?mode=validate&width=60&height=20";
        picHeader.put("Cookie", cookie);
        savePath = "./pic/"+UUID.randomUUID().toString()+".jpg";
        cookies = HttpsTool.downloadPicture(picUrl, picHeader, savePath);
        logger.info("验证码图片地址： "+savePath);
//        Scanner scanner = new Scanner(System.in);
//        String verifyCode = scanner.nextLine();
//        scanner.close();
        String verifyCode = "";
        try {
            verifyCode = ImagePreProcess.getAllOcr(savePath);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        String redirectUrl = "https://gz.cbss.10010.com/essframe?service=page/LoginProxy&login_type=redirectLogin";
        Map<String,String> redirectHeader = new HashMap<String,String>();
        cookie = HttpsTool.cookieMapToString(cookies);
        redirectHeader.put("Accept", "text/html, application/xhtml+xml, * /*");
        redirectHeader.put("Referer", "https://cbss.10010.com/essframe");
        redirectHeader.put("Accept-Language", "zh-CN");
        redirectHeader.put("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        redirectHeader.put("Content-Type", "application/x-www-form-urlencoded");
//        redirectHeader.put("Accept-Encoding", "gzip, deflate");
        redirectHeader.put("Host", "gz.cbss.10010.com");
        redirectHeader.put("Connection", "Keep-Alive");
        redirectHeader.put("Cache-Control", "no-cache");
        redirectHeader.put("Cookie", cookie);
        Map<String,String> redirectParam = new HashMap<String,String>();
        String LOGIN_PASSWORD = passWd;//encryptPasswd(passWd);
        redirectParam.put("service", "direct/1/Home/$Form");
        redirectParam.put("sp", "S0");
        redirectParam.put("Form0", "LOGIN_PROVINCE_REDIRECT_URL,AUTH_TYPE,CAPTURE_URL,WHITE_LIST_LOGIN,IPASS_LOGIN,IPASS_SERVICE_URL,IPASS_LOGIN_PROVINCE,IPASS_LOGINOUT_DOMAIN,SIGNATURE_CODE,SIGNATURE_DATA,IPASS_ACTIVATE,STAFF_ID,$FormConditional,$FormConditional$0,LOGIN_PROVINCE_CODE,$FormConditional$1,$FormConditional$2,$FormConditional$3,$FormConditional$4,$FormConditional$5,$TextField,$TextField$0,$TextField$1,$TextField$2,$TextField$3,$TextField$4,$TextField$5,$TextField$6,$TextField$7,$TextField$8,$TextField$9,$TextField$10,$TextField$11,$TextField$12,$TextField$13,$TextField$14,$TextField$15,$TextField$16,$TextField$17,$TextField$18,$TextField$19,$TextField$20,$TextField$21,$TextField$22,$TextField$23,$TextField$24,$TextField$25,$TextField$26,$TextField$27,$TextField$28,$TextField$29,$TextField$30");
        redirectParam.put("$FormConditional", "F");
        redirectParam.put("$FormConditional$0", "T");
        redirectParam.put("$FormConditional$1", "T");
        redirectParam.put("$FormConditional$2", "T");
        redirectParam.put("$FormConditional$3", "F");
        redirectParam.put("$FormConditional$4", "F");
        redirectParam.put("$FormConditional$5", "F");
        redirectParam.put("LOGIN_PROVINCE_REDIRECT_URL", "https://gz.cbss.10010.com/essframe");
        redirectParam.put("AUTH_TYPE", "0");
        redirectParam.put("CAPTURE_URL", "/image?mode=validate");
        redirectParam.put("width", "60");
        redirectParam.put("height", "20");
        redirectParam.put("WHITE_LIST_LOGIN", "");
        redirectParam.put("IPASS_LOGIN", "");
        redirectParam.put("IPASS_SERVICE_URL", "");
        redirectParam.put("IPASS_LOGIN_PROVINCE", "");
        redirectParam.put("IPASS_LOGINOUT_DOMAIN", "");
        redirectParam.put("SIGNATURE_CODE", "");
        redirectParam.put("IPASS_ACTIVATE", "");
        redirectParam.put("STAFF_ID", userName);
        redirectParam.put("LOGIN_PASSWORD", LOGIN_PASSWORD);
        redirectParam.put("LOGIN_PROVINCE_CODE", "71");
        redirectParam.put("VERIFY_CODE", verifyCode);
        vb = HttpsTool.post(redirectUrl, redirectHeader, redirectParam, "utf-8");
        cookies = vb.getCookies();
        String loginUrl = "https://gz.cbss.10010.com/essframe";
        cookie = HttpsTool.cookieMapToString(cookies);
        Map<String,String> loginHeader = new HashMap<String,String>();
        loginHeader.put("Accept", "text/html, application/xhtml+xml, */*");
        loginHeader.put("Referer", redirectUrl);
        loginHeader.put("Accept-Language", "zh-CN");
        loginHeader.put("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        loginHeader.put("Content-Type","application/x-www-form-urlencoded");
//        loginHeader.put("Accept-Encoding","gzip, deflate");
        loginHeader.put("Host","gz.cbss.10010.com");
        loginHeader.put("Connection","Keep-Alive");
        loginHeader.put("Cache-Control","no-cache");
        loginHeader.put("Cookie",cookie);
        Map<String,String> loginParams = new HashMap<String,String>();
        loginParams.put("service", "direct/1/LoginProxy/$Form");
        loginParams.put("sp", "S0");
        loginParams.put("Form0", "ACTION_MODE,STAFF_ID,LOGIN_PASSWORD,NEED_SMS_VERIFY,SUBSYS_CODE,LOGIN_TYPE,authDomainType,soap,menuId,error,authType,LOGIN_PROVINCE_CODE,VERIFY_CODE,WHITE_LIST_LOGIN,IPASS_SERVICE_URL,IPASS_CHECK_MESSAGE,IPASS_LOGIN_PROVINCE,SIGNATURE_CODE,SIGNATURE_DATA,IPASS_LOGIN,IPASS_ACTIVATE,NEED_INSTALL_CERT,IPASS_INSTALL_RESULT,IPASS_INSTALL_MESSAGE,IPASS_LOGINOUT_DOMAIN,btnProxyLogin");
        loginParams.put("ACTION_MODE", "");
        loginParams.put("STAFF_ID", userName);
        loginParams.put("LOGIN_PASSWORD", LOGIN_PASSWORD);
        loginParams.put("NEED_SMS_VERIFY", "");
        loginParams.put("SUBSYS_CODE", "");
        loginParams.put("LOGIN_TYPE", "redirectLogin");
        loginParams.put("authDomainType", "");
        loginParams.put("soap", "");
        loginParams.put("menuId", "");
        loginParams.put("error", "");
        loginParams.put("authType", "");
        loginParams.put("LOGIN_PROVINCE_CODE", provinceId);
        loginParams.put("VERIFY_CODE", verifyCode);
        loginParams.put("WHITE_LIST_LOGIN", "");
        loginParams.put("IPASS_SERVICE_URL", "");
        loginParams.put("IPASS_CHECK_MESSAGE", "");
        loginParams.put("IPASS_LOGIN_PROVINCE", "");
        loginParams.put("SIGNATURE_CODE", "");
        loginParams.put("SIGNATURE_DATA", "");
        loginParams.put("IPASS_LOGIN", "");
        loginParams.put("IPASS_ACTIVATE", "");
        loginParams.put("NEED_INSTALL_CERT", "");
        loginParams.put("IPASS_INSTALL_RESULT", "");
        loginParams.put("IPASS_INSTALL_MESSAGE", "");
        loginParams.put("IPASS_LOGINOUT_DOMAIN", "");
        loginParams.put("btnProxyLogin", "提交查询内容");
        vb = HttpsTool.post(loginUrl, loginHeader, loginParams, "gbk");
        return vb;
    }
    
    /**
     * 
     * 根据cbss系统，对密码进行加密
     * 
     */
    private static String encryptPasswd(String passwd){
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
    /**
     * 将一个map转化为string
     * @param map
     * @return
     */
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
    //查询移网的4G套餐名称
    public static String getYiwangOrderProductName(String html){
        String tdhtml = "<input type=\"text\" disabled=\"disabled\" id=\"PRODUCT_NAME\" name=\"PRODUCT_NAME\" value=\"(.+?)\" class=\"txt\"/>";
        Pattern productPattern = Pattern.compile(tdhtml,Pattern.DOTALL);
        Matcher productMatcher = productPattern.matcher(html);
        String productString = "";
        while(productMatcher.find()){
             productString = StringEscapeUtils.unescapeHtml(productMatcher.group(1).trim());
            logger.info(productString);
        }
        
        return productString;
    }
    public static List<SpProduct> getYiwangProductList(String html){
        List<SpProduct> list = new ArrayList<SpProduct>();
        Pattern productPattern = Pattern.compile("<tr class=\"row_odd\".+?>(.+?)</tr>",Pattern.DOTALL);
        Matcher productMatcher = productPattern.matcher(html);
        Object obj[] = new Object[10];
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
