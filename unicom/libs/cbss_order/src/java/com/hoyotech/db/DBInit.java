package com.hoyotech.db;

import com.hoyotech.utils.ConfigHelper;

public class DBInit {    
	public void init(){
		DBConnectionPool.setDriverClass(ConfigHelper.getConfig().getDriver());
		DBConnectionPool.setDefaultDbname(ConfigHelper.getConfig().getUserName());
	}
}
