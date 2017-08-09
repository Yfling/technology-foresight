(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var scroller = new IScroll('#scrollWrap', {
        mouseWheel: true,
        preventDefault: false
    });
    var $form = $('#form');
    var $errMsgMod = $("#errMsg");
    var $errMsgWrap = $errMsgMod.find('.wrap');

    function init(){
        bindEvent();
        new DestEditor($form.find('.dest .content'), {
            city: conf.user.city || ''
        });
        // $('#datetimepicker').datepicker({
        //     format : 'yyyy-mm-dd hh:mm:ss'
        // });
        $('#datetimepicker2').datepicker({
            format : 'yyyy-mm-dd'
        });
    }
    function bindEvent(){
        $form.on('tap', '.dest .content', function(){

        });
        $form.find('.dest .content').on('destchange', function(e, d){
            $(this).find('input').val(d.city + ' ' + d.dest + ' ' + d.detail);
        });
        $errMsgMod.on('tap', 'button', function(){
            $errMsgMod.hide();
        });
    }
    init();
})();