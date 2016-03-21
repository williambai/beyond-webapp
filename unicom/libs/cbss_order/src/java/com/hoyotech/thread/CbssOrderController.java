package com.hoyotech.thread;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import org.apache.log4j.PropertyConfigurator;
import com.hoyotech.bean.Account;
import com.hoyotech.bean.OrderInfo;
import com.hoyotech.bean.ProductInfo;
import com.pdbang.DBService;
//import com.hoyotech.db.DBInit;
//import com.hoyotech.db.DBService;

/**
 * Description: 爬虫系统入口类
 * 
 * @ClassName: CbssOrderController
 * @date: 2015-11-9 上午10:03:24
 * @author Administrator
 * @since JDK 1.6
 */
public class CbssOrderController extends Thread
{
    private static final long  THREADSLEEPMINS = 10 * 1000L;
    
    private BlockingQueue<OrderInfo> orderQueue =
        new LinkedBlockingQueue<OrderInfo>();
    
    public List<Account> list = DBService.getAccountInfoList();
    
    private List<ProductInfo> productList = DBService.getProductInfo();
    
    /**
     * Description: 订购线程执行入口
     * 
     * @author Administrator
     * @date: 2015-11-9上午10:06:03
     */
    public void run()
    {
        
        for (int i = 0; i < 1; i++)
        {
            CbssProductOrder spOrder =
                new CbssProductOrder(i, list, productList, orderQueue);
            spOrder.start();
        }
        String id = "0";
        while (true)
        {
            List<OrderInfo> orderList = DBService.getOrderInfo(id);
            if (orderList.size() == 0)
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
            id = orderList.get(orderList.size() - 1).getId();
            try
            {
                for (OrderInfo li : orderList)
                {
                    this.orderQueue.put(li);
                }
            }
            catch (Exception e)
            {
                e.printStackTrace();
            }
        }
    }
    
    /**
     * Description: TODO(程序入口)
     * 
     * @Title: main
     * @author Administrator
     * @param args tag
     * @date: 2015-11-9上午10:06:41
     * @since JDK 1.6
     */
    
    public static void main(String[] args)
    {
        PropertyConfigurator.configure("./config/log4j.properties");
//        DBInit db = new DBInit();
//        db.init();
        CbssOrderLogin orderLogin =
            new CbssOrderLogin(new CbssOrderController());
        orderLogin.start();
    }
}
