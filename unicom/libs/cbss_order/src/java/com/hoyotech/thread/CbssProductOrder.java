package com.hoyotech.thread;

import java.io.IOException;
import java.io.StringReader;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.Namespace;
import org.jdom.input.SAXBuilder;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import net.sf.json.JSONObject;
import org.apache.log4j.Logger;
import org.xml.sax.InputSource;
import com.hoyotech.bean.Account;
import com.hoyotech.bean.LiWangProduct;
import com.hoyotech.bean.OrderInfo;
import com.hoyotech.bean.OrderResult;
import com.hoyotech.bean.ProductInfo;
import com.hoyotech.bean.ResTableInfo;
import com.hoyotech.bean.ResourceInfo;
import com.hoyotech.bean.SpProduct;
import com.hoyotech.bean.VirtualBrowser;
import com.hoyotech.utils.HTMLDecoder;
import com.hoyotech.utils.HttpsTool;
import com.hoyotech.utils.RegexUtils;

import com.pdbang.DBService;

/**
 * Description: TODO(CBSS系统订购线程类)
 * 
 * @ClassName: CbssProductOrder
 * @date: 2015-11-9 上午10:41:20
 * @author Administrator
 * @since JDK 1.6
 */
public class CbssProductOrder extends Thread
{
    
    private static final Logger LOGGER =
        Logger.getLogger(CbssProductOrder.class);
    
    private static final long THREADSLEEPMINS = 50 * 1000L;
    
    private int i;
    
    private List<Account> accountList;
    
    private List<ProductInfo> productList;
    
    private BlockingQueue<OrderInfo> queue =
        new LinkedBlockingQueue<OrderInfo>();
    
    /**
     * Creates a new instance of CbssProductOrder.
     * 
     * @param i
     * @param accountList tag
     * @param productList tag
     * @param queue tag
     */
    public CbssProductOrder(int i, List<Account> accountList,
        List<ProductInfo> productList, BlockingQueue<OrderInfo> queue)
    {
        this.i = i;
        this.accountList = accountList;
        this.productList = productList;
        this.queue = queue;
    }
    
    /**
     * Creates a new instance of CbssProductOrder.
     */
    public CbssProductOrder()
    {
        
    }
    
    /**
     * Description: TODO 线程入口函数
     * 
     * @author Administrator
     * @date: 2015-11-9上午10:44:33
     */
    public void run()
    {
        LOGGER.info("cbss订购线程【" + i + "】启动！");
        while (true)
        {
            Account account = null;
            OrderInfo info = null;
            try
            {
                info = this.queue.take();
            }
            catch (InterruptedException e)
            {
                e.printStackTrace();
            }
            if (info == null)
            {
                try
                {
                    Thread.sleep(THREADSLEEPMINS);
                }
                catch (InterruptedException e)
                {
                    e.printStackTrace();
                }
                continue;
            }
            for (Account li : accountList)
            {
                if (li.getUserName().equals(info.getAccount())
                    && li.getPassWord().equals(info.getPassword()))
                {
                    account = li;
                }
            }
            if (account == null)
            {
                LOGGER.info("登录cbss系统失败失败用户名或者密码错误。");
                DBService.sendSMS("自动化登录cbss系统失败用户名或者密码错误，请及时处理！");
                return;
            }
            OrderResult result = null;
            String productName = info.getProductName();
            // 4G联通秘书5元包 4GQQ音乐
            // 4G沃酷狗 4G3元超值版铃音盒
            // 4G来电秘书 4G开机提醒(3元/月) 4G省内城市天气
            // || productName.contains("开机提醒")
            // || productName.contains("来电秘书")
            try
            {
                if (productName.contains("QQ音乐")
                    || productName.contains("省内城市天气")
                    || productName.contains("沃酷狗")
                    || productName.contains("超值版铃音盒"))
                {
                    LOGGER.info("开始订购SP： " + productName + " "
                        + info.getOrderId() + " " + info.getPhone());
                    result = this.orderSpProduct(account, info);
                    
                }
                else if (productName.contains("流量"))
                {
                    LOGGER.info("开始订购流量包： " + productName + " "
                        + info.getOrderId() + " " + info.getPhone());
                    result = this.orderFlux(account, info);
                }
                else if (productName.contains("联通秘书"))
                {
                    LOGGER.info("开始移网联产品： " + productName + " "
                        + info.getOrderId() + " " + info.getPhone());
                    result = this.orderYiWangProduct(account, info);
                }
                else
                {
                    LOGGER.info("本产品不存在不支持自动化开通：" + productName
                        + info.getOrderId() + " " + info.getPhone());
                    DBService.updateOrderStatus(info.getId(), info.getOrderId(), new OrderResult(
                        "1", "本产品暂不支持支持自动化订购业务"));
                    continue;
                }
                LOGGER.info("开始更新创富系统订单信息表");
                DBService.updateOrderStatus(info.getId(), info.getOrderId(), result);
//                Object[] obj =
//                    (Object[])DBService.check4GOrderRecordId(info.getOrderId(),
//                        "");
//                
//                if (obj != null && obj[5].equals("-1"))
//                {
//                    LOGGER.info(obj.toString());
//                    DBService.updateVmssGoddsResult(result.getOrderMessage(),
//                        info.getOrderId(),
//                        info.getPhone(),
//                        info.getProductName());
//                }
            }
            catch (Exception e)
            {
                DBService.sendSMS("自动化程序通过报文下发或者解析html过程异常，请及时处理！");
                LOGGER.error("自动化程序通过报文下发或者解析html过程异常：" + e);
            }
            
        }
    }
    
    /**
     * 获取对象属性，返回一个字符串数组
     * 
     * @param o 对象
     * @return String[] 字符串数组
     */
    private static String[] getFiledName(Object o)
    {
        try
        {
            Field[] fields = o.getClass().getDeclaredFields();
            String[] fieldNames = new String[fields.length];
            for (int i = 0; i < fields.length; i++)
            {
                fieldNames[i] = fields[i].getName();
            }
            return fieldNames;
        }
        catch (SecurityException e)
        {
            e.printStackTrace();
            System.out.println(e.toString());
        }
        return null;
    }
    
    /**
     * 使用反射根据属性名称获取属性值
     * 
     * @param fieldName 属性名称
     * @param o 操作对象
     * @return Object 属性值
     */
    
    private Object getFieldValueByName(String fieldName, Object o)
    {
        try
        {
            String firstLetter = fieldName.substring(0, 1).toUpperCase();
            String getter = "get" + firstLetter + fieldName.substring(1);
            Method method = o.getClass().getMethod(getter, new Class[] {});
            Object value = method.invoke(o, new Object[] {});
            return value;
        }
        catch (Exception e)
        {
            System.out.println("属性不存在");
            return null;
        }
    }
    
    /**
     * 根据产品名称查询产品
     * 
     * @param productName
     * @return
     */
    private ProductInfo getProductInfo(String productName)
    {
        for (ProductInfo li : productList)
        {
            if (productName.equals(li.getProductName()))
            {
                return li;
            }
        }
        return null;
    }
    
