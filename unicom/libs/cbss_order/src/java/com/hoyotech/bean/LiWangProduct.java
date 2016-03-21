package com.hoyotech.bean;

public class LiWangProduct
{
    private String  liWangID;
    private String productId;
    private String productName;
    private String packgeId;
    private String serviceId;
    
    public void setLiWangID(String liWangID)
    {
        this.liWangID = liWangID;
    }
    public String getLiWangID()
    {
        return liWangID;
    }
    public void setProductId(String productId)
    {
        this.productId = productId;
    }
    public String getProductId()
    {
        return productId;
    }
    public void setProductName(String productName)
    {
        this.productName = productName;
    }
    public String getProductName()
    {
        return productName;
    }
    public void setPackgeId(String packgeId)
    {
        this.packgeId = packgeId;
    }
    public String getPackgeId()
    {
        return packgeId;
    }
    public void setServiceId(String serviceId)
    {
        this.serviceId = serviceId;
    }
    public String getServiceId()
    {
        return serviceId;
    }
    
    public LiWangProduct() {
        super();
    }
}
