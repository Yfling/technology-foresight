(function(){
	$(document).on('tap', '.publish-select', function(){
		var $this = $(this);
		var keys = $this.attr('keys').split(',');
		var attrs = $this.attr('attrs').split(',');
		var value = $this.val();
		var thisWidth = $this.width();
		var options = '';
		if(!value){
			value = keys;
		}
		for(var loop = 0; loop < keys.length; loop ++){
			options += '<li value="'+ attrs[loop] +'" style="line-height: 40px; border-bottom: 1px solid #fff; color: #fff;">'+ keys[loop] +'</li>';
		}
		var htmlDom = '<div for-id="'+ $this.attr('id') +'" class="select-dom-pannel" style="position: absolute; top: 42px; bottom: 0px; left: 0px; right: 0px; padding: 20px; background: #000; opacity: 0.9;">'
				+ '<ul style="">'
					+ options
				+ '</ul>'
			+ '</div>';
		$('body').append(htmlDom);
	});
	$(document).on('tap', '.select-dom-pannel li', function(){
		var $this = $(this);
		var $thisParent = $this.parents('.select-dom-pannel');
		var thisValue = $this.attr('value');
		var key = $this.html();
		var value = $this.attr('value');
		thisId = $thisParent.attr('for-id');
		console.log(value, key, thisId)
		$('#' + thisId).attr('value', value).find('.value-span').html(key);
		$('.select-dom-pannel').remove();
	});
})();
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