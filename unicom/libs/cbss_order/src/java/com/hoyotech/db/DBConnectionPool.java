package com.hoyotech.db;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hoyotech.utils.ConfigHelper;
import com.jolbox.bonecp.BoneCP;
import com.jolbox.bonecp.BoneCPConfig;
import com.jolbox.bonecp.Statistics;

/**
 * 数据库连接池BoneCP的封装使用 主要是实现数据库连接的配置信息（驱动类、JDBC URL、用户名和密码）独立设置 ,<br />
 * 采用单例模式，保证系统中只有一个数据库连接池。
 * 
 */
public class DBConnectionPool {

	private static final Logger log = LoggerFactory.getLogger(DBConnectionPool.class);
	
	private static ConfigHelper configHelper = ConfigHelper.getConfig();

	/** 连接池map，存放多个数据库连接池 */
	private Map<String, BoneCP> poolsMap = new HashMap<String, BoneCP>();

	/**
	 * 唯一实例
	 */
	private static final DBConnectionPool pool = new DBConnectionPool();
	
	/**
	 * 当前线程使用的数据库名称
	 */
	private static final ThreadLocal<String> currentDbname = new ThreadLocal<String>();	
	
	private static final ThreadLocal<Connection> transConn = new ThreadLocal<Connection>();
	
	//全局变量，默认使用的数据库名
	private static String defaultDbname = null;

//	static{
//		DBConnectionPool.setDriverClass(ConfigHelper.getConfig().getDriver());
//		DBConnectionPool.setDefaultDbname(ConfigHelper.getConfig().getDbName());
//	}
	
	//注册数据库驱动
	public static void setDriverClass(String className){
		// 注册数据库驱动程序
		try {
			Class.forName(className);
		} catch (Exception e) {
			log.error("error occured when register database driver.", e);
		}
	}
	
	
	//判断该线程是否开启了事务
	public static boolean  isTransacionStart(){
		
		Connection conn = transConn.get();
		
		if(conn != null)
			return true;
		
		return false;
		
	}

	//返回线程绑定的连接
	public  Connection getTransConn(){
		
		return transConn.get();
	}
	
