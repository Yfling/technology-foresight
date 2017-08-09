var express = require('express');
var router = express.Router();
var weixin = require('weixin-api');

weixin.token = 'FdMfny43bk4jizXK';

//接入验证
router.get('/checkSignature', function(req, res) {
    // 签名成功
    if (weixin.checkSignature(req)) {
        res.send(200, req.query.echostr);
    } else {
        res.send(200, 'fail');
    }
});

// index
router.get('/', function(req, res) {
    res.render('page/index', { 
        pageId: 'index',
        isAuthed: true, // 是否通过审核
        task: {
            unfinish: {
                publish: 100,
                pull: 40,
                judge: 50
            }
        },
        publish: {
            check: true,
            reward: true,
            trip: false
        }
    });
});

// login
router.get('/login', function(req, res) {
    res.render('page/login', { 
        type: 'get',
        errMsg: 1  // 1: get请求
    });
});
router.post('/login', function(req, res) {
    console.log(req);
    res.render('page/login', { 
        type: 'post',
        errMsg: 1  // 0: 成功, -1: 该手机号未注册, -2: 密码错误
    });
});
// logout
router.get('/logout', function(req, res){
    res.redirect('/login');
});
// regist
router.get('/regist', function(req, res) {
    res.render('page/regist', { 
        type: 'get',
        errMsg: 1
    });
});
router.post('/regist', function(req, res) {
    var success = true;
    if(success){
        res.redirect('/regist2');
    }else{
        res.render('page/regist', { 
            type: 'post',
            errMsg: 1  // 1: 成功, -1: 该手机号已被注册, -2: 验证码输入错误, -3: 两次输入的密码不一致
        }); 
    }
});
router.get('/getVerify', function(req, res) {
    res.json(200, {
        status: 1,
        errMsg: '',
        result: {
            code: '123456'
        }
    });
});

// regist 2
// router.get('/regist2', function(req, res) {
//     res.render('page/regist2', { 
//         type: 'get',
//         errMsg: 1,
//         data: null
//     });
// });
router.get('/regist2', function(req, res) {
    res.render('page/regist2', { 
        type: 'get',
        errMsg: 1,
        data: {
            id: '123456',
            photo: 'http://ffdf',
            name: 'fsdfsdf',
            company: 'fsdfsf',
            scope: 'trunk',
            zone: 'fsfsd',
            tel: 'fsdfsdf',
            idNum: 'fsdfsd',
            des: 'fsdfsfs',
            certify: 'http//'
        }
    });
});

router.post('/regist2', function(req, res) {
    var success = true;
    if(success){
        res.redirect('/');
    }else{
        res.render('page/regist2', {
            type: 'post',
            errMsg: 1,  // 1: 成功, -1: 资料填写不完整, -2: 该身份证已被注册
            data: null
        });
    }
});


// get passwd
router.get('/getPasswd', function(req, res) {
    res.render('page/getPasswd', { 
        type: 'get',
        errMsg: 1
    });
});
router.post('/getPasswd', function(req, res) {
    var success = true;
    if(success){
        res.redirect('/getPasswd2');
    }else{
        res.render('page/getPasswd', { 
            type: 'post',
            errMsg: 1  // 1: 成功, -1: 该手机号已被注册, -2: 验证码输入错误, -3: 两次输入的密码不一致
        });
    }
});
// get passwd 2
router.get('/getPasswd2', function(req, res) {
    res.render('page/getPasswd2', { 
        type: 'get',
        errMsg: 1
    });
});
router.post('/getPasswd2', function(req, res) {
    res.render('page/getPasswd2', { 
        type: 'post',
        errMsg: 1  // 1: 成功, -1: 该手机号已被注册, -2: 验证码输入错误, -3: 两次输入的密码不一致
    });
});

