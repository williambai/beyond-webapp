## 标准网站应用系统模板

### 安装和初始化
#### Step1: 复制 app, setup, models, config
#### Step2: 运行 npm run setup，安装和初始化mongodb成功
#### Step3: cd app
#### Step4: 替换全部"{产品名称}"为真实名称
#### Step5: 运行 npm run test 测试
#### Step6: 运行 npm run dev 开发 
#### Setp7: 访问 http://localhost:8000

### 模块开发
#### Step1: 复制 app-module-generator 到 app/src/modules 下，并重新命名
#### Step2: 编辑新模块下的文件，并测试通过
#### Step3: 在 app/src 下，新增模块入口文件，参考index.js
#### Step4: 修改gulpfile.js，在js任务中添加新模块的js，参考index.js
#### Step5: 运行 app/gulp build or app/gulp development

