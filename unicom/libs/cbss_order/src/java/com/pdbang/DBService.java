package com.pdbang;

import static com.mongodb.client.model.Filters.eq;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.log4j.Logger;
import org.bson.Document;

import com.hoyotech.bean.Account;
import com.hoyotech.bean.OrderInfo;
import com.hoyotech.bean.OrderResult;
import com.hoyotech.bean.ProductInfo;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;

public class DBService {
    private  static Logger logger = Logger.getLogger(DBService.class);
	public static MongoDatabase database;
	static{
		MongoClientURI connectionString = new MongoClientURI("mongodb://localhost:27017");
		@SuppressWarnings("resource")
		MongoClient mongoClient = new MongoClient(connectionString);
		database = mongoClient.getDatabase("unicom");		
	}
	 public static List<Account> getAccountInfoList(){
		 List<Account> list = new ArrayList<Account>();
		 MongoCollection<Document> collection = database.getCollection("cbss.accounts");
		 MongoCursor<Document> cursor = collection.find().iterator();
		 try{
			 while(cursor.hasNext()){
				 Document doc = cursor.next();
				 Account account = new Account(doc.getString("province_id"), doc.getString("username"),doc.getString("password"));
				 list.add(account);
			 }			 
		 }finally{
			 cursor.close();
		 }
		 return list;
	 }
    /**
     * 初始化4G产品
     * @return
     */
    public static List<ProductInfo> getProductInfo(){
    	List<ProductInfo> list = new ArrayList<ProductInfo>();
    	MongoCollection<Document> collection = database.getCollection("goods");
    	MongoCursor<Document> cursor = collection.find(eq("category","4G")).iterator();
    	Document doc;
    	try{
    		while(cursor.hasNext()){
    			doc = cursor.next();
    			ProductInfo productInfo = new ProductInfo(
    					String.valueOf(doc.getObjectId("_id")), 
    					doc.getString("name"), 
    					String.valueOf(doc.getInteger("price")), 
    					doc.getString("barcode")
    				);
    			//System.out.println(doc);
    			list.add(productInfo);
    		}
    	}finally{
    		cursor.close();
    	}
    	return list;
    }
    
    /**
     * 获取待处理的20个订单
     * @param id
     * @return
     */
    
    public static List<OrderInfo> getOrderInfo(String id){
		 List<OrderInfo> list = new ArrayList<OrderInfo>();
		 MongoCollection<Document> collection = database.getCollection("cbss.orders");
    	MongoCursor<Document> cursor = collection.find(eq("order_status","-1")).iterator();
    	Document doc;
    	int i= 0;
    	try{
    		while(cursor.hasNext()){
    			doc = cursor.next();
    			OrderInfo orderInfo = new OrderInfo(
    					String.valueOf(doc.getObjectId("_id")), 
    					doc.getString("phone"), 
    					doc.getString("product_name"), 
    					doc.getString("account"),
    					doc.getString("password"),
    					doc.getString("order_id")
    				);
    			if(i>20) break;
    			i++;
    			//System.out.println(doc);
    			list.add(orderInfo);
    		}
    	}finally{
    		cursor.close();
    	}
		 return list;
	 }
    /**
     * 更新订单状态
     * @param id
     * @param orderResult
     * @return
     */
	 public static boolean updateOrderStatus(String id,OrderResult orderResult){
		 MongoCollection<Document> collection = database.getCollection("cbss.orders");
		 String curDateTime = DateFormatUtils.format(new Date(), "yyyyMMddHHmmss");
		try{
			 collection.updateOne(eq("_id",id), 
				 new Document("$set", 
						 new Document("order_status",
								 orderResult.getOrderCode())
				 				.append("err_msg", orderResult.getOrderMessage())
				 				.append("order_status_time", curDateTime)));
		}catch(Exception e){
			return false;
		}
		return true;
	 }
	
	//订单是否存在
    public static Object[] check4GOrderRecordId(String recordId,String result){
    	return null;
    }
    public static void updateVmssGoddsResult(String resultFlag,String buyRecordId,String phone,String goodsName){
    	
    }
    public static boolean sendSMS(String content, String mobile){
    	return false;
    }
    /** 
     * Description: 保存调用VMSS接口所得用户订购结果
     * @author ADMIN 
     * @date: 2014-11-13下午04:32:25
     * @param vmssBuyGoodsInfo VmssBuyGoodsInfo    
     */ 
    public static boolean updateVmssBuyGoodLog(String returnFlag,String orderTime,String describe,String transNo,String buyRecordId){
    	return false;
    }
    	
    	
	/**
	 * test
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		ArrayList<Account> accounts = (ArrayList<Account>) DBService.getAccountInfoList();
		ArrayList<ProductInfo> productInfos = (ArrayList<ProductInfo>) DBService.getProductInfo();
		
	}

}