// 个人中心
router.get('/mine', function(req, res) {
    res.render('page/mine', { 
        pageId: 'mine',
        info: {
            photo: '/dest/img/common/default-photo.png',
            name: '特使团',
            company: '百度在线'
        },
        task: {
            check: {
                publish: 100,
                pull: 40
            },
            reward: {
                publish: 100,
                pull: 40
            },
            trip: {
                publish: 100
            },
            unfinish: {
                publish: 100,
                pull: 40,
                judge: 50
            }
        },
        fudou: {
            num: 40
        },
        notice: {
            num: 100
        }
    });
});
// 个人详情页
router.get('/mineInfo', function(req, res){
    res.render('page/mineInfo', {
        pageId: 'mineInfo',
        canJudge: true,
        star: 4.5,
        photo: '/dest/img/common/default-photo.png',
        id: '1111111',
        name: '我的名字',
        company: '北京泰康保险有限公司',
        tel: '1888888888',
        doneTask: '50',
        publishTask: '48'
    })
});
// 获取评论
router.get('/commentListAjax', function(req, res){
    res.json(200, {
        status: 1,
        errMsg: '',
        result: {
            data: [{
                tel: '123******123',
                time: '02-26 18:24',
                star: 3,
                content: '师傅不错，很好很快，好评'
            },{
                tel: '123******123',
                time: '02-26 18:24',
                star: 3,
                content: '师傅不错，很好很快，好评'
            },{
                tel: '123******123',
                time: '02-26 18:24',
                star: 3,
                content: '师傅不错，很好很快，好评'
            },{
                tel: '123******123',
                time: '02-26 18:24',
                star: 3,
                content: '师傅不错，很好很快，好评'
            },{
                tel: '123******123',
                time: '02-26 18:24',
                star: 3,
                content: '师傅不错，很好很快，好评'
            },{
                tel: '123******123',
                time: '02-26 18:24',
                star: 3,
                content: '师傅不错，很好很快，好评'
            },{
                tel: '123******123',
                time: '02-26 18:24',
                star: 3,
                content: '师傅不错，很好很快，好评'
            },{
                tel: '123******123',
                time: '02-26 18:24',
                star: 3,
                content: '师傅不错，很好很快，好评'
            }]
        }
    })
});

// 排查详情页
router.get('/checkDetail', function(req, res) {
    res.render('page/checkDetail', {
        pageId: 'checkDetail', // 页面id, 不需要修改
        title: '详情', // 页面title, 不需要修改
        user: { // 用户相关信息，当前登录用户的相关信息
            id: 1234567,
            name: '张三',
            photo: '',
            company: 'baidu'
        },
        check: { // 当前排查任务的相关信息
            id: '123456', // 当前排查的id
            title: 'XXX商品事例视频', // 任务名称
            progress: { // 任务进度
                all: 7,
                finished: 4
            },
            viewerNum: 100, // 浏览者数量
            publishTime: '1小时前', // 发布时间
            deadLine: '2015-12-12', // 截至日期
            des: /*描述*/'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
            photos: ['http://himg2.huanqiu.com/attachment2010/2015/0603/16/02/20150603040234914.jpg', '/dest/img/common/default-photo.png', '/dest/img/common/default-photo.png'], // 相关图片
            publisher: { // 发布者信息
                id: '1234567',
                name: '张三', // 名字
                isAuthed: true, // 是否认证
                photo: '/dest/img/common/default-photo.png', // 头像
                tel: '123456', // 电话
                addr: '北京', // 地址
            },
            receiver: {
                id: '123456',
                name: '张三', // 名字
                isAuthed: true, // 是否认证
                photo: '/dest/img/common/default-photo.png', // 头像
                tel: '123456', // 电话
                addr: '北京', // 地址
            },
            received: true, // 当前登录用户是否领取了该任务
            resulted: false, // 当前登录用户是否发布了排查结果
        }

    });
});
// 排查详情页，点击领取排查
router.get('/receiveCheck', function(req, res){
    res.json('200', {
        status: 1,
        errMsg: '',
        result: 'success'
    });
});
// 排查详情页，点击删除排查
router.get('/delete/check', function(req, res){
    var success = true; // 进行后端删除操组的结果，成功还是失败
    if(success){
        res.redirect('/publish?type=0'); // type: 0 排查，1 悬赏， 2 行程
    }else{
        res.render('/delete/check?id=' + req.query[id]);
    }
});
// 悬赏详情页
router.get('/rewardDetail', function(req, res) {
    res.render('page/rewardDetail', {
        pageId: 'rewardDetail', // 页面id, 不需要修改
        title: '详情', // 页面title, 不需要修改
        user: { // 用户相关信息，当前登录用户的相关信息
            id: 123456,
            name: '张三',
            photo: '',
            company: 'baidu'
        },
        reward: { // 当前排查任务的相关信息
            id: 1234567,
            title: '关于某某事件的调查任务', // 任务名称
            prize: 150,
            viewerNum: 100, // 浏览者数量
            publishTime: '1小时前', // 发布时间
            dest: { // 目的地
                dest: '北京市第一人民医院',
                detail: '北京市 昌平区 英雄路234号'
            },
            deadLine: '2015-12-12', // 截至日期
            type: '病例调查',
            source: '北京泰康人寿有限公司',
            personNum: 1,
            des: /*描述*/'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
            photos: ['/dest/img/common/default-photo1.png', '/dest/img/common/default-photo2.png', '/dest/img/common/default-photo3.png'], // 相关图片
            publisher: { // 发布者信息
                id: 123456,
                name: '张三', // 名字
                isAuthed: true, // 是否认证
                photo: '/dest/img/common/default-photo.png', // 头像
                tel: '18610124600', // 电话
                addr: '北京', // 地址
            },
            receiver: null,
            received: false, // 当前登录用户是否领取了该任务
            resulted: false, // 当前登录用户是否发布了结果
            cofirmed: false // 发布者已确认完成
        }

    });
});
// 悬赏详情页，确认完成
router.get('/confirmDone/reward', function(req, res){
    // 处理完确认完成的逻辑之后，跳回当前页
    res.redirect('/rewardDetail');
});
// 悬赏详情页，点击删除
router.get('/delete/reward', function(req, res){
    var success = true; // 进行后端删除操组的结果，成功还是失败
    if(success){
        res.redirect('/publish?type=1'); // type: 0 排查，1 悬赏， 2 行程
    }else{
        res.render('/delete/reward?id=' + req.query[id]);
    }
});

