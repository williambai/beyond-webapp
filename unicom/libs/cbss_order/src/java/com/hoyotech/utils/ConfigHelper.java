package com.hoyotech.utils;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

import org.apache.log4j.Logger;


public class ConfigHelper {
    private static ConfigHelper config = null;

    private static final Logger logger = Logger.getLogger(ConfigHelper.class);

    private String driver = "";
    private String tesseractPath = "";
    private String userName = "";
    private String password = "";
    private String accessable = "";
    private String driveUrl ="";
    //是否使用代理 1:是，0:否
    private String useProxy = "";
    private String proxyIp = "";
    private String proxyPort = "";

    public synchronized static ConfigHelper getConfig() {
        if (config == null) {
            config = new ConfigHelper();
        }
        return config;
    }

    private ConfigHelper() {

        Properties prop = new Properties();
        try {
            prop.load(new FileInputStream("./config/config.ini"));
            this.driver = prop.getProperty("jdbc.driverClassName", "");
            this.userName = prop.getProperty("jdbc.username", "");
            this.password = prop.getProperty("jdbc.password", "");
            this.driveUrl  = prop.getProperty("jdbc.url", "");
            
            this.tesseractPath = prop.getProperty("tesseractPath", "");
            this.accessable = prop.getProperty("accessable", "true");
            this.useProxy = prop.getProperty("useProxy","0");
            this.proxyIp = prop.getProperty("proxyIp","");
            this.proxyPort = prop.getProperty("proxyPort","");
        }
        catch (Exception e) {
            logger.error("config.ini error#" + e.toString());
        }
    }


    public String getDriver() {
        return driver;
    }

    public String getAccessable() {
        return accessable;
    }


	public String getTesseractPath() {
        return tesseractPath;
    }

    public String getUseProxy() {
		return useProxy;
	}


	public String getProxyIp() {
		return proxyIp;
	}


	public String getProxyPort() {
		return proxyPort;
	}
	public void setUserName(String userName)
    {
        this.userName = userName;
    }
	public String getUserName()
    {
        return userName;
    }
	public void setPassword(String password)
    {
        this.password = password;
    }
	public String getPassword()
    {
        return password;
    }
	public void setDriveUrl(String driveUrl)
    {
        this.driveUrl = driveUrl;
    }
	public String getDriveUrl()
    {
        return driveUrl;
    }

}
