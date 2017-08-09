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