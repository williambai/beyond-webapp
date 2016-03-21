package com.hoyotech.utils;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.hoyotech.bean.ResTableInfo;
import com.hoyotech.bean.ResourceInfo;
import com.hoyotech.bean.SpProduct;

public class RegexUtils {
    /**
     * 正则表达式匹配
     * @param regex
     * @param html
     * @return
     */
    public static String regexMathes(String regex,String html){
        String result = "";
        Pattern pattern = Pattern.compile(regex,Pattern.DOTALL);
        Matcher matcher = pattern.matcher(html);
        if (matcher.matches()) {
            result = matcher.group(1).trim();
        }
        return result;
    }
    /***
     * 
     * 
     * 点击选择流量包是的请求参数
     * 
     */
    public static Map<String,String> getResourceParam(String html){
        Map<String,String> map = new HashMap<String,String>();
        Pattern productPattern = Pattern.compile("<input(.+?)(></input>|/>)",Pattern.DOTALL);
        Matcher productMatcher = productPattern.matcher(html);
        while(productMatcher.find()){
            String group1 = productMatcher.group(1);
            String name = "";
            String value = "";
            Pattern namePattern = Pattern.compile("name=\"(.+?)\"",Pattern.DOTALL);
            Pattern valuePattern = Pattern.compile("value=\"(.*?)\"",Pattern.DOTALL);
            Matcher nameMatcher = namePattern.matcher(group1);
            if(nameMatcher.find()){
                name = nameMatcher.group(1);
            }
            Matcher valueMatcher = valuePattern.matcher(group1);
            if(valueMatcher.find()){
                value = HTMLDecoder.decode(valueMatcher.group(1));
            }
            if(!name.isEmpty()){
                map.put(name,value);
            }
        }
        return map;
    }
    /** get str by pad prefix */
    public static String getStrByPadPrefix(int len) {
        int max = 4; 
        String str = String.valueOf(len);
        for (int i=0; i<max -String.valueOf(len).length(); i++) {
            str = "0" + str;
        }
        return str;
    }
    /** get str by pad length */
    public static String getStrByPadLength(String value) {
        int length = value.length();
        return getStrByPadPrefix(length) + value;
    }
    /** 流量包变更时获得codingString */
    public static String getXcodingString(List<ResTableInfo> list){
        String str = "";
        for(ResTableInfo li:list){
            li.setxTag(" ");
            str += getStrByPadLength(li.getxTag().replaceAll("\r|\n", ""));
            str += getStrByPadLength(li.getResourceTag().replaceAll("\r|\n", ""));
            if(li.getPackageCode().trim().length() == 0){
                li.setPackageCode("");
            }
            str += getStrByPadLength(li.getPackageCode().replaceAll("\r|\n", ""));
            str += getStrByPadLength(li.getResourceCode().replaceAll("\r|\n", ""));
            str += getStrByPadLength(li.getResourceCount().replaceAll("\r|\n", ""));
            str += getStrByPadLength(li.getMoney().replaceAll("\r|\n", ""));
            str += getStrByPadLength(li.getUnit().replaceAll("\r|\n", ""));
            str += getStrByPadLength(li.getValidTime().replaceAll("\r|\n", ""));
            str += getStrByPadLength(li.getValidTimeUnit().replaceAll("\r|\n", ""));
            str += getStrByPadLength(li.getDepositRate().replaceAll("\r|\n", ""));
            str += getStrByPadLength(li.getResourceName().replaceAll("\r|\n", ""));
        }
        return (getStrByPadPrefix(11) + getStrByPadPrefix(list.size()) + str).replace("\t", " ");
    }
    /**
     * 
     * 可订购流量包产品信息
     * 
     */
    public static List<ResTableInfo> extractResTableInfo(String html){
        List<ResTableInfo> list = new ArrayList<ResTableInfo>();
        Pattern productPattern = Pattern.compile("<tr class=\"(row_odd|row_even)\".+?>(.+?)</tr>",Pattern.DOTALL);
        Matcher productMatcher = productPattern.matcher(html);
        while(productMatcher.find()){
            String productString = productMatcher.group(2);
            Pattern prdouctDetailPattern = Pattern.compile("<input value=(.+?) type=\"checkbox\" name=\"ses\"></input>\\s+</td>.*" +
                  "<td style=\"display:none\" >(.+?)</td>.*" +
                  "<td style=\"display:none\" >(.+?)</td>.*" +
                  "<td style=\"display:none\" >(.+?)</td>.*" +
                  "<td style=\"display:none\" >(.+?)</td>.*" +
                  "<td style=\"display:none\" >(.+?)</td>.*" +
                  "<td style=\"display:none\" >(.+?)</td>.*" +
                  "<td style=\"display:none\" >(.+?)</td>.*" +
                  "<td style=\"display:none\" >(.+?)</td>.*" +
                  "<td style=\"display:none\" >(.+?)</td>.*" +
                  "<td style=\"display:none\" >(.+?)</td>.*" 
                      ,Pattern.DOTALL);
            Matcher productDetailMatcher = prdouctDetailPattern.matcher(productString);
            if(productDetailMatcher.find()){
                ResTableInfo info = new ResTableInfo(productDetailMatcher.group(1).replace("\"",""),productDetailMatcher.group(2),productDetailMatcher.group(3),
                    productDetailMatcher.group(4),productDetailMatcher.group(5),productDetailMatcher.group(6),productDetailMatcher.group(7),
                    productDetailMatcher.group(8),productDetailMatcher.group(9),productDetailMatcher.group(10),productDetailMatcher.group(11));
                list.add(info);
            }
        }
        return list;
    }
    public static List<ResourceInfo> extractResourceInfo(String html){
        List<ResourceInfo> list = new ArrayList<ResourceInfo>();
        Pattern productPattern = Pattern.compile("<tr class=\"(row_odd|row_even)\".+?>(.+?)</tr>",Pattern.DOTALL);
        Matcher productMatcher = productPattern.matcher(html);
        while(productMatcher.find()){
            String productString = productMatcher.group(2);
            Pattern prdouctDetailPattern = Pattern.compile("<td>(.+?)</td>.*" +
                  "<td>(.+?)</td>.*" +
                  "<td>(.+?)</td>.*" +
                  "<td>(.+?)</td>.*" +
                  "<td>(.+?)</td>.*" +
                  "<td>(.+?)</td>.*" +
                  "<td>(.+?)</td>.*" +
                  "<td style=\"display:none\">(.+?)</td>.*" +
                  "<td>(.+?)</td>"
                      ,Pattern.DOTALL);
            Matcher productDetailMatcher = prdouctDetailPattern.matcher(productString);
            if(productDetailMatcher.find()){
                ResourceInfo resourceInfo = new ResourceInfo(productDetailMatcher.group(1).trim(),
                    productDetailMatcher.group(2).trim(),productDetailMatcher.group(3).trim(),
                    productDetailMatcher.group(4).trim(),productDetailMatcher.group(5).trim(),
                    productDetailMatcher.group(6).trim(),productDetailMatcher.group(7).trim(),
                    productDetailMatcher.group(8).trim(),productDetailMatcher.group(9).trim());
                list.add(resourceInfo);
            }
        }
        return list;
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
    //产品可能会出现的价格
    public static List<String> queryPrice(String html){
        List<String> list = new ArrayList<String>();
        Map<String,String> map = new HashMap<String,String>();
        Pattern productPattern = Pattern.compile("option value=\"(\\d+)\"",Pattern.DOTALL);
        Matcher productMatcher = productPattern.matcher(html);
        while(productMatcher.find()){
            String group1 = productMatcher.group(1);
            System.out.println("line: "+group1);
            list.add(group1.trim());
        }
        return list;
    }
    public static String getRandomParam() {
        Date date = new Date();
        return "" + date.getYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() + String.valueOf(System.currentTimeMillis()).substring(10,13);
    }
    
}
