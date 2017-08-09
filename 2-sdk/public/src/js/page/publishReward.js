(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var scroller = new IScroll('#scrollWrap', {
        mouseWheel: true,
        preventDefault: false
    });
    var $form = $('#form');
    var $errMsgMod = $("#errMsg");
    var $errMsgWrap = $errMsgMod.find('.wrap');
    var $levels = $form.find('.level');
    var $total = $form.find('.total');

    var $imgList = $form.find('.file-list');
    var $fileWrap = $form.find('.file-wrap');
    var $fileWrap2 = $form.find('.file-wrap2');
    var imageNum = 0;
    var files = [];
    
    function init(){
        bindEvent();
        new DestEditor($form.find('.dest .content'), {
            city: conf.user.city || ''
        });
        $('#datetimepicker').datepicker({
            format : 'yyyy-mm-dd'
        });
    }
    function bindEvent(){
        $form.on('tap', '.levels .level', function(){
            $levels.removeClass('cur');
            $(this).addClass('cur');
            $total.text('本次共奖励' + $(this).find('input').val() + '福豆');
        })
        .on('tap', '.file i', function(){
            var $this = $(this);
            // var index = $this.closest('.file').index();
            remove($this.closest('.file'));
        });
        $form.find('.upload-input').on('change', function(e){
            selectFile(e);
        });
        $form.find('.dest .content').on('destchange', function(e, d){
            $(this).find('input').val(d.city + ' ' + d.dest + ' ' + d.detail);
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
                        src: this.result,
                        index: files.length
                    }));
                }
            })(f);
            reader.readAsDataURL(f);
        }
    }
    function getTpl(data){
        return '<div class="file">'
        +          '<img class="preview" src="' + data.src + '">'
        +          '<input class="hidden" type="hidden" name="img' + data.index + '" value="' + data.src + '">'
        +          '<i></i>'
        +      '</div>';
    }
    init();
})();