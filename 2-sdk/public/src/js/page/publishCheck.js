(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var scroller = new IScroll('#scrollWrap', {
        mouseWheel: true,
        preventDefault: false
    });
    var $form = $('#form');
    var $errMsgMod = $("#errMsg");
    var $errMsgWrap = $errMsgMod.find('.wrap');

    var $imgList = $form.find('.file-list');
    var $fileWrap = $form.find('.file-wrap');
    var $fileWrap2 = $form.find('.file-wrap2');
    var imageNum = 0;
    var files = [];

    var $scopeItem = $form.find('.scope .item');
    var $scopeInput = $form.find('.scope input');
    var $branchCity = $form.find('.branch-city');

    function init(){
        bindEvent();
        $('#datetimepicker').datepicker({
            format : 'yyyy-mm-dd'
        });
        new AreaPicker($form.find('.branch-city .content'));
    }
    function bindEvent(){
        $errMsgMod.on('tap', 'button', function(){
            $errMsgMod.hide();
        });
        $form.on('tap', '.file i', function(){
            var $this = $(this);
            // var index = $this.closest('.file').index();
            remove($this.closest('.file'));
        });
        $form.on('tap', '.item', function(){
            var $item = $(this).closest('.item');
            $scopeItem.removeClass('selected');
            $item.addClass('selected');
            if($item.hasClass('trunk')){
                $scopeInput.val('trunk');
                $branchCity.addClass('hide');
            }else if($item.hasClass('branch')){
                $scopeInput.val('branch');
                $branchCity.removeClass('hide');
            }
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
        $form.find('.dest .content').on('destchange', function(e, d){
            $(this).find('input').val(d.city + ' ' + d.dest + ' ' + d.detail);
        });

        $branchCity.find('.content').on('citychange', function(e, data){
            $(this).find('input').val(data.sheng.name + ' ' + data.shi.name);
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