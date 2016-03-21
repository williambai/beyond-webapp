package com.hoyotech.bean;

public class SpProduct {
    private String spProductId;
    private String spId;
    private String partyId;
    private String firstBuyTime;
    private String spServiceId;
    private String paySerialNumber;
    private String spProductName;
    private String priceDescribe;
    private String startDate;
    private String endDate;
    private String itemId;
    private String isBookedCancelSp;
    
    
    public SpProduct() {
        super();
    }
    public SpProduct(String spProductId, String spId, String partyId, String firstBuyTime,
            String spServiceId, String paySerialNumber, String startDate, String endDate,
            String spProductName, String priceDescribe) {
        super();
        this.spProductId = spProductId;
        this.spId = spId;
        this.partyId = partyId;
        this.firstBuyTime = firstBuyTime;
        this.spServiceId = spServiceId;
        this.paySerialNumber = paySerialNumber;
        this.startDate = startDate;
        this.endDate = endDate;
        this.spProductName = spProductName;
        this.priceDescribe = priceDescribe;
    }
    public SpProduct(String spProductId, String spId, String partyId, String firstBuyTime,
            String spServiceId, String paySerialNumber, String spProductName, String priceDescribe,
            String startDate, String endDate, String itemId, String isBookedCancelSp) {
        super();
        this.spProductId = spProductId;
        this.spId = spId;
        this.partyId = partyId;
        this.firstBuyTime = firstBuyTime;
        this.spServiceId = spServiceId;
        this.paySerialNumber = paySerialNumber;
        this.spProductName = spProductName;
        this.priceDescribe = priceDescribe;
        this.startDate = startDate;
        this.endDate = endDate;
        this.itemId = itemId;
        this.isBookedCancelSp = isBookedCancelSp;
    }
    public String getSpProductId() {
        return spProductId;
    }
    public void setSpProductId(String spProductId) {
        this.spProductId = spProductId;
    }
    public String getSpId() {
        return spId;
    }
    public void setSpId(String spId) {
        this.spId = spId;
    }
    public String getPartyId() {
        return partyId;
    }
    public void setPartyId(String partyId) {
        this.partyId = partyId;
    }
    public String getFirstBuyTime() {
        return firstBuyTime;
    }
    public void setFirstBuyTime(String firstBuyTime) {
        this.firstBuyTime = firstBuyTime;
    }
    public String getSpServiceId() {
        return spServiceId;
    }
    public void setSpServiceId(String spServiceId) {
        this.spServiceId = spServiceId;
    }
    public String getPaySerialNumber() {
        return paySerialNumber;
    }
    public void setPaySerialNumber(String paySerialNumber) {
        this.paySerialNumber = paySerialNumber;
    }
    public String getSpProductName() {
        return spProductName;
    }
    public void setSpProductName(String spProductName) {
        this.spProductName = spProductName;
    }
    public String getPriceDescribe() {
        return priceDescribe;
    }
    public void setPriceDescribe(String priceDescribe) {
        this.priceDescribe = priceDescribe;
    }
    public String getStartDate() {
        return startDate;
    }
    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }
    public String getEndDate() {
        return endDate;
    }
    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
    public String getItemId() {
        return itemId;
    }
    public void setItemId(String itemId) {
        this.itemId = itemId;
    }
    public String getIsBookedCancelSp() {
        return isBookedCancelSp;
    }
    public void setIsBookedCancelSp(String isBookedCancelSp) {
        this.isBookedCancelSp = isBookedCancelSp;
    }
    @Override
    public String toString() {
        return "SpProduct [" + (spProductId != null ? "spProductId=" + spProductId + ", " : "")
                + (spId != null ? "spId=" + spId + ", " : "")
                + (partyId != null ? "partyId=" + partyId + ", " : "")
                + (firstBuyTime != null ? "firstBuyTime=" + firstBuyTime + ", " : "")
                + (spServiceId != null ? "spServiceId=" + spServiceId + ", " : "")
                + (paySerialNumber != null ? "paySerialNumber=" + paySerialNumber + ", " : "")
                + (spProductName != null ? "spProductName=" + spProductName + ", " : "")
                + (priceDescribe != null ? "priceDescribe=" + priceDescribe + ", " : "")
                + (startDate != null ? "startDate=" + startDate + ", " : "")
                + (endDate != null ? "endDate=" + endDate + ", " : "")
                + (itemId != null ? "itemId=" + itemId + ", " : "")
                + (isBookedCancelSp != null ? "isBookedCancelSp=" + isBookedCancelSp : "") + "]";
    }
    
    
}
