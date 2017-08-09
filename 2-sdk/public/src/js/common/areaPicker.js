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