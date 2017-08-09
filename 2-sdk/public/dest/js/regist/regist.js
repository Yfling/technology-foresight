(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var scroller = new IScroll('#scrollWrap', {
        mouseWheel: true,
        preventDefault: false
    });

    var $mod = $("#regist");
    var $verifyBtn = $mod.find(".verify-btn");
    var $telInput = $mod.find('.tel-wrap input');
    var $errMsgMod = $("#errMsg");
    var $errMsgWrap = $errMsgMod.find('.wrap');
    var verifyCode = '';
    var isGettingCode = false;

    function init(){
        bindEvent();
    }
    function bindEvent(){
        $mod.on('tap', '.verify-btn', function(){
            if(isGettingCode) return;
            if(!$.trim($telInput.val())){
                alert('手机号码不能为空');
                return;
            }
            isGettingCode = true;
            var times = 60;
            $verifyBtn.addClass('loading')
                .text(times + '秒后可重新获取');
            var timer = setInterval(function(){
                if(times > 0){
                    times--;
                    $verifyBtn.addClass('loading')
                        .text(times + '秒后可重新获取');
                }else{
                    isGettingCode = false;
                    clearInterval(timer);
                    $verifyBtn.removeClass('loading')
                        .text('获取验证码');
                }

            }, 1000);

            getVerify().then(function(data){
            });
        });
        $errMsgMod.on('tap', 'button', function(){
            $errMsgMod.hide();
        });
    }
    function getVerify(){
        var d = $.Deferred();
        return $.ajax({
            url: '/getVerify'
        }).done(function(data){
            if(data.status > 0){
                d.resolve(data.result.code);
            }else{
                d.reject(data.errMsg);
            }
            console.log(data);
        }).fail(function(data){
            d.reject(data);
        });
    }
    init();
})();