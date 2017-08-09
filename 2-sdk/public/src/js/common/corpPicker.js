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