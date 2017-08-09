#edaicha

## 目录结构设计
### bin
* node启动文件

### controller

### data
* ajax数据模拟文件
    
### doc
* framework
    * 框架设计说明
* login/regist/index/...
    * 各个页面的说明文件
    
### public 静态资源
* dest // 产出目录
    * js
        * lib // 库文件夹
            * common // 通用模块文件夹
            * page // 页面文件夹
    * css
        * lib // 库文件夹
            * common // 通用模块文件夹
            * page // 页面文件夹
    * img
        * common
        * page 
* src // 开发目录
    * js
        * lib // 库文件夹
            * common // 通用模块文件夹
            * page // 页面文件夹
            * widget // 模块，如果有，最好以页面为单位新建下级目录，方便grunt打包
    * css
        * lib // 库文件夹
        * common // 通用模块文件夹
        * page // 页面文件夹
        * widget // 模块，如果有，最好以页面为单位新建下级目录，方便grunt打包
    * img
        * common
        * page 
        
### routes
* 路由

### views
* demo 
    * 示例文件
* page
    * 页面文件
* widget
    * common
        * 通用模块文件
    * login/regist/index/... // 文件夹
        * 页面模块文件


## 开发
### git管理
* git仓库
    * https://git.oschina.net/bigliang/edaicha.git
* 开发流程
    * git clone https://git.oschina.net/bigliang/edaicha.git
    * npm install
    * grunt
    * npm start
    * 打开浏览器 http://localhost:3000


## 模版数据规范


## ajax接口数据格式规范

```javascript
    {
        status: 1, // 接口返回值状态码
        errMsg: '失败信息', // 接口返回值错误信息，正确则为空
        result: { // 所有的返回值都封装在result对象中
            code: '123456'
        }
    }
```