// 悬赏详情页，点击认领悬赏
router.get('/receiveReward', function(req, res){
    res.json('200', {
        status: 1,
        errMsg: '',
        result: 'success'
    });
});

// 行程详情页
router.get('/tripDetail', function(req, res) {
    res.render('page/tripDetail', {
        pageId: 'tripDetail', // 页面id, 不需要修改
        title: '详情', // 页面title, 不需要修改
        user: { // 用户相关信息，当前登录用户的相关信息
            id: 123456,
            name: '张三',
            photo: '',
            company: 'baidu'
        },
        trip: { // 当前排查任务的相关信息
            id: 123456,
            viewerNum: 100, // 浏览者数量
            publishTime: '1小时前', // 发布时间
            dest: { // 目的地
                dest: '北京市第一人民医院',
                detail: '北京市 昌平区 英雄路234号'
            },
            deadLine: '2015-12-12', // 截至日期
            des: /*描述*/'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
            publisher: { // 发布者信息
                id: 123456,
                name: '张三', // 名字
                isAuthed: true, // 是否认证
                photo: '/dest/img/common/default-photo.png', // 头像
                tel: '123456', // 电话
                addr: '北京', // 地址
            }
        }

    });
});
// 行程详情页，点击删除
router.get('/delete/trip', function(req, res){
    var success = true; // 进行后端删除操组的结果，成功还是失败
    if(success){
        res.redirect('/publish?type=2'); // type: 0 排查，1 悬赏， 2 行程
    }else{
        res.render('/delete/trip?id=' + req.query[id]);
    }
});


//我领取的任务列表
router.get('/receive', function(req, res) {
    res.render('page/receive', { 
        pageId: 'receive',
        title: '我领取的正在执行的任务',
        type: 'get',
        errMsg: 1
    });
});
router.get('/receive/api', function(req, res) {
    var pageName = req.query['type'];
    var taskArr = [];
    var status;
    if(pageName == 'check'){
        status = 1;
        for(var loop = 0; loop < 20; loop ++){
            taskArr.push({
                id: 123456,
                title: '太平洋人寿xx调查任务xx调查任务',
                progress: {
                    all: 7,
                    finished: 4
                },
                deadline: '2015-02-03'
            });
        };
    }else if(pageName == 'reward'){
        status = 1;
        for(var loop = 0; loop <20; loop ++){
            taskArr.push({
                id: 123456,
                title: '太平洋人寿xx调查任务xx调查任务',
                prizeNum: '100',
                deadline: '2015-02-03'
            });
        };
    }else if(pageName == 'trip'){
        status = 1;
        for(var loop = 0; loop < 20; loop ++){
            taskArr.push({
                id: 123456,
                title: '太平洋人寿xx调查任务xx调查任务',
                date: '2015-02-03'
            });
        };
    }else{
        status = 0;
    }
    res.send({
        status: status,
        type: pageName,
        result: {
            task: taskArr
        },
        time: new Date().getTime()
    });
});