    /**
     * 订购流量包产品
     * 
     * @param account
     * @param orderInfo
     * @return
     */
    private OrderResult orderFlux(Account account, OrderInfo orderInfo)
    {
        String encoding = "utf-8";
        String phone = orderInfo.getPhone();
        String productName = orderInfo.getProductName().replace("4G", "");
        ProductInfo productInfo = getProductInfo(productName);
        String price = productInfo.getPrice();
        String resourceCode = productInfo.getResourceCode();
        Map<String, String> cookies = account.getCookie();
        String cookie = HttpService.cookieMapToString(cookies);
        Map<String, String> homePageParamMap = account.getMetaInfo();
        String navUrl =
            "https://gz.cbss.10010.com/essframe?service=page/Nav&STAFF_ID="
                + homePageParamMap.get("staffId");
        Map<String, String> navHeader = new HashMap<String, String>();
        navHeader.put("Accept", "text/html, application/xhtml+xml, */*");
        navHeader.put("Referer", "https://gz.cbss.10010.com/essframe");
        navHeader.put("Accept-Language", "zh-CN");
        navHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        navHeader.put("Content-Type", "application/x-www-form-urlencoded");
        // loginHeader.put("Accept-Encoding","gzip, deflate");
        navHeader.put("Host", "gz.cbss.10010.com");
        navHeader.put("Connection", "Keep-Alive");
        navHeader.put("Cache-Control", "no-cache");
        navHeader.put("Cookie", cookie);
        
        VirtualBrowser vb = HttpsTool.get(navUrl, navHeader, encoding);
        String navHtml = vb.getHtml();
        String resourceUrl =
            RegexUtils.regexMathes(".*clickMenuItem\\(this\\);openmenu\\('(.+?OrderGprsRes.+?)'.*",
                navHtml);
        // 左边框，用于获得下一步访问地址
        String headUrl =
            "https://gz.cbss.10010.com/essframe?service=page/Sidebar";
        Map<String, String> headUrlHeader = new HashMap<String, String>();
        headUrlHeader.put("Accept", "text/html, application/xhtml+xml, */*");
        headUrlHeader.put("Referer", "https://gz.cbss.10010.com/essframe");
        headUrlHeader.put("Accept-Language", "zh-CN");
        headUrlHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        headUrlHeader.put("Content-Type", "application/x-www-form-urlencoded");
        headUrlHeader.put("Host", "gz.cbss.10010.com");
        headUrlHeader.put("Connection", "Keep-Alive");
        headUrlHeader.put("Cache-Control", "no-cache");
        headUrlHeader.put("Cookie", cookie);
        vb = HttpsTool.get(headUrl, headUrlHeader, encoding);
        cookies = vb.getCookies();
        cookie = HttpService.cookieMapToString(cookies);
        String sideBarHtml = vb.getHtml();
        String custUrl =
            RegexUtils.regexMathes(".*menuaddr=\"(.+?)\".*", sideBarHtml);
        if (custUrl.isEmpty())
        {
            LOGGER.info("没取到url");
            return new OrderResult("1", "用户认证异常！");
        }
        String loginRandomCode =
            RegexUtils.regexMathes(".*LOGIN_RANDOM_CODE=(\\d+).*", sideBarHtml);
        String loginCheckCode =
            RegexUtils.regexMathes(".*LOGIN_CHECK_CODE=(\\d+).*", sideBarHtml);
        custUrl = custUrl.replace("&amp;", "&");
        custUrl =
            custUrl + "&staffId=" + homePageParamMap.get("staffId")
                + "&departId=" + homePageParamMap.get("deptId")
                + "&subSysCode=" + homePageParamMap.get("subSysCode")
                + "&eparchyCode=" + homePageParamMap.get("epachyId");
        custUrl = "https://gz.cbss.10010.com/" + custUrl;
        Map<String, String> custHeader = new HashMap<String, String>();
        custHeader.put("Accept", "text/html, application/xhtml+xml, */*");
        custHeader.put("Referer",
            "https://gz.cbss.10010.com/essframe?service=page/Sidebar");
        custHeader.put("Accept-Language", "zh-CN");
        custHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        custHeader.put("Content-Type", "application/x-www-form-urlencoded");
        custHeader.put("Host", "gz.cbss.10010.com");
        custHeader.put("Connection", "Keep-Alive");
        custHeader.put("Cache-Control", "no-cache");
        custHeader.put("Cookie", cookie);
        vb = HttpsTool.get(custUrl, custHeader, encoding);
        cookies = vb.getCookies();
        cookie = HttpService.cookieMapToString(cookies);
        
        // 账务管理，流量包资源订购
        String packageUrl =
            "https://gz.cbss.10010.com" + resourceUrl + "&staffId="
                + homePageParamMap.get("staffId") + "&departId="
                + homePageParamMap.get("deptId")
                + "&subSysCode=BSS&eparchyCode="
                + homePageParamMap.get("epachyId");
        Map<String, String> packageHeader = new HashMap<String, String>();
        packageHeader.put("Accept", "text/html, application/xhtml+xml, */*");
        packageHeader.put("Referer", custUrl);
        packageHeader.put("Accept-Language", "zh-CN");
        packageHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        packageHeader.put("Content-Type", "application/x-www-form-urlencoded");
        packageHeader.put("Host", "gz.cbss.10010.com");
        packageHeader.put("Connection", "Keep-Alive");
        packageHeader.put("Cache-Control", "no-cache");
        packageHeader.put("Cookie", cookie);
        vb = HttpsTool.get(packageUrl, packageHeader, encoding);
        cookies = vb.getCookies();
        cookie = HttpService.cookieMapToString(cookies);
        // 用户流量包信息查询
        String acctUrl = "https://gz.cbss.10010.com/acctmanm";
        Map<String, String> acctHeader = new HashMap<String, String>();
        acctHeader.put("Accept", "text/html, application/xhtml+xml, */*");
        acctHeader.put("Referer",
            "https://gz.cbss.10010.com/essframe?service=page/Sidebar");
        acctHeader.put("Accept-Language", "zh-CN");
        acctHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        acctHeader.put("Content-Type", "application/x-www-form-urlencoded");
        acctHeader.put("Host", "gz.cbss.10010.com");
        acctHeader.put("Connection", "Keep-Alive");
        acctHeader.put("Cache-Control", "no-cache");
        acctHeader.put("Cookie", cookie);
        Map<String, String> acctParam = new HashMap<String, String>();
        acctParam.put("service",
            "direct/1/amcharge.ordergprsresource.OrderGprsRes/$Form");
        acctParam.put("sp", "S0");
        acctParam.put("Form0",
            "cond_SERIAL_NUMBER,cond_NET_TYPE_CODE,bquerytop,cond_DL_NAME,cond_DL_SNUMBER,"
                + "data_DL_ZJ,cond_DL_NUMBER,data_RESOURCE_TAG,data_RESOURCE_ZK,data_PACKAGE_CODE,"
                + "data_RESOURCE_CODE,data_ZK_NAME,data_RESOURCE_NAME,data_LONG,data_MONEY,data_RES_MONEY,"
                + "data_UNIT,data_VALID_TIME_UNIT,data_VALID_TIME,data_RESOURCE_COUNT"
                + ",bsubmit1,userinfoback_PREPAY_TAG");
        acctParam.put("cond_ID_TYPE", "1");
        acctParam.put("cond_SERIAL_NUMBER", phone);
        acctParam.put("cond_NET_TYPE_CODE", "");
        acctParam.put("bquerytop", " 查 询 ");
        acctParam.put("cond_X_USER_COUNT", "");
        acctParam.put("cond_DL_NAME", "");
        acctParam.put("cond_DL_SNUMBER", "");
        acctParam.put("data_DL_ZJ", "");
        acctParam.put("cond_DL_NUMBER", "");
        acctParam.put("data_RESOURCE_TAG", "");
        acctParam.put("data_RESOURCE_ZK", "");
        acctParam.put("data_PACKAGE_CODE", "");
        acctParam.put("data_RESOURCE_CODE", "");
        acctParam.put("data_ZK_NAME", "");
        acctParam.put("data_RESOURCE_NAME", "");
        acctParam.put("data_LONG", "");
        acctParam.put("data_MONEY", "");
        acctParam.put("data_RES_MONEY", "");
        acctParam.put("data_UNIT", "");
        acctParam.put("data_VALID_TIME_UNIT", "");
        acctParam.put("data_VALID_TIME", "");
        acctParam.put("data_RESOURCE_COUNT", "");
        acctParam.put("cond_PRINT_FLAG", "");
        acctParam.put("cond_DL_ZJ_NAME", "");
        acctParam.put("userinfoback_ACCT_ID", "");
        acctParam.put("userinfoback_SERIAL_NUMBER", "");
        acctParam.put("userinfoback_PAY_NAME", "");
        acctParam.put("userinfoback_NET_TYPE_CODE", "");
        acctParam.put("userinfoback_SERVICE_CLASS_CODE", "");
        acctParam.put("userinfoback_USER_ID", "");
        acctParam.put("userinfoback_PAY_MODE_CODE", "");
        acctParam.put("userinfoback_ROUTE_EPARCHY_CODE", "");
        acctParam.put("userinfoback_PREPAY_TAG", "");
        acctParam.put("userinfoback_CITY_CODE", "");
        acctParam.put("userinfoback_PRODUCT_ID", "");
        acctParam.put("userinfoback_BRAND_CODE", "");
        acctParam.put("cond_CREDIT_VALUE", "");
        acctParam.put("cond_DEPOSIT_MONEY", "");
        acctParam.put("cond_TOTAL_FEE", "");
        acctParam.put("X_CODING_STR", "");
        acctParam.put("cond_DATE", "");
        acctParam.put("cond_DATE1", "");
        acctParam.put("cond_DATE2", "");
        acctParam.put("cond_DATE3", "");
        acctParam.put("cond_STAFF_ID1", "");
        acctParam.put("cond_STAFF_NAME1", "");
        acctParam.put("cond_DEPART_NAME1", "");
        acctParam.put("cond_ENDDATE", "");
        acctParam.put("cond_CUST_NAME", "");
        acctParam.put("cond_PSPT_TYPE_CODE", "");
        acctParam.put("cond_PSPT_ID", "");
        acctParam.put("cond_PSPT_ADDR", "");
        acctParam.put("cond_POST_ADDRESS", "");
        acctParam.put("cond_CONTACT", "");
        acctParam.put("cond_CONTACT_PHONE", "");
        acctParam.put("cond_EMAIL", "");
        acctParam.put("cond_SHOWLIST", "");
        acctParam.put("cond_PSPT_END_DATE", "");
        acctParam.put("cond_NET_TYPE_CODE1", "");
        vb = HttpsTool.post(acctUrl, acctHeader, acctParam, "gbk");
        String resourceHtml = vb.getHtml();
        String content =
            RegexUtils.regexMathes(".*<div class=\"content\">(.+?)</div>.*",
                resourceHtml);
        if (content.trim().length() > 0)
        {
            // LOGGER.info(content);
            return new OrderResult("1", content);
        }
        
        List<ResourceInfo> resourceList =
            RegexUtils.extractResourceInfo(resourceHtml);
        for (ResourceInfo li : resourceList)
        {
            if (li.getDealTag().contains("处理中"))
            {
                LOGGER.info("用户有业务尚在处理中！");
                return new OrderResult("1", "用户有业务尚在处理中！");
            }
        }
        // 可选择流量包
        List<ResTableInfo> resTableList =
            RegexUtils.extractResTableInfo(resourceHtml);
        // form表单参数
        Map<String, String> resourceParam =
            RegexUtils.getResourceParam(resourceHtml);
        String xCodingString = RegexUtils.getXcodingString(resTableList);
        float creditMoney =
            Float.parseFloat(resourceParam.get("cond_CREDIT_VALUE"));// 信用额度
        float dePostMoney =
            Float.parseFloat(resourceParam.get("cond_DEPOSIT_MONEY"));// 话费余额
        if (creditMoney + dePostMoney < Float.parseFloat(price))
        {
            LOGGER.info("用户余额不足！");
            return new OrderResult("1", "用户余额不足！");
        }
        // 选择流量包
        String amchargeUrl =
            "https://gz.cbss.10010.com/acctmanm?service=ajaxDirect/1/amcharge.ordergprsresource.OrderGprsRes"
                + "/amcharge.ordergprsresource.OrderGprsRes/javascript/refeshZK&pagename="
                + "amcharge.ordergprsresource.OrderGprsRes"
                + "&eventname=getResZKList&staffId="
                + homePageParamMap.get("staffId")
                + "&departId="
                + homePageParamMap.get("deptId")
                + "&subSysCode=acctmanm&eparchyCode="
                + homePageParamMap.get("epachyId")
                + "&partids=refeshZK&random="
                + RegexUtils.getRandomParam()
                + "&ajaxSubmitType=post";
        Map<String, String> amchargeHeader = new HashMap<String, String>();
        amchargeHeader.put("Accept",
            "text/javascript, text/html, application/xml, text/xml, */*");
        amchargeHeader.put("Referer", "https://gz.cbss.10010.com/acctmanm");
        amchargeHeader.put("Accept-Language", "zh-CN");
        amchargeHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        amchargeHeader.put("Content-Type", "application/x-www-form-urlencoded");
        // amchargeHeader.put("Accept-Encoding","gzip, deflate");
        amchargeHeader.put("x-requested-with", "XMLHttpRequest");
        amchargeHeader.put("Host", "gz.cbss.10010.com");
        amchargeHeader.put("Connection", "Keep-Alive");
        amchargeHeader.put("Cache-Control", "no-cache");
        amchargeHeader.put("Cookie", cookie);
        Map<String, String> amchargeParam = new HashMap<String, String>();
        amchargeParam.put("Form0", resourceParam.get("Form0"));
        amchargeParam.put("cond_ID_TYPE", resourceParam.get("cond_ID_TYPE"));
        amchargeParam.put("cond_SERIAL_NUMBER", phone);
        amchargeParam.put("cond_NET_TYPE_CODE", "50");
        amchargeParam.put("bquerytop", " 查 询 ");
        amchargeParam.put("cond_X_USER_COUNT",
            resourceParam.get("cond_X_USER_COUNT"));
        amchargeParam.put("cond_DL_NAME", resourceParam.get("cond_DL_NAME"));
        amchargeParam.put("cond_DL_SNUMBER",
            resourceParam.get("cond_DL_SNUMBER"));
        amchargeParam.put("data_DL_ZJ", "");
        amchargeParam.put("cond_DL_NUMBER", "");
        amchargeParam.put("data_RESOURCE_TAG", resourceCode);// 流量包编码
        amchargeParam.put("data_RESOURCE_ZK", "");
        amchargeParam.put("data_PACKAGE_CODE",
            resourceParam.get("data_PACKAGE_CODE"));
        amchargeParam.put("data_RESOURCE_CODE",
            resourceParam.get("data_RESOURCE_CODE"));
        amchargeParam.put("data_ZK_NAME", resourceParam.get("data_ZK_NAME"));
        amchargeParam.put("data_RESOURCE_NAME",
            resourceParam.get("data_RESOURCE_NAME"));
        amchargeParam.put("data_LONG", resourceParam.get("data_LONG"));
        amchargeParam.put("data_MONEY", resourceParam.get("data_MONEY"));
        amchargeParam.put("data_RES_MONEY", resourceParam.get("data_RES_MONEY"));
        amchargeParam.put("data_UNIT", resourceParam.get("data_UNIT"));
        amchargeParam.put("data_VALID_TIME_UNIT",
            resourceParam.get("data_VALID_TIME_UNIT"));
        amchargeParam.put("data_VALID_TIME",
            resourceParam.get("data_VALID_TIME"));
        amchargeParam.put("data_RESOURCE_COUNT",
            resourceParam.get("data_RESOURCE_COUNT"));
        amchargeParam.put("cond_PRINT_FLAG",
            resourceParam.get("cond_PRINT_FLAG"));
        amchargeParam.put("cond_DL_ZJ_NAME",
            resourceParam.get("cond_DL_ZJ_NAME"));
        amchargeParam.put("bsubmit1", "提 交");
        amchargeParam.put("userinfoback_ACCT_ID",
            resourceParam.get("userinfoback_ACCT_ID"));
        amchargeParam.put("userinfoback_SERIAL_NUMBER", phone);
        amchargeParam.put("userinfoback_PAY_NAME",
            resourceParam.get("userinfoback_PAY_NAME"));
        amchargeParam.put("userinfoback_NET_TYPE_CODE",
            resourceParam.get("userinfoback_NET_TYPE_CODE"));
        amchargeParam.put("userinfoback_SERVICE_CLASS_CODE",
            resourceParam.get("userinfoback_SERVICE_CLASS_CODE"));
        amchargeParam.put("userinfoback_USER_ID",
            resourceParam.get("userinfoback_USER_ID"));
        amchargeParam.put("userinfoback_PAY_MODE_CODE",
            resourceParam.get("userinfoback_PAY_MODE_CODE"));
        amchargeParam.put("userinfoback_ROUTE_EPARCHY_CODE",
            resourceParam.get("userinfoback_ROUTE_EPARCHY_CODE"));
        amchargeParam.put("userinfoback_PREPAY_TAG",
            resourceParam.get("userinfoback_PREPAY_TAG"));
        amchargeParam.put("userinfoback_CITY_CODE",
            resourceParam.get("userinfoback_CITY_CODE"));
        amchargeParam.put("userinfoback_PRODUCT_ID",
            resourceParam.get("userinfoback_PRODUCT_ID"));
        amchargeParam.put("userinfoback_BRAND_CODE",
            resourceParam.get("userinfoback_BRAND_CODE"));
        amchargeParam.put("cond_CREDIT_VALUE",
            resourceParam.get("cond_CREDIT_VALUE"));
        amchargeParam.put("cond_DEPOSIT_MONEY",
            resourceParam.get("cond_DEPOSIT_MONEY"));
        amchargeParam.put("cond_TOTAL_FEE", resourceParam.get("cond_TOTAL_FEE"));
        amchargeParam.put("X_CODING_STR", xCodingString);
        amchargeParam.put("cond_DATE", resourceParam.get("cond_DATE"));
        amchargeParam.put("cond_DATE1", resourceParam.get("cond_DATE1"));
        amchargeParam.put("cond_DATE2", resourceParam.get("cond_DATE2"));
        amchargeParam.put("cond_DATE3", resourceParam.get("cond_DATE3"));
        amchargeParam.put("cond_STAFF_ID1", resourceParam.get("cond_STAFF_ID1"));
        amchargeParam.put("cond_STAFF_NAME1",
            resourceParam.get("cond_STAFF_NAME1"));
        amchargeParam.put("cond_DEPART_NAME1",
            resourceParam.get("cond_DEPART_NAME1"));
        amchargeParam.put("cond_ENDDATE", resourceParam.get("cond_ENDDATE"));
        amchargeParam.put("cond_CUST_NAME", resourceParam.get("cond_CUST_NAME"));
        amchargeParam.put("cond_PSPT_TYPE_CODE",
            resourceParam.get("cond_PSPT_TYPE_CODE"));
        amchargeParam.put("cond_PSPT_ID", resourceParam.get("cond_PSPT_ID"));
        amchargeParam.put("cond_PSPT_ADDR", resourceParam.get("cond_PSPT_ADDR"));
        amchargeParam.put("cond_POST_ADDRESS",
            resourceParam.get("cond_POST_ADDRESS"));
        amchargeParam.put("cond_CONTACT", resourceParam.get("cond_CONTACT"));
        amchargeParam.put("cond_CONTACT_PHONE",
            resourceParam.get("cond_CONTACT_PHONE"));
        amchargeParam.put("cond_EMAIL", resourceParam.get("cond_EMAIL"));
        amchargeParam.put("cond_SHOWLIST", resourceParam.get("cond_SHOWLIST"));
        amchargeParam.put("cond_PSPT_END_DATE",
            resourceParam.get("cond_PSPT_END_DATE"));
        amchargeParam.put("cond_NET_TYPE_CODE1",
            resourceParam.get("cond_NET_TYPE_CODE1"));
        amchargeParam.put("RESOURCE_TAG", resourceCode);
        vb = HttpsTool.post(amchargeUrl, amchargeHeader, amchargeParam, "GBK");
        String packageHtml = vb.getHtml();
        List<String> priceList = RegexUtils.queryPrice(packageHtml);
        
        if (!priceList.contains(price))
        {
            LOGGER.info("价格不对，不能订！");
            return new OrderResult("1", "用户不能订购该产品");
        }
        
        String refreshMoneyUrl =
            "https://gz.cbss.10010.com/acctmanm?service=ajaxDirect/1/amcharge.ordergprsresource.OrderGprsRes/"
                + "amcharge.ordergprsresource.OrderGprsRes/javascript/refeshMoney&pagename="
                + "amcharge.ordergprsresource.OrderGprsRes"
                + "&eventname=getOrderResInfos&staffId="
                + homePageParamMap.get("staffId")
                + "&departId="
                + homePageParamMap.get("deptId")
                + "&subSysCode=acctmanm&eparchyCode="
                + homePageParamMap.get("epachyId")
                + "&partids=refeshMoney&random="
                + RegexUtils.getRandomParam()
                + "&ajaxSubmitType=post";
        Map<String, String> refreshMoneyHeader = new HashMap<String, String>();
        refreshMoneyHeader.put("Accept",
            "text/javascript, text/html, application/xml, text/xml, */*");
        refreshMoneyHeader.put("Referer", "https://gz.cbss.10010.com/acctmanm");
        refreshMoneyHeader.put("Accept-Language", "zh-CN");
        refreshMoneyHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        refreshMoneyHeader.put("Content-Type",
            "application/x-www-form-urlencoded");
        // refreshMoneyHeader.put("Accept-Encoding","gzip, deflate");
        refreshMoneyHeader.put("x-requested-with", "XMLHttpRequest");
        refreshMoneyHeader.put("Host", "gz.cbss.10010.com");
        refreshMoneyHeader.put("Connection", "Keep-Alive");
        refreshMoneyHeader.put("Cache-Control", "no-cache");
        refreshMoneyHeader.put("Cookie", cookie);
        Map<String, String> refreshMoneyParam = new HashMap<String, String>();
        refreshMoneyParam.put("Form0", resourceParam.get("Form0"));
        refreshMoneyParam.put("cond_ID_TYPE", resourceParam.get("cond_ID_TYPE"));
        refreshMoneyParam.put("cond_SERIAL_NUMBER", phone);
        refreshMoneyParam.put("cond_NET_TYPE_CODE",
            resourceParam.get("userinfoback_NET_TYPE_CODE"));
        refreshMoneyParam.put("bquerytop", " 查 询 ");
        refreshMoneyParam.put("cond_X_USER_COUNT",
            resourceParam.get("cond_X_USER_COUNT"));
        refreshMoneyParam.put("cond_DL_NAME", resourceParam.get("cond_DL_NAME"));
        refreshMoneyParam.put("cond_DL_SNUMBER",
            resourceParam.get("cond_DL_SNUMBER"));
        refreshMoneyParam.put("data_DL_ZJ", "");
        refreshMoneyParam.put("cond_DL_NUMBER", "");
        refreshMoneyParam.put("data_RESOURCE_TAG", resourceCode);// 流量包编码
        refreshMoneyParam.put("data_RESOURCE_ZK", price);
        refreshMoneyParam.put("data_PACKAGE_CODE",
            resourceParam.get("data_PACKAGE_CODE"));
        refreshMoneyParam.put("data_RESOURCE_CODE",
            resourceParam.get("data_RESOURCE_CODE"));
        refreshMoneyParam.put("data_ZK_NAME", resourceParam.get("data_ZK_NAME"));
        refreshMoneyParam.put("data_RESOURCE_NAME",
            resourceParam.get("data_RESOURCE_NAME"));
        refreshMoneyParam.put("data_LONG", resourceParam.get("data_LONG"));
        refreshMoneyParam.put("data_MONEY", resourceParam.get("data_MONEY"));
        refreshMoneyParam.put("data_RES_MONEY",
            resourceParam.get("data_RES_MONEY"));
        refreshMoneyParam.put("data_UNIT", resourceParam.get("data_UNIT"));
        refreshMoneyParam.put("data_VALID_TIME_UNIT",
            resourceParam.get("data_VALID_TIME_UNIT"));
        refreshMoneyParam.put("data_VALID_TIME",
            resourceParam.get("data_VALID_TIME"));
        refreshMoneyParam.put("data_RESOURCE_COUNT",
            resourceParam.get("data_RESOURCE_COUNT"));
        refreshMoneyParam.put("cond_PRINT_FLAG",
            resourceParam.get("cond_PRINT_FLAG"));
        refreshMoneyParam.put("cond_DL_ZJ_NAME",
            resourceParam.get("cond_DL_ZJ_NAME"));
        refreshMoneyParam.put("bsubmit1", "提 交");
        refreshMoneyParam.put("userinfoback_ACCT_ID",
            resourceParam.get("userinfoback_ACCT_ID"));
        refreshMoneyParam.put("userinfoback_SERIAL_NUMBER", phone);
        refreshMoneyParam.put("userinfoback_PAY_NAME",
            resourceParam.get("userinfoback_PAY_NAME"));
        refreshMoneyParam.put("userinfoback_NET_TYPE_CODE",
            resourceParam.get("userinfoback_NET_TYPE_CODE"));
        refreshMoneyParam.put("userinfoback_SERVICE_CLASS_CODE",
            resourceParam.get("userinfoback_SERVICE_CLASS_CODE"));
        refreshMoneyParam.put("userinfoback_USER_ID",
            resourceParam.get("userinfoback_USER_ID"));
        refreshMoneyParam.put("userinfoback_PAY_MODE_CODE",
            resourceParam.get("userinfoback_PAY_MODE_CODE"));
        refreshMoneyParam.put("userinfoback_ROUTE_EPARCHY_CODE",
            resourceParam.get("userinfoback_ROUTE_EPARCHY_CODE"));
        refreshMoneyParam.put("userinfoback_PREPAY_TAG",
            resourceParam.get("userinfoback_PREPAY_TAG"));
        refreshMoneyParam.put("userinfoback_CITY_CODE",
            resourceParam.get("userinfoback_CITY_CODE"));
        refreshMoneyParam.put("userinfoback_PRODUCT_ID",
            resourceParam.get("userinfoback_PRODUCT_ID"));
        refreshMoneyParam.put("userinfoback_BRAND_CODE",
            resourceParam.get("userinfoback_BRAND_CODE"));
        refreshMoneyParam.put("cond_CREDIT_VALUE",
            resourceParam.get("cond_CREDIT_VALUE"));
        refreshMoneyParam.put("cond_DEPOSIT_MONEY",
            resourceParam.get("cond_DEPOSIT_MONEY"));
        refreshMoneyParam.put("cond_TOTAL_FEE",
            resourceParam.get("cond_TOTAL_FEE"));
        refreshMoneyParam.put("X_CODING_STR", xCodingString);
        refreshMoneyParam.put("cond_DATE", resourceParam.get("cond_DATE"));
        refreshMoneyParam.put("cond_DATE1", resourceParam.get("cond_DATE1"));
        refreshMoneyParam.put("cond_DATE2", resourceParam.get("cond_DATE2"));
        refreshMoneyParam.put("cond_DATE3", resourceParam.get("cond_DATE3"));
        refreshMoneyParam.put("cond_STAFF_ID1",
            resourceParam.get("cond_STAFF_ID1"));
        refreshMoneyParam.put("cond_STAFF_NAME1",
            resourceParam.get("cond_STAFF_NAME1"));
        refreshMoneyParam.put("cond_DEPART_NAME1",
            resourceParam.get("cond_DEPART_NAME1"));
        refreshMoneyParam.put("cond_ENDDATE", resourceParam.get("cond_ENDDATE"));
        refreshMoneyParam.put("cond_CUST_NAME",
            resourceParam.get("cond_CUST_NAME"));
        refreshMoneyParam.put("cond_PSPT_TYPE_CODE",
            resourceParam.get("cond_PSPT_TYPE_CODE"));
        refreshMoneyParam.put("cond_PSPT_ID", resourceParam.get("cond_PSPT_ID"));
        refreshMoneyParam.put("cond_PSPT_ADDR",
            resourceParam.get("cond_PSPT_ADDR"));
        refreshMoneyParam.put("cond_POST_ADDRESS",
            resourceParam.get("cond_POST_ADDRESS"));
        refreshMoneyParam.put("cond_CONTACT", resourceParam.get("cond_CONTACT"));
        refreshMoneyParam.put("cond_CONTACT_PHONE",
            resourceParam.get("cond_CONTACT_PHONE"));
        refreshMoneyParam.put("cond_EMAIL", resourceParam.get("cond_EMAIL"));
        refreshMoneyParam.put("cond_SHOWLIST",
            resourceParam.get("cond_SHOWLIST"));
        refreshMoneyParam.put("cond_PSPT_END_DATE",
            resourceParam.get("cond_PSPT_END_DATE"));
        refreshMoneyParam.put("cond_NET_TYPE_CODE1",
            resourceParam.get("cond_NET_TYPE_CODE1"));
        refreshMoneyParam.put("RESOURCE_TAG", resourceCode);
        refreshMoneyParam.put("ZK_CODE", price);
        vb =
            HttpsTool.post(refreshMoneyUrl,
                refreshMoneyHeader,
                refreshMoneyParam,
                "gbk");
        // LOGGER.info(vb.getHtml());
        String chargeInfo = HTMLDecoder.decode(vb.getHtml());
        // LOGGER.info(chargeInfo);
        Map<String, String> rMap = RegexUtils.getResourceParam(chargeInfo);
        for (ResTableInfo li : resTableList)
        {
            if (li.getResourceCode().equals(rMap.get("data_RESOURCE_CODE")))
            {
                rMap.put("data_RESOURCE_NAME", li.getResourceName());
            }
        }
        // LOGGER.info(rMap);
        // 订购提交
        String acctManmUrl = "https://gz.cbss.10010.com/acctmanm";
        Map<String, String> acctManmHeader = new HashMap<String, String>();
        acctManmHeader.put("Accept", "text/html, application/xhtml+xml, */*");
        acctManmHeader.put("Referer", "https://gz.cbss.10010.com/acctmanm");
        acctManmHeader.put("Accept-Language", "zh-CN");
        acctManmHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        acctManmHeader.put("Content-Type", "application/x-www-form-urlencoded");
        // acctManmHeader.put("Accept-Encoding","gzip, deflate");
        acctManmHeader.put("Host", "gz.cbss.10010.com");
        acctManmHeader.put("Connection", "Keep-Alive");
        acctManmHeader.put("Cache-Control", "no-cache");
        acctManmHeader.put("Cookie", cookie);
        Map<String, String> acctManmParam = new HashMap<String, String>();
        acctManmParam.put("service",
            "direct/1/amcharge.ordergprsresource.OrderGprsRes/$Form");
        acctManmParam.put("sp", "S0");
        acctManmParam.put("Form0", resourceParam.get("Form0"));
        acctManmParam.put("cond_ID_TYPE", resourceParam.get("cond_ID_TYPE"));
        acctManmParam.put("cond_SERIAL_NUMBER", phone);
        acctManmParam.put("cond_NET_TYPE_CODE",
            resourceParam.get("userinfoback_NET_TYPE_CODE"));
        acctManmParam.put("cond_X_USER_COUNT", "");
        acctManmParam.put("cond_DL_NAME", "");
        acctManmParam.put("cond_DL_SNUMBER", "");
        acctManmParam.put("data_DL_ZJ", "");
        acctManmParam.put("cond_DL_NUMBER", "");
        acctManmParam.put("data_RESOURCE_TAG", resourceCode);
        acctManmParam.put("data_RESOURCE_ZK", price);
        acctManmParam.put("data_PACKAGE_CODE",
            resourceParam.get("data_PACKAGE_CODE"));
        acctManmParam.put("data_RESOURCE_CODE", rMap.get("data_RESOURCE_CODE"));
        acctManmParam.put("data_ZK_NAME", rMap.get("data_ZK_NAME"));
        acctManmParam.put("data_RESOURCE_NAME", rMap.get("data_RESOURCE_NAME"));
        acctManmParam.put("data_LONG", rMap.get("data_LONG"));
        acctManmParam.put("data_MONEY", rMap.get("data_MONEY"));
        acctManmParam.put("data_RES_MONEY", rMap.get("data_RES_MONEY"));
        acctManmParam.put("data_UNIT", rMap.get("data_UNIT"));
        acctManmParam.put("data_VALID_TIME_UNIT",
            rMap.get("data_VALID_TIME_UNIT"));
        acctManmParam.put("data_VALID_TIME", rMap.get("data_VALID_TIME"));
        acctManmParam.put("data_RESOURCE_COUNT",
            rMap.get("data_RESOURCE_COUNT"));
        acctManmParam.put("cond_PRINT_FLAG", "");
        acctManmParam.put("cond_DL_ZJ_NAME", "");
        acctManmParam.put("bsubmit1", "提 交");
        acctManmParam.put("userinfoback_ACCT_ID",
            resourceParam.get("userinfoback_ACCT_ID"));
        acctManmParam.put("userinfoback_SERIAL_NUMBER", phone);
        acctManmParam.put("userinfoback_PAY_NAME",
            resourceParam.get("userinfoback_PAY_NAME"));
        acctManmParam.put("userinfoback_NET_TYPE_CODE",
            resourceParam.get("userinfoback_NET_TYPE_CODE"));
        acctManmParam.put("userinfoback_SERVICE_CLASS_CODE",
            resourceParam.get("userinfoback_SERVICE_CLASS_CODE"));
        acctManmParam.put("userinfoback_USER_ID",
            resourceParam.get("userinfoback_USER_ID"));
        acctManmParam.put("userinfoback_PAY_MODE_CODE",
            resourceParam.get("userinfoback_PAY_MODE_CODE"));
        acctManmParam.put("userinfoback_ROUTE_EPARCHY_CODE",
            resourceParam.get("userinfoback_ROUTE_EPARCHY_CODE"));
        acctManmParam.put("userinfoback_PREPAY_TAG",
            resourceParam.get("userinfoback_PREPAY_TAG"));
        acctManmParam.put("userinfoback_CITY_CODE",
            resourceParam.get("userinfoback_CITY_CODE"));
        acctManmParam.put("userinfoback_PRODUCT_ID",
            resourceParam.get("userinfoback_PRODUCT_ID"));
        acctManmParam.put("userinfoback_BRAND_CODE",
            resourceParam.get("userinfoback_BRAND_CODE"));
        acctManmParam.put("cond_CREDIT_VALUE",
            resourceParam.get("cond_CREDIT_VALUE"));
        acctManmParam.put("cond_DEPOSIT_MONEY",
            resourceParam.get("cond_DEPOSIT_MONEY"));
        acctManmParam.put("cond_TOTAL_FEE", "");
        acctManmParam.put("X_CODING_STR", xCodingString);
        acctManmParam.put("cond_DATE", resourceParam.get("cond_DATE"));
        acctManmParam.put("cond_DATE1", resourceParam.get("cond_DATE1"));
        acctManmParam.put("cond_DATE2", resourceParam.get("cond_DATE2"));
        acctManmParam.put("cond_DATE3", resourceParam.get("cond_DATE3"));
        acctManmParam.put("cond_STAFF_ID1", resourceParam.get("cond_STAFF_ID1"));
        acctManmParam.put("cond_STAFF_NAME1",
            resourceParam.get("cond_STAFF_NAME1"));
        acctManmParam.put("cond_DEPART_NAME1",
            resourceParam.get("cond_DEPART_NAME1"));
        acctManmParam.put("cond_ENDDATE", resourceParam.get("cond_ENDDATE"));
        acctManmParam.put("cond_CUST_NAME", resourceParam.get("cond_CUST_NAME"));
        acctManmParam.put("cond_PSPT_TYPE_CODE",
            resourceParam.get("cond_PSPT_TYPE_CODE"));
        acctManmParam.put("cond_PSPT_ID", resourceParam.get("cond_PSPT_ID"));
        acctManmParam.put("cond_PSPT_ADDR", resourceParam.get("cond_PSPT_ADDR"));
        acctManmParam.put("cond_POST_ADDRESS",
            resourceParam.get("cond_POST_ADDRESS"));
        acctManmParam.put("cond_CONTACT", resourceParam.get("cond_CONTACT"));
        acctManmParam.put("cond_CONTACT_PHONE",
            resourceParam.get("cond_CONTACT_PHONE"));
        acctManmParam.put("cond_EMAIL", resourceParam.get("cond_EMAIL"));
        acctManmParam.put("cond_SHOWLIST", resourceParam.get("cond_SHOWLIST"));
        acctManmParam.put("cond_PSPT_END_DATE",
            resourceParam.get("cond_PSPT_END_DATE"));
        acctManmParam.put("cond_NET_TYPE_CODE1",
            resourceParam.get("cond_NET_TYPE_CODE1"));
        vb = HttpsTool.post(acctManmUrl, acctManmHeader, acctManmParam, "GBK");
        // LOGGER.info(vb.getHtml());
        content =
            RegexUtils.regexMathes(".*<div class=\"content\">(.+?)</div>.*",
                vb.getHtml());
        LOGGER.info("流量订购结果：" + content);
        if (content.trim().contains("成功"))
        {
            return new OrderResult("0", "成功");
        }
        else
        {
            return new OrderResult("1", content);
        }
    }
    
