(function(){
    var $mod = $('#commonMenu');
    var $body = $('body');
    var tpl = '<div id="publishLayer" class="mod-publish-layer">'
            +        '<div class="tasks">'
            +            '<a class="check" href="/publish/check2">'
            +                '<div class="icon-wrap">'
            +                    '<img width="20" height="25" src="/dest/img/page/index/paicha-icon.png">'
            +                '</div>'
            +                '<p>衣</p>'
            +            '</a>'
            +            '<a class="reward" href="/publish/reward2">'
            +                '<div class="icon-wrap">'
            +                    '<img width="24" height="29" src="/dest/img/page/index/xuanshang-icon.png">'
            +                '</div>'
            +                '<p>食</p>'
            +            '</a>'
            +            '<a class="trip" href="/publish/trip2">'
            +                '<div class="icon-wrap">'
            +                    '<img width="24" height="23" src="/dest/img/page/index/xingcheng-icon.png">'
            +                '</div>'
            +                '<p>行</p>'
            +            '</a>'
            +        '</div>'
            +        '<div class="close"></div>'
            +    '</div>';

    function init(){
        bindEvent();
    }
    function bindEvent(){
        $body.on('tap', '.common-publish', function(){
            render();
        })
        $body.on('tap', '#publishLayer .close', function(){
            $('#publishLayer').remove();
        });
    }
    function render(){
        $body.append(tpl);
    }

    init();
})();