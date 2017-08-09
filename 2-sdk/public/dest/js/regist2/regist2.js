(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var $regist = $('#regist');
    var $errMsgMod = $("#errMsg");
    var $errMsgWrap = $errMsgMod.find('.wrap');
    var $photo = $regist.find('.photo-wrap img');
    var $photoHiddenInput = $regist.find('.photo-wrap .hidden');
    var $certifyImg = $regist.find('.certify-wrap .preview');
    var $certifyHiddenInput = $regist.find('.certify-wrap .hidden');

    var $scopeItem = $regist.find('.scope .item');
    var $scopeInput = $regist.find('.scope input');

    var scroller = new IScroll('#scrollWrap', {
        mouseWheel: true,
        preventDefault: false
    });
    function init(){
        bindEvent();
        new AreaPicker($regist.find('.zone-wrap input'));
        new CorpPicker($regist.find('.company-wrap input'));
    }
    function bindEvent(){
        $errMsgMod.on('tap', 'button', function(){
            $errMsgMod.hide();
        });
        $regist.find('.photo-wrap .upload-input').on('change', function(e){
            selectFile(e);
        });
        $regist.find('.certify-wrap .upload-input').on('change', function(e){
            selectCertify(e);
        });
        $regist.find('.zone-wrap input').on('citychange', function(e, data){
            $(this).val(data.sheng.name + ' ' + data.shi.name);
        });
        $regist.find('.company-wrap input').on('corpchange', function(e, data){
            $(this).val(data.des);
            console.log(data);
        });
        $regist.on('tap', '.input-wrap.scope .item', function(){
            var $item = $(this).closest('.item');
            $scopeItem.removeClass('selected');
            $item.addClass('selected');
            if($item.hasClass('trunk')){
                $scopeInput.val('trunk');
            }else if($item.hasClass('branch')){
                $scopeInput.val('branch');
            }
        });
    }
    function selectFile(e){
        var files = e.target.files;
        for(var i=0, len=files.length; i<len; i++){
            var reader = new FileReader();
            var f = files[i];
            reader.onload = (function(file){
                return function(e){
                    $photo.attr('src', this.result);
                    $photoHiddenInput.val(this.result);
                }
            })(f);
            reader.readAsDataURL(f);
        }
    }
    function selectCertify(e){
        var files = e.target.files;
        for(var i=0, len=files.length; i<len; i++){
            var reader = new FileReader();
            var f = files[i];
            reader.onload = (function(file){
                return function(e){
                    $certifyImg.attr('src', this.result);
                    $certifyHiddenInput.val(this.result);
                }
            })(f);
            reader.readAsDataURL(f);
        }
    }
    init();
})();