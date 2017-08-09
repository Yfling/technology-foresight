(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var scroller = new IScroll('#scrollWrap', {
        mouseWheel: true,
        preventDefault: false
    });

    var $detail = $('#detail');
    var page = 0;
    var listTpl = '{{#for $item in data}}'
        +            '<a href="/{{$item.task.type}}Detail?id={{$item.task.id}}">'
        +                '<div class="left">'
        +                    '<p class="name">{{$item.name}}</p>'
        +                    '<p class="time">{{$item.time}}</p>'
        +                '</div>'
        +                '<div class="right">'
        +                    '<p class="plus num">{{#if +$item.status > 0}}+{{/if}}{{#if +$item.status < 0}}-{{/if}}{{$item.num}}</p>'
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
            url: '/getFudouList?page=' + page
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