    /**
     * 
     * 订购sp产品
     * 
     */
    private OrderResult orderSpProduct(Account account, OrderInfo orderInfo)
    {
        String encoding = "utf-8";
        String phone = orderInfo.getPhone();
        String productName = orderInfo.getProductName().replace("4G", "");
        ProductInfo productInfo = getProductInfo(productName);
        String resourceCode = productInfo.getResourceCode();
        Map<String, String> cookies = account.getCookie();
        Map<String, String> homePageParamMap = account.getMetaInfo();
        String cookie = HttpService.cookieMapToString(cookies);
        String headUrl =
            "https://gz.cbss.10010.com/essframe?service=page/Sidebar";
        Map<String, String> headUrlHeader = new HashMap<String, String>();
        headUrlHeader.put("Accept", "text/html, application/xhtml+xml, */*");
        headUrlHeader.put("Referer", "https://gz.cbss.10010.com/essframe");
        headUrlHeader.put("Accept-Language", "zh-CN");
        headUrlHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        headUrlHeader.put("Content-Type", "application/x-www-form-urlencoded");
        headUrlHeader.put("Host", "gz.cbss.10010.com");
        headUrlHeader.put("Connection", "Keep-Alive");
        headUrlHeader.put("Cache-Control", "no-cache");
        headUrlHeader.put("Cookie", cookie);
        VirtualBrowser vb = HttpsTool.get(headUrl, headUrlHeader, encoding);
        String sideBarHtml = vb.getHtml();
        cookies = vb.getCookies();
        cookie = HttpService.cookieMapToString(cookies);
        String custUrl =
            RegexUtils.regexMathes(".*menuaddr=\"(.+?)\".*", sideBarHtml);
        if (custUrl.isEmpty())
        {
            LOGGER.info("没取到url");
        }
        String loginRandomCode =
            RegexUtils.regexMathes(".*LOGIN_RANDOM_CODE=(\\d+).*", sideBarHtml);
        String loginCheckCode =
            RegexUtils.regexMathes(".*LOGIN_CHECK_CODE=(\\d+).*", sideBarHtml);
        custUrl = custUrl.replace("&amp;", "&");
        custUrl =
            custUrl + "&staffId=" + homePageParamMap.get("staffId")
                + "&departId=" + homePageParamMap.get("deptId")
                + "&subSysCode=" + homePageParamMap.get("subSysCode")
                + "&eparchyCode=" + homePageParamMap.get("epachyId");
        custUrl = "https://gz.cbss.10010.com/" + custUrl;
        // LOGGER.info(custUrl);
        Map<String, String> custHeader = new HashMap<String, String>();
        custHeader.put("Accept", "text/html, application/xhtml+xml, */*");
        custHeader.put("Referer",
            "https://gz.cbss.10010.com/essframe?service=page/Sidebar");
        custHeader.put("Accept-Language", "zh-CN");
        custHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        custHeader.put("Content-Type", "application/x-www-form-urlencoded");
        // custHeader.put("Accept-Encoding","gzip, deflate");
        custHeader.put("Host", "gz.cbss.10010.com");
        custHeader.put("Connection", "Keep-Alive");
        custHeader.put("Cache-Control", "no-cache");
        custHeader.put("Cookie", cookie);
        vb = HttpsTool.get(custUrl, custHeader, encoding);
        cookies = vb.getCookies();
        cookie = HttpService.cookieMapToString(cookies);
        
        // 首页用户认证
        String authenticateUrl =
            "https://gz.cbss.10010.com/custserv?service=swallow/pub.chkcust.MainChkCust/authenticate/1";
        String referUrl =
            "https://gz.cbss.10010.com/custserv?service=page/pub.chkcust.MainChkCust&listener=&staffId="
                + homePageParamMap.get("staffId")
                + "&departId="
                + homePageParamMap.get("deptId")
                + "&subSysCode=custserv&eparchyCode="
                + homePageParamMap.get("epachyId");
        Map<String, String> authenticateHeader = new HashMap<String, String>();
        authenticateHeader.put("Accept",
            "text/javascript, text/html, application/xml, text/xml, */*");
        authenticateHeader.put("Accept-Language", "zh-CN");
        authenticateHeader.put("x-prototype-version", "1.5.1");
        authenticateHeader.put("Referer", referUrl);
        authenticateHeader.put("x-requested-with", "XMLHttpRequest");
        authenticateHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        authenticateHeader.put("Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8");
        // authenticateHeader.put("Accept-Encoding","gzip, deflate");
        authenticateHeader.put("Host", "gz.cbss.10010.com");
        authenticateHeader.put("Connection", "Keep-Alive");
        authenticateHeader.put("Cache-Control", "no-cache");
        authenticateHeader.put("Cookie", cookie);
        Map<String, String> authenticateParams = new HashMap<String, String>();
        String paramJson =
            "{\"CHECK_MODE\": \"8\", \"EPARCHY_CODE\": \""
                + homePageParamMap.get("epachyId")
                + "\", \"ID_TYPE_CODE\": \"1\", \"PSPT_ID\": \"\", \"SERIAL_NUMBER\": \""
                + phone + "\"}";
        authenticateParams.put("inparam", paramJson);
        authenticateParams.put("globalPageName", "pub.chkcust.MainChkCust");
        
        vb =
            HttpsTool.post(authenticateUrl,
                authenticateHeader,
                authenticateParams,
                "utf-8");
        String authHtml = vb.getHtml();
        if (authHtml.contains("alert"))
        {
            String message =
                RegexUtils.regexMathes(".*message=\"(.+?)\".*", authHtml);
            // Pattern messagePattern =
            // Pattern.compile(".*message=\"(.+?)\".*",Pattern.DOTALL);
            // Matcher messageMatcher = messagePattern.matcher(authHtml);
            // if(messageMatcher.matches()){
            // message = HTMLDecoder.decode(messageMatcher.group(1).trim());
            // }
            message = HTMLDecoder.decode(message);
            return new OrderResult("1", message);
        }
        cookies = vb.getCookies();
        cookie = HttpService.cookieMapToString(cookies);
        
        String custId = RegexUtils.regexMathes(".*custId='(.+?)'.*", authHtml);
        String userId = RegexUtils.regexMathes(".*USER_ID=(\\d+).*", authHtml);
        String acctId = RegexUtils.regexMathes(".*ACCT_ID=(\\d+).*", authHtml);
        String custName =
            RegexUtils.regexMathes(".*custName=\"(.+?)\".*", authHtml);
        // Pattern custIdPattern = Pattern.compile(".*custId='(.+?)'.*",
        // Pattern.DOTALL);
        // Matcher custIdMatcher = custIdPattern.matcher(authHtml);
        // if(custIdMatcher.matches()){
        // custId = custIdMatcher.group(1);
        // }
        
        // Pattern userIdPattern = Pattern.compile(".*USER_ID=(\\d+).*",
        // Pattern.DOTALL);
        // Matcher userIdMatcher = userIdPattern.matcher(authHtml);
        // if(userIdMatcher.matches()){
        // userId = userIdMatcher.group(1);
        // }
        // Pattern acctIdPattern = Pattern.compile(".*ACCT_ID=(\\d+).*",
        // Pattern.DOTALL);
        // Matcher acctIdMatcher = acctIdPattern.matcher(authHtml);
        // if(acctIdMatcher.matches()){
        // acctId = acctIdMatcher.group(1);
        // }
        // Pattern custNamePattern = Pattern.compile(".*custName=\"(.+?)\".*",
        // Pattern.DOTALL);
        // Matcher custNameMatcher = custNamePattern.matcher(authHtml);
        // if(custNameMatcher.matches()){
        // custName = HTMLDecoder.decode(custNameMatcher.group(1));
        // }
        // LOGGER.info("custId:"+custId + " userId: "+ userId +
        // " acctId: "+acctId+" custName: "+custName);
        // LOGGER.info("认证页结果： "+authHtml);
        if (custId.isEmpty())
        {
            LOGGER.info("用户认证异常");
            return new OrderResult("1", "用户认证异常");
        }
        String userListUrl =
            "https://gz.cbss.10010.com/custserv?service=swallow/pub.chkcust.MainChkCust/queryUserList/1";
        Map<String, String> userListHeader = new HashMap<String, String>();
        userListHeader.put("Accept",
            "text/javascript, text/html, application/xml, text/xml, */*");
        userListHeader.put("Accept-Language", "zh-CN");
        userListHeader.put("x-prototype-version", "1.5.1");
        userListHeader.put("Referer", referUrl);
        userListHeader.put("x-requested-with", "XMLHttpRequest");
        userListHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        userListHeader.put("Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8");
        userListHeader.put("Host", "gz.cbss.10010.com");
        userListHeader.put("Connection", "Keep-Alive");
        userListHeader.put("Cache-Control", "no-cache");
        userListHeader.put("Cookie", cookie);
        Map<String, String> userListParams = new HashMap<String, String>();
        userListParams.put("custId", custId);
        userListParams.put("globalPageName", "pub.chkcust.MainChkCust");
        
        vb =
            HttpsTool.post(userListUrl, userListHeader, userListParams, "utf-8");
        // LOGGER.info("userList: "+vb.getHtml());
        String userListHtml = vb.getHtml();
        String netTypeCode =
            RegexUtils.regexMathes(".*netTypeCode=\"(.+?)\".*", userListHtml);
        // Pattern netTypeCodePattern =
        // Pattern.compile(".*netTypeCode=\"(.+?)\".*",
        // Pattern.DOTALL);
        // Matcher netTypeCodeMatcher =
        // netTypeCodePattern.matcher(userListHtml);
        // if(netTypeCodeMatcher.matches()){
        // netTypeCode = netTypeCodeMatcher.group(1);
        // }
        String prepayTag =
            RegexUtils.regexMathes(".*prepayTag=\"(.+?)\".*", userListHtml);
        // Pattern prepayTagCodePattern =
        // Pattern.compile(".*prepayTag=\"(.+?)\".*",
        // Pattern.DOTALL);
        // Matcher prepayTagMatcher =
        // prepayTagCodePattern.matcher(userListHtml);
        // if(prepayTagMatcher.matches()){
        // prepayTag = prepayTagMatcher.group(1);
        // }
        // LOGGER.info("netTypeCode: "+netTypeCode + " prepayTag: "+ prepayTag
        // );
        String tradeInfoUrl =
            "https://gz.cbss.10010.com/custserv?service=swallow/popupdialog.queryPreOrder.QueryPreOrder/queryTradeInfonum/1";
        Map<String, String> tradeInfoHeader = new HashMap<String, String>();
        tradeInfoHeader.put("Accept",
            "text/javascript, text/html, application/xml, text/xml, */*");
        tradeInfoHeader.put("Accept-Language", "zh-CN");
        tradeInfoHeader.put("x-prototype-version", "1.5.1");
        tradeInfoHeader.put("Referer", referUrl);
        tradeInfoHeader.put("x-requested-with", "XMLHttpRequest");
        tradeInfoHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        tradeInfoHeader.put("Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8");
        tradeInfoHeader.put("Host", "gz.cbss.10010.com");
        tradeInfoHeader.put("Connection", "Keep-Alive");
        tradeInfoHeader.put("Cache-Control", "no-cache");
        tradeInfoHeader.put("Cookie", cookie);
        Map<String, String> tradeInfoParams = new HashMap<String, String>();
        tradeInfoParams.put("COND_USER_ID", custId);
        tradeInfoParams.put("globalPageName", "pub.chkcust.MainChkCust");
        
        vb =
            HttpsTool.post(tradeInfoUrl,
                tradeInfoHeader,
                tradeInfoParams,
                "utf-8");
        // LOGGER.info(vb.getHtml());
        
        String personalServUrl =
            "https://gz.cbss.10010.com/custserv?service=page/personalserv.platformtrade.SpTrade&listener="
                + "initMobTrade&RIGHT_CODE=csSpTrade&LOGIN_RANDOM_CODE="
                + loginRandomCode
                + "&LOGIN_CHECK_CODE="
                + loginCheckCode
                + "&LOGIN_PROVINCE_CODE="
                + homePageParamMap.get("provinceId")
                + "&IPASS_LOGIN=null&staffId="
                + homePageParamMap.get("staffId")
                + "&departId="
                + homePageParamMap.get("deptId")
                + "&subSysCode="
                + homePageParamMap.get("subSysCode")
                + "&eparchyCode="
                + homePageParamMap.get("epachyId");
        Map<String, String> personalServHeader = new HashMap<String, String>();
        personalServHeader.put("Accept",
            "text/html, application/xhtml+xml, */*");
        personalServHeader.put("Referer",
            "https://gz.cbss.10010.com/essframe?service=page/Sidebar");
        personalServHeader.put("Accept-Language", "zh-CN");
        personalServHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        personalServHeader.put("Content-Type",
            "application/x-www-form-urlencoded");
        personalServHeader.put("Host", "gz.cbss.10010.com");
        personalServHeader.put("Connection", "Keep-Alive");
        personalServHeader.put("Cache-Control", "no-cache");
        personalServHeader.put("Cookie", cookie);
        vb = HttpsTool.get(personalServUrl, personalServHeader, encoding);
        
        String personalServHtml = vb.getHtml();
        
        String tradeBase =
            RegexUtils.regexMathes("(?s).*name=\"_tradeBase\"\\s+value=\"(.+?)\"/>.*",
                personalServHtml);
        String queryCustUrl =
            "https://gz.cbss.10010.com/custserv?service=swallow/pub.chkcust.MainChkCust/queryCustAuth/1";
        Map<String, String> queryCustHeader = new HashMap<String, String>();
        referUrl = personalServUrl;
        queryCustHeader.put("Accept",
            "text/javascript, text/html, application/xml, text/xml, */*");
        queryCustHeader.put("Accept-Language", "zh-CN");
        queryCustHeader.put("x-prototype-version", "1.5.1");
        queryCustHeader.put("Referer", referUrl);
        queryCustHeader.put("x-requested-with", "XMLHttpRequest");
        queryCustHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        queryCustHeader.put("Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8");
        // queryCustHeader.put("Accept-Encoding","gzip, deflate");
        queryCustHeader.put("Host", "gz.cbss.10010.com");
        queryCustHeader.put("Connection", "Keep-Alive");
        queryCustHeader.put("Cache-Control", "no-cache");
        queryCustHeader.put("Cookie", cookie);
        Map<String, String> queryCustParams = new HashMap<String, String>();
        queryCustParams.put("touchId", "");
        queryCustParams.put("serialNumber", phone);
        queryCustParams.put("netTypeCode", netTypeCode);
        queryCustParams.put("rightCode", "csSpTrade");
        queryCustParams.put("globalPageName",
            "personalserv.platformtrade.SpTrade");
        vb =
            HttpsTool.post(queryCustUrl,
                queryCustHeader,
                queryCustParams,
                "utf-8");
        
        String custServUrl = "https://gz.cbss.10010.com/custserv";
        Map<String, String> custServHeader = new HashMap<String, String>();
        custServHeader.put("Accept",
            "text/javascript, text/html, application/xml, text/xml, */*");
        custServHeader.put("Accept-Language", "zh-CN");
        custServHeader.put("x-prototype-version", "1.5.1");
        custServHeader.put("Referer", referUrl);
        custServHeader.put("x-requested-with", "XMLHttpRequest");
        custServHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        custServHeader.put("Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8");
        // custServHeader.put("Accept-Encoding","gzip, deflate");
        custServHeader.put("Host", "gz.cbss.10010.com");
        custServHeader.put("Connection", "Keep-Alive");
        custServHeader.put("Cache-Control", "no-cache");
        custServHeader.put("Cookie", cookie);
        
        Map<String, String> custServParams = new HashMap<String, String>();
        custServParams.put("service",
            "direct/1/personalserv.platformtrade.SpTrade/$MobTrade.$Form$0");
        custServParams.put("sp", "S0");
        custServParams.put("Form0",
            "ORDER_MGR,RElA_TRADE_ID,ORDER_TYPE,SUPPORT_TAG,COMM_SHARE_NBR_STRING,"
                + "AC_INFOS,FORGIFT_USER_ID,QUERY_ACCOUNT_ID,_rightCode,inModeCode"
                + ",NET_TYPE_CODE,SERIAL_NUMBER,subQueryTrade");
        custServParams.put("SUPPORT_TAG", "");
        custServParams.put("COMM_SHARE_NBR_STRING", "");
        custServParams.put("AC_INFOS", "");
        custServParams.put("FORGIFT_USER_ID", "");
        custServParams.put("QUERY_ACCOUNT_ID", "");
        custServParams.put("_rightCode", "csSpTrade");
        custServParams.put("_tradeBase", tradeBase);
        custServParams.put("inModeCode", "0");
        custServParams.put("ORDER_MGR", "");
        custServParams.put("RElA_TRADE_ID", "");
        custServParams.put("ORDER_TYPE", "");
        custServParams.put("NET_TYPE_CODE", netTypeCode);
        custServParams.put("SERIAL_NUMBER", phone);
        custServParams.put("subQueryTrade", "查询");
        
        vb = HttpsTool.post(custServUrl, custServHeader, custServParams, "GBK");
        
        String userInfoHtml = vb.getHtml();
        String xmlResult = "";
        Pattern xmlPattern =
            Pattern.compile(".*value=\"(.+?)\" id=\"_messageXml\".*",
                Pattern.DOTALL);
        Matcher xmlMatcher = xmlPattern.matcher(userInfoHtml);
        if (xmlMatcher.matches())
        {
            try
            {
                xmlResult =
                    HTMLDecoder.decode(java.net.URLDecoder.decode(xmlMatcher.group(1),
                        "utf-8"));
                Pattern p =
                    Pattern.compile(".*message=\"(.+?)\" type=\"error\".*",
                        Pattern.DOTALL);
                Matcher m = p.matcher(xmlResult);
                if (m.matches())
                {
                    xmlResult = HTMLDecoder.decode(m.group(1));
                }
                else
                {
                    xmlResult = "";
                }
                if (xmlResult.indexOf(":") > 0)
                {
                    xmlResult =
                        xmlResult.substring(xmlResult.indexOf(":") + 1,
                            xmlResult.length());
                }
            }
            catch (Exception e)
            {
                
            }
        }
        if (!xmlResult.isEmpty())
        {
            return new OrderResult("1", xmlResult);
        }
        String tradeTypeCode = "";
        Pattern tradeCodePattern =
            Pattern.compile(".*name=\"_TRADE_TYPE_CODE\" value=\"(\\d+)\".*",
                Pattern.DOTALL);
        Matcher tradeCodeMatcher = tradeCodePattern.matcher(userInfoHtml);
        if (tradeCodeMatcher.matches())
        {
            tradeTypeCode = tradeCodeMatcher.group(1);
        }
        List<SpProduct> orderEdSpProudctList =
            HttpService.extractProductList(userInfoHtml);
        
        for (SpProduct li : orderEdSpProudctList)
        {
            if (li.getSpProductId().contains(resourceCode))
            {
                LOGGER.info("用户<" + orderInfo.getOrderId() + " "
                    + orderInfo.getPhone() + ">已订购有该sp产品："
                    + li.getSpProductName());
                return new OrderResult("1", "用户已订购有该sp产品");
            }
        }
        tradeBase =
            RegexUtils.regexMathes("(?s).*name=\"_tradeBase\"\\s+value=\"(.+?)\"/>.*",
                userInfoHtml);
        String userSpString = "";
        Pattern userSpPattern =
            Pattern.compile("(?s).*name=\"USER_SP\"\\s+value=\"(.*?)\"/>.*",
                Pattern.DOTALL);
        Matcher userSpMatcher = userSpPattern.matcher(userInfoHtml);
        if (userSpMatcher.matches())
        {
            userSpString = HTMLDecoder.decode(userSpMatcher.group(1).trim());
            userSpString = userSpString.replace("&quot;", "\"");
        }
        // LOGGER.info("userSpString: "+ userSpString);
        String queryProductUrl =
            "https://gz.cbss.10010.com/custserv?service=direct/1/personalserv.platformtrade.SpTrade/querySpProducts";
        Map<String, String> queryProductHeader = new HashMap<String, String>();
        queryProductHeader.put("Accept",
            "text/javascript, text/html, application/xml, text/xml, */*");
        queryProductHeader.put("Accept-Language", "zh-CN");
        queryProductHeader.put("x-prototype-version", "1.5.1");
        queryProductHeader.put("Referer", "https://gz.cbss.10010.com/custserv");
        queryProductHeader.put("x-requested-with", "XMLHttpRequest");
        queryProductHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        queryProductHeader.put("Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8");
        // queryProductHeader.put("Accept-Encoding","gzip, deflate");
        queryProductHeader.put("Host", "gz.cbss.10010.com");
        queryProductHeader.put("Connection", "Keep-Alive");
        queryProductHeader.put("Cache-Control", "no-cache");
        queryProductHeader.put("Cookie", cookie);
        
        Map<String, String> queryProductParams = new HashMap<String, String>();
        queryProductParams.put("SP_TYPE_CODE", "");
        queryProductParams.put("SP_PRODUCT_NAME_S",
            productName.length() > 7 ? productName.substring(0, 7)
                : productName);
        queryProductParams.put("SP_NET_TAG", "0");
        vb =
            HttpsTool.post(queryProductUrl,
                queryProductHeader,
                queryProductParams,
                "GBK");
        String orderProductHtml = vb.getHtml();
        
        List<SpProduct> spProudctList =
            HttpService.extractProductResult(orderProductHtml);
        
        if (spProudctList.isEmpty())
        {
            LOGGER.info("未查到相应的产品");
            return new OrderResult("1", "未查到相应的产品");
        }
        else
        {
            LOGGER.info(spProudctList.get(0));
        }
        SpProduct spProduct = null;
        for (SpProduct li : spProudctList)
        {
            if (li.getSpProductId().equals(resourceCode))
            {
                spProduct = li;
            }
        }
        if (spProduct == null)
        {
            LOGGER.info("未查到相应的产品");
            return new OrderResult("1", "未查到相应的产品");
        }
        String submitUrl =
            "https://gz.cbss.10010.com/custserv?service=swallow/personalserv.platformtrade.SpTrade/submitMobTrade/1";
        Map<String, String> submitHeader = new HashMap<String, String>();
        submitHeader.put("Accept",
            "text/javascript, text/html, application/xml, text/xml, */*");
        submitHeader.put("Accept-Language", "zh-CN");
        submitHeader.put("x-prototype-version", "1.5.1");
        submitHeader.put("Referer", "https://gz.cbss.10010.com/custserv");
        submitHeader.put("x-requested-with", "XMLHttpRequest");
        submitHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        submitHeader.put("Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8");
        // submitHeader.put("Accept-Encoding","gzip, deflate");
        submitHeader.put("Host", "gz.cbss.10010.com");
        submitHeader.put("Connection", "Keep-Alive");
        submitHeader.put("Cache-Control", "no-cache");
        submitHeader.put("Cookie", cookie);
        Map<String, String> submitParams = new HashMap<String, String>();
        submitParams.put("Base", tradeBase);
        SimpleDateFormat dateFormater =
            new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String time = dateFormater.format(System.currentTimeMillis());
        String extHead =
            "{\"Common\": {\"ACTOR_NAME\": \"\", \"ACTOR_PHONE\": \"\", "
                + "\"ACTOR_CERTTYPEID\": \"\", \"ACTOR_CERTNUM\": \"\", \"REMARK\": \"\"},";
        String extProduct =
            "\"TF_B_TRADE_SP\": {\"ITEM\": [{\"MODIFY_TAG\": \"0\", \"SP_PRODUCT_ID\": \""
                + spProduct.getSpProductId()
                + "\", \"SP_ID\": \""
                + spProduct.getSpId()
                + "\", \"PARTY_ID\": \""
                + spProduct.getPartyId()
                + "\", \"FIRST_BUY_TIME\": \""
                + time
                + "\", \"SP_SERVICE_ID\": \""
                + spProduct.getSpServiceId()
                + "\", \"PAY_SERIAL_NUMBER\": \"\", \"START_DATE\": \""
                + time
                + "\", \"END_DATE\": \"2050-12-31 23:59:59\", \"PAY_USER_ID\": \""
                + custId
                + "\", \"PRODUCT_ID\": \"-1\", \"PACKAGE_ID\": \"-1\", \"ITEM_ID\": \"-1\"}]}, ";
        String extOrderedProduct =
            "\"TF_B_TRADE_SP_TEMP\": " + userSpString + " , ";
        if (userSpString.isEmpty())
        {
            extOrderedProduct = "";
        }
        String extOtherInfo =
            "\"TRADE_OTHER_INFO\": {\"ITEM\": {\"CHECK_TYPE\": \"8\", \"BLACK_CUST\": \"0\"}}}";
        String extString =
            extHead + extProduct + extOrderedProduct + extOtherInfo;
        submitParams.put("Ext", extString);
        // LOGGER.info("extString: "+extString);
        submitParams.put("globalPageName", "personalserv.platformtrade.SpTrade");
        vb = HttpsTool.post(submitUrl, submitHeader, submitParams, "GBK");
        String submitResult = vb.getHtml();
        // LOGGER.info("submitResultHtml: "+submitResult);
        if (submitResult.contains("TradeSubmitFailed"))
        {
            String message =
                RegexUtils.regexMathes(".*message=\"(.+?)\".*", submitResult);
            message = HTMLDecoder.decode(message.replace("&quot;", "\""));
            LOGGER.info(message);
            return new OrderResult("1", message);
        }
        String tradeId = "";
        String subscribeId = "";
        String proviceOrderId = "";
        Pattern resultPattern =
            Pattern.compile("tradeId='(\\d+)'.+subscribeId='(\\d+)'.+proviceOrderId='(\\d+)'",
                Pattern.DOTALL);
        Matcher resultMatcher = resultPattern.matcher(submitResult);
        if (resultMatcher.find())
        {
            tradeId = resultMatcher.group(1).trim();
            subscribeId = resultMatcher.group(2).trim();
            proviceOrderId = resultMatcher.group(3).trim();
        }
        String netTypeCodeAll =
            RegexUtils.regexMathes(".*netTypeCode=\"(\\d+)\".*", submitResult);
        String tradeReceiptInfo =
            RegexUtils.regexMathes(".*tradeReceiptInfo=\"(.+?)\".*",
                submitResult);
        LOGGER.info("tradeId: " + tradeId + " subscribeId: " + subscribeId
            + " proviceOrderId: " + proviceOrderId + " netTypeCodeAll: "
            + netTypeCodeAll + " tradeReceiptInfo: " + tradeReceiptInfo);
        String tradeTypeCodeAll = "";
        Pattern tradeTypeCodeAllPattern =
            Pattern.compile(".*tradeTypeCode=\"(.+?)\".*", Pattern.DOTALL);
        Matcher tradeTypeCodeAllMatcher =
            tradeTypeCodeAllPattern.matcher(submitResult);
        if (tradeTypeCodeAllMatcher.matches())
        {
            tradeTypeCodeAll = tradeTypeCodeAllMatcher.group(1);
        }
        LOGGER.info("tradeTypeCodeAll: " + tradeTypeCodeAll);
        String strisneedprint = "";
        Pattern strisneedprintPattern =
            Pattern.compile(".*strisneedprint=\"(.+?)\".*", Pattern.DOTALL);
        Matcher strisneedprintMatcher =
            strisneedprintPattern.matcher(submitResult);
        if (strisneedprintMatcher.matches())
        {
            strisneedprint = strisneedprintMatcher.group(1);
        }
        LOGGER.info("strisneedprint: " + strisneedprint);
        String continueTradeUrl =
            "https://gz.cbss.10010.com/custserv?service=swallow/"
                + "personalserv.dealtradefee.DealTradeFee/continueTradeReg/1";
        referUrl =
            "https://gz.cbss.10010.com/custserv?service=page/personalserv.dealtradefee.DealTradeFee"
                + "&listener=init&TRADE_TYPE_CODE=tradeType&";
        // param=%7B%22SUBSCRIBE_ID%22%3A%20%227115051548867345%22%2C%20%22TRADE_ID
        // /%22%3A%20%227115051548867345%22%2C%20%22PROVINCE_ORDER_ID%22%3A%20%227115051548867345%22%7D
        // &fee=&noBack=&staffId=AXXHJD01&departId=71b1oh0&subSysCode=custserv&eparchyCode=0027";
        String param =
            "param={\"SUBSCRIBE_ID\": \"" + subscribeId
                + "\", \"TRADE_ID\": \"" + tradeId
                + "\", \"PROVINCE_ORDER_ID\": \"" + proviceOrderId + "\"}";
        try
        {
            param = java.net.URLEncoder.encode(param, "utf-8");
        }
        catch (Exception e)
        {
            
        }
        referUrl += param;
        String end =
            "&fee=&noBack=&staffId=" + homePageParamMap.get("staffId")
                + "&departId=" + homePageParamMap.get("deptId")
                + "&subSysCode=custserv&eparchyCode="
                + homePageParamMap.get("epachyId");
        referUrl += end;
        Map<String, String> continueHead = new HashMap<String, String>();
        continueHead.put("Accept",
            "text/javascript, text/html, application/xml, text/xml, */*");
        continueHead.put("Accept-Language", "zh-CN");
        continueHead.put("x-prototype-version", "1.5.1");
        continueHead.put("Referer", referUrl);
        continueHead.put("x-requested-with", "XMLHttpRequest");
        continueHead.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        continueHead.put("Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8");
        // continueHead.put("Accept-Encoding","gzip, deflate");
        continueHead.put("Host", "gz.cbss.10010.com");
        continueHead.put("Connection", "Keep-Alive");
        continueHead.put("Cache-Control", "no-cache");
        continueHead.put("Cookie", cookie);
        Map<String, String> continueParams = new HashMap<String, String>();
        Boolean bool = false;
        Integer i = new Integer(0);
        continueParams.put("cancelTag", bool.toString());
        continueParams.put("funcType", i.toString());
        continueParams.put("dataType", i.toString());
        String tradeMainString =
            "[{\"TRADE_ID\": \"" + tradeId
                + "\", \"TRADE_TYPE\": \"SP查询/退订/订购\", \"SERIAL_NUMBER\": \""
                + phone + "\", \"TRADE_FEE\": \"0.00\", \"CUST_NAME\": \""
                + custName + "\", \"CUST_ID\": \"" + custId
                + "\", \"USER_ID\": \"" + userId + "\", \"ACCT_ID\": \""
                + acctId + "\", \"NET_TYPE_CODE\": \"" + netTypeCode
                + "\", \"TRADE_TYPE_CODE\": \"" + tradeTypeCode + "\"}]";
        continueParams.put("tradeMain", tradeMainString);
        List<String> list = new ArrayList<String>();
        continueParams.put("fees", list.toString());
        continueParams.put("unChargedfees", list.toString());
        continueParams.put("feePayMoney", list.toString());
        continueParams.put("feeCheck", list.toString());
        continueParams.put("feePos", list.toString());
        String baseString =
            "{\"prepayTag\": \"" + prepayTag + "\", \"tradeTypeCode\": \""
                + tradeTypeCodeAll + "\", \"strisneedprint\": \""
                + strisneedprint + "\", \"serialNumber\": \"" + phone
                + "\", \"tradeReceiptInfo\": \"" + tradeReceiptInfo
                + "\", \"netTypeCode\": \"" + netTypeCodeAll + "\"}";
        continueParams.put("base", baseString);
        continueParams.put("CASH", "0.00");
        continueParams.put("SEND_TYPE", i.toString());
        continueParams.put("TRADE_ID", tradeId);
        continueParams.put("TRADE_ID_MORE_STR", tradeId);
        continueParams.put("SERIAL_NUMBER_STR", phone);
        continueParams.put("TRADE_TYPE_CODE_STR", tradeTypeCode);
        continueParams.put("NET_TYPE_CODE_STR", netTypeCode);
        continueParams.put("DEBUTY_CODE", "");
        continueParams.put("IS_NEED_WRITE_CARD", bool.toString());
        continueParams.put("WRAP_TRADE_TYPE", "tradeType");
        continueParams.put("CUR_TRADE_IDS", "");
        continueParams.put("CUR_TRADE_TYPE_CODES", "");
        continueParams.put("CUR_SERIAL_NUMBERS", "");
        continueParams.put("CUR_NET_TYPE_CODES", "");
        continueParams.put("isAfterFee", "");
        continueParams.put("globalPageName",
            "personalserv.dealtradefee.DealTradeFee");
        vb =
            HttpsTool.post(continueTradeUrl,
                continueHead,
                continueParams,
                "utf-8");
        String continueHtml = vb.getHtml();
        String isNeedOccupy =
            RegexUtils.regexMathes(".*IS_NEED_OCCUPY='(.+?)'.*", continueHtml);
        if ("true".equals(isNeedOccupy))
        {
            LOGGER.info("办理成功！");
            return new OrderResult("0", "成功！");
        }
        else
        {
            LOGGER.info("办理失败");
            return new OrderResult("1", "失败！");
        }
    }
    
