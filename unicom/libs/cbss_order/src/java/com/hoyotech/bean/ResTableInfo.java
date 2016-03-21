package com.hoyotech.bean;

public class ResTableInfo {
    private String xTag;
    private String resourceTag;
    private String packageCode;
    private String resourceCode;
    private String resourceCount;
    private String money;
    private String unit;
    private String validTime;
    private String validTimeUnit;
    private String depositRate;
    private String resourceName;
    
    public ResTableInfo() {
        super();
    }

    public ResTableInfo(String xTag, String resourceTag, String packageCode, String resourceCode,
            String resourceCount, String money, String unit, String validTime, String validTimeUnit,
            String depositRate, String resourceName) {
        super();
        this.xTag = xTag;
        this.resourceTag = resourceTag;
        this.packageCode = packageCode;
        this.resourceCode = resourceCode;
        this.resourceCount = resourceCount;
        this.money = money;
        this.unit = unit;
        this.validTime = validTime;
        this.validTimeUnit = validTimeUnit;
        this.depositRate = depositRate;
        this.resourceName = resourceName;
    }

    public String getxTag() {
        return xTag;
    }

    public void setxTag(String xTag) {
        this.xTag = xTag;
    }

    public String getResourceTag() {
        return resourceTag;
    }

    public void setResourceTag(String resourceTag) {
        this.resourceTag = resourceTag;
    }

    public String getPackageCode() {
        return packageCode;
    }

    public void setPackageCode(String packageCode) {
        this.packageCode = packageCode;
    }

    public String getResourceCode() {
        return resourceCode;
    }

    public void setResourceCode(String resourceCode) {
        this.resourceCode = resourceCode;
    }

    public String getResourceCount() {
        return resourceCount;
    }

    public void setResourceCount(String resourceCount) {
        this.resourceCount = resourceCount;
    }

    public String getMoney() {
        return money;
    }

    public void setMoney(String money) {
        this.money = money;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getValidTime() {
        return validTime;
    }

    public void setValidTime(String validTime) {
        this.validTime = validTime;
    }

    public String getValidTimeUnit() {
        return validTimeUnit;
    }

    public void setValidTimeUnit(String validTimeUnit) {
        this.validTimeUnit = validTimeUnit;
    }

    public String getDepositRate() {
        return depositRate;
    }

    public void setDepositRate(String depositRate) {
        this.depositRate = depositRate;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    @Override
    public String toString() {
        return "ResTableInfo [" + (xTag != null ? "xTag=" + xTag + ", " : "")
                + (resourceTag != null ? "resourceTag=" + resourceTag + ", " : "")
                + (packageCode != null ? "packageCode=" + packageCode + ", " : "")
                + (resourceCode != null ? "resourceCode=" + resourceCode + ", " : "")
                + (resourceCount != null ? "resourceCount=" + resourceCount + ", " : "")
                + (money != null ? "money=" + money + ", " : "")
                + (unit != null ? "unit=" + unit + ", " : "")
                + (validTime != null ? "validTime=" + validTime + ", " : "")
                + (validTimeUnit != null ? "validTimeUnit=" + validTimeUnit + ", " : "")
                + (depositRate != null ? "depositRate=" + depositRate + ", " : "")
                + (resourceName != null ? "resourceName=" + resourceName : "") + "]";
    }
}
