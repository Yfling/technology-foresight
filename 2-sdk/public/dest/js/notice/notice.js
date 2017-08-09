(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var scroller = new IScroll('#scrollWrap', {
        mouseWheel: true,
        preventDefault: false
    });

    var $detail = $('#detail');
    var page = 0;
    var listTpl = '{{#for $item in data}}'
        +            '<a href="/noticeDetail?id={{$item.id}}">'
        +                '{{#if +$item.isRead > 0}}'
        +                '<i></i>'
        +                '{{/if}}'
        +                '<div class="left">'
        +                    '<p class="des">{{$item.des}}</p>'
        +                    '<p class="time">{{$item.time}}</p>'
        +                '</div>'
        +                '<div class="right">'
        +                    '<div class="arrow"></div>'
        +                '</div>'
        +            '</a>'
        +            '{{/for}}';



    function init(){
        render(page);
    }
    function render(page){
        getData(page).then(function(data){
            $detail.append(tpl(listTpl, data.result));
            scroller.refresh();
        })
    }
    function getData(page){
        var d = $.Deferred();
        return $.ajax({
            url: '/getNoticeList?page=' + page
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
})();