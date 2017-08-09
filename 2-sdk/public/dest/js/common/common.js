(function(){
    var $mod = $('#commonMenu');
    var $body = $('body');
    var tpl = '<div id="publishLayer" class="mod-publish-layer">'
            +        '<div class="tasks">'
            +            '<a class="check" href="/publish/check2">'
            +                '<div class="icon-wrap">'
            +                    '<img width="20" height="25" src="/dest/img/page/index/paicha-icon.png">'
            +                '</div>'
            +                '<p>衣</p>'
            +            '</a>'
            +            '<a class="reward" href="/publish/reward2">'
            +                '<div class="icon-wrap">'
            +                    '<img width="24" height="29" src="/dest/img/page/index/xuanshang-icon.png">'
            +                '</div>'
            +                '<p>食</p>'
            +            '</a>'
            +            '<a class="trip" href="/publish/trip2">'
            +                '<div class="icon-wrap">'
            +                    '<img width="24" height="23" src="/dest/img/page/index/xingcheng-icon.png">'
            +                '</div>'
            +                '<p>行</p>'
            +            '</a>'
            +        '</div>'
            +        '<div class="close"></div>'
            +    '</div>';

    function init(){
        bindEvent();
    }
    function bindEvent(){
        $body.on('tap', '.common-publish', function(){
            render();
        })
        $body.on('tap', '#publishLayer .close', function(){
            $('#publishLayer').remove();
        });
    }
    function render(){
        $body.append(tpl);
    }

    init();
})();
// (function(){
//     FastClick.attach(document.body);
// })();
(function(){
    var $body = $('body');
    function AreaPicker($trigger){
        this.$trigger = $trigger;
        this.sheng = $trigger.data('sheng') || 0;
        this.shi = $trigger.data('shi') || 0;
        this.init();
    }
    AreaPicker.prototype = {
        init: function(){
            this.bindEvent();
        },
        scroll: function(){
            this.shengScroller = new IScroll($('#shengScrollWrap')[0], {
                mouseWheel: true,
                preventDefault: false
            });
            this.shiScroller = new IScroll($('#shiScrollWrap')[0], {
                mouseWheel: true,
                preventDefault: false
            });
        },
        bindEvent: function(){
            var self = this;
            this.$trigger.on('tap', function(){
                self.render().then(function(data){
                    self.data = data;
                    self.scroll();
                    self.$picker = $('#areaPicker');
                    self.$sheng = self.$picker.find('.sheng');
                    self.$shi = self.$picker.find('.shi');
                    self.$shengItem = self.$sheng.find('li');
                    self.$shiItem = self.$shi.find('li');
                    self.changeShengStyle(self.$shengItem.eq(self.sheng));
                    self.changeCitys(self.sheng);
                    self.changeShiStyle(self.$shiItem.eq(self.shi));
                    self.sheng = 0;
                    self.shi = 0;
                });
            });
            $body.on('tap', '#areaPicker .header .back', function(){
                self.destroy();
            })
            .on('tap', '#areaPicker .sheng li', function(){
                var $this = $(this);
                self.changeShengStyle($this);
                self.changeSheng($this);
                self.changeCitys($this.index());
            })
            .on('tap', '#areaPicker .shi li', function(){
                var $this = $(this);
                self.changeShiStyle($this);
                self.changeShi($this);
            });
        },
        render: function(){
            var self = this;
            return this.getData().then(function(d){
                $body.append(tpl(self.pickerTpl, {data: $.extend(true, {}, d)}));
                return d;
            });
        },
        destroy: function(){
            this.$picker.remove();
        },
        changeShengStyle: function($item){
            this.$shengItem.removeClass('cur');
            $item.addClass('cur');
        },
        changeSheng: function($item){
            this.sheng = $item.index();
            this.$trigger.data('sheng', this.sheng);
        },
        changeCitys: function(index){
            var self = this;
            this.$shi.find('ul').html(tpl(this.cityItem, {
                data: $.extend(true, {}, self.data[index].cities)
            }));
            this.$shiItem = this.$shi.find('li');
            this.shiScroller.refresh();
        },
        changeShiStyle: function($item){
            this.$shiItem.removeClass('cur');
            $item.addClass('cur');
        },
        changeShi: function($item){
            var self = this;
            this.shi = $item.index();
            this.$trigger.data('shi', this.shi);
            this.$trigger.trigger('citychange', {
                sheng: {
                    name: self.data[self.sheng].name,
                    index: self.sheng
                },
                shi: {
                    name: self.data[self.sheng].cities[self.shi],
                    index: self.shi
                }
            });
            this.destroy();
        },
        getData: function(){
            var deferred = $.Deferred();
            $.ajax({
                url: '/json/location.json'
            }).done(function(d){
                if(d){
                    deferred.resolve(d);
                }else{
                    deferred.reject(d);
                }
            }).fail(function(d){
                deferred.reject(d);
            });
            return deferred.promise();
        },
        pickerTpl: '<div id="areaPicker" class="mod-area-picker">'
        +                '<div class="header">'
        +                    '<a href="javascript:;" class="back"></a>'
        +                    '<p class="text">选择地区</p>'
        +                '</div>'
        +                '<div class="body">'
        +                    '<div class="sheng">'
        +                        '<div id="shengScrollWrap" class="scroll-wrap">'
        +                            '<div class="scroller">'
        +                                '<ul>'
        +                                    '{{#for $item in data}}'
        +                                        '<li class="{{#if @index==0}}cur{{/if}}">{{$item.name}}</li>'
        +                                    '{{/for}}'
        +                                '</ul>'
        +                            '</div>'
        +                        '</div>'
        +                    '</div>'
        +                    '<div class="shi">'
        +                        '<div id="shiScrollWrap" class="scroll-wrap">'
        +                            '<div class="scroller">'
        +                                '<ul>'
        +                                    '{{#for $item in data[0].cities}}'
        +                                        '<li class="{{#if @index==0}}cur{{/if}}">{{$item}}</li>'
        +                                    '{{/for}}'
        +                                '</ul>'
        +                            '</div>'
        +                        '</div>'
        +                    '</div>'
        +                '</div>'
        +            '</div>',
        cityItem:    '{{#for $item in data}}'
        +                '<li>{{$item}}</li>'
        +            '{{/for}}'
    };

    window.AreaPicker = AreaPicker;
})();
(function(){
    var $body = $('body');
    function CorpPicker($trigger){
        this.$trigger = $trigger;
        this.corp = this.$trigger.data('corp');
        this.init();
    }
    CorpPicker.prototype = {
        init: function(){
            this.bindEvent();
        },
        scroll: function(){
            this.shengScroller = new IScroll($('#corpScrollWrap')[0], {
                mouseWheel: true,
                preventDefault: false
            });
        },
        bindEvent: function(){
            var self = this;
            this.$trigger.on('tap', function(){
                self.render().then(function(data){
                    self.data = data;
                    self.scroll();
                    self.$picker = $('#corpPicker');
                    self.$corpItem = self.$picker.find('.item');
                    self.changeCorpStyle(self.$corpItem.eq(self.corp));
                    self.corp = 0;
                });
            });
            $body.on('tap', '#corpPicker .header .back', function(){
                self.destroy();
            })
            .on('tap', '#corpPicker .corps li', function(){
                var $this = $(this);
                self.changeCorpStyle($this);
                self.changeCorp($this);
            });
        },
        render: function(){
            var self = this;
            return this.getData().then(function(d){
                $body.append(tpl(self.pickerTpl, {data: $.extend(true, {}, d)}));
                return d;
            });
        },
        destroy: function(){
            this.$picker.remove();
        },
        changeCorpStyle: function($item){
            this.$corpItem.removeClass('cur');
            $item.addClass('cur');
        },
        changeCorp: function($item){
            var self = this;
            this.corp = $item.index();
            this.$trigger.data('corp', this.corp);
            this.$trigger.trigger('corpchange', {
                index: self.corp,
                des: self.data[self.corp].des
            });
            this.destroy();
        },
        getData: function(){
            var deferred = $.Deferred();
            $.ajax({
                url: '/json/corps.json'
            }).done(function(d){
                if(d){
                    deferred.resolve(d);
                }else{
                    deferred.reject(d);
                }
            }).fail(function(d){
                deferred.reject(d);
            });
            return deferred.promise();
        },
        pickerTpl: '<div id="corpPicker" class="mod-corp-picker">'
        +                '<div class="header">'
        +                    '<a href="javascript:;" class="back"></a>'
        +                    '<p class="text">选择地区</p>'
        +                '</div>'
        +                '<div class="body">'
        +                    '<div class="corps">'
        +                        '<div id="corpScrollWrap" class="scroll-wrap">'
        +                            '<div class="scroller">'
        +                                '<ul>'
        +                                    '{{#for $item in data}}'
        +                                        '<li class="item">'
        +                                           '<div class="name">'
        +                                               '<i class="icon" style="background-image="{{$item.icon}}"></i>'
        +                                               '<span class="des">{{$item.des}}</span>'
        +                                           '</div>'
        +                                           '<i class="selected-icon"></i>'
        +                                        '</li>'
        +                                    '{{/for}}'
        +                                '</ul>'
        +                            '</div>'
        +                        '</div>'
        +                    '</div>'
        +                '</div>'
        +            '</div>',
        cityItem:    '{{#for $item in data}}'
        +                '<li>{{$item}}</li>'
        +            '{{/for}}'
    };

    window.CorpPicker = CorpPicker;
})();
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
(function(){
    var $body = $('body');
    function DestEditor($trigger, opt){
        this.opt = opt;
        this.$trigger = $trigger;
        this.$editor = null;
        this.city = '';
        this.dest = '';
        this.detail = '';

        this.init();
    }
    DestEditor.prototype = {
        init: function(){
            this.bindEvent();
        },
        bindEvent: function(){
            var self = this;
            this.$trigger.on('tap', function(){
                self.render();
                self.$editor = $('#destEditor');
                new AreaPicker(self.$editor.find('.city .content'));
                self.$editor.find('.city .content').on('citychange', function(e, data){
                    $(this).find('input').val(data.sheng.name + data.shi.name);
                    self.city = data.sheng.name + data.shi.name;
                });

            });
            $body.on('tap', '#destEditor .header .back', function(){
                self.destroy();
            })
            .on('tap', '#destEditor button', function(){
                self.$trigger.trigger('destchange', {
                    city: self.city,
                    dest: self.$editor.find('.dest input').val(),
                    detail: self.$editor.find('.detail textarea').val()
                });
                self.destroy();
            });
        },
        render: function(){
            $body.append(this.editorTpl(this.opt));
        },
        destroy: function(){
            this.$editor.remove();
        },
        editorTpl: function(opt){
            return '<div id="destEditor" class="mod-dest-editor">'
            +                '<div class="header">'
            +                    '<a href="javascript:;" class="back"></a>'
            +                    '<p class="text">目的地</p>'
            +                '</div>'
            +                '<form class="body">'
            +                    '<div class="main">'
            +                        '<div class="wrap city">'
            +                            '<label>城市</label>'
            +                            '<div class="content">'
            +                                '<input name="dest" placeholder="请选择城市" readonly autocomplete="off" value=' + opt.city + '>'
            +                                '<div class="ui-arrow"></div>'
            +                            '</div>'
            +                        '</div>'
            +                        '<div class="wrap dest">'
            +                            '<label>地点名称</label>'
            +                            '<div class="content">'
            +                                '<input name="dest" placeholder="例如第一人民医院" autocomplete="off">'
            +                            '</div>'
            +                        '</div>'
            +                        '<div class="wrap detail">'
            +                            '<label>详细地址</label>'
            +                            '<div class="content">'
            +                                '<textarea name="dest" placeholder="例如xx区 xx街道 xx号" autocomplete="off"></textarea>'
            +                            '</div>'
            +                        '</div>'
            +                    '</div>'
            +                    '<div class="wrap">'
            +                        '<button type="button">确定</button>'
            +                    '</div>'
            +                '</form>'
            +            '</div>'
            }
        }
    window.DestEditor = DestEditor;
})();