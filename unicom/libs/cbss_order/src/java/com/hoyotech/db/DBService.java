package com.hoyotech.db;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.log4j.Logger;
import com.hoyotech.bean.Account;
import com.hoyotech.bean.OrderInfo;
import com.hoyotech.bean.OrderResult;
import com.hoyotech.bean.ProductInfo;
import com.hoyotech.utils.ConfigHelper;
import com.hoyotech.utils.RoleUtils;

public class DBService {
    private static ConfigHelper configHelper = ConfigHelper.getConfig();
    private  static Logger logger = Logger.getLogger(DBService.class);
    public static Properties CHUANGFUPROPERTIES = null;
    @SuppressWarnings("unchecked")
    public static List<Account> getAccountInfoList(){
        RoleUtils.switchDatabase(configHelper.getUserName());
        String sql = "select province_id,cbssaccount,cbsspasswd from b_city_account ";
        List<Account> list = JDBCHelper.queryBySql(Account.class, 3, sql, null);
        return list;
    }
    @SuppressWarnings("unchecked")
    public static List<OrderInfo> getOrderInfo(String id){
        RoleUtils.switchDatabase(configHelper.getUserName());
        String sql = "select id,phone,product_name,account,password,order_id from cbss_order_info where order_status = '-1' and id > ? limit 20";
        List<OrderInfo> list = JDBCHelper.queryBySql(OrderInfo.class, 6, sql, new Object[]{id});
        return list;
    }
    public static boolean updateOrderStatus(String id,OrderResult orderResult){
        RoleUtils.switchDatabase(configHelper.getUserName());
        String curDateTime = DateFormatUtils.format(new Date(), "yyyyMMddHHmmss");
        String sql = "update cbss_order_info set order_status = ?,err_msg = ?,order_status_time = ? where id = ?";
        boolean result = JDBCHelper.execute(sql, new Object[]{orderResult.getOrderCode(),orderResult.getOrderMessage(),curDateTime,id});
        return result;
    }
    //订单是否存在
    public static Object[] check4GOrderRecordId(String recordId,String result)
    {
        StringBuffer sql =
            new StringBuffer(
                " select * from tm_vmssbuygoods_log t where t.f_buy_record_id='"
                    + recordId + "' ");
        if (!result.equals(""))
        {
            sql.append("  and t.f_return_flag='-1' ");
        }
        return JDBCHelper.queryBySql(sql.toString(),null);
    }
    
