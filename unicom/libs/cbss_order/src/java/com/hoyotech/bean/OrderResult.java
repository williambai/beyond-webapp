package com.hoyotech.bean;

public class OrderResult {
    private String orderCode;
    private String orderMessage;
    
    public OrderResult(String orderCode, String orderMessage) {
        super();
        this.orderCode = orderCode;
        this.orderMessage = orderMessage;
    }
    public String getOrderCode() {
        return orderCode;
    }
    public void setOrderCode(String orderCode) {
        this.orderCode = orderCode;
    }
    public String getOrderMessage() {
        return orderMessage;
    }
    public void setOrderMessage(String orderMessage) {
        this.orderMessage = orderMessage;
    }
    
    
}
