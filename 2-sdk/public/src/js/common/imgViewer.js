(function(){
    var $body = $('body');
    function ImgViewer($img){
        this.$mod = $('#imgViewer');
        this.$img = $img;
        this.img = this.$img.attr('src');
        this.init();
    }
    ImgViewer.prototype = {
        init: function(){
            this.render();
            this.$mod = $('#imgViewer');
            this.setImgWrapSize(this.getImgSize(this.img));
            this.bindEvent();
            this.zoom();
        },
        bindEvent: function(){
            var self = this;
            this.$mod.on('tap', function(e){
                var $target = $(e.target);
                if($target.closest('img').length){
                    return;
                }
                self.destroy();
            });
        },
        render: function(){
            var self = this;
            if(this.$mod.length){
                this.$mod.remove();
            }else{
                $body.append(tpl(this.viewerTpl, {
                    img: {
                        src: self.img
                    }
                }));
            }
        },
        getImgSize: function(src){
            var res = {};
            var img = new Image();
            img.src = src;
            res.height = img.height;
            res.width = img.width;
            return res;
        },
        setImgWrapSize: function(size){
            this.$mod.find('.img-wrap').css({
                width: size.width / 2,
                height: size.height / 2
            });
        },
        zoom: function(){
            // alert(1);
            new RTP.PinchZoom(this.$mod.find('img'), {});
        },
        destroy: function(){
            this.$mod.remove();
        },
        viewerTpl: '<div id="imgViewer" class="mod-img-viewer">'
        +               '<div class="img-wrap">'
        +                   '<img src="{{img.src}}">'
        +               '</div>'
        +          '</div>'
    };
    window.ImgViewer = ImgViewer;
})();