    public static void updateVmssGoddsResult(String resultFlag,String buyRecordId,String phone,String goodsName)
    {
        String curDateTime = DateFormatUtils.format(new Date(), "yyyyMMddHHmmss");
        String content = "";
        String describe = "";
        try
        {
            if (resultFlag.contains("成功"))
            {
                resultFlag = "00";
                describe = "自动化开通成功";
                content =
                    "尊敬的用户您好，您订购的" + goodsName
                        + "已成功开通，欢迎使用。";
            }
            else
            {
                resultFlag = "41";
                describe = "自动化开通失败";
                content =
                    "尊敬的用户您好，您的号码目前暂不支持"
                        + goodsName + "的开通，请谅解！";
            }
            updateVmssBuyGoodLog(resultFlag,curDateTime,describe,"",buyRecordId);
            logger.info("产品订购发短信 "+phone +": "+content);
            sendSMS(content,phone);
        }
        catch (Exception e)
        {
            logger.error("更新创富系统订单异常："+e);
        }
    }
    //发错短信
    public static boolean sendSMS(String content, String mobile)
    {
        StringBuffer sql = new StringBuffer();
        sql.append(" insert into sms_mt_swap t (t.id, t.msg_content, t.dest_terminal_id, t.sp_code, t.service_id, t.fee_type, t.fee, t.recive_report, t.msg_format, t.request_time, t.biz_id,t.opt_code,t.priority,t.linkid,t.use_black) ");
        sql.append(" values  (SEQ_SMS_MT_SWAP.NEXTVAL,?,?,'10655357633','FREEHELP','1','0','0','15',to_char(sysdate,'yyyymmddhh24miss'),'ydzd','2','1',null, '0') ");
        
        logger.info(sql.toString()+"参数："+content+"   号码："+mobile);
        Object [] args = new Object[]{content,mobile};
        try 
        {
             return  JDBCHelper.execute(sql.toString(), args);
        } catch (Exception e) {
           logger.error("短信下发异常："+e);
        }
        return false;
    }
    /** 
     * Description: 保存调用VMSS接口所得用户订购结果
     * @author ADMIN 
     * @date: 2014-11-13下午04:32:25
     * @param vmssBuyGoodsInfo VmssBuyGoodsInfo    
     */ 
    public static boolean updateVmssBuyGoodLog(String returnFlag,String orderTime,String describe,String transNo,String buyRecordId)
    {
        StringBuffer sql=new StringBuffer();
        boolean returnResult = false;
        try{
            sql.append(" update tm_vmssbuygoods_log t set t.f_return_flag='"+returnFlag+"',");
            sql.append("  t.f_order_time='"+orderTime+"',t.f_describe='"+describe+"' ");
            if(!"".equals(transNo)){
                sql.append("  ,t.f_trans_no ='"+transNo+"' ");
            }
            sql.append("   where t.f_buy_record_id='"+buyRecordId+"' "); 
            returnResult = JDBCHelper.execute(sql.toString(),null);
        }catch (Exception e) {
            logger.error("更新vmss接口所得用户订购结果异常："+e);
        }
        return  returnResult;
    }
    /**
     * 初始化4G产品
     * @return
     */
    @SuppressWarnings("unchecked")
    public static List<ProductInfo> getProductInfo(){
        RoleUtils.switchDatabase(configHelper.getUserName());
        String sql = "select a.id,a.product_name,a.price,b.cbss_order_code from product_info  a left join product_relation  b on a.id = b.product_id";
        List<ProductInfo> list = JDBCHelper.queryBySql(ProductInfo.class, 4, sql, new Object[]{});
        return list;
    }
    public static boolean addCbssOrderInfo (String orderID,String phone,String productName){
     boolean result = false;
     try
     {
         String curDateTime = DateFormatUtils.format(new Date(), "yyyyMMddHHmmss");
         StringBuffer sqlParm = new StringBuffer();
         sqlParm.append("INSERT INTO CBSS_ORDER_INFO");
         sqlParm.append(" (ID,");
         sqlParm.append(" ORDER_ID,");
         sqlParm.append(" PHONE,");
         sqlParm.append(" PRODUCT_NAME,");
         sqlParm.append(" ACCOUNT,");
         sqlParm.append(" PASSWORD,");
         sqlParm.append(" ORDER_STATUS,");
         sqlParm.append(" ERR_MSG,");
         sqlParm.append(" ORDER_STATUS_TIME,");
         sqlParm.append(" ADD_TIME,AUTO_MARK)");
         sqlParm.append("VALUES");
         sqlParm.append(" (SEQ_CBSS_ORDER_INFO_ID.NEXTVAL, ?,?,?,");
         sqlParm.append(" ?,?,'-1','',?,?,'')");
         String userName = (String)getPropertiesChuangfu().getProperty("cbss.userName");
         String passWord = (String)getPropertiesChuangfu().getProperty("cbss.passWrod");
         Object[] args = new Object[7];
         args[0] = orderID;
         args[1] = phone;
         args[2] = productName;
         args[3] = userName;
         args[4] = passWord;
         args[5] = curDateTime;
         args[6] = curDateTime;
         logger.info("Method:addCbssOrderInfo.sql="+sqlParm.toString()+" 参数："+args.toString());
         result = JDBCHelper.execute(sqlParm.toString(), args);
         return result;
     }
     catch (Exception e)
     {
        logger.error("插入cbss系统的订单数据异常："+e);
     }
     return result;
    }
    
    public static Properties getPropertiesChuangfu()
    {
        if (null == CHUANGFUPROPERTIES)
        {
            initChuanfuProp();
        }
        
        return CHUANGFUPROPERTIES;
    }
    public static void initChuanfuProp()
    {
        if (null == CHUANGFUPROPERTIES)
        {
            CHUANGFUPROPERTIES = new Properties();
        }
        InputStream inputStream = null;
        try
        {
            inputStream = new FileInputStream("./config/chinaunicomchuangfu.properties");
            CHUANGFUPROPERTIES.load(inputStream);
        }
        catch (IOException e)
        {
            logger.error("init properties failed. cause: ", e);
        }
        finally
        {
            if (null != inputStream)
            {
                try
                {
                    inputStream.close();
                }
                catch (IOException e)
                {
                    logger.error("close inputStream failed. cause: ", e);
                }
            }
        }
    }
}

