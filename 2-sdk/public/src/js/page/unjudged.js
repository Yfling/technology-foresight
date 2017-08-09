(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var $unjudged = $('#unjudged');
    var $tab = $unjudged.find('.tab');
    var $tabs = $tab.find('.item');
    var $mainUnjudged = $("#mainUnjudged");
    var $checkWrap = $mainUnjudged.find('.check-wrap');
    var $rewardWrap = $mainUnjudged.find('.reward-wrap');

    var $pannels = {
        $checkPannel: $checkWrap.find('.check-pannel'),
        $rewardPannel: $rewardWrap.find('.reward-pannel')
    }
    var curPage = {
            'check': 0,
            'reward': 0
        };
    var curIndex = tool.getQuery()['type'] || 0;
    var tpls = {
            'check': '{{#for $item in data}}'
            +        '<div class="per-list">'
            +        '<a href="/checkDetail?id={{$item.task.id}}">'
            +           '<div class="wrap main">'
            +               '<p class="addr">{{$item.task.addr}}</p>'
            +               '<div class="arrow"></div>'
            +           '</div>'
            +           '<div class="wrap sub">'
            +               '<span class="publisher">领取人：{{$item.receiver.name}}</span>'
            +               '<span class="finishe-time">领取时间：{{$item.task.receiveTime}}</span>'
            +           '</div>'
            +        '</a>'
            +        '<div class="judge"><a href="/mineinfo?id={{$item.receiver.id}}&taskId={{$item.task.id}}" class="btn">评价</a></div>'
            +        '</div>'
            +        '{{/for}}',
            'reward': '{{#for $item in data}}'
            +        '<div class="per-list">'
            +        '<a href="/rewardDetail?id={{$item.task.id}}">'
            +           '<div class="wrap main">'
            +               '<p class="addr">{{$item.task.addr}}</p>'
            +               '<div class="arrow"></div>'
            +           '</div>'
            +           '<div class="wrap sub">'
            +               '<span class="publisher">领取人：{{$item.receiver.name}}</span>'
            +               '<span class="finishe-time">领取时间：{{$item.task.receiveTime}}</span>'
            +           '</div>'
            +        '</a>'
            +        '<div class="judge"><a href="/mineinfo?id={{$item.receiver.id}}&taskId={{$item.task.id}}" class="btn">评价</span></a></div>'
            +        '</div>'
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
        // checkScroll: new IScroll($checkWrap[0], {
        //     mouseWheel: true,
        //     preventDefault: false
        // }),
        rewardScroll: new IScroll($rewardWrap[0], {
            mouseWheel: true,
            preventDefault: false
        })
    }
    function init(){
        // render('check').done(function(data){
        //     curPage['check'] ++;
        //     scrolls['checkScroll'].refresh();
        // });
        render('reward').done(function(data){
            curPage['reward'] ++;
            scrolls['rewardScroll'].refresh();
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
            url: '/unfinish/list?type=' + type + '&page=' + (curPage[type] + 1)

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