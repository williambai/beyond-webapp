package com.hoyotech.bean;

public class ResourceInfo {
//    <th id="col_RESOURCE_INS_ID">
//    资源账本实例
//</th>
//<th id="col_MONEY">
//    金额(单位:元)
//</th>
//<th id="col_RESOURCE_COUNT">
//    资源量
//</th>
//<th id="col_UNIT">
//    资源单位
//</th>
//<th id="col_RESOURCE_TYPE">
//    资源类型
//</th>
//<th id="col_RECEIVE_TIME">
//    购买到账时间
//</th>
//<th id="col_INVALID_TIME">
//    资源失效时间
//</th>
//<th id="col_DEAL_TAG" style="display:none">
//    处理状态
//</th>
//<th id="col_DEAL_TAG1">
//    处理状态
//</th>
//  资源账本实例
    private String resourceInsId;
//  金额(单位:元)
    private String money;
//  资源量
    private String resourceCount;
//  资源单位
    private String unit;
//  资源类型
    private String resourceType;
//  购买到账时间
    private String receiveTime;
//  资源失效时间
    private String invalidTime;
//  处理状态
    private String dealIntTag;
//  处理状态
    private String dealTag;
    
    public ResourceInfo(){
        super();
    }
    
    public ResourceInfo(String resourceInsId, String money, String resourceCount, String unit,
            String resourceType, String receiveTime, String invalidTime, String dealIntTag, String dealTag) {
        super();
        this.resourceInsId = resourceInsId;
        this.money = money;
        this.resourceCount = resourceCount;
        this.unit = unit;
        this.resourceType = resourceType;
        this.receiveTime = receiveTime;
        this.invalidTime = invalidTime;
        this.dealIntTag = dealIntTag;
        this.dealTag = dealTag;
    }
    public String getResourceInsId() {
        return resourceInsId;
    }
    public void setResourceInsId(String resourceInsId) {
        this.resourceInsId = resourceInsId;
    }
    public String getMoney() {
        return money;
    }
    public void setMoney(String money) {
        this.money = money;
    }
    public String getResourceCount() {
        return resourceCount;
    }
    public void setResourceCount(String resourceCount) {
        this.resourceCount = resourceCount;
    }
    public String getUnit() {
        return unit;
    }
    public void setUnit(String unit) {
        this.unit = unit;
    }
    public String getResourceType() {
        return resourceType;
    }
    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }
    public String getReceiveTime() {
        return receiveTime;
    }
    public void setReceiveTime(String receiveTime) {
        this.receiveTime = receiveTime;
    }
    public String getInvalidTime() {
        return invalidTime;
    }
    public void setInvalidTime(String invalidTime) {
        this.invalidTime = invalidTime;
    }
    public String getDealIntTag() {
        return dealIntTag;
    }
    public void setDealIntTag(String dealIntTag) {
        this.dealIntTag = dealIntTag;
    }
    public String getDealTag() {
        return dealTag;
    }
    public void setDealTag(String dealTag) {
        this.dealTag = dealTag;
    }

    @Override
    public String toString() {
        return "ResourceInfo [" + (resourceInsId != null ? "resourceInsId=" + resourceInsId + ", " : "")
                + (money != null ? "money=" + money + ", " : "")
                + (resourceCount != null ? "resourceCount=" + resourceCount + ", " : "")
                + (unit != null ? "unit=" + unit + ", " : "")
                + (resourceType != null ? "resourceType=" + resourceType + ", " : "")
                + (receiveTime != null ? "receiveTime=" + receiveTime + ", " : "")
                + (invalidTime != null ? "invalidTime=" + invalidTime + ", " : "")
                + (dealIntTag != null ? "dealIntTag=" + dealIntTag + ", " : "")
                + (dealTag != null ? "dealTag=" + dealTag : "") + "]";
    }
    
    
}
