var express = require('express');
var router = express.Router();

//发布
router.get('/', function(req, res) {
    res.render('page/publish', { 
        pageId: 'publish',
        type: 'get',
        errMsg: 1
    });
});
router.get('/api', function(req, res) {
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
// 所有
router.get('/all', function(req, res) {
    res.render('page/published', { 
        pageId: 'published',
        type: 'get',
        errMsg: 1
    });
});
router.get('/api/all', function(req, res) {
    var pageName = req.query['type'];
    var taskArr = [];
    var status;
    if(pageName == 'check'){
        status = 1;
        for(var loop = 0; loop < 20; loop ++){
            taskArr.push({
                id: 123456,
                title: '太平洋人寿xx调查任务xx调查任务all',
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


router.get('/reward', function(req, res) {
    res.render('page/publish-reward', { 
        title: '发布悬赏',
        type: 'get',
        errMsg: 1,
        data: {
            award: 50,
            cardNum: "",
            deadline: "2015-2-4",
            describe: "aaa adfa fdasa d",
            location: 0,
            personalType: 1,
            researchType: '保险',
            tel: "13300000000"
        }
    });
});
router.get('/check', function(req, res) {
    res.render('page/publish-check', { 
        title: '发布排查',
        type: 'get',
        errMsg: 1,
        data: {
            deadline: "2015-2-4",
            title: '意外保险'
        }
    });
});
// router.get('/trip', function(req, res) {
//     res.render('page/publish-trip', { 
//         title: '发布行程',
//         type: 'get',
//         errMsg: 1,
//         data: {
//             award: 50,
//             cardNum: "",
//             deadline: "2015-2-4",
//             describe: "aaa adfa fdasa d",
//             location: 0,
//             personalType: 1,
//             researchType: '保险',
//             tel: "13300000000"
//         }
//     });
// });
// 发布行程
// router.get('/trip2', function(req, res) {
//     res.render('page/publishTrip', { 
//         pageId: 'publishTrip',
//         title: '发布行程',
//         type: 'get',
//         errMsg: 1,
//         data: null
//     });
// });
// 修改行程 ...参数带id. 如/publish/trip2?id=123456
router.get('/trip2', function(req, res) {
    res.render('page/publishTrip', { 
        pageId: 'publishTrip',
        title: '发布行程',
        type: 'get',
        errMsg: 1,
        data: {
            id: '123456',
            dest: '医院',
            startDate: '2015-04-05',
            startTime: '10:00',
            endDate: '2015-04-05',
            endTime: '10:00',
            des: '我要去干什么'
        }
    });
});
// 当发布行程或修改行程时，点击了发布按钮的处理逻辑
router.post('/trip2', function(req, res){
    var success = false;
    var id = 123456;
    // 发布成功时
    if(success){
        res.redirect('/tripDetail?id=' + id);
    // 发布失败时
    }else{
        res.render('page/publishTrip', {
            pageId: 'publishTrip',
            title: '发布行程',
            type: 'post',
            errMsg: 1, // -1 没有输入目的地， -2 没有输入开始日期, -3 数据保存失败，请重试, -4 开始时间， -5 截止日期， -6 截止时间 
            data: null
        });
    }
});


// 发布排查
// router.get('/check2', function(req, res) {
//     res.render('page/publishCheck', { 
//         pageId: 'publishCheck',
//         title: '发布排查',
//         type: 'get',
//         errMsg: 1,
//         data: null
//     });
// });
// 修改排查 ...参数带id. 如/publish/trip2?id=123456
router.get('/check2', function(req, res) {
    res.render('page/publishCheck', { 
        pageId: 'publishCheck',
        title: '发布排查',
        type: 'get',
        errMsg: 1,
        data: {
            id: '123456',
            title: 'fsfsfs',
            sort: '1',
            checkedPersonName: '张三',
            idType: '2',
            idNum: 'fsfsdfsdffsdf',
            insuranceNum: '2,000',
            date: '2015-04-05',
            type: '5',
            des: '我要去干什么',
            scope: 'branch',
            images: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAwCAYAAACBpyPiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkNWYxNGZiMi1jMjFlLTRhZjEtOTlmOS1jZDNmNjViMjQ3YTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDE0MjAzNTFERENDMTFFNDkwODdBMjVDRDc2OUM5Q0EiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDE0MjAzNTBERENDMTFFNDkwODdBMjVDRDc2OUM5Q0EiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpjZTkwM2Y0ZC01MTYzLTQ4OWQtOGRhNi0wN2Q0ZDA2ZDYyMjMiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxZTQyMWQxMC0yM2M2LTExNzgtOWQ4Yi1mNzY4ZGMwNzgxMDciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4VtOghAAABSklEQVR42uzasWqEQBAG4NlEMYKKWqezuLPLq/gEPlgqHyCQB0jpa4iFhZXEu4iggmZno02a8+Au7IQZ+NXCg8919UYR4KcOMm8yJ5lF45xW52F1w1HmU3P076D3+CgXrzIvQKueZJ6FXHzJOECvOrGeBpL1AISL8YzXCR8EASRJAlEU0cObpgme54HruvTw8zyr9TiOPOcZz3jGM57xeuH7vlfrYRjuhjeu6VUMw4Blufzsgvv4vq+2wzCEtm1BCHHxd7gP/jM3TbPLtPtJKk3TP5sOWZbdduTzPAfLsnYDHMeBOI6hqiqo63rXyG9n7ebTpiiKq0YPDxTxZVmqkLpgt1bYtm2+VTKe8YxnPOP1wm/tADZz5PDYHU7TdNf3Nvx+nvGMZzzj/z++I2rvEP9BFK/cVD+ciLejwI13mbPm6PPqxAGHbwEGAN0E9Tb7JeZvAAAAAElFTkSuQmCC'],
            branchCity: '杭州'
        }
    });
});
// 当发布排查或修改排查时，点击了发布按钮的处理逻辑
router.post('/check2', function(req, res){
    var success = false;
    var id = 123456;
    // 发布成功时
    if(success){
        res.redirect('/checkDetail?id=' + id);
    // 发布失败时
    }else{
        res.render('page/publishCheck', {
            pageId: 'publishCheck',
            title: '发布排查',
            type: 'post',
            errMsg: 1, // -1 没有选择标题， -2 没有输入截止日期, -3 请输入被调查人姓名, -4 请输入证件号码, -5 请输入保额, -6 请选择发布范围, -7 数据保存失败，请重试
            data: null
        });
    }
});


// 发布悬赏
// router.get('/reward2', function(req, res) {
//     res.render('page/publishReward', { 
//         pageId: 'publishReward',
//         title: '发布悬赏',
//         type: 'get',
//         errMsg: 1,
//         data: null
//     });
// });
// 修改悬赏 ...参数带id. 如/publish/trip2?id=123456
router.get('/reward2', function(req, res) {
    res.render('page/publishReward', { 
        pageId: 'publishReward',
        title: '发布悬赏',
        type: 'get',
        errMsg: 1,
        data: {
            id: '123456',
            title: 'xxx排查事件',
            dest: '北京海淀',
            deadline: '2015-04-05',
            name: '张三',
            rewardType: '2',
            idType: '3',
            idNum: '123456',
            images: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAwCAYAAACBpyPiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkNWYxNGZiMi1jMjFlLTRhZjEtOTlmOS1jZDNmNjViMjQ3YTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDE0MjAzNTFERENDMTFFNDkwODdBMjVDRDc2OUM5Q0EiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDE0MjAzNTBERENDMTFFNDkwODdBMjVDRDc2OUM5Q0EiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpjZTkwM2Y0ZC01MTYzLTQ4OWQtOGRhNi0wN2Q0ZDA2ZDYyMjMiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxZTQyMWQxMC0yM2M2LTExNzgtOWQ4Yi1mNzY4ZGMwNzgxMDciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4VtOghAAABSklEQVR42uzasWqEQBAG4NlEMYKKWqezuLPLq/gEPlgqHyCQB0jpa4iFhZXEu4iggmZno02a8+Au7IQZ+NXCg8919UYR4KcOMm8yJ5lF45xW52F1w1HmU3P076D3+CgXrzIvQKueZJ6FXHzJOECvOrGeBpL1AISL8YzXCR8EASRJAlEU0cObpgme54HruvTw8zyr9TiOPOcZz3jGM57xeuH7vlfrYRjuhjeu6VUMw4Blufzsgvv4vq+2wzCEtm1BCHHxd7gP/jM3TbPLtPtJKk3TP5sOWZbdduTzPAfLsnYDHMeBOI6hqiqo63rXyG9n7ebTpiiKq0YPDxTxZVmqkLpgt1bYtm2+VTKe8YxnPOP1wm/tADZz5PDYHU7TdNf3Nvx+nvGMZzzj/z++I2rvEP9BFK/cVD+ciLejwI13mbPm6PPqxAGHbwEGAN0E9Tb7JeZvAAAAAElFTkSuQmCC'],
            des: '我要去干什么',
            fudouNum: '120'
        }
    });
});
// 当发布悬赏或修改悬赏时，点击了发布按钮的处理逻辑
router.post('/reward2', function(req, res){
    var success = true;
    var id = 123456;
    // 发布成功时
    if(success){
        res.redirect('/rewardDetail?id=' + id);
    // 发布失败时
    }else{
        res.render('page/publishReward', {
            pageId: 'publishReward',
            title: '发布悬赏',
            type: 'post',
            errMsg: 1, // -1 没有选择目的地， -2 没有输入截止日期, -3 没有选择调查类型， -4 没有选择证件类型，-5 没有输入证件号, -6 数据保存失败，请重试, -7 没有输入被保险人姓名, -8 没有输入标题
            data: null
        });
    }
});



// router.post('/api/reward', function(req, res) {
//     res.send({
//         status: 200,
//         result: {
//         },
//         time: new Date().getTime()
//     });
// });


module.exports = router;