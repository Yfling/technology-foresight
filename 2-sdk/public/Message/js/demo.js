/**
 *页内通讯类
 *@Class:ChangeFeeling
 *观察者模式实现——底部状态栏内容根据左侧点击的按钮进行响应
 *模式中，底部状态栏为订阅者，左侧按钮为发布者
 *
 *
 *页内通讯 原型方法
 *@method:registerObserve 订阅者feeling加入发布者的订阅列表中
 *@param:feeling 订阅者实例对象
 * 
 *@method:notifyObserve 遍历发布者的订阅列表，对每个订阅者执行
 *@param:feeling 订阅者实例对象
 *
 **/
var ChangeFeeling = function() {
    this.feeling = [];
};

ChangeFeeling.prototype = {
    registerObserve: function(feeling) {
        this.feeling.push(feeling);
    },
    notifyObserve: function(feeling) {
        for (var i = 0, len = this.feeling.length; i < len; i++) {
            this.feeling[i].update();
        }
    }
};
/**
 *底部状态类
 *@Class FeelingGood/FeelingBoring/FeelingAngry
 *@param:changerBtn 传入发布者实例，并将调用它的订阅者(按钮)传入发布者订阅列表
 *三个按钮类的功能基本一致，核心在于其update方法有不同的状态响应
 *
 *
 *底部状态 原型方法
 *@method:update 显示底部状态，并更新内容与图片。具体根据不同按钮，内容不同
 *
 **/
var FeelingGood = function(changerBtn) {
    this.changerBtn = changerBtn;
    this.changerBtn.registerObserve(this);
    this.feelingBox = document.querySelector(".feeling-today");
    this.imgBox = document.querySelectorAll('.feeling-today ul li');
    this.feeling = document.querySelector('.feeling-today h2');
};

FeelingGood.prototype.update = function() {
    this.feelingBox.style.visibility = "visible";
    this.feelingBox.style.opacity = "1";
    this.feelingBox.style.filter="alpha(opacity=100)";
    this.feeling.innerHTML = "心情好的话，就要努力工作哦。";
    for (var i = 0, len = this.imgBox.length; i < len; i++) {
        this.imgBox[i].firstChild.src = "images/good.png";
    }
};
var FeelingBoring = function(changerBtn) {
    this.changerBtn = changerBtn;
    this.changerBtn.registerObserve(this);
    this.feelingBox = document.querySelector(".feeling-today");
    this.imgBox = document.querySelectorAll('.feeling-today ul li');
    this.feeling = document.querySelector('.feeling-today h2');
};

FeelingBoring.prototype.update = function() {
    this.feelingBox.style.visibility = "visible";
    this.feelingBox.style.opacity = "1";
    this.feelingBox.style.filter="alpha(opacity=100)";
    this.feeling.innerHTML = "世界太和平了，都不需要码农来拯救了。";
    for (var i = 0, len = this.imgBox.length; i < len; i++) {
        this.imgBox[i].firstChild.src = "images/boring.png";
    }
};
var FeelingAngry = function(changerBtn) {
    this.changerBtn = changerBtn;
    this.changerBtn.registerObserve(this);
    this.feelingBox = document.querySelector(".feeling-today");
    this.imgBox = document.querySelectorAll('.feeling-today ul li');
    this.feeling = document.querySelector('.feeling-today h2');
};

FeelingAngry.prototype.update = function() {

    this.feelingBox.style.visibility = "visible";
    this.feelingBox.style.opacity = "1";
    this.feelingBox.style.filter="alpha(opacity=100)";
    this.feeling.innerHTML = "那个傻逼产品怎么还不被车撞啊。";
    for (var i = 0, len = this.imgBox.length; i < len; i++) {
        this.imgBox[i].firstChild.src = "images/angry.png";
    }
};

/**
 *Iframe与登录窗口交互类
 *@Class WindowMessage
 *核心原理在于postMessage Api与onmessage事件的响应
 *窗口中填写内容提交后，结果将会由父页面接收并更新父页面内容
 *
 **/