    /**
     * Description: TODO(移网订购产品业务)
     * 
     * @Title: orderYiWangProduct tag
     * @author Administrator tag
     * @param account tag
     * @param orderInfo tag
     * @return tag
     * @date: 2015-11-9上午10:49:47
     * @since JDK 1.6
     */
    
    public OrderResult orderYiWangProduct(Account account, OrderInfo orderInfo)
    {
        
        // 请求构造1
        String encoding = "utf-8";
        String phone = orderInfo.getPhone();
        String productName = orderInfo.getProductName().replace("4G", "");
        ProductInfo productInfo = getProductInfo(productName);
        String resourceCode = productInfo.getResourceCode();
        Map<String, String> cookies = account.getCookie();
        Map<String, String> homePageParamMap = account.getMetaInfo();
        String cookie = HttpService.cookieMapToString(cookies);
        String headUrl =
            "https://gz.cbss.10010.com/essframe?service=page/Sidebar";
        Map<String, String> headUrlHeader = new HashMap<String, String>();
        headUrlHeader.put("Accept", "text/html, application/xhtml+xml, */*");
        headUrlHeader.put("Referer", "https://gz.cbss.10010.com/essframe");
        headUrlHeader.put("Accept-Language", "zh-CN");
        headUrlHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        headUrlHeader.put("Content-Type", "application/x-www-form-urlencoded");
        headUrlHeader.put("Host", "gz.cbss.10010.com");
        headUrlHeader.put("Connection", "Keep-Alive");
        headUrlHeader.put("Cache-Control", "no-cache");
        headUrlHeader.put("Cookie", cookie);
        VirtualBrowser vb = HttpsTool.get(headUrl, headUrlHeader, encoding);
        String sideBarHtml = vb.getHtml();
        cookies = vb.getCookies();
        cookie = HttpService.cookieMapToString(cookies);
        String custUrl =
            RegexUtils.regexMathes(".*menuaddr=\"(.+?)\".*", sideBarHtml);
        if (custUrl.isEmpty())
        {
            LOGGER.info("没取到url");
        }
        // 请求构造2
        String loginRandomCode =
            RegexUtils.regexMathes(".*LOGIN_RANDOM_CODE=(\\d+).*", sideBarHtml);
        String loginCheckCode =
            RegexUtils.regexMathes(".*LOGIN_CHECK_CODE=(\\d+).*", sideBarHtml);
        custUrl = custUrl.replace("&amp;", "&");
        custUrl =
            custUrl + "&staffId=" + homePageParamMap.get("staffId")
                + "&departId=" + homePageParamMap.get("deptId")
                + "&subSysCode=" + homePageParamMap.get("subSysCode")
                + "&eparchyCode=" + homePageParamMap.get("epachyId");
        custUrl = "https://gz.cbss.10010.com/" + custUrl;
        Map<String, String> custHeader = new HashMap<String, String>();
        custHeader.put("Accept", "text/html, application/xhtml+xml, */*");
        custHeader.put("Referer",
            "https://gz.cbss.10010.com/essframe?service=page/Sidebar");
        custHeader.put("Accept-Language", "zh-CN");
        custHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        custHeader.put("Content-Type", "application/x-www-form-urlencoded");
        custHeader.put("Host", "gz.cbss.10010.com");
        custHeader.put("Connection", "Keep-Alive");
        custHeader.put("Cache-Control", "no-cache");
        custHeader.put("Cookie", cookie);
        vb = HttpsTool.get(custUrl, custHeader, encoding);
        cookies = vb.getCookies();
        cookie = HttpService.cookieMapToString(cookies);
        
        // 请求构造3
        
        // 首页用户认证
        String authenticateUrl =
            "https://gz.cbss.10010.com/custserv?service=swallow/pub.chkcust.MainChkCust/authenticate/1";
        String referUrl =
            "https://gz.cbss.10010.com/custserv?service=page/pub.chkcust.MainChkCust&listener=&staffId="
                + homePageParamMap.get("staffId")
                + "&departId="
                + homePageParamMap.get("deptId")
                + "&subSysCode=custserv&eparchyCode="
                + homePageParamMap.get("epachyId");
        Map<String, String> authenticateHeader = new HashMap<String, String>();
        authenticateHeader.put("Accept",
            "text/javascript, text/html, application/xml, text/xml, */*");
        authenticateHeader.put("Accept-Language", "zh-CN");
        authenticateHeader.put("x-prototype-version", "1.5.1");
        authenticateHeader.put("Referer", referUrl);
        authenticateHeader.put("x-requested-with", "XMLHttpRequest");
        authenticateHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        authenticateHeader.put("Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8");
        authenticateHeader.put("Host", "gz.cbss.10010.com");
        authenticateHeader.put("Connection", "Keep-Alive");
        authenticateHeader.put("Cache-Control", "no-cache");
        authenticateHeader.put("Cookie", cookie);
        Map<String, String> authenticateParams = new HashMap<String, String>();
        String paramJson =
            "{\"CHECK_MODE\": \"8\", \"EPARCHY_CODE\": \""
                + homePageParamMap.get("epachyId")
                + "\", \"ID_TYPE_CODE\": \"1\", \"PSPT_ID\": \"\", \"SERIAL_NUMBER\": \""
                + phone + "\"}";
        authenticateParams.put("inparam", paramJson);
        authenticateParams.put("globalPageName", "pub.chkcust.MainChkCust");
        
        vb =
            HttpsTool.post(authenticateUrl,
                authenticateHeader,
                authenticateParams,
                "utf-8");
        
        // 请求构造4
        String authHtml = vb.getHtml();
        if (authHtml.contains("alert"))
        {
            String message =
                RegexUtils.regexMathes(".*message=\"(.+?)\".*", authHtml);
            message = HTMLDecoder.decode(message);
            return new OrderResult("1", message);
        }
        cookies = vb.getCookies();
        cookie = HttpService.cookieMapToString(cookies);
        
        String custId = RegexUtils.regexMathes(".*custId='(.+?)'.*", authHtml);
        String userId = RegexUtils.regexMathes(".*USER_ID=(\\d+).*", authHtml);
        String acctId = RegexUtils.regexMathes(".*ACCT_ID=(\\d+).*", authHtml);
        String custName =
            RegexUtils.regexMathes(".*custName=\"(.+?)\".*", authHtml);
        if (custId.isEmpty())
        {
            LOGGER.info("用户认证异常");
            return new OrderResult("1", "用户认证异常");
        }
        // 请求构造5
        String userListUrl =
            "https://gz.cbss.10010.com/custserv?service=swallow/pub.chkcust.MainChkCust/queryUserList/1";
        Map<String, String> userListHeader = new HashMap<String, String>();
        userListHeader.put("Accept",
            "text/javascript, text/html, application/xml, text/xml, */*");
        userListHeader.put("Accept-Language", "zh-CN");
        userListHeader.put("x-prototype-version", "1.5.1");
        userListHeader.put("Referer", referUrl);
        userListHeader.put("x-requested-with", "XMLHttpRequest");
        userListHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        userListHeader.put("Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8");
        userListHeader.put("Host", "gz.cbss.10010.com");
        userListHeader.put("Connection", "Keep-Alive");
        userListHeader.put("Cache-Control", "no-cache");
        userListHeader.put("Cookie", cookie);
        Map<String, String> userListParams = new HashMap<String, String>();
        userListParams.put("custId", custId);
        userListParams.put("globalPageName", "pub.chkcust.MainChkCust");
        
        vb =
            HttpsTool.post(userListUrl, userListHeader, userListParams, "utf-8");
        String userListHtml = vb.getHtml();
        String netTypeCode =
            RegexUtils.regexMathes(".*netTypeCode=\"(.+?)\".*", userListHtml);
        String prepayTag =
            RegexUtils.regexMathes(".*prepayTag=\"(.+?)\".*", userListHtml);
        // 请求构造6
        String tradeInfoUrl =
            "https://gz.cbss.10010.com/custserv?service="
                + "swallow/popupdialog.queryPreOrder.QueryPreOrder/queryTradeInfonum/1";
        Map<String, String> tradeInfoHeader = new HashMap<String, String>();
        tradeInfoHeader.put("Accept",
            "text/javascript, text/html, application/xml, text/xml, */*");
        tradeInfoHeader.put("Accept-Language", "zh-CN");
        tradeInfoHeader.put("x-prototype-version", "1.5.1");
        tradeInfoHeader.put("Referer", referUrl);
        tradeInfoHeader.put("x-requested-with", "XMLHttpRequest");
        tradeInfoHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        tradeInfoHeader.put("Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8");
        tradeInfoHeader.put("Host", "gz.cbss.10010.com");
        tradeInfoHeader.put("Connection", "Keep-Alive");
        tradeInfoHeader.put("Cache-Control", "no-cache");
        tradeInfoHeader.put("Cookie", cookie);
        Map<String, String> tradeInfoParams = new HashMap<String, String>();
        tradeInfoParams.put("COND_USER_ID", custId);
        tradeInfoParams.put("globalPageName", "pub.chkcust.MainChkCust");
        
        vb =
            HttpsTool.post(tradeInfoUrl,
                tradeInfoHeader,
                tradeInfoParams,
                "utf-8");
        /*
         * service=page/personalserv.changeelement.ChangeElement&listener=initMobTrade
         * &RIGHT_CODE=csChangeServiceTrade
         * &LOGIN_RANDOM_CODE=14465352084491089705681
         * &LOGIN_CHECK_CODE=201511037138517672&LOGIN_PROVINCE_CODE=71&
         * IPASS_LOGIN
         * =null&staffId=KXGCFJH2&departId=71b1hyi&subSysCode=BSS&eparchyCode
         * =0712
         */
        // 请求构造7
        String personalServUrl =
            "https://gz.cbss.10010.com/custserv?service=page/personalserv.changeelement.ChangeElement"
                + "&listener=initMobTrade&RIGHT_CODE=csChangeServiceTrade&LOGIN_RANDOM_CODE="
                + loginRandomCode
                + "&LOGIN_CHECK_CODE="
                + loginCheckCode
                + "&LOGIN_PROVINCE_CODE="
                + homePageParamMap.get("provinceId")
                + "&IPASS_LOGIN=null&staffId="
                + homePageParamMap.get("staffId")
                + "&departId="
                + homePageParamMap.get("deptId")
                + "&subSysCode="
                + homePageParamMap.get("subSysCode")
                + "&eparchyCode="
                + homePageParamMap.get("epachyId");
        Map<String, String> personalServHeader = new HashMap<String, String>();
        personalServHeader.put("Accept",
            "text/html, application/xhtml+xml, */*");
        personalServHeader.put("Referer",
            "https://gz.cbss.10010.com/essframe?service=page/Sidebar");
        personalServHeader.put("Accept-Language", "zh-CN");
        personalServHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        personalServHeader.put("Content-Type",
            "application/x-www-form-urlencoded");
        personalServHeader.put("Host", "gz.cbss.10010.com");
        personalServHeader.put("Connection", "Keep-Alive");
        personalServHeader.put("Cache-Control", "no-cache");
        personalServHeader.put("Cookie", cookie);
        vb = HttpsTool.get(personalServUrl, personalServHeader, encoding);
        
        // 请求构造8
        String personalServHtml = vb.getHtml();
        String tradeBase =
            RegexUtils.regexMathes("(?s).*name=\"_tradeBase\"\\s+value=\"(.+?)\"/>.*",
                personalServHtml);
        String queryCustUrl =
            "https://gz.cbss.10010.com/custserv?service=swallow/pub.chkcust.MainChkCust/queryCustAuth/1";
        Map<String, String> queryCustHeader = new HashMap<String, String>();
        
        referUrl = personalServUrl;
        queryCustHeader.put("Accept",
            "text/javascript, text/html, application/xml, text/xml, */*");
        queryCustHeader.put("Accept-Language", "zh-CN");
        queryCustHeader.put("x-prototype-version", "1.5.1");
        queryCustHeader.put("Referer", referUrl);
        queryCustHeader.put("x-requested-with", "XMLHttpRequest");
        queryCustHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        queryCustHeader.put("Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8");
        queryCustHeader.put("Host", "gz.cbss.10010.com");
        queryCustHeader.put("Connection", "Keep-Alive");
        queryCustHeader.put("Cache-Control", "no-cache");
        queryCustHeader.put("Cookie", cookie);
        Map<String, String> queryCustParams = new HashMap<String, String>();
        queryCustParams.put("touchId", "");
        queryCustParams.put("serialNumber", phone);
        queryCustParams.put("netTypeCode", netTypeCode);
        queryCustParams.put("rightCode", "csChangeServiceTrade");
        queryCustParams.put("globalPageName",
            "personalserv.changeelement.ChangeElement");
        vb =
            HttpsTool.post(queryCustUrl,
                queryCustHeader,
                queryCustParams,
                "utf-8");
        
        // 请求构造9
        String custServUrl = "https://gz.cbss.10010.com/custserv";
        Map<String, String> custServHeader = new HashMap<String, String>();
        custServHeader.put("Accept",
            "text/javascript, text/html, application/xml, text/xml, */*");
        custServHeader.put("Accept-Language", "zh-CN");
        custServHeader.put("x-prototype-version", "1.5.1");
        custServHeader.put("Referer", referUrl);
        custServHeader.put("x-requested-with", "XMLHttpRequest");
        custServHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        custServHeader.put("Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8");
        custServHeader.put("Host", "gz.cbss.10010.com");
        custServHeader.put("Connection", "Keep-Alive");
        custServHeader.put("Cache-Control", "no-cache");
        custServHeader.put("Cookie", cookie);
        
        Map<String, String> custServParams = new HashMap<String, String>();
        custServParams.put("service",
            "direct/1/personalserv.changeelement.ChangeElement/$MobTrade.$Form$0");
        custServParams.put("sp", "S0");
        custServParams.put("Form0",
            "ORDER_MGR,RElA_TRADE_ID,ORDER_TYPE,SUPPORT_TAG,COMM_SHARE_NBR_STRING,AC_INFOS,"
                + "FORGIFT_USER_ID,QUERY_ACCOUNT_ID,_rightCode,inModeCode,NET_TYPE_CODE,SERIAL_NUMBER,subQueryTrade");
        custServParams.put("SUPPORT_TAG", "");
        custServParams.put("COMM_SHARE_NBR_STRING", "");
        custServParams.put("AC_INFOS", "");
        custServParams.put("FORGIFT_USER_ID", "");
        custServParams.put("QUERY_ACCOUNT_ID", "");
        custServParams.put("_rightCode", "csChangeServiceTrade");
        custServParams.put("_tradeBase", tradeBase);
        custServParams.put("inModeCode", "1");
        custServParams.put("ORDER_MGR", "");
        custServParams.put("RElA_TRADE_ID", "");
        custServParams.put("ORDER_TYPE", "");
        custServParams.put("NET_TYPE_CODE", netTypeCode);// =&=&=50
        custServParams.put("SERIAL_NUMBER", phone);
        custServParams.put("subQueryTrade", "查询");
        
        vb = HttpsTool.post(custServUrl, custServHeader, custServParams, "GBK");
        
        // 请求构造10
        String userInfoHtml = vb.getHtml();
        String xmlResult = "";
        Pattern xmlPattern =
            Pattern.compile(".*value=\"(.+?)\" id=\"_messageXml\".*",
                Pattern.DOTALL);
        
        Matcher xmlMatcher = xmlPattern.matcher(userInfoHtml);
        if (xmlMatcher.matches())
        {
            try
            {
                xmlResult =
                    HTMLDecoder.decode(java.net.URLDecoder.decode(xmlMatcher.group(1),
                        "utf-8"));
                Pattern p =
                    Pattern.compile(".*message=\"(.+?)\" type=\"error\".*",
                        Pattern.DOTALL);
                Matcher m = p.matcher(xmlResult);
                if (m.matches())
                {
                    xmlResult = HTMLDecoder.decode(m.group(1));
                }
                else
                {
                    xmlResult = "";
                }
                if (xmlResult.indexOf(":") > 0)
                {
                    xmlResult =
                        xmlResult.substring(xmlResult.indexOf(":") + 1,
                            xmlResult.length());
                }
            }
            catch (Exception e)
            {
                
            }
        }
        if (!xmlResult.isEmpty())
        {
            return new OrderResult("1", xmlResult);
        }
        String tradeTypeCode = "";
        Pattern tradeCodePattern =
            Pattern.compile(".*name=\"_TRADE_TYPE_CODE\" value=\"(\\d+)\".*",
                Pattern.DOTALL);
        
        Matcher tradeCodeMatcher = tradeCodePattern.matcher(userInfoHtml);
        if (tradeCodeMatcher.matches())
        {
            tradeTypeCode = tradeCodeMatcher.group(1);
        }
        userInfoHtml = HTMLDecoder.decode(userInfoHtml);
        userInfoHtml = userInfoHtml.replace("&quot;", "\"");
        
        String userSpString = "";
        Pattern userSpPattern =
            Pattern.compile("(?s).*name=\"_all_infos\"\\s+value=\"(.*?)\"/>.*",
                Pattern.DOTALL);
        Matcher userSpMatcher = userSpPattern.matcher(userInfoHtml);
        if (userSpMatcher.matches())
        {
            userSpString = HTMLDecoder.decode(userSpMatcher.group(1).trim());
            userSpString = userSpString.replace("&quot;", "\"");
        }
        JSONObject json = JSONObject.fromObject(userSpString);
        LiWangProduct liWangProduct = new LiWangProduct();
        liWangProduct.setProductId(json.getString("PRODUCT_ID"));
        
        JSONObject productnameJson =
            JSONObject.fromObject(json.getJSONObject("MYUSER_INFO"));
        liWangProduct.setProductName(productnameJson.getString("PRODUCT_NAME"));
        
        LOGGER.info("用户<" + orderInfo.getOrderId() + " " + orderInfo.getPhone()
            + ">有的移网4G套餐产品：" + liWangProduct.getProductName());
        
        tradeBase =
            RegexUtils.regexMathes("(?s).*name=\"_tradeBase\"\\s+value=\"(.+?)\"/>.*",
                userInfoHtml);
        
        // 请求构造11==========查询套餐内的产品名称
        
        // productId=89002148&modifyTag=9&userId=7115050831704135&productMode=00&curProductId=89002148
        // &onlyUserInfos=0&productInvalid=0&tradeTypeCode=120
        String queryProductUrl =
            "https://gz.cbss.10010.com/custserv?service=swallow/common.product.ProductHelper/getPackageByPId/1";
        Map<String, String> queryProductHeader = new HashMap<String, String>();
        queryProductHeader.put("Accept",
            "text/javascript, text/html, application/xml, text/xml, */*");
        queryProductHeader.put("Accept-Language", "zh-CN");
        queryProductHeader.put("x-prototype-version", "1.5.1");
        queryProductHeader.put("Referer", "https://gz.cbss.10010.com/custserv");
        queryProductHeader.put("x-requested-with", "XMLHttpRequest");
        queryProductHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        queryProductHeader.put("Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8");
        queryProductHeader.put("Host", "gz.cbss.10010.com");
        queryProductHeader.put("Connection", "Keep-Alive");
        queryProductHeader.put("Cache-Control", "no-cache");
        queryProductHeader.put("Cookie", cookie);
        
        Map<String, String> queryProductParams = new HashMap<String, String>();
        queryProductParams.put("productId", liWangProduct.getProductId());
        queryProductParams.put("modifyTag", "9");
        queryProductParams.put("userId", userId);
        queryProductParams.put("productMode", "00");
        queryProductParams.put("curProductId", liWangProduct.getProductId());
        queryProductParams.put("onlyUserInfos", "0");
        queryProductParams.put("productInvalid", "0");
        queryProductParams.put("tradeTypeCode", tradeTypeCode);
        vb =
            HttpsTool.post(queryProductUrl,
                queryProductHeader,
                queryProductParams,
                "GBK");
        String liWangProductList = vb.getHtml();
        
        liWangProductList = HTMLDecoder.decode(liWangProductList);
        liWangProductList = liWangProductList.replace("&quot;", "\"");
        
        String os = xmlElements(liWangProductList, "联通秘书");
        if (os.contains("已经订购"))
        {
            LOGGER.info("该用户已经订购该产品: " + orderInfo.getProductName());
            return new OrderResult("1", "该用户已订购该产品");
        }
        else if (os.equals(""))
        {
            LOGGER.info("cbss系统没有该产品: " + orderInfo.getProductName());
            return new OrderResult("1", "cbss系统没有该产品");
        }
        
        // 请求构造12
        String submitUrl =
            "https://gz.cbss.10010.com/custserv?service=swallow"
                + "/personalserv.changeelement.ChangeElement/submitMobTrade/1";
        Map<String, String> submitHeader = new HashMap<String, String>();
        submitHeader.put("Accept",
            "text/javascript, text/html, application/xml, text/xml, */*");
        submitHeader.put("Accept-Language", "zh-CN");
        submitHeader.put("x-prototype-version", "1.5.1");
        submitHeader.put("Referer", "https://gz.cbss.10010.com/custserv");
        submitHeader.put("x-requested-with", "XMLHttpRequest");
        submitHeader.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        submitHeader.put("Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8");
        submitHeader.put("Host", "gz.cbss.10010.com");
        submitHeader.put("Connection", "Keep-Alive");
        submitHeader.put("Cache-Control", "no-cache");
        submitHeader.put("Cookie", cookie);
        Map<String, String> submitParams = new HashMap<String, String>();
        submitParams.put("Base", tradeBase);
        SimpleDateFormat dateFormater =
            new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String time = dateFormater.format(System.currentTimeMillis());
        
        String extHead =
            "{\"Common\": {\"ACTOR_NAME\": \"\", \"ACTOR_PHONE\": \"\", \"ACTOR_CERTTYPEID\": \"\","
                + " \"ACTOR_CERTNUM\": \"\", \"REMARK\": \"\"},";
        
        String extProduct =
            "\"TF_B_TRADE_DISCNT\": {\"ITEM\": [{\"DISCNT_CODE\": \""
                + resourceCode + "\", \"END_DATE\": \"" + "2050-01-01 23:59:59"
                + "\", \"ID\": \"" + userId + "\", \"ID_TYPE\": \"" + "1"
                + "\", \"ITEM_ID\": \"" + "" + "\", \"MODIFY_TAG\": \"" + "0"
                + "\", \"PACKAGE_ID\": \"" + "51003006"
                + "\", \"PRODUCT_ID\": \"" + liWangProduct.getProductId()
                + "\", \"RELATION_TYPE_CODE\": \"" + "" + "\",\"SPEC_TAG\": \""
                + "0" + "\",  \"START_DATE\": \"" + time
                + "\", \"USER_ID_A\": \"-1\", \"X_DATATYPE\": \"null\"}]}, ";
        
        String extOrderedProduct =
            "\"TF_B_TRADE_SVC\": {\"ITEM\": [{\"END_DATE\": \""
                + "2050-12-31 00:00:00"
                + "\",\"ITEM_ID\": \"\", \"MODIFY_TAG\": \"" + "0"
                + "\", \"PACKAGE_ID\": \"" + "51003006"
                + "\", \"PRODUCT_ID\": \"" + liWangProduct.getProductId()
                + "\", \"SERVICE_ID\": \"" + "50200" + "\", \"START_DATE\": \""
                + time + "\", \"USER_ID_A\": \"" + "-1"
                + "\", \"X_DATATYPE\": \"" + "null\"" + "}]},";
        if (userSpString.isEmpty())
        {
            extOrderedProduct = "";
        }
        String extOtherInfo =
            "\"TRADE_SUB_ITEM\": {\"LINK_NAME\": \"\", \"LINK_PHONE\": \"\"}}";
        String extString =
            extHead + extProduct + extOrderedProduct + extOtherInfo;
        submitParams.put("Ext", extString);
        // LOGGER.info("extString: "+extString);
        submitParams.put("globalPageName",
            "personalserv.changeelement.ChangeElement");
        vb = HttpsTool.post(submitUrl, submitHeader, submitParams, "GBK");
        String submitResult = vb.getHtml();
        // LOGGER.info("submitResultHtml: "+submitResult);
        if (submitResult.contains("TradeSubmitFailed"))
        {
            String message =
                RegexUtils.regexMathes(".*message=\"(.+?)\".*", submitResult);
            message = HTMLDecoder.decode(message.replace("&quot;", "\""));
            LOGGER.info(message);
            return new OrderResult("1", message);
        }
        String tradeId = "";
        String subscribeId = "";
        String proviceOrderId = "";
        Pattern resultPattern =
            Pattern.compile("tradeId='(\\d+)'.+subscribeId='(\\d+)'.+proviceOrderId='(\\d+)'",
                Pattern.DOTALL);
        Matcher resultMatcher = resultPattern.matcher(submitResult);
        if (resultMatcher.find())
        {
            tradeId = resultMatcher.group(1).trim();
            subscribeId = resultMatcher.group(2).trim();
            proviceOrderId = resultMatcher.group(3).trim();
        }
        String netTypeCodeAll =
            RegexUtils.regexMathes(".*netTypeCode=\"(\\d+)\".*", submitResult);
        String tradeReceiptInfo =
            RegexUtils.regexMathes(".*tradeReceiptInfo=\"(.+?)\".*",
                submitResult);
        LOGGER.info("tradeId: " + tradeId + " subscribeId: " + subscribeId
            + " proviceOrderId: " + proviceOrderId + " netTypeCodeAll: "
            + netTypeCodeAll + " tradeReceiptInfo: " + tradeReceiptInfo);
        String tradeTypeCodeAll = "";
        Pattern tradeTypeCodeAllPattern =
            Pattern.compile(".*tradeTypeCode=\"(.+?)\".*", Pattern.DOTALL);
        Matcher tradeTypeCodeAllMatcher =
            tradeTypeCodeAllPattern.matcher(submitResult);
        if (tradeTypeCodeAllMatcher.matches())
        {
            tradeTypeCodeAll = tradeTypeCodeAllMatcher.group(1);
        }
        LOGGER.info("tradeTypeCodeAll: " + tradeTypeCodeAll);
        String strisneedprint = "";
        Pattern strisneedprintPattern =
            Pattern.compile(".*strisneedprint=\"(.+?)\".*", Pattern.DOTALL);
        Matcher strisneedprintMatcher =
            strisneedprintPattern.matcher(submitResult);
        if (strisneedprintMatcher.matches())
        {
            strisneedprint = strisneedprintMatcher.group(1);
        }
        LOGGER.info("strisneedprint: " + strisneedprint);
        String continueTradeUrl =
            "https://gz.cbss.10010.com/custserv?service=swallow"
                + "/personalserv.dealtradefee.DealTradeFee/continueTradeReg/1";
        referUrl =
            "https://gz.cbss.10010.com/custserv?service=page/personalserv.dealtradefee.DealTradeFee"
                + "&listener=init&TRADE_TYPE_CODE=tradeType&";
        String param =
            "param={\"SUBSCRIBE_ID\": \"" + subscribeId
                + "\", \"TRADE_ID\": \"" + tradeId
                + "\", \"PROVINCE_ORDER_ID\": \"" + proviceOrderId + "\"}";
        try
        {
            param = java.net.URLEncoder.encode(param, "utf-8");
        }
        catch (Exception e)
        {
            LOGGER.error("订购异常："+e);
        }
        // 请求构造12
        referUrl += param;
        String end =
            "&fee=&noBack=&staffId=" + homePageParamMap.get("staffId")
                + "&departId=" + homePageParamMap.get("deptId")
                + "&subSysCode=custserv&eparchyCode="
                + homePageParamMap.get("epachyId");
        referUrl += end;
        Map<String, String> continueHead = new HashMap<String, String>();
        continueHead.put("Accept",
            "text/javascript, text/html, application/xml, text/xml, */*");
        continueHead.put("Accept-Language", "zh-CN");
        continueHead.put("x-prototype-version", "1.5.1");
        continueHead.put("Referer", referUrl);
        continueHead.put("x-requested-with", "XMLHttpRequest");
        continueHead.put("User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko");
        continueHead.put("Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8");
        // continueHead.put("Accept-Encoding","gzip, deflate");
        continueHead.put("Host", "gz.cbss.10010.com");
        continueHead.put("Connection", "Keep-Alive");
        continueHead.put("Cache-Control", "no-cache");
        continueHead.put("Cookie", cookie);
        Map<String, String> continueParams = new HashMap<String, String>();
        Boolean bool = false;
        Integer i = new Integer(0);
        continueParams.put("cancelTag", bool.toString());
        continueParams.put("funcType", i.toString());
        continueParams.put("dataType", i.toString());
        String tradeMainString =
            "[{\"TRADE_ID\": \"" + tradeId
                + "\", \"TRADE_TYPE\": \"移网产品/服务变更\", \"SERIAL_NUMBER\": \""
                + phone + "\", \"TRADE_FEE\": \"0.00\", \"CUST_NAME\": \""
                + custName + "\", \"CUST_ID\": \"" + custId
                + "\", \"USER_ID\": \"" + userId + "\", \"ACCT_ID\": \""
                + acctId + "\", \"NET_TYPE_CODE\": \"" + netTypeCode
                + "\", \"TRADE_TYPE_CODE\": \"" + tradeTypeCode + "\"}]";
        
        continueParams.put("tradeMain", tradeMainString);
        List<String> list = new ArrayList<String>();
        continueParams.put("fees", list.toString());
        continueParams.put("unChargedfees", list.toString());
        continueParams.put("feePayMoney", list.toString());
        continueParams.put("feeCheck", list.toString());
        continueParams.put("feePos", list.toString());
        String baseString =
            "{\"prepayTag\": \"" + prepayTag + "\", \"tradeTypeCode\": \""
                + tradeTypeCodeAll + "\", \"strisneedprint\": \""
                + strisneedprint + "\", \"serialNumber\": \"" + phone
                + "\", \"tradeReceiptInfo\": \"" + tradeReceiptInfo
                + "\", \"netTypeCode\": \"" + netTypeCodeAll + "\"}";
        continueParams.put("base", baseString);
        continueParams.put("CASH", "0.00");
        continueParams.put("SEND_TYPE", i.toString());
        continueParams.put("TRADE_ID", tradeId);
        continueParams.put("TRADE_ID_MORE_STR", tradeId);
        continueParams.put("SERIAL_NUMBER_STR", phone);
        continueParams.put("TRADE_TYPE_CODE_STR", tradeTypeCode);
        continueParams.put("NET_TYPE_CODE_STR", netTypeCode);
        continueParams.put("DEBUTY_CODE", "");
        continueParams.put("IS_NEED_WRITE_CARD", bool.toString());
        continueParams.put("WRAP_TRADE_TYPE", "tradeType");
        continueParams.put("CUR_TRADE_IDS", "");
        continueParams.put("CUR_TRADE_TYPE_CODES", "");
        continueParams.put("CUR_SERIAL_NUMBERS", "");
        continueParams.put("CUR_NET_TYPE_CODES", "");
        continueParams.put("isAfterFee", "");
        continueParams.put("globalPageName",
            "personalserv.dealtradefee.DealTradeFee");
        vb =
            HttpsTool.post(continueTradeUrl,
                continueHead,
                continueParams,
                "utf-8");
        String continueHtml = vb.getHtml();
        String isNeedOccupy =
            RegexUtils.regexMathes(".*IS_NEED_OCCUPY='(.+?)'.*", continueHtml);
        if ("true".equals(isNeedOccupy))
        {
            LOGGER.info("办理成功！");
            return new OrderResult("0", "成功！");
        }
        else
        {
            LOGGER.info("办理失败");
            return new OrderResult("1", "失败！");
        }
        
    }
    
