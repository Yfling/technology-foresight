(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var scroller = new IScroll('#scrollWrap', {
        mouseWheel: true,
        preventDefault: false
    });

    var $judge = $('#judge');
    var $comment = $('#comment');
    var $judgeBtn = $('#judgeBtn');
    var $stars = $judge.find('.star');
    var itemTpl = '<ul>'
                +       '{{#for $item in data}}'
                +       '<li>'
                +           '<div class="extra">'
                +               '<div class="wrap">'
                +                   '<span class="tel">{{$item.tel}}</span>'
                +                   '<span class="time">{{$item.time}}</span>'
                +               '</div>'
                +               '<span class="stars"><span class="star" style="width:{{$item.star/5*100}}%"></span></span>'
                +           '</div>'
                +           '<p class="content">{{$item.content}}</span>'
                +       '</li>'
                +       '{{/for}}'
                +  '</ul>';
    var num = 0;

    function init(){
        render();
        bindEvent();
    }
    function render(){
        getData().then(function(data){
            $comment.append(tpl(itemTpl, data));
            scroller.refresh();
        });
    }
    function bindEvent(){
        $judge.on('tap', '.star', function(){
            var index = $(this).index();
            $stars.removeClass('yellow');
            $stars.each(function(i, elem){
                if(i <= index){
                    $(elem).addClass('yellow');
                }
            });
            num = index + 1;
            $judgeBtn.removeClass('hide');
        });
        $judgeBtn.on('tap', '.not-judge', function(){
            giveUpJudge().then(function(data){
                history.back();
            });
            $judgeBtn.addClass('hide');
        })
        .on('tap', '.judge', function(){
            doJudge().then(function(data){
                window.location = document.referrer;
                // history.back();
            });
            $judgeBtn.addClass('hide');
        });
    }
    function doJudge(){
        var d = $.Deferred();
        $.ajax({
            type: 'POST',
            url: '/doJudge?id=' + conf.id,
            data: {
                level: num,
                des: $judge.find('textarea').val()
            }
        }).done(function(data){
            if(data.status > 0 && data.result.data > 0){
                d.resolve(data.result);
            }else{
                d.reject(data);
            }
        }).fail(function(data){
            d.reject(data);
        });
        return d.promise();
    }
    function giveUpJudge(){
        var d = $.Deferred();
        $.ajax({
            url: '/giveUpJudge?id=' + conf.id
        }).done(function(data){
            if(data.status > 0 && data.result.data > 0){
                d.resolve(data.result);
            }else{
                d.reject(data);
            }
        }).fail(function(data){
            d.reject(data);
        });
        return d.promise();
    }
    function getData(){
        var d = $.Deferred();
        $.ajax({
            url: '/commentListAjax?id=' + conf.id
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