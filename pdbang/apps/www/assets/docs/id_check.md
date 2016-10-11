### 身份检验接口

根据用户的身份证信息检验是否一致。

` POST /id_check `

#### 输入参数

`fullname` *必须* 姓名

`pid` *必须* 身份证号码

`gender` *可选* 性别

`address` *可选* 地址

`expired` *可选* 有效期

#### 输出响应


#### 输出响应案例

`{
    "fullname": {
        "input": "张三",
        "result": "一致"
    },
    "pid": {
        "input": "100101190000001212",
        "result": "一致"
    },
    "gender": {
        "input": "男",
        "result": "一致"
    },
    "address": {
        "input": "北京市海淀区学院路38号",
        "result": "一致"
    },
    "expired": {
        "input": "2030年10月",
        "result": "一致"
    }
}`