//我领取的所有任务列表
router.get('/received', function(req, res) {
    res.render('page/received', { 
        pageId: 'received',
        title: '我领取的所有任务',
        type: 'get',
        errMsg: 1
    });
});
router.get('/received/api', function(req, res) {
    var pageName = req.query['type'];
    var taskArr = [];
    var status;
    if(pageName == 'check'){
        status = 1;
        for(var loop = 0; loop < 20; loop ++){
            taskArr.push({
                id: 123456,
                title: '太平洋人寿xx调查任务xx调查任务',
                progress: {
                    all: 7,
                    finished: 4
                },
                deadline: '2015-02-03'
            });
        };
    }else if(pageName == 'reward'){
        status = 1;
        for(var loop = 0; loop <20; loop ++){
            taskArr.push({
                id: 123456,
                title: '太平洋人寿xx调查任务xx调查任务',
                prizeNum: '100',
                deadline: '2015-02-03'
            });
        };
    }else if(pageName == 'trip'){
        status = 1;
        for(var loop = 0; loop < 20; loop ++){
            taskArr.push({
                id: 123456,
                title: '太平洋人寿xx调查任务xx调查任务',
                date: '2015-02-03'
            });
        };
    }else{
        status = 0;
    }
    res.send({
        status: status,
        type: pageName,
        result: {
            task: taskArr
        },
        time: new Date().getTime()
    });
});

// 发布排查结果
router.get('/publishCheckResult', function(req, res) {
    res.render('page/publishCheckResult', { 
        pageId: 'publishCheckResult',
        title: '发布排查结果',
        type: 'get',
        data: {
            company: 'XXX公司'
        }
    });
});
router.post('/publishCheckResult', function(req, res) {
    res.render('page/publishCheckResult', { 
        pageId: 'publishCheckResult',
        title: '发布排查结果',
        type: 'post',
        errMsg: 1, // 1 success， -1 未投保，-2 险种为选择，-3 保额未填，-4 生效日期未填, -5 排查公司未填
        data: {
            company: 'XXX公司',
            check: {
                id: '1111',
            }
        }
    });
});