var WindowMessage = function() {

    this.btnLogin = document.querySelector('.btn-login a');
    this.message = '';
    this.loginWindow;
    this.window = window;

    this.tasksWindow = this.window.frames[0];

    this.iframeToParent();

    this.getMsgFromLoginWindow();

    this.window.onmessage = function(e) {
        var titleMsg = document.querySelector("header h2");
        if (e.data === "login") {
            titleMsg.innerHTML = "您已登录！欢迎使用任务管理系统（Demo版本），祝您工作愉快！";
        }
    };
    this.changeWindowStyle();
};

/**
 *Iframe/子窗体交互 原型方法
 *@Method:submitTask Iframe填写的数据。
 *子窗口window对象的引用已通过this.window.frames[0]取得。
 *
 *@Method:iframeToParent 点击后获取填写的数据，并根据数据的完整程度判断是否提交给父窗口的变量。
 *父窗口接受数据后，开始对数据的处理。
 *
 *@Method:getTasksFromIframe 对子窗口提交的数据进行处理，并打印到页面上。
 *
 *@Method:tasksReset 点击后重置任务信息。
 *
 *@Method:getMsgFromLoginWindow 点击按钮打开登录窗口，同时将该窗口的引用保存在属性this.loginWindow中，随时可调用。
 *为了确保this.loginWindow的值不会是一个未声明的空窗口，此处等待登录窗口加载完毕后再执行下一步方法函数。
 *
 *@Method:windowToParent 通过上一步保存的登录窗口的引用，对登录窗口进行操作，满足登录条件后窗口关闭，并提交数据给父窗口
 *该过程调用PostMessage Api进行数据传输。
 *
 *@Method:changeWindowStyle 改变子页配色主题。将打开的每个窗口的引用保存在一个数组中。
 *根据当前主题的状态————即this.style的布尔值来判断使用哪一种配色。
 *
 *@Method:changeStyleAlone 在子页中点击改变配色。点击任何一个子页的按钮，所有子页的配色随之改变。
 *
 *@Method:changeStyle 遍历所有子页，通过this.style的取值判断使用哪种配色。
 *@param:pages 数组，保存所有打开的子页window对象的引用。
 */
