(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    /*当前浏览器的*/
    var rewardList = {};
    currentType=0;
    currentSort=0;
    var $list = $("#list");
        function getlist(type,sort,keyword,zone){
        $.ajax({
            url: '/pull/rewardList?type='+type+'&sort='+sort+'&keyword='+keyword + '&zone=' + zone
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
        $list.html('');
        for(var i=0,l=data.length;i<l;i++){
            if(data[i].status == '已完成'){
                var status = "<div class='status c'>"+data[i].status+"</div>";
            }else if(data[i].status == '已过期'){
                var status = "<div class='status n'>"+data[i].status+"</div>";
            }else{
                var status = "";
            }
                var $sample = $("<div class='sample'></div>");
                var $opcheck = $("<div class='opcheck'></div>");
                var $apply = $("<div id='"+data[i].id+"' class='apply'></div>");
                var $endcheck = $("<a href='/rewardDetail?id="+data[i].id+"' class='endcheck'>"+
                        "<div class='title'>"+
                            "<div class='title-word'>"+data[i].title+"</div>"+
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
                    "</a>");

                $opcheck.on('tap',function(e){
                    var $apply = $(this).find('.apply');
                    if($apply.attr('class').indexOf('selected') > -1){
                        $apply.removeClass('selected');
                        delete rewardList[$(e.target).attr('id')];
                        if($.isEmptyObject(rewardList)){
                            $('#footerWrap').hide();
                        }
                        console.log(rewardList);
                    }else{
                        $('#footerWrap').show();
                        rewardList[$(e.target).attr('id')] =$(e.target).attr('id')
                        console.log(rewardList);
                        $apply.addClass('selected');
                        //在复层下面添加一个空div为了让，选取列表内容能够现实完全
                        if($('#listPlace').css('height') !== '45px'){
                            $('#list').append("<div id='listPlace' style='height:45px'></div>");
                            myScroll.refresh();
                        }else{
                            myScroll.refresh();
                        }
                    }
                });

                $opcheck.append($apply);
                $sample.append($opcheck);
                $sample.append($endcheck);
                $list.append($sample);

        }
        



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

    //选取任务cancel事件绑定
    $('#footerWrap').find('.cancel').on('tap',function(){
        $('#footerWrap').hide();
    });

    //选取任务认领事件绑定
    $('#footerWrap').find('.sure').on('tap',function(){
        $('#footerWrap').hide();
        var $list = $("#list");

        $.ajax({
            type:'POST',
            url: '/pull/getReward',
            data:rewardList
        }).done(function(data){
            if(data.result.code==1){
                window.location = '';
            }
        }).fail(function(msg){

        });
        
    });


        getlist(1,1,'', $city.text());
})();








