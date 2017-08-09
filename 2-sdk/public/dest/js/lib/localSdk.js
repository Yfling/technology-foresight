window.Xhrfactory = function() {
    this.init.apply(this, arguments);
};

window.Xhrfactory.prototype = {
    init: function() {
        this.xhr = this.create();
    },
    create: function() {
        var xhr = null;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXobject) {
            xhr = new ActiveXobject('Msml2.Xmlhttp');
        } else {
            xhr = new ActiveXobject('Microsoft.Xmlhttp');
        }
        return xhr;
    },
    readystate: function(callback) {
        this.xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                callback(this.responseText);
                console.log(this);
            }
        }
    },
    para: function(data) {
        var datastr = '';
        if (data && Object.prototype.toString.call(data) === "[object object]") {
            for (var i in data) {
                for (var i = 0; i < lenght; i++) {
                    datastr += i + '='
                    data[i] + '&';
                }
            }
        }
    },

    get: function(url, data, callback) {

        this.readystate(callback);
        var newurl = url;
        var datastr = this.para(data);
        newurl = url + '?' + datastr;
        this.xhr.open('get', newurl, true);
        this.xhr.send(null);

    }
};

// 后台程序的模板变量
var localStorageSign = 'on';
// 版本控制
var resourceVersion = '12312443243202';

// 本地的Sdk主方法
window.mLocalSdk = {
    
    resourceJavascriptList: [{
        id: '1232131241',
        url: '/dest/js/lib/core.js',
        type: 'javascript'
    }, {
        id: '1232131242',
        url: '/dest/js/lib/log.js',
        type: 'javascript'
    }, {
        id: '1232131243',
        url: '/dest/js/lib/report.js',
        type: 'javascript'
    }],

    needUpdate: (function() {
        return localStorage.getItem('resourceVersion') === resourceVersion;
    })(),

    
    isIE: (function() {
            var v = 3;
            var div = document.createElement('div');
            var all = div.getElementsByTagName('i');
            while (
                div.innerHTML = '<!-- [if gt IE' + (++v) + ']><i></i><![endif] -->', !all[0])
                 { 
                    if(v > 11){return false}
                }
            return v > 3 ? v : false;
        })(),


    checkHedge: function() {
        var localStorageLength = localStorage.length;
        var localStorageSize = 0;
        for (var i = 0; i < localStorageLength; i++) {
            var key = localStorage.key(i);
            localStorageSize += localStorage.getItem(key).length;
        }
        return localStorageSize;
    },
    saveSdk: function() {
        try {
            localStorage.setItem('resourceVersion', resourceVersion);
        } catch (oException) {
            if (oException.name == 'QuotaExceededError') {
                localStorage.clear();
                localStorage.setItem('resourceVersion', resourceVersion);
            }
            alert('QuotaExceededError');
        }

        for (var i = 0; i < this.resourceJavascriptList.length; i++) {
            _self = this;
            (function(i){
                var scriptId = _self.resourceJavascriptList[i]['id'];
                var xhr = new Xhrfactory();
                xhr.get(_self.resourceJavascriptList[i]['url'], null, function(data) {
                    try {
                        localStorage.setItem(scriptId, data);
                    } catch (oException) {
                        console.log('oException',oException);
                        if (oException.name == 'QuotaExceededError') {
                            localStorage.clear();
                            localStorage.setItem(scriptId, data);
                        }
                    }
                });
            })(i);
            // XXX addhtml 加载到页面
        }
    },

    startup: function() {
        // 满足一下条件
        var _self = this;
        if (localStorageSign === 'on' && !this.isIE && window.localStorage) {

            if (this.needUpdate === true) {
                //不需要更新
                return (function() {
                    
                    for (var i = 0; i < _self.resourceJavascriptList.length; i++) {
                        // 获取本地缓存列表 输入到html上
                        var scriptId = _self.resourceJavascriptList[i]['id'];
                        // 把我们的列表中的js文件 渲染到页面

                        // 去读取本地文件
                        window.mDomUtils.addJavascriptByInline(scriptId);
                    }
                })();
                
            } else {
                // 保存我们请求到的js文件
                return (function() {
                    _self.saveSdk();
                    for (var i = 0; i < _self.resourceJavascriptList.length; i++) {
                        // 获取本地缓存列表 输入到html上
                        var scriptId = _self.resourceJavascriptList[i]['id'];
                        // 把我们的 列表中的js文件 渲染到页面

                        // 去读取本地文件
                        window.mDomUtils.addJavascriptByInline(scriptId);
                    }
                })();


                //***
                // 把从网络获取到的javascript 输入到html上；
                // save localstroage
            }
        } else {
       
            return function() {
                alert(2);
                    for (var i = 0; i < resourceJavascriptList.length; i++) {
                        // 获取本地缓存列表 输入到html上
                        var scriptId = resourceJavascriptList[i]['scriptId'];
                        // 把我们的列表中的js文件 渲染到页面

                        // 读取网络上得到的资源
                        window.mDomUtils.addJavascriptByLink(scriptId, resourceJavascriptList[i]['url']);
                    }
                }
                //***
                // 把从网络获取到的javascript 输入到html上；
                // 原始方法加载javascriopt
        }

    }
    // 写入本地localstorage

    
};

window.mDomUtils = {
    // 内联方式添加javascript
    addJavascriptByInline: function(scriptId) {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.id = scriptId;
        var heads = document.getElementsByTagName('head');
        if (heads.lenght) {
            heads[0].appendChild(script);
        } else {
            document.documentElement.appendChild(script);
        }
        script.innerHTML = localStorage.getItem(scriptId);
    },


    // 外链方式添加javascript
    addJavascriptByLink: function(scriptId, url) {
        var script = document.createElemet('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', url);
        script.id = scriptId;
        var heads = document.getElementsByTagName('head');
        if (heads.length) {
            heads[0].appendChild(script);
        } else {
            document.documentElement.appendChild(script);
        }
    },


    // 外链方式添加css

    addCssByLink: function(url) {
        var doc = document;
        var link = doc.createElemet('link');
        link.setAttribute('type', 'text/css');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', url);
        var heads = doc.getElementsByTagName('head');
        if (heads.length) {
            heads[0].appendChild(link);
        } else {
            doc.documentElement.appendChild(link);
        }
    },

    // 外链方式添加css

        addCssByLink: function(cssString) {
        var doc = document;
        var link = doc.createElemet('link');
        link.setAttribute('type', 'text/css');
        link.setAttribute('rel', 'stylesheet');

        if (link.stylesheet) {
            // IE支持
            link.stylesheet.cssText = cssString;
        } else {
            // w3c
            var cssText = doc.createTextNode(cssString);
            link.appendChild(cssText);
        }

        var heads = doc.getElementsByTagName('head');
        if (heads.length) {
            heads[0].appendChild(link);
        } else {
            doc.documentElement.appendChild(link);
        }
    }
};