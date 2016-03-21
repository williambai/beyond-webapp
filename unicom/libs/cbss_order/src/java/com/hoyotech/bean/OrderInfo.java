package com.hoyotech.bean;

public class OrderInfo {
//    select id,tag,phone,product_name,account,password from cbss_order_info where order_status = '-1' order by id limit 20
    private String id;
    private String phone;
    private String productName;
    private String account;
    private String password;
    private String orderId;
    
    
    
    public OrderInfo(String id,String phone, String productName, String account, String password,String orderId) {
        super();
        this.id = id;
        this.phone = phone;
        this.productName = productName;
        this.account = account;
        this.password = password;
        this.orderId = orderId;
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        this.productName = productName;
    }
    public String getAccount() {
        return account;
    }
    public void setAccount(String account) {
        this.account = account;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public void setOrderId(String orderId)
    {
        this.orderId = orderId;
    }
    public String getOrderId()
    {
        return orderId;
    }
        
    
}