// 排查结果列表页
router.get('/checkResultList', function(req, res) {
    res.render('page/checkResultList', { 
        pageId: 'checkResultList',
        title: '公布的排查结果',
        type: 'get',
        data: {
            id: 'fdsfsd', // 排查的id
            user: {
                id: '111'
            },
            publisher: {
                id: '111'
            },
            done: true // 是否已结束
        }
    });
});
router.get('/checkResultListAjax', function(req, res){
    res.json(200, {
        status: 1,
        errMsg: '',
        result:{
            data: [{
                id: 123456,
                isMine: false,
                company: '太平洋人寿',
                type: '意外险',
                num: '400',
                time: '2015-02-03'
            },{
                id: 123456,
                isMine: true,
                company: '太平洋人寿',
                type: '意外险',
                num: '400',
                time: '2015-02-03'
            },{
                id: 123456,
                isMine: false,
                company: '太平洋人寿',
                type: '意外险',
                num: '400',
                time: '2015-02-03'
            },{
                id: 123456,
                isMine: false,
                company: '太平洋人寿',
                type: '意外险',
                num: '400',
                time: '2015-02-03'
            },{
                id: 123456,
                isMine: false,
                company: '太平洋人寿',
                type: '意外险',
                num: '400',
                time: '2015-02-03'
            },{
                id: 123456,
                isMine: false,
                company: '太平洋人寿',
                type: '意外险',
                num: '400',
                time: '2015-02-03'
            },{
                id: 123456,
                isMine: false,
                company: '太平洋人寿',
                type: '意外险',
                num: '400',
                time: '2015-02-03'
            },{
                id: 123456,
                isMine: false,
                company: '太平洋人寿',
                type: '意外险',
                num: '400',
                time: '2015-02-03'
            },{
                id: 123456,
                isMine: false,
                company: '太平洋人寿',
                type: '意外险',
                num: '400',
                time: '2015-02-03'
            },{
                id: 123456,
                isMine: false,
                company: '太平洋人寿',
                type: '意外险',
                num: '400',
                time: '2015-02-03'
            },{
                id: 123456,
                isMine: false,
                company: '太平洋人寿',
                type: '意外险',
                num: '400',
                time: '2015-02-03'
            },{
                id: 123456,
                isMine: false,
                company: '太平洋人寿',
                type: '意外险',
                num: '400',
                time: '2015-02-03'
            }]
        }
    });
})
router.get('/checkDone', function(req, res){
    res.redirect('page/checkResultList');
});
// 排查结果详情页
router.get('/checkResultDetail', function(req, res){
    res.render('page/checkResultDetail', {
        pageId: 'checkResultDetail',
        title: '排查结果详情',
        type: 'get',
        company: '太平洋人搜',
        types: [{
            type: '意外保险',
            num: '400,000',
            time: '2013-01-02',
            isPay: '是'
        },{
            type: '意外保险',
            num: '400,000',
            time: '2013-01-02',
            isPay: '是'
        }],
        des: '文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述'
    });
});
// 待评价页面
router.get('/unjudged', function(req, res){
    res.render('page/unjudged', {
        pageId: 'unjudged',
        title: '代评价的任务',
        type: 'get'
    });
});
// 待评价页面列表 ?page=0 1 ...
router.get('/unfinish/list', function(req, res){
    res.json(200, {
        status: 1,
        errMsg: '',
        result:{
            data: [{
                task: {
                    id: 123456, 
                    type: 'reward',
                    addr: '第一人民医院 - 朝阳区 - 北京',
                    finisheTime: '2015-02-03',
                    receiveTime: '111'
                },
                publisher: {
                    id: 123456,
                    name: '刘小傲'
                },
                receiver: {
                    id: 123456,
                    name: 'aaa'
                }
            },
            {
                task: {
                    id: 123456, 
                    type: 'reward',
                    addr: '第一人民医院 - 朝阳区 - 北京',
                    finisheTime: '2015-02-03',
                    receiveTime: '111'  
                },
                publisher: {
                    id: 123456,
                    name: '刘小傲'
                },
                receiver: {
                    id: 123456,
                    name: 'aaa'
                }
            },{
                task: {
                    id: 123456, 
                    type: 'reward',
                    addr: '第一人民医院 - 朝阳区 - 北京',
                    finisheTime: '2015-02-03',
                    receiveTime: '111'   
                },
                publisher: {
                    id: 123456,
                    name: '刘小傲'
                },
                receiver: {
                    id: 123456,
                    name: 'aaa'
                }
            },{
                task: {
                    id: 123456, 
                    type: 'reward',
                    addr: '第一人民医院 - 朝阳区 - 北京',
                    finisheTime: '2015-02-03',
                    receiveTime: '111'   
                },
                publisher: {
                    id: 123456,
                    name: '刘小傲'
                },
                receiver: {
                    id: 123456,
                    name: 'aaa'
                }
            },{
                task: {
                    id: 123456, 
                    type: 'reward',
                    addr: '第一人民医院 - 朝阳区 - 北京',
                    finisheTime: '2015-02-03',
                    receiveTime: '111'   
                },
                publisher: {
                    id: 123456,
                    name: '刘小傲'
                },
                receiver: {
                    id: 123456,
                    name: 'aaa'
                }
            },{
                task: {
                    id: 123456, 
                    type: 'reward',
                    addr: '第一人民医院 - 朝阳区 - 北京',
                    finisheTime: '2015-02-03',
                    receiveTime: '111'   
                },
                publisher: {
                    id: 123456,
                    name: '刘小傲'
                },
                receiver: {
                    id: 123456,
                    name: 'aaa'
                }
            },{
                task: {
                    id: 123456, 
                    type: 'reward',
                    addr: '第一人民医院 - 朝阳区 - 北京',
                    finisheTime: '2015-02-03',
                    receiveTime: '111'   
                },
                publisher: {
                    id: 123456,
                    name: '刘小傲'
                },
                receiver: {
                    id: 123456,
                    name: 'aaa'
                }
            },{
                task: {
                    id: 123456, 
                    type: 'reward',
                    addr: '第一人民医院 - 朝阳区 - 北京',
                    finisheTime: '2015-02-03',
                    receiveTime: '111'   
                },
                publisher: {
                    id: 123456,
                    name: '刘小傲'
                },
                receiver: {
                    id: 123456,
                    name: 'aaa'
                }
            },{
                task: {
                    id: 123456, 
                    type: 'reward',
                    addr: '第一人民医院 - 朝阳区 - 北京',
                    finisheTime: '2015-02-03',
                    receiveTime: '111'   
                },
                publisher: {
                    id: 123456,
                    name: '刘小傲'
                },
                receiver: {
                    id: 123456,
                    name: 'aaa'
                }
            },{
                task: {
                    id: 123456, 
                    type: 'reward',
                    addr: '第一人民医院 - 朝阳区 - 北京',
                    finisheTime: '2015-02-03',
                    receiveTime: '111'   
                },
                publisher: {
                    id: 123456,
                    name: '刘小傲'
                },
                receiver: {
                    id: 123456,
                    name: 'aaa'
                }
            }]
        }
    });
});
// 点击 跳过并完成 按钮
router.get('/giveUpJudge', function(req, res){
    res.json(200, {
        status: 1,
        errMsg: '',
        result:{
            data: 1 // >0 成功 <0 失败
        }
    });
});
// 点击 发表评价 按钮
router.post('/doJudge', function(req, res){
    res.json(200, {
        status: 1,
        errMsg: '',
        result:{
            data: 1 // >0 成功 <0 失败
        }
    });
});


