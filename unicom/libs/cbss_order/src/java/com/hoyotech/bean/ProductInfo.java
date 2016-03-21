package com.hoyotech.bean;

public class ProductInfo {
    private String id;
    private String productName;
    private String price;
    private String resourceCode;
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        this.productName = productName;
    }
    public String getPrice() {
        return price;
    }
    public void setPrice(String price) {
        this.price = price;
    }
    public String getResourceCode() {
        return resourceCode;
    }
    public void setResourceCode(String resourceCode) {
        this.resourceCode = resourceCode;
    }
    public ProductInfo(String id, String productName, String price, String resourceCode) {
        super();
        this.id = id;
        this.productName = productName;
        this.price = price;
        this.resourceCode = resourceCode;
    }
      
    
}
