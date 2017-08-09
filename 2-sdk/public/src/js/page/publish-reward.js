(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var scroller = new IScroll('#scrollWrap', {
        mouseWheel: true,
        preventDefault: false
    });
	$('#deadLineTime').datepicker();

	var $modPublishReward = $('.mod-publish-reward');
	/*$modPublishReward.on('tap', '.choose-reward li', function(){
		$this = $(this);
		$modPublishReward.find('.reward-step').attr('value', $this.html());
		$modPublishReward.find('.choose-reward li').remove('active');
		$this.addClass('active');
	});*/
	$modPublishReward.on('tap', '.forth-step', function(){
		var postData = {
			location: $('#locationSelect').attr('value'),
			deadline: $('#deadLineTime').attr('value'),
			award: $('#awardSelect').attr('value'),
			tel: $('#phoneNum').attr('value'),
			researchType: $('#researchType').attr('value'),
			personalType: $('#typeSelect').attr('value'),
			cardNum: $('#cardNum').val(),
			describe: $('#describe').val()
		}
		$.ajax({
			url: "/publish/api/reward",
			type: "post",
			dataType: "json",
			contentType: "application/json", 
			data: JSON.stringify(postData)
		}).done(function(msg){
			alert('done')
		})
	});
	$(document).tap(function(e){
    	if($(e.target).parents('.reward-step').length == 0 && $(e.target).parents('#awardSelect').length == 0 && $(e.target).attr('id') != 'awardSelect'){
    		$('.reward-step').hide();
			//$('.datepicker-all').hide();
    	}
    }); 
    $modPublishReward.on('tap', '#awardSelect', function(){
		$('.reward-step').show();
		//$('.datepicker-all').show();
	});
	$('.choose-reward').on('tap', 'li', function(){
		$(this).siblings('li').removeClass('active');
		$(this).addClass('active');
		$('#awardSelect').attr('value', $(this).attr('value'));
		$('.reward-step .total-prize').find('span').html($(this).attr('value'));
		$('#awardSelect .value-span').html($(this).html());
		$('.reward-step').hide();
	});
})();