(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var scroller = new IScroll('#scrollWrap', {
        mouseWheel: true,
        preventDefault: false
    });

    var $errMsgMod = $("#errMsg");
    var $errMsgWrap = $errMsgMod.find('.wrap');
    function init(){
        bindEvent();
    }
    function bindEvent(){
        $errMsgMod.on('tap', 'button', function(){
            $errMsgMod.hide();
        });
    }
    init();
})();