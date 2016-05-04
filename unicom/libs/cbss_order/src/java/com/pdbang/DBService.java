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

    private static MongoClient openDB(){
		MongoClientURI connectionString = new MongoClientURI("mongodb://localhost:27017");
		MongoClient mongoClient = new MongoClient(connectionString);
		return mongoClient;
    }

    public static List<Account> getAccountInfoList(){
    	MongoClient mongoClient = null;
    	List<Account> list = new ArrayList<Account>();
    	try{
    		mongoClient = openDB();
			MongoDatabase database = mongoClient.getDatabase("unicom"); 
			 MongoCollection<Document> collection = database.getCollection("cbss.accounts");
			 MongoCursor<Document> cursor = collection.find().iterator();
			 try{
				 while(cursor.hasNext()){
					 Document doc = cursor.next();
					 Account account = new Account(doc.getString("province_id"), doc.getString("username"),doc.getString("password"));
					 if(doc.getString("status") == "有效"){
						 list.add(account);
					 }
				 }			 
			 }finally{
				 cursor.close();
			 }
			 return list;
    	}catch(Exception e){
    		logger.error("MongoDB 连接错误");
    		return list;
    	}
		finally{
    		if(mongoClient != null){
    			mongoClient.close();    			
    		}
    	}
	 }
    /**
     * 初始化4G产品
     * @return
     */
    public static List<ProductInfo> getProductInfo(){
    	MongoClient mongoClient = null;
    	List<ProductInfo> list = new ArrayList<ProductInfo>();
    	try{
    		mongoClient = openDB();
			MongoDatabase database = mongoClient.getDatabase("unicom"); 
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
				mongoClient.close();
	    	}
	    	return list;
    	}catch(Exception e){
    		logger.error("MongoDB 连接错误");
    		return list;
    	}
		finally{
    		if(mongoClient != null){
    			mongoClient.close();    			
    		}
    	}
    }
    
    /**
     * 获取待处理的20个订单
     * @param id
     * @return
     */
    
    public static List<OrderInfo> getOrderInfo(String id){
    	MongoClient mongoClient = null;
    	List<OrderInfo> list = new ArrayList<OrderInfo>();
    	try{
    		mongoClient = openDB();
			MongoDatabase database = mongoClient.getDatabase("unicom"); 
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
				mongoClient.close();
	    	}
			 return list;
    	}catch(Exception e){
    		logger.error("MongoDB 连接错误");
    		return list;
    	}
		finally{
    		if(mongoClient != null){
    			mongoClient.close();    			
    		}
    	}
	 }
    /**
     * 更新订单状态
     * @param id
     * @param orderId 
     * @param orderResult
     * @param orderId
     * @return
     */
	 public static boolean updateOrderStatus(String id,String orderId, OrderResult orderResult){
	    	MongoClient mongoClient = null;
	    	try{
	    		mongoClient = openDB();
				MongoDatabase database = mongoClient.getDatabase("unicom"); 
				 MongoCollection<Document> cbssOrders = database.getCollection("cbss.orders");
				 MongoCollection<Document> orders = database.getCollection("orders");
				 String curDateTime = DateFormatUtils.format(new Date(), "yyyyMMddHHmmss");
				try{
					//** 更新cbss.orders 
					cbssOrders.updateOne(eq("_id",id), 
						 new Document("$set", 
								 new Document("order_status",
										 orderResult.getOrderCode())
						 				.append("err_msg", orderResult.getOrderMessage())
						 				.append("order_status_time", curDateTime)));
					//** 更新orders
					orders.updateOne(eq("_id",orderId), 
						new Document("$set",
								new Document("status", (orderResult.getOrderCode() == "0") ? "成功":"失败")
						)
					);
				}catch(Exception e){
					return false;
				}finally{
					mongoClient.close();			
				}
				return true;
	    	}catch(Exception e){
	    		logger.error("MongoDB 连接错误");
	    		return false;
	    	}
			finally{
	    		if(mongoClient != null){
	    			mongoClient.close();    			
	    		}
	    	}
	 }
	
	//** 订单是否存在
//    public static Object[] check4GOrderRecordId(String recordId,String result){
//    	return null;
//    }
//    public static void updateVmssGoddsResult(String resultFlag,String buyRecordId,String phone,String goodsName){
//    	
//    }

	 //** 系统故障提醒短信
    public static boolean sendSMS(String content){
    	MongoClient mongoClient = null;
    	try{
    		mongoClient = openDB();
			MongoDatabase database = mongoClient.getDatabase("unicom"); 
			 MongoCollection<Document> collection = database.getCollection("platforms.sms");
			 Document smsDoc = new Document();
			 smsDoc.put("sender", "10655836");
			 smsDoc.put("receiver", "15692740700");//** 发送到默认管理员的手机：15692740700
			 smsDoc.put("content", content);
			 smsDoc.put("status", "新建");
			try{
				 collection.insertOne(smsDoc);
			}catch(Exception e){
				return false;
			}finally{
				mongoClient.close();			
			}
			return true;
    	}catch(Exception e){
    		logger.error("MongoDB 连接错误");
    		return false;
    	}
		finally{
    		if(mongoClient != null){
    			mongoClient.close();    			
    		}
    	}  
    }
    /** 
     * Description: 保存调用VMSS接口所得用户订购结果
     * @author ADMIN 
     * @date: 2014-11-13下午04:32:25
     * @param vmssBuyGoodsInfo VmssBuyGoodsInfo    
     */ 
//    public static boolean updateVmssBuyGoodLog(String returnFlag,String orderTime,String describe,String transNo,String buyRecordId){
//    	return false;
//    }
    	
    	
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
