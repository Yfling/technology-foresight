(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    currentType=0;
    currentSort=0;
    var $list = $("#list");
        function getlist(type,sort,keyword, zone){
        $.ajax({
            url: '/pull/getList?type='+type+'&sort='+sort+'&keyword='+keyword + '&zone=' + zone
        }).done(function(msg){
            console.log(msg.result.list);
            render(msg.result.list);
        }).fail(function(msg){

        });
    }
    var $city = $('#headWrap').find('.city');
    $city.on('citychange', function(e, d){
        console.log(d);
        $city.text(d.shi.name);
        getlist(currentType,currentSort,'', $city.text());
    });
    new AreaPicker($city);


    function render(data){
        var str = '';

        for(var i=0,l=data.length;i<l;i++){
            if(data[i].status == '已完成'){
                var status = "<div class='status c'>"+data[i].status+"</div>";
            }else if(data[i].status == '已过期'){
                var status = "<div class='status n'>"+data[i].status+"</div>";
            }else{
                var status = "";
            }

                str+="<a href='/checkDetail?id=" + data[i].id + "' class='sample'>"+
                    "<div class='title'>"+
                        "<div class='title-word'>"+data[i].title+"</div>"+
                        status+
                    "</div>"+
                    "<div class='des'>"+
                        data[i].des+
                    "</div>"+

                    "<div class='end'>"+
                        "<div class='progress'>"+
                            data[i].progress+
                        "</div>"+
                        "<div class='time'>"+
                            data[i].time+
                        "</div>"+

                    "</div>"+

                "</a>";

        }
        $list.html(str);
        var myScroll = new IScroll('.body-wrap', { mouseWheel: true ,preventDefault: false});

        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

    }

    // 选择下来菜单
    $('.all').on('tap',function(){
        $('.all-float').toggle();
    });

    $('.all-sample').on('tap',function(){
        $(".all-sample").removeClass('selected');
        var i = $(this).data('value');
        switch(i){
            case '0':
            $('.all').find('.word').text('进行');
            $(".all-sample").eq(i).addClass('selected');
            currentType = i;
            getlist(currentType,currentSort,'', $city.text());
                        break;
            case 1:
            $('.all').find('.word').text('全部');
            $(".all-sample").eq(i).addClass('selected');
            currentType = i;
            getlist(currentType,currentSort,'', $city.text());
        break;
            case 2:
            $('.all').find('.word').text('完成');
            $(".all-sample").eq(i).addClass('selected');
            currentType = i;
            getlist(currentType,currentSort,'', $city.text());
        break;
            case 3:
            $('.all').find('.word').text('过期');
            $(".all-sample").eq(i).addClass('selected');
            currentType = i;
            getlist(currentType,currentSort,'', $city.text());
        break;
        }
    });

    
    //发布时间
    $('.publish-time').on('tap',function(){
        currentSort = 0;
        $('.nav-sub').removeClass('nav-green');
        $(this).addClass('nav-green');
        getlist(currentType,currentSort,'', $city.text());
    });
     $('.end-time').on('tap',function(){
        $('.nav-sub').removeClass('nav-green');
        $(this).addClass('nav-green');

        currentSort = 1;
        getlist(currentType,currentSort,'', $city.text());
    });
    $('.progress').on('tap',function(){
        $('.nav-sub').removeClass('nav-green');
        $(this).addClass('nav-green');

        currentSort = 2;
        getlist(currentType,currentSort,'', $city.text());
    });

    // 点击搜索
    $('.search').on('tap',function(){
        $('.search-content').show();
        $('.search-gray').css('display','block');
    });


    //点击搜索ok
    $('.search-content').find('.ok').on('tap',function(){
        $('.search-content').hide();
        getlist(0,0,$('.search-input').eq(0).val(), $city.text());
        $('.search-gray').hide();
    });

    //点击搜索cancel
    $('.search-content').find('.cancel').on('tap',function(){
        $('.search-content').hide();
        $('.search-gray').hide();
    });

        getlist(1,1,'', $city.text());
})();








