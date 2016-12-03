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

var filterResults = function() {
	$('#searchFilter input').on('input', function() {
		$('.courseDetails').hide();
		$('.titleOfCourse span').remove();
		$(this).val($(this).val().replace(regExtended, ''))
		var content = $(this).val().toLowerCase();
		$('.titleOfCourse').each(function() {
			var name = $(this)[0].outerText.toLowerCase();
			name = name.replace('expand_more', '');
			var tmp = $(this).next('.courseDetails').children().children();
			var details = '';
			for (var i = 1; i < tmp.length; i++) {
				if (tmp == undefined) {
					break;
				}
				details += tmp[i].innerText;
				details = details.replace('check_box_outline_blank', '');
				details = details.replace('check_box', '');
			}
			details = details.toLowerCase();
			if (name.indexOf(content) !== -1 || details.indexOf(content) !== -1) {
				$(this).css('display', 'block').parent().css('border-bottom', '2px solid #c1bfb5');;
			} else {
				$(this).css('display', 'none').parent().css('border', '0');
			}
		});
		if (content === '') {
			$('.titleOfCourse').parent().each(function() {
				$(this).css('border-bottom', '2px solid #c1bfb5');
			});
		}
	});
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
		checkIfAnyChosen();
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
		checkIfAnyChosen();
	});
};

var checkIfAnyChosen = function() {
	$('.titleOfCourse').each(function() {
		if ($(this).next().children().children('tr').hasClass('chosenGroup')) {
			$(this).parent().removeClass('ordinary');
			$(this).parent().addClass('bold');
		} else {
			$(this).parent().removeClass('bold');
			$(this).parent().addClass('ordinary');			
		}
	})
}

$(window).on('load', function() {
	checkIfAnyChosen();	
	setProperHeight();
	enableClicks();
	filterResults();
	$('select').on('change', function() {
		var span = $('.filter-option.pull-left', $(this).parent().parent());
		if (span.html() !== ' ') {
			$('.btn-group.bootstrap-select.open .caret', $(this).parent().parent()).css('background', '#e0532c');
		}
	})
});