// 福豆
router.get('/fudou', function(req, res){
    res.render('page/fudou', {
        pageId: 'fudou',
        title: '我的福豆',
        type: 'get',
        num: '10,000' // 福豆数量
    });
});
// 获取福豆消费信息列表
router.get('/getFudouList', function(req, res){
    res.json(200, {
        status: 1,
        errMsg: '',
        result:{
            data: [{
                name: '中央人民医院人身保险调查',
                time: '2015-02-04 12:45',
                status: 1, // > 0 增加， < 0 减少
                num: 50,
                task: {
                    type: 'check', // 排查 悬赏 还是？
                    id: 123456 // 任务id
                }
            },{
                name: '中央人民医院人身保险调查',
                time: '2015-02-04 12:45',
                status: -1, // > 0 增加， < 0 减少
                num: 50,
                task: {
                    type: 'check', // 排查 悬赏 还是？
                    id: 123456 // 任务id
                }
            },{
                name: '中央人民医院人身保险调查',
                time: '2015-02-04 12:45',
                status: 1, // > 0 增加， < 0 减少
                num: 50,
                task: {
                    type: 'check', // 排查 悬赏 还是？
                    id: 123456 // 任务id
                }
            },{
                name: '中央人民医院人身保险调查',
                time: '2015-02-04 12:45',
                status: 1, // > 0 增加， < 0 减少
                num: 50,
                task: {
                    type: 'check', // 排查 悬赏 还是？
                    id: 123456 // 任务id
                }

            },{
                name: '中央人民医院人身保险调查',
                time: '2015-02-04 12:45',
                status: 1, // > 0 增加， < 0 减少
                num: 50,
                task: {
                    type: 'check', // 排查 悬赏 还是？
                    id: 123456 // 任务id
                }

            },{
                name: '中央人民医院人身保险调查',
                time: '2015-02-04 12:45',
                status: 1, // > 0 增加， < 0 减少
                num: 50,
                task: {
                    type: 'check', // 排查 悬赏 还是？
                    id: 123456 // 任务id
                }

            },{
                name: '中央人民医院人身保险调查',
                time: '2015-02-04 12:45',
                status: 1, // > 0 增加， < 0 减少
                num: 50,
                task: {
                    type: 'check', // 排查 悬赏 还是？
                    id: 123456 // 任务id
                }

            },{
                name: '中央人民医院人身保险调查',
                time: '2015-02-04 12:45',
                status: 1, // > 0 增加， < 0 减少
                num: 50,
                task: {
                    type: 'check', // 排查 悬赏 还是？
                    id: 123456 // 任务id
                }

            },{
                name: '中央人民医院人身保险调查',
                time: '2015-02-04 12:45',
                status: 1, // > 0 增加， < 0 减少
                num: 50,
                task: {
                    type: 'check', // 排查 悬赏 还是？
                    id: 123456 // 任务id
                }

            },{
                name: '中央人民医院人身保险调查',
                time: '2015-02-04 12:45',
                status: 1, // > 0 增加， < 0 减少
                num: 50,
                task: {
                    type: 'check', // 排查 悬赏 还是？
                    id: 123456 // 任务id
                }

            },{
                name: '中央人民医院人身保险调查',
                time: '2015-02-04 12:45',
                status: 1, // > 0 增加， < 0 减少
                num: 50,
                task: {
                    type: 'check', // 排查 悬赏 还是？
                    id: 123456 // 任务id
                }

            }]
        }
    });
});

