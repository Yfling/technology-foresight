var express = require('express');
var http = require('http');
var	url = require('url');
var router = express.Router();


/*排查列表*/
router.get('/investigation', function(req, res) {
    res.render('page/investigation', { 
        pageId: 'investigation',
        type: 'get',
        errMsg: 1,  // 1: get请求
        user: {
            zone: '杭州'
        }
    });
});

/*悬赏列表*/
router.get('/reward', function(req, res) {
    res.render('page/reward', { 
        pageId: 'reward',
        type: 'get',
        errMsg: 1,  // 1: get请求
        user: {
            zone: '北京'
        }
    });
});

/*行程列表*/
router.get('/trip', function(req, res) {
    res.render('page/trip', { 
        pageId: 'trip',
        type: 'get',
        errMsg: 1,  // 1: get请求
        user: {
            zone: '杭州'
        }
    });
});

/*行程列表接口*/
router.get('/tripList', function(req, res) {
	var type = url.parse(req.url,true).query.type;  //pathname => select  
    var sort = url.parse(req.url,true).query.sort;  //pathname => select  
       	res.json(200, { 
        status: 1, // 接口返回值状态码
        errMsg: '失败信息', // 接口返回值错误信息，正确则为空
        result: { 
        	type:type,
        	sort:sort,
        	total:5,//总数
        	list:[
        		{
                    id: 123456,
		            title:'永久自行车',
		            des:'永久27速自行车 锁死前叉/CNC车圈/2培林花鼓',
		            progress:'月销量1342242件',
		            time:'上架时间：2017-07-13',
		            status:''

		        },
		         
		        {
                    id: 123456,
		            title:'永久自行车',
		            des:'永久27速自行车 锁死前叉/CNC车圈/2培林花鼓',
		            progress:'月销量1342242件',
		            time:'上架时间：2017-07-13',
		            status:''

		        },
{
                    id: 123456,
		            title:'永久自行车',
		            des:'永久27速自行车 锁死前叉/CNC车圈/2培林花鼓',
		            progress:'月销量1342242件',
		            time:'上架时间：2017-07-13',
		            status:''

		        },
{
                    id: 123456,
		            title:'永久自行车',
		            des:'永久27速自行车 锁死前叉/CNC车圈/2培林花鼓',
		            progress:'月销量1342242件',
		            time:'上架时间：2017-07-13',
		            status:''

		        },
{
                    id: 123456,
		            title:'永久自行车',
		            des:'永久27速自行车 锁死前叉/CNC车圈/2培林花鼓',
		            progress:'月销量1342242件',
		            time:'上架时间：2017-07-13',
		            status:''

		        },
{
                    id: 123456,
		            title:'永久自行车',
		            des:'永久27速自行车 锁死前叉/CNC车圈/2培林花鼓',
		            progress:'月销量1342242件',
		            time:'上架时间：2017-07-13',
		            status:''

		        },
{
                    id: 123456,
		            title:'永久自行车',
		            des:'永久27速自行车 锁死前叉/CNC车圈/2培林花鼓',
		            progress:'月销量1342242件',
		            time:'上架时间：2017-07-13',
		            status:''

		        


		        }
		    ]    
        }
    })
});


