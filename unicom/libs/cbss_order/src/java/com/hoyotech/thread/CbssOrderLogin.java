package com.hoyotech.thread;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.log4j.Logger;
import com.hoyotech.bean.Account;
import com.hoyotech.bean.VirtualBrowser;
import com.hoyotech.db.DBService;
import com.hoyotech.utils.RegexUtils;

/**
 * Description: TODO(线程登录类)
 * 
 * @ClassName: CbssOrderLogin
 * @date: 2015-11-9 上午10:27:11
 * @author Administrator
 * @since JDK 1.6
 */
public class CbssOrderLogin extends Thread
{
    private static Logger logger = Logger.getLogger(CbssOrderLogin.class);
    
    private static boolean isLoginMark = false;
    
    private static final long  THREADSLEEPMINS = 1500 * 1000L;
    
    private List<Account> accountList;
    
    private CbssOrderController controller;
    
    /**
     * Creates a new instance of CbssOrderLogin.
     * 
     * @param controller tag
     */
    public CbssOrderLogin(CbssOrderController controller)
    {
        this.accountList = controller.list;
        this.controller = controller;
    }
    
   
    
    /**
     * Description: TODO 线程入口函数
     * 
     * @author Administrator
     * @date: 2015-11-9上午10:27:56
     */
    public void run()
    {
        logger.info("cbss登录线程开启！");
        while (true)
        {
            try
            {
                for (Account li : this.accountList)
                {
                    String userName = li.getUserName();
                    String passWord = li.getPassWord();
                    if (userName == null || userName.isEmpty()
                        || passWord == null || passWord.isEmpty())
                    {
                        continue;
                    }
                    boolean iscount = false;
                    li.setLogin(false);
                    while (!li.isLogin)
                    {
                        String homePageMeta = "";
                        VirtualBrowser vb = HttpService.login(li);
                        Map<String, String> cookies = vb.getCookies();
                        String homePageHtml = vb.getHtml();
                        homePageMeta =
                            RegexUtils.regexMathes(".*(<meta.*provinceId.*?>).*",
                                homePageHtml);
                        if (homePageMeta.isEmpty())
                        {
                            logger.error("登录页参数获取失败！");
                            if (!iscount)
                            {
                                String adminPhone =
                                    DBService.getPropertiesChuangfu()
                                        .getProperty("adminPhone");
                                DBService.sendSMS("自动化登录cbss系统失败用户名或者密码错误，请及时处理！",
                                    adminPhone);
                            }
                            iscount = true;
                            continue;
                        }
                        else
                        {
                            li.setLogin(true);
                            li.setCookie(cookies);
                            logger.info("登录页参数获取成功！");
                        }
                        String[] array = homePageMeta.split("\\s+");
                        Map<String, String> homePageParamMap =
                            new HashMap<String, String>();
                        for (String ar : array)
                        {
                            if (ar.contains("="))
                            {
                                ar = ar.replace("'", "").replace("\"", "");
                                String[] arr = ar.split("=");
                                homePageParamMap.put(arr[0], arr[1]);
                            }
                        }
                        li.setMetaInfo(homePageParamMap);
                        System.out.println("homePageMap: "
                            + homePageParamMap.toString());
                    }
                }
                if (!isLoginMark)
                {
                    controller.start();
                    isLoginMark = true;
                }
                Thread.sleep(THREADSLEEPMINS);// 1800
                
            }
            catch (InterruptedException e)
            {
                logger.info("cbss登录线程开启异常：" + e);
            }
        }
        
    }
}
