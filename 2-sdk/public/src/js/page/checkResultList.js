(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var scroller = new IScroll('#scrollWrap', {
        mouseWheel: true,
        preventDefault: false
    });

    var $content = $('#content');
    var itemTpl = '<ul>'
                +       '{{#for $item in data}}'
                +       '<li>'
                +           '<a href="/checkResultDetail?id={{$item.id}}">'
                +               '<span class="company">{{$item.company}}</span>'
                +               '<span class="type">{{$item.type}}</span>'
                +               '<span class="num">{{$item.num}}</span>'
                +               '<span class="time">{{$item.time}}</span>'
                +           '</a>'
                +           '{{#if $item.isMine}}'
                +           '<i class="mine">我</i>'
                +           '{{/if}}'
                +       '</li>'
                +       '{{/for}}'
                +  '</ul>';

    function init(){
        render();
    }
    function render(){
        getData().then(function(data){
            $content.append(tpl(itemTpl, data));
            scroller.refresh();
        });
    }
    function getData(){
        var d = $.Deferred();
        $.ajax({
            url: '/checkResultListAjax?id=' + conf.check.id
        }).done(function(data){
            if(data.status > 0){
                d.resolve(data.result);
            }else{
                d.reject(data);
            }
        }).fail(function(data){
            d.reject(data);
        });
        return d.promise();
    }
    init();
})();