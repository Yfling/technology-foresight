(function(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var scroller = new IScroll('#scrollWrap', {
        mouseWheel: true,
        preventDefault: false
    });

    $('#deadLineTime').datepicker();

    var $modPublishTrip = $('.mod-publish-trip');
	$modPublishTrip.on('tap', '.forth-step', function(){
		var postData = {
			location: $('#locationSelect').attr('value'),
			deadline: $('#deadLineTime').attr('value')
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