WindowMessage.prototype = {

    submitTasks: function() {
        var taskMessage = [];
        var oInput = this.tasksWindow.document.querySelectorAll('input');
        for (var i = 0, len = oInput.length; i < len; i++) {
            taskMessage.push(oInput[i].value);
        }
        return taskMessage;
    },

    iframeToParent: function() {
        var subBtn = this.tasksWindow.document.querySelector('#submit');
        var rstBtn = this.tasksWindow.document.querySelector('#reset');
        var tip = this.tasksWindow.document.querySelector('#tip');
        var that = this;

        subBtn.onclick = function() {
            that.message = that.submitTasks();
            for (var i = 0, len = that.message.length; i < len; i++) {
                if (that.message[i].length === 0) {
                    tip.style.display = "block";
                    return;
                } else {
                    tip.style.display = "none";
                }
            }
            that.getTasksFromIframe();
        };
        rstBtn.onclick = function() {
            that.tasksReset();
        };
    },

    getTasksFromIframe: function() {
        var resultNone = document.querySelector('.result h2');
        var resultShow = document.querySelector('.result-show');
        resultNone.style.display = 'none';
        resultShow.style.display = 'inline-block';
        resultShow.childNodes[1].innerHTML = "您今天的任务是：" + this.message[0];
        resultShow.childNodes[3].innerHTML = "预计完成时间：" + this.message[1];
        resultShow.childNodes[5].innerHTML = "合作人员：" + this.message[2];
    },
    tasksReset: function() {
        var resultNone = document.querySelector('.result h2');
        var resultShow = document.querySelector('.result-show');
        var oInput = this.tasksWindow.document.querySelectorAll('input');
        resultNone.style.display = 'block';
        resultShow.style.display = 'none';

        resultShow.childNodes[1].innerHTML = "";
        resultShow.childNodes[3].innerHTML = "";
        resultShow.childNodes[5].innerHTML = "";

        for (var i = 0, len = oInput.length; i < len; i++) {
            oInput[i].value = '';
        }
    },


    getMsgFromLoginWindow: function() {
        var that = this;
        this.btnLogin.onclick = function() {
            that.loginWindow = window.open('templates/login.html', 'loginWindow', 'width=400,height=400,status=yes,resizable=yes');
            that.loginWindow.onload = function() {
                that.windowToParent();
            };
        };
    },
    windowToParent: function() {
        var that = this;
        var subBtn = this.loginWindow.document.querySelector("#subBtn");
        subBtn.onclick = function(e) {
            e.preventDefault();
            var nameLen = that.loginWindow.document.querySelector("#name").value.length;
            var pwdLen = that.loginWindow.document.querySelector("#password").value.length;
            var tip = that.loginWindow.document.querySelector("#tip");
            if (nameLen === 0 || pwdLen === 0) {
                tip.style.display = "block";
            } else {
                tip.style.display = "block";
                tip.innerHTML = "登录成功！3秒后页面将关闭……";
                setTimeout(function() {
                    that.loginWindow.opener.postMessage("login", "*");
                    that.loginWindow.close();
                }, 3000);
            }
        };
    },



    changeWindowStyle: function() {
        var btnPageOne = document.querySelector('.msgone');
        var btnPageTwo = document.querySelector('.msgtwo');
        var btnPageThree = document.querySelector('.msgthree');
        var btnChange = document.querySelector('.btn-changeStyle a');
        var pageArr = [];
        var that = this;
        this.style = true;
        btnPageOne.onclick = function(e) {
            e.preventDefault();
            var pgf = window.open('templates/page1.html', 'page1', 'width=800,height=800,status=yes,resizable=yes');
            pageArr.push(pgf);
            pgf.onload = function() {
                that.changeStyleAlone(pageArr);
                this.document.querySelector('#closePage').onclick = function() {
                    pgf.close();
                };
            };
        };

        btnPageTwo.onclick = function(e) {
            e.preventDefault();
            var pgs = window.open('templates/page2.html', 'page2', 'width=800,height=800,status=yes,resizable=yes');
            pageArr.push(pgs);
            pgs.onload = function() {
                that.changeStyleAlone(pageArr);
                this.document.querySelector('#closePage').onclick = function() {
                    pgs.close();
                };
            };
        };

        btnPageThree.onclick = function(e) {
            e.preventDefault();
            var pgt = window.open('templates/page3.html', 'page3', 'width=800,height=800,status=yes,resizable=yes');
            pageArr.push(pgt);
            pgt.onload = function() {
                that.changeStyleAlone(pageArr);
                this.document.querySelector('#closePage').onclick = function() {
                    pgt.close();
                };
            };

        };

        btnChange.onclick = function(e) {
            e.preventDefault();
            that.changeStyle(pageArr);
        };
    },

    changeStyleAlone: function(pages) {

        var that = this;
        for (var i = 0, lenM = pages.length; i < lenM; i++) {
            pages[i].document.querySelector('#changeStyle').onclick = function() {
                that.changeStyle(pages);
            };
        }
    },

    closeChildWindow: function(pages) {
        var that = this;
        for (var i = 0, len = pages.length; i < len; i++) {
            var win = pages[i];
            pages[i].document.querySelector('#closePage').onclick = function() {
                console.log(win)
            }
        }
    },
    changeStyle: function(pages) {
        if (this.style) {
            for (var i = 0, lenM = pages.length; i < lenM; i++) {
                pages[i].document.querySelector('.main').className = "main otherstyle";

            }
            this.style = false;
        } else {
            for (var j = 0, lenO = pages.length; j < lenO; j++) {
                pages[j].document.querySelector('.main').className = "main mainstyle";

            }
            this.style = true;
        }
    }
};

window.onload = function() {
    var btnBox = document.querySelectorAll('.controller-list ul li a');
    btnBox[0].onclick = function() {
        var changeFeeling = new ChangeFeeling();
        var feelingGood = new FeelingGood(changeFeeling);
        changeFeeling.notifyObserve(feelingGood);
    };
    btnBox[1].onclick = function() {
        var changeFeeling = new ChangeFeeling();
        var feelingBoring = new FeelingBoring(changeFeeling);
        changeFeeling.notifyObserve(feelingBoring);
    };
    btnBox[2].onclick = function() {
        var changeFeeling = new ChangeFeeling();
        var feelingAngry = new FeelingAngry(changeFeeling);
        changeFeeling.notifyObserve(feelingAngry);
    };

    var windowMessage = new WindowMessage();
};
