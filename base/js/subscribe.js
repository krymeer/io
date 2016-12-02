var setProperHeight = function() {
	if ($('.selectionForms .dropdown-menu.open').length > 0) {
		$('.selectionForms .dropdown-menu.open').each(function() {
			var ul = $(this).children('ul');
			var height = ul.children('li').length*37;
			if (height <= 200) {
				$(this).css('height', height);
				ul.addClass('noOverflow');
			} else {
				if (ul.hasClass('noOverflow')) {
					ul.removeClass('noOverflow');
				}
			}
		})
	}
};

var enableClicks = function() {
	$('.titleOfCourse').click(function() {
		$('.titleOfCourse span').remove();
		if ($(this).next().css('display') == 'table') {
			$(this).next().hide();
		} else {
			$('.courseDetails').hide();
			$(this).children('tbody').children('tr').children('td:last').append('<span class="chosen"></span>');
			$(this).next().show();
		}
	});
	$('.courseDetails i').click(function() {
		var tr = $(this).closest('tr');
		if (tr.hasClass('chosenGroup')) {
			tr.removeClass('chosenGroup');
			tr.children('td').children('i').html('check_box_outline_blank');
		} else {
			tr.addClass('chosenGroup');
			tr.children('td').children('i').html('check_box');
		}
	});
};

$(window).on('load', function() {
	setProperHeight();
	enableClicks();
});