    /**
     * Description: TODO(XML格式解析)
     * 
     * @Title: xmlElements
     * @author Administrator
     * @param xmlDoc tag
     * @param proname tag
     * @return tag
     * @date: 2015-11-9上午10:57:24
     * @since JDK 1.6
     */
    
    public static String xmlElements(String xmlDoc, String proname)
    {
        // 创建一个新的字符串
        StringReader read = new StringReader(xmlDoc);
        // 创建新的输入源SAX 解析器将使用 InputSource 对象来确定如何读取 XML 输入
        InputSource source = new InputSource(read);
        // 创建一个新的SAXBuilder
        SAXBuilder sb = new SAXBuilder();
        String isOrderProName = "";
        try
        {
            // 通过输入源构造一个Document
            Document doc = sb.build(source);
            // 取的根元素
            Element root = doc.getRootElement().getChild("pkgByPId");
            // 得到根元素所有子元素的集合
            List jiedian = root.getChildren();
            // 获得XML中的命名空间（XML中未定义可不写）
            Namespace ns = root.getNamespace();
            Element et = null;
            for (int i = 0; i < jiedian.size(); i++)
            {
                et = (Element)jiedian.get(i);// 循环依次得到子元素productName
                if (et.getAttributes().size() == 9
                    && et.getAttributeValue("packageName").contains(proname))
                {
                    isOrderProName = "已经订购该产品" + proname;
                    LOGGER.info(isOrderProName);
                    break;
                }
                else
                {
                    if (et.getAttributeValue("packageName").contains(proname))
                    {
                        isOrderProName = "有订购该产品" + proname;
                        LOGGER.info(isOrderProName);
                        break;
                    }
                }
            }
            /*
             * et = (Element) jiedian.get(0); List zjiedian = et.getChildren();
             * for(int j=0;j<zjiedian.size();j++){ Element xet = (Element)
             * zjiedian.get(j); System.out.println(xet.getName()); }
             */
        }
        catch (JDOMException e)
        {
            // TODO 自动生成 catch 块
            e.printStackTrace();
        }
        catch (IOException e)
        {
            // TODO 自动生成 catch 块
            e.printStackTrace();
        }
        return isOrderProName;
    }
}
