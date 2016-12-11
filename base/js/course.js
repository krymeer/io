$(document).ready(function() {
	$('.reportError').click(function() {
		alert($(this).parent().children('h4').html())
	})
	$('.reportError').hover(function() {
		$(this).popover('show');
	}, function() {
		$(this).popover('hide');
	});
	$('.titleOfCourse span').remove();
	$('.groupInfo h4 i.toggle').click(function() {
		var hiddenList = $(this).parent().next('.hiddenList');
		var toggle = $(this).prev('span.toggleTriangle');
		if (hiddenList.css('display') === 'none') {
			hiddenList.css('display', 'block');
			toggle.css('display', 'inline');
		} else if (hiddenList.css('display') === 'block') {
			hiddenList.css('display', 'none');
			toggle.css('display', 'none');
		}
	});
});