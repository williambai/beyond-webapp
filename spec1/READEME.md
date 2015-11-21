## 标准网站应用系统模板

### 安装和初始化
#### Step1: 复制 app
#### Step2: 安装 npm install
#### Step3: 替换全部"{产品名称}"为真实名称
#### Step4: 运行 node test/fixtures/mongodb.js创建数据库
#### Step5: 运行 app/gulp
#### Step6: 在app/test/modules下，运行 casperjs user.casper.js 测试
#### 安装和初始化成功

### 模块开发
#### Step1: 复制 app-module-generator 到 app/src/modules 下，并重新命名
#### Step2: 编辑新模块下的文件，并测试通过
#### Step3: 在 app/src 下，新增模块入口文件，参考index.js
#### Step4: 修改gulpfile.js，在js任务中添加新模块的js，参考index.js
#### Step5: 运行 app/gulp build or app/gulp development