	//开启本线程的事务，将一个conn绑定到本线程。
	public static boolean startTransaction(){
		
			//如果该线程已经绑定了连接，则可能是前面的conn的事务没有提交或回滚，则
			//先将连接的未提交事务回滚，然后将连接返回给连接池,并删除对该连接的引用。
			//然后申请新的连接。
			if(isTransacionStart()){

				try{
					transConn.get().rollback();
				}catch(Exception e){
					e.printStackTrace();
				}

				try{
					transConn.get().close();
				}catch(Exception e){
					e.printStackTrace();
				}
				
				transConn.remove();
			}

		//获取新的连接绑定到线程上
		try {
			Connection conn = DBConnectionPool.getInstance().getConnection();
			conn.setAutoCommit(false);
			transConn.set(conn);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
		return true;
		
	}
	
	//提交本线程事务，并取消本线程的conn绑定
	public static boolean transCommit(){
		
		Connection conn = null;
		try {
			//获取私有连接
			conn = transConn.get();
			if(conn!=null)
				conn.commit();
			else
				return false;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}finally{
			if(conn!=null){
				try {
					//提交完成后将连接返回给连接池
					conn.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			//提交完成后必须释放私有连接
			transConn.remove();
		}
		
		return true;
	}
	

	//回滚本线程的事务，并取消本线程的绑定
	public static boolean transRollback(){
		
		Connection conn = null;
		
		try {
			//获取私有连接
			conn = transConn.get();
			if(conn!=null)
				conn.rollback();
			else
				return false;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}finally{
			if(conn!=null){
				try {
					//回滚完成后将连接返回给连接池
					conn.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			//回滚完成后必须释放私有连接
			transConn.remove();
		}
		
		return true;
	}
	
	//获取默认数据库名
	public static String getDefaultDbname() {
		return defaultDbname;
	}

	//设置默认数据库名
	public static void setDefaultDbname(String name) {
		defaultDbname = name;
	}
	
	public static DBConnectionPool getInstance() {
		return pool;
	}

	/**
	 * 设置或切换当前线程使用的数据库
	 * @param dbname 需要切换的数据库名
	 */
	public static void setDbName(String dbname){
		
		currentDbname.set(dbname);
	}
	
	/**
	 * 获取当前线程使用的数据库名
	 * @return 数据库名，如果当前线程没有设置数据库，则返回默认的数据库
	 */
	public static String getDbName(){
	
		String result = currentDbname.get();
		//如果当前没有设置数据库名，则设置为默认数据库
		if(result==null){
			currentDbname.set(defaultDbname);
			return currentDbname.get();
		}

		return result;
	}
	
	/**
	 * 删除当前线程使用的数据库名.
	 */
	public static void removeDbName(){
		
		currentDbname.remove();
	}
	
	/**
	 * 私有构造器
	 */
	private DBConnectionPool() {
		
	}
	
	/**
	 * 关闭所有的连接池
	 */
	public synchronized void closeAllPool(){
		for(BoneCP pool: poolsMap.values()){
			if (pool != null) {
				pool.close();
				pool = null;
			} 
		}
	}
	
	/**
	 * 关闭指定连接池
	 * @param poolName
	 */
	public synchronized void closePool(String configName) {
		BoneCP pool = poolsMap.get(configName);
		if (pool == null) {
			log.error("target pool is not avaliable : " + configName);
		} else {
			pool.close();
			pool = null;
		}
	}
	
	/**
	 * 从连接池里获取连接
	 * @return
	 * @throws Exception 
	 */
	public synchronized Connection  getConnection() throws Exception {

		String configName = getDbName();
		//如果没有设置数据库名，也没有设置默认数据库
		if(configName == null)
			return null;
		
		BoneCP pool = poolsMap.get(configName);
//		if (pool == null) {
//			// 尚未初始化该连接池，完成初始化工作。
//			log.info("this pool is not avaliable, initialize now : " + configName);
//			pool = new BoneCP(new BoneCPConfig(configName));
//			poolsMap.put(configName, pool);
//		}
		
		
          //设置配置参数
          //connectionPool = new BoneCP(config); // setup the connection pool
          //connection = connectionPool.getConnection(); // fetch a connection
          
          if (pool == null) {
              BoneCPConfig config = new BoneCPConfig();
              config.setJdbcUrl(configHelper.getDriveUrl()); // jdbc url specific to your database, eg jdbc:mysql://127.0.0.1/yourdb
              log.debug(configHelper.getDriveUrl());
              config.setUsername(configHelper.getUserName()); 
              config.setPassword(configHelper.getPassword());
              //设置每60秒检查数据库中的空闲连接数
              config.setIdleConnectionTestPeriodInMinutes(60);
              //设置连接空闲时间
              config.setIdleMaxAgeInMinutes(240);
              //设置每个分区中的最大连接数 30
              config.setMaxConnectionsPerPartition(30);
              //设置每个分区中的最小连接数 10
              config.setMinConnectionsPerPartition(10);
              //当连接池中的连接耗尽的时候 BoneCP一次同时获取的连接数
              config.setAcquireIncrement(5);
              //连接释放处理
              config.setReleaseHelperThreads(3);
              //设置分区  分区数为3
              config.setPartitionCount(3);
              // 尚未初始化该连接池，完成初始化工作。
              log.info("this pool is not avaliable, initialize now : " + configName);
              pool = new BoneCP(config);
              poolsMap.put(configName, pool);
          }
          
//		System.out.println("Class"+Thread.currentThread().getClass());
//		System.out.println("Name"+Thread.currentThread().getName());
	
		return pool.getConnection();
	}
	
	
	public int getFreeConnection(){
		
		String configName = getDbName();
		//如果没有设置数据库名，也没有设置默认数据库
		if(configName == null)
			return -1;
		BoneCP pool = poolsMap.get(configName);
		return pool.getTotalFree();
		
	}
	
	
	public int getReleaseConnection(){
		
		String configName = getDbName();
		//如果没有设置数据库名，也没有设置默认数据库
		if(configName == null)
			return -1;
		BoneCP pool = poolsMap.get(configName);
		return pool.getTotalLeased();
		
	}
	
	
	public int getCreatedConnection(){
		
		String configName = getDbName();
		//如果没有设置数据库名，也没有设置默认数据库
		if(configName == null)
			return -1;
		BoneCP pool = poolsMap.get(configName);
		return pool.getTotalCreatedConnections();
		
	}
	
	/**
	 * 打印指定连接池的连接状态
	 * @param poolName
	 */
	public void printPoolStatus(String configName) {
		BoneCP pool = poolsMap.get(configName);
		if (pool == null) {
			log.error("target pool is not avaliable : " + configName);
		} else {
			Statistics stat = pool.getStatistics();
			log.info("configName：" + configName + ", connections: free / total = "
					+ stat.getTotalFree() + " / "
					+ stat.getTotalCreatedConnections());
		}
	}
	
}
