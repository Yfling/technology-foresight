(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var scroller = new IScroll('#scrollWrap', {
        mouseWheel: true,
        preventDefault: false
    });

    var $title = $('#title');

    function init(){
        bindEvent();
    }
    function bindEvent(){
        $title.on('tap', '.interactive', function(){
            $(this).find('ul').toggleClass('hide');
        });
    }
    init();
})();