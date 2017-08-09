(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var scroller = new IScroll('#scrollWrap', {
        mouseWheel: true,
        preventDefault: false
    });

    $('#deadLineTime').datepicker();

	var $modPublishCheck = $('.mod-publish-check');

	$modPublishCheck.on('tap', '.forth-step', function(){
		var postData = {
			location: $('#titleSelect').attr('value'),
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
})();