/******

        {
            title:'MH370重大空难遇难人员资料调查',
            des:'发起：张三 - 北京泰康人寿有限公司',
            progress:'完成进度4/8',
            time:'2015-02-04'
        },
         {
            title:'MH370重大空难遇难人员资料调查',
            des:'发起：张三 - 北京泰康人寿有限公司',
            progress:'完成进度4/8',
            time:'2015-02-04'
        },
         {
            title:'MH370重大空难遇难人员资料调查',
            des:'发起：张三 - 北京泰康人寿有限公司',
            progress:'完成进度4/8',
            time:'2015-02-04'
        },
         {
            title:'MH370重大空难遇难人员资料调查',
            des:'发起：张三 - 北京泰康人寿有限公司',
            progress:'完成进度4/8',
            time:'2015-02-04'
        },
         {
            title:'MH370重大空难遇难人员资料调查',
            des:'发起：张三 - 北京泰康人寿有限公司',
            progress:'完成进度4/8',
            time:'2015-02-04'
        },
         {
            title:'MH370重大空难遇难人员资料调查',
            des:'发起：张三 - 北京泰康人寿有限公司',
            progress:'完成进度4/8',
            time:'2015-02-04'
        },

type = 0所有用户  1进行中 2已完成 3已过期  
sort = 0发布时间排序  1截止时间排序  3进度排序 

*******/
/*排插列表接口*/
router.get('/getList', function(req, res) {
	var type = url.parse(req.url,true).query.type;  //pathname => select  
    var sort = url.parse(req.url,true).query.sort;  //pathname => select  
       	res.json(200, { 
        status: 1, // 接口返回值状态码
        errMsg: '啦啦信息', // 接口返回值错误信息，正确则为空
        result: { 
        	type:type,
        	sort:sort,
        	total:5,//总数
        	list:[
        		{
                    id: 123456,
		            title:'印花无袖连衣裙',
		            des:'木瑾惠韩版印花无袖连衣裙欧根纱小清新气质',
		            progress:'月销量1425582件',
		            time:'2015-02-04 首次上架',
		            status:''

		        },
		         {
                    id: 123456,
                    title:'印花无袖连衣裙',
                    des:'木瑾惠韩版印花无袖连衣裙欧根纱小清新气质',
                    progress:'月销量1425582件',
                    time:'2015-02-04 首次上架',
                    status:''

                },	{
                    id: 123456,
                    title:'印花无袖连衣裙',
                    des:'木瑾惠韩版印花无袖连衣裙欧根纱小清新气质',
                    progress:'月销量1425582件',
                    time:'2015-02-04 首次上架',
                    status:''

                },
		         {
                    id: 123456,
                    title:'印花无袖连衣裙',
                    des:'木瑾惠韩版印花无袖连衣裙欧根纱小清新气质',
                    progress:'月销量1425582件',
                    time:'2015-02-04 首次上架',
                    status:''

                },
		         {
                    id: 123456,
                    title:'印花无袖连衣裙',
                    des:'木瑾惠韩版印花无袖连衣裙欧根纱小清新气质',
                    progress:'月销量1425582件',
                    time:'2015-02-04 首次上架',
                    status:''

                },	{
                    id: 123456,
                    title:'印花无袖连衣裙',
                    des:'木瑾惠韩版印花无袖连衣裙欧根纱小清新气质',
                    progress:'月销量1425582件',
                    time:'2015-02-04 首次上架',
                    status:''

                },
				{
                    id: 123456,
                    title:'印花无袖连衣裙',
                    des:'木瑾惠韩版印花无袖连衣裙欧根纱小清新气质',
                    progress:'月销量1425582件',
                    time:'2015-02-04 首次上架',
                    status:''

                },
		        {
                    id: 123456,
                    title:'印花无袖连衣裙',
                    des:'木瑾惠韩版印花无袖连衣裙欧根纱小清新气质',
                    progress:'月销量1425582件',
                    time:'2015-02-04 首次上架',
                    status:''

                },
		    ]    
        }
    })
});
/*领取悬任务接口*/
router.post('/getReward', function(req, res) {
    console.log('--------');
    res.json(200, {
        status: 1,
        errMsg: '',
        result: {
            code: 1
        }
    });
});
/*悬赏任务列表接口*/
router.get('/rewardList', function(req, res) {
	var type = url.parse(req.url,true).query.type;  //pathname => select  
    var sort = url.parse(req.url,true).query.sort;  //pathname => select  
       	res.json(200, { 
        status: 1, // 接口返回值状态码
        errMsg: '失败信息', // 接口返回值错误信息，正确则为空
        result: { 
        	type:type,
        	sort:sort,
        	total:5,//总数
        	list:[
        		{
        			id:'1',
                    title:'旺旺零食大礼包',
                    des:'节日休闲零食含进口零食大礼包约2340g',
		            progress:'月销售量14348件',
		            time:'首次上架时间：2017-07-11',
		            status:''

		        },
		         {	
		         	id:'2',
		            title:'旺旺零食大礼包',
		            des:'节日休闲零食含进口零食大礼包约2340g',
		            progress:'月销售量14348件',
		            time:'首次上架时间：2017-07-11',
		            status:''

		        },
		         {
		         	id:'3',
		            title:'旺旺零食大礼包',
		            des:'节日休闲零食含进口零食大礼包约2340g',
		            progress:'月销售量14348件',
		            time:'首次上架时间：2017-07-11',
		            status:'已完成'
		        },
		         {
		         	id:'4',
		            title:'旺旺零食大礼包',
		            des:'节日休闲零食含进口零食大礼包约2340g',
		            progress:'月销售量14348件',
		            time:'首次上架时间：2017-07-11',
		            status:'已过期'
		        },
		         {
		         	id:'5',
		            title:'旺旺零食大礼包',
		            des:'节日休闲零食含进口零食大礼包约2340g',
		            progress:'月销售量14348件',
		            time:'首次上架时间：2017-07-11',
		            status:''

		        },
		        {
		        	id:'6',
		            title:'旺旺零食大礼包',
		            des:'节日休闲零食含进口零食大礼包约2340g',
		            progress:'月销售量14348件',
		            time:'首次上架时间：2017-07-11',
		            status:''

		        },

				{
					id:'7',
		            title:'旺旺零食大礼包',
		            des:'节日休闲零食含进口零食大礼包约2340g',
		            progress:'月销售量14348件',
		            time:'首次上架时间：2017-07-11',
		            status:''

		        },

		         {
		         	id:'8',
		            title:'旺旺零食大礼包',
		            des:'节日休闲零食含进口零食大礼包约2340g',
		            progress:'月销售量14348件',
		            time:'首次上架时间：2017-07-11',
		            status:''

		        }
		    ]    
        }
    })
});

