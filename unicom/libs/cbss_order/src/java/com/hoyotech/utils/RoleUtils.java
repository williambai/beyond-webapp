package com.hoyotech.utils;

import com.hoyotech.db.DBConnectionPool;

public class RoleUtils {
	/**
	 * 切换数据库方法
	 * @param database_name
	 */
	public static void switchDatabase(String database_name){
		if(!DBConnectionPool.getDbName().equals(database_name)){
			DBConnectionPool.setDbName(database_name);
		}
	}
}
