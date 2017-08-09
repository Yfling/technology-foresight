(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var scroller = new IScroll('#scrollWrap', {
        mouseWheel: true,
        preventDefault: false
    });
    var $interactive = $('#interactive');
    var $title = $('#title');
    var $modPhoto = $('#photo');

    function init(){
        bindEvent();
    }
    function bindEvent(){
        $interactive.on('tap', function(){
            var $this = $(this);
            if($this.hasClass('unreceived')){
                receiveCheck();
            }
        });
        $title.on('tap', '.interactive', function(){
            $(this).find('ul').toggleClass('hide');
        });
        $modPhoto.on('tap', 'li img', function(){
            new ImgViewer($(this));
        });
    }
    function receiveCheck(){
        return $.ajax({
            url: '/receiveCheck'
        }).done(function(data){
            if(data.status > 0 && data.result==='success'){
                changeStatus();
            }
        }).fail(function(){

        });
    }
    function changeStatus(){
        $interactive.removeClass('unreceived')
            .addClass('received')
            .attr('href', 'bbb')
            .find('p')
            .text('公布调查结果');
    }
    init();
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
})();