/*悬赏任务列表接口*/
router.get('/tripList', function(req, res) {
	var type = url.parse(req.url,true).query.type;  //pathname => select  
    var sort = url.parse(req.url,true).query.sort;  //pathname => select  
       	res.json(200, { 
        status: 1, // 接口返回值状态码
        errMsg: '失败信息', // 接口返回值错误信息，正确则为空
        result: { 
        	type:type,
        	sort:sort,
        	total:5,//总数
        	list:[
        		{
        			id:'1',
                    title:'印花无袖连衣裙',
                    des:'木瑾惠韩版印花无袖连衣裙欧根纱小清新气质A字裙女1801 花色 M',
		            progress:'月销售量14348件',
		            time:'2015-02-04',
		            status:''

		        },
		         {	
		         	id:'2',
		            title:'MH370重大空难遇难人员资料调查',
		            des:'发起：张三 - 北京泰康人寿有限公司',
		            progress:'月销售量14348件',
		            time:'2015-02-04',
		            status:''

		        },
		         {
		         	id:'3',
		            title:'MH370重大空难遇难人员资料调查',
		            des:'发起：张三 - 北京泰康人寿有限公司',
		            progress:'月销售量14348件',
		            time:'2015-02-04',
		            status:'已完成'
		        },
		         {
		         	id:'4',
		            title:'MH370重大空难遇难人员资料调查',
		            des:'发起：张三 - 北京泰康人寿有限公司',
		            progress:'月销售量14348件',
		            time:'2015-02-04',
		            status:'已过期'
		        },
		         {
		         	id:'5',
		            title:'MH370重大空难遇难人员资料调查',
		            des:'发起：张三 - 北京泰康人寿有限公司',
		            progress:'月销售量14348件',
		            time:'2015-02-04',
		            status:''

		        },
		        {
		        	id:'6',
		            title:'MH370重大空难遇难人员资料调查',
		            des:'发起：张三 - 北京泰康人寿有限公司',
		            progress:'月销售量14348件',
		            time:'2015-02-04',
		            status:''

		        },

				{
					id:'7',
		            title:'MH370重大空难遇难人员资料调查',
		            des:'发起：张三 - 北京泰康人寿有限公司',
		            progress:'完成进度4/8',
		            time:'2015-02-04',
		            status:''

		        },

		         {
		         	id:'8',
		            title:'MH370重大空难遇难人员资料调查',
		            des:'发起：张三 - 北京泰康人寿有限公司',
		            progress:'完成进度4/8',
		            time:'2015-02-04',
		            status:''

		        }
		    ]    
        }
    })
});


module.exports = router;
