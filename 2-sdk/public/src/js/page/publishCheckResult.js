(function(){
    var $form = $('#form');
    var $insureItem = $form.find('.insure .item');
    var $isPayItems = $form.find('.isPay .item');
    var $insureInput = $form.find('.insure input');
    var $isPayInput = $form.find('.isPay input');
    var $plus = $form.find('.plus');
    var $errMsgMod = $("#errMsg");
    var $errMsgWrap = $errMsgMod.find('.wrap');
    var $type = $form.find('.type');
    var $num = $form.find('.num');
    var $time = $form.find('.time');
    var $isPay = $form.find('.isPay');
    var $des = $form.find('.des');
    var $upload = $form.find('.upload');
    var $types = $form.find('.types');
    var $typeClone = $types.eq(0).clone();

    var $imgList = $form.find('.file-list');
    var $fileWrap = $form.find('.file-wrap');
    var $fileWrap2 = $form.find('.file-wrap2');
    var imageNum = 0;
    var files = [];

    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var scroller = new IScroll('#scrollWrap', {
        mouseWheel: true,
        preventDefault: false
    });
    
    function init(){
        bindEvent();
        $('#datetimepicker').datepicker({
            format : 'yyyy-mm-dd'
        });
    }
    function bindEvent(){
        $form.on('tap', '.insure .item', function(){
            var $item = $(this).closest('.item');
            $type = $form.find('.type');
            $num = $form.find('.num');
            $time = $form.find('.time');
            $isPay = $form.find('.isPay');
            $insureItem.removeClass('selected');
            $item.addClass('selected');
            if($item.hasClass('yes')){
                $insureInput.val(true);
                $type.removeClass('hide');
                $num.removeClass('hide');
                $time.removeClass('hide');
                $des.removeClass('hide');
                $isPay.removeClass('hide');
                $plus.removeClass('hide');
                $upload.removeClass('hide');
            }else if($item.hasClass('no')){
                $insureInput.val(false);
                $type.addClass('hide');
                $num.addClass('hide');
                $time.addClass('hide');
                $des.addClass('hide');
                $isPay.addClass('hide');
                $plus.addClass('hide');
                $upload.addClass('hide');
            }
            scroller.refresh();
        })
        .on('tap', '.isPay .item', function(){
            var $item = $(this);
            $isPayItems = $item.closest('.types').find('.isPay .item');
            $isPayInput = $item.closest('.types').find('.isPay input');
            $isPayItems.removeClass('selected');
            $item.addClass('selected');
            if($item.hasClass('yes')){
                $isPayInput.val(true);
            }else{
                $isPayInput.val(false);
            }
        })
        .on('tap', '.plus span', function(){
            var $this = $(this);
            $types = $form.find('.types');
            var index = $types.length + 1;
            console.log($types.length);
            $typeClone = $types.eq(0).clone();
            $typeClone.find('.type input').attr('name', 'type' + index);
            $typeClone.find('.num input').attr('name', 'num' + index);
            $typeClone.find('.time input').attr('name', 'time' + index);
            $typeClone.find('.isPay input').attr('name', 'isPay' + index);
            $typeClone.find('.wrap').removeClass('hide');
            $typeClone.insertBefore($this.closest('.plus'));
            scroller.refresh();
        });
        $form.find('.upload-input').on('change', function(e){
            selectFile(e);
        })
        $form.on('tap', '.file i', function(){
            var $this = $(this);
            // var index = $this.closest('.file').index();
            remove($this.closest('.file'));
        });
        $errMsgMod.on('tap', 'button', function(){
            $errMsgMod.hide();
        });
    }
    function remove($elem){
        console.log($form.serialize());
        var index = $elem.index();
        $elem.remove();
        delete files[index].name;
        delete files[index].size;
        imageNum--;
        if(imageNum < 1){
            $imgList.addClass('hide');
            $fileWrap2.removeClass('hide');
        }
        console.log(files.length);
    }
    function selectFile(e){
        files = e.target.files;
        for(var i=0, len=files.length; i<len; i++){
            var reader = new FileReader();
            var f = files[i];
            reader.onload = (function(file){
                console.log(file);
                return function(e){
                console.log(this);
                    imageNum ++;
                    $imgList.removeClass('hide');
                    $fileWrap2.addClass('hide');
                    $fileWrap.before(getTpl({
                        src: this.result
                    }));
                }
            })(f);
            reader.readAsDataURL(f);
        }
    }
    function getTpl(data){
        return '<div class="file">'
        +          '<img class="preview" src="' + data.src + '">'
        // +          '<input class="hidden" type="hidden" name="img' + data.index + '" value="' + data.src + '">'
        +          '<i></i>'
        +      '</div>';
    }

    init();
})();