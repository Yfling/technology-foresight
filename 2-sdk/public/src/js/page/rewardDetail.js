(function(){
    var scroller = new IScroll('#scrollWrap', {
        mouseWheel: true,
        preventDefault: false
    });
    var $interactive = $('#interactive');
    var $title = $('#title');


    function init(){
        bindEvent();
    }
    function bindEvent(){
        $interactive.on('tap', '.receive', function(){
            var $this = $(this);
            if($this.hasClass('unreceived')){
                receive();
            }
        });
        $title.on('tap', '.interactive', function(){
            $(this).find('ul').toggleClass('hide');
        });
    }
    function receive(){
        return $.ajax({
            url: '/receiveReward?id=' + conf.reward.id
        }).done(function(data){
            if(data.status > 0 && data.result==='success'){
                changeStatus();
                window.location = '/pull/reward';
            }
        }).fail(function(){

        });
    }
    function changeStatus(){
        $interactive.find('.receive').removeClass('unreceived')
            .addClass('received')
            .find('p')
            .text('已认领');
    }
    init();
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
})();