(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var $publish = $('#publish');
    var $tab = $publish.find('.tab');
    var $tabs = $tab.find('.item');
    var $mainPublish = $("#mainPublish");
    var $checkWrap = $mainPublish.find('.check-wrap');
    var $rewardWrap = $mainPublish.find('.reward-wrap');
    var $tripWrap = $mainPublish.find('.trip-wrap');

    var $pannels = {
        $checkPannel: $checkWrap.find('.check-pannel'),
        $rewardPannel: $rewardWrap.find('.reward-pannel'),
        $tripPannel: $tripWrap.find('.trip-pannel')
    }
    var curPage = {
            'check': 0,
            'reward': 0,
            'trip': 0
        };
    var curIndex = tool.getQuery()['type'] || 0;
    var tpls = {
            'check': '{{#for $item in task}}'
            +        '<a href="/checkDetail?id={{$item.id}}" class="per-list">'
            +           '<p class="content">{{$item.title}}</p>'
            +           '<div class="wrap">'
            +               '<span class="percent">完成进度{{$item.progress.finished}}/{{$item.progress.all}}</span>'
            +               '<span class="deadline">截止日期：{{$item.deadline}}</span>'
            +           '</div>'
            +        '</a>'
            +        '{{/for}}',
            'reward': '{{#for $item in task}}'
            +        '<a href="/rewardDetail?id={{$item.id}}" class="per-list">'
            +           '<p class="content">{{$item.title}}</p>'
            +           '<div class="wrap">'
            +               '<span class="prize-num">奖励{{$item.prizeNum}}福豆</span>'
            +               '<span class="deadline">截止日期：{{$item.deadline}}</span>'
            +           '</div>'
            +        '</a>'
            +        '{{/for}}',
            'trip': '{{#for $item in task}}'
            +        '<a href="/tripDetail?id={{$item.id}}" class="per-list">'
            +           '<p class="content">{{$item.title}}</p>'
            +           '<span class="go-time">前往日期：{{$item.date}}</span>'
            +        '</a>'
            +        '{{/for}}'
    };

    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        initialSlide: curIndex,
        onSlideChangeStart: function(s){
            curIndex = s.activeIndex;
            changeTab(curIndex);
        }
    });
    var scrolls = {
    	checkScroll: new IScroll($checkWrap[0], {
    		mouseWheel: true,
            preventDefault: false
    	}),
        rewardScroll: new IScroll($rewardWrap[0], {
            mouseWheel: true,
            preventDefault: false
        }),
        tripScroll: new IScroll($tripWrap[0], {
            mouseWheel: true,
            preventDefault: false
        })
    }
    function init(){
        render('check').done(function(data){
            curPage['check'] ++;
            scrolls['checkScroll'].refresh();
        });
        render('reward').done(function(data){
            curPage['reward'] ++;
            scrolls['rewardScroll'].refresh();
        });
        render('trip').done(function(data){
            curPage['trip'] ++;
            scrolls['tripScroll'].refresh();
        });
        bindEvent();
    }
    function render(type){
        var type = type || $tabs.eq(curIndex).data('type');
        return getData(type).then(function(data){
            $pannels['$' + type + 'Pannel'].append(tpl(tpls[type], data.result));
        });
    }
    function bindEvent(){
        $tab.on('tap', '.item', function(){
            var $this = $(this);
            var index = $this.index();
            swiper.slideTo(index, 400);
            changeTab(index);
        });
    }
    function changeTab(index){
        $tabs.removeClass('cur');
        $tabs.eq(index).addClass('cur');
    }
    function getData(type){
        var type = type || $tabs.eq(curIndex).data('type');
        var d = $.Deferred();
        return $.ajax({
            url: '/publish/api/?type=' + type + '&page=' + curPage[type] + 1
        }).done(function(data){
            if(data.status > 0){
                d.resolve(data.result);
            }else{
                d.reject();
            }
        }).fail(function(){
            d.reject();
        });
        return d.promise();
    }
    init();
})()