// 消息系统
router.get('/notice', function(req, res){
    res.render('page/notice', {
        pageId: 'notice',
        title: '系统通知',
        type: 'get'
    });
});
// 消息列表
router.get('/getNoticeList', function(req, res){
    res.json(200, {
        status: 1,
        errMsg: '',
        result:{
            data: [{
                id: '123456',
                isRead: 1,
                des: '您发布的任务“去大兴区进行调查”已经被领取您发布的任务“去大兴区进行调查”已经被领取',
                time: '2015-02-04 12:45'
            },{
                id: '123456',
                isRead: 1,
                des: '您发布的任务“去大兴区进行调查”已经被领取您发布的任务“去大兴区进行调查”已经被领取',
                time: '2015-02-04 12:45'
            },{
                id: '123456',
                isRead: 1,
                des: '您发布的任务“去大兴区进行调查”已经被领取您发布的任务“去大兴区进行调查”已经被领取',
                time: '2015-02-04 12:45'
            },{
                id: '123456',
                isRead: 1,
                des: '您发布的任务“去大兴区进行调查”已经被领取您发布的任务“去大兴区进行调查”已经被领取',
                time: '2015-02-04 12:45'
            },{
                id: '123456',
                isRead: 0,
                des: '您发布的任务“去大兴区进行调查”已经被领取您发布的任务“去大兴区进行调查”已经被领取',
                time: '2015-02-04 12:45'
            },{
                id: '123456',
                isRead: 0,
                des: '您发布的任务“去大兴区进行调查”已经被领取您发布的任务“去大兴区进行调查”已经被领取',
                time: '2015-02-04 12:45'
            },{
                id: '123456',
                isRead: 0,
                des: '您发布的任务“去大兴区进行调查”已经被领取您发布的任务“去大兴区进行调查”已经被领取',
                time: '2015-02-04 12:45'
            },{
                id: '123456',
                isRead: 1,
                des: '您发布的任务“去大兴区进行调查”已经被领取您发布的任务“去大兴区进行调查”已经被领取',
                time: '2015-02-04 12:45'
            },{
                id: '123456',
                isRead: 1,
                des: '您发布的任务“去大兴区进行调查”已经被领取您发布的任务“去大兴区进行调查”已经被领取',
                time: '2015-02-04 12:45'
            }]
        }
    });
});

// 系统通知详情
router.get('/noticeDetail', function(req, res){
    res.render('page/noticeDetail', {
        pageId: 'noticeDetail',
        title: '系统通知',
        type: 'get',
        time: '2015-02-04 12:45',
        des: '您发布的任务“去中央人民医院调查”被领取。fsfs您发布的任务“去中央人民医院调查”被领取。',
        task: {
            id: '123445',
            type: 'check',
            name: '中央人民医院调查',
            publishTime: '2015-04-02'
        },
        receiver: {
            id: '123343',
            name: '李四',
            isAuthed: true,
            tel: '1880119877',
            addr: '北京'
        }
    });
});
router.get('/agreement', function(req, res){
    res.render('page/agreement', {
        pageId: 'agreement',
        type: 'get'
    });
});
module.exports = router;
