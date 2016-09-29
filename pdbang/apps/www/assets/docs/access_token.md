## 获取access_token

access\_token是全局唯一接口调用凭据，调用各接口时都需使用access_token，开发者需要妥善保存。

access\_token的存储至少要保留512个字符空间。

access\_token的有效期目前为2个小时，需定时刷新，重复获取将导致上次获取的access_token失效。

### access_token的生成方式
第三方使用app_key和app_secret调用接口来获取access_token。app_key和app_secret在开发者创建App时获得（第三方需要成为开发者，且帐号没有异常）。

注意：调用所有接口时均需使用https协议。

### access_token的使用及生成方式

1、为了保密appsecrect，第三方需要一个access_token获取和刷新的中控服务器。而其他业务逻辑服务器所使用的access_token均来自于该中控服务器，不应该各自去刷新，否则会造成access_token覆盖而影响业务；

2、access_token的有效期通过返回的expire_in来传达，目前是7200(秒)。中控服务器需要根据这个有效时间提前去刷新新access_token。在刷新过程中，中控服务器对外输出的依然是老access_token，此时平台会保证在刷新短时间内，新老access_token都可用，以保证第三方业务的平滑过渡；

3、access_token的有效时间可能会在未来有调整，所以中控服务器不仅需要内部定时主动刷新，还需要提供被动刷新access_token的接口，这样便于业务服务器在API调用获知access_token已超时的情况下，可以触发access_token的刷新流程。

注意：如果第三方不使用中控服务器，而是选择各个业务逻辑点各自去刷新access_token，那么就可能会产生冲突，导致服务不稳定。

### 接口说明

`GET /token`

#### 输入参数

`grant_type` *必须* 

填写client_credential

`app_key` *必须* appKey

第三方用户唯一凭证

`app_secret` *必须* appSecret

第三方用户唯一凭证密钥

### 输出响应

`access_token` *必须*

获取到的凭证

`expires_in` *必须*

凭证有效时间(秒)

### 输出响应示例

正常情况下，

`{"access_token":"ACCESS_TOKEN","expires_in":7200}`

错误情况下，

`{"errcode":40401,"errmsg":"app_key 不存在"}`
