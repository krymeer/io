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
		$(this).val($(this).val().replace(regExtended, ''));
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
				$(this).css('display', 'block').parent().css('border-bottom', '2px solid #c1bfb5');
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
	$('.titleOfCourse').unbind().click(function() {
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
	$('.courseDetails i').unbind().click(function() {
		var tr = $(this).closest('tr'), code = tr.children('td:nth-of-type(2)').innerText;
		if (tr.hasClass('chosenGroup')) {
			tr.removeClass('chosenGroup');
			tr.children('td').children('i').html('check_box_outline_blank');
			checkIfAnyChosen();			
			/* TO DO
				$.get('http://localhost:8000/...' + code + '/')
			*/
		} else {
			tr.addClass('chosenGroup');
			tr.children('td').children('i').html('check_box');
			checkIfAnyChosen();
			/* TO DO
				$.get('http://localhost:8000/...' + code + '/')
			*/
		}
	});
};

var checkIfAnyChosen = function() {
	$('.titleOfCourse').each(function() {
		if ($(this).next().children().children('tr').hasClass('chosenGroup')) {
			$(this).next().children().children('tr.chosenGroup').children('td:last-of-type').children('i').html('check_box');
			$(this).parent().removeClass('ordinary');
			$(this).parent().addClass('bold');
		} else {
			$(this).parent().removeClass('bold');
			$(this).parent().addClass('ordinary');			
		}
	})
}

var checkBox = '<td><i class="material-icons">check_box_outline_blank</i></td>';

var selectOptions = function() {
	$('#selectUni select').change(function() {
		$('#selectFac').fadeOut();
		$('#selectFld').fadeOut();
		$('#searchResults').fadeOut();
		$('#searchFilter').fadeOut();
		var university = ($('#selectUni select option:selected').attr('id'));
		$.get('http://localhost:8000/courses/get/faculties/' + university + '/')
			.done(function(data) {
				var faculties = data;
				$('#selectFac').html('<span class="title">Wydział</span><select class="selectpicker" data-university="' + university + '" data-width="100%" data-style="btn-primary" title=" "></select>');
				for (var i = 0; i < faculties.length; i++) {
					var option = '<option data-acronym="' + faculties[i]['acronym'] + '">' + faculties[i]['name'] + '</option>';
					$('#selectFac .selectpicker').append(option);
				}
				$('.selectpicker').selectpicker('refresh');
				setProperHeight();
				$('#selectFac').fadeIn();
				$('#selectFac select').change(function() { 
					$('#selectFld').fadeOut();
					$('#searchResults').fadeOut();
					$('#searchFilter').fadeOut();
					var faculty = ($('#selectFac select option:selected').attr('data-acronym'));
					university = ($('#selectFac select option:selected').parent().attr('data-university'));
					$.get('http://localhost:8000/courses/get/fields-of-study/' + faculty  + '/')
					.done(function(data) {
						var fieldsOfStudy = data;
						$('#selectFld').html('<span class="title">Kierunek</span><select data-university="' + university + '" data-faculty="' + faculty + '" class="selectpicker" data-width="100%" data-style="btn-primary" title=" "></select>');
						for (var i = 0; i < fieldsOfStudy.length; i++) {
							var option = '<option data-pk="' + fieldsOfStudy[i]['id'] + '">' + fieldsOfStudy[i]['name'] + '</option>';
							$('#selectFld .selectpicker').append(option);
						}
						$('.selectpicker').selectpicker('refresh');
						setProperHeight();
						$('#selectFld').fadeIn();
						$('#selectFld select').change(function() {
							$('#searchResults').fadeOut();
							$('#searchFilter').fadeOut();
							var pk = ($('#selectFld select option:selected').attr('data-pk'));
							$.get('http://localhost:8000/courses/get/courses/' + pk  + '/')
							.done(function(data) {
								$('#searchResults').html('');
								var courses = data;
								for (var i = 0; i < courses.length; i++) {
									var groups = courses[i].groups;
									for (var j = 0; j < groups.length; j++) {
										var group;
										if (groups[j]['subscribed'] === 'true') {
											group = '<tr class="chosenGroup">';
										} else {
											group = '<tr>';
										}
										group += '<td>' + groups[j]['type'] + '</td><td>' + groups[j]['code'] + '</td><td>' + groups[j]['day'] + ' ' + groups[j]['start_time'] + '-' + groups[j]['end_time'] + ' ' + '</td><td>' + groups[j]['room'] + '</td><td>' + groups[j]['teacher'] + '</td>' + checkBox + '</tr>';
										var content = $('#searchResults').html();
										if (content.indexOf(courses[i]['name'] + '</td><td>' + courses[i]['lecturer']) < 0) {
											$('#searchResults').append('<div class="ordinary"><table class="titleOfCourse"><tr><td>' + courses[i]['name'] + '</td><td>' + courses[i]['lecturer'] + '</td><td><i class="material-icons">expand_more</i></td></tr></table><table class="courseDetails"><tr><td>Rodzaj zajęć</td><td>Kod grupy</td><td>Termin zajęć</td><td>Sala</td><td>Prowadzący</td><td></td></tr>' + group +'</table></div>');
										} else {
											$('.titleOfCourse').each(function() {
												if ($('td:first-child', this).html() === courses[i]['name'] && $('td:nth-child(2)', this).html() === courses[i]['lecturer'] && $('#searchResults').html().indexOf(groups[j]['code']) < 0) {
											  	$(this).next('.courseDetails').append(group);
												}
											})
										}
										checkIfAnyChosen();				
										enableClicks();										
									}
								}
								$('#searchResults').fadeIn();
								$('#searchFilter').fadeIn();		
							})
							.fail(function() {
								console.error('Problem with getting a list of courses!')
							})
						});
					})
					.fail(function() {
						console.error('Problem with getting a list of fields of studies!')
					})
				});
			})
			.fail(function() {
				console.error('Problem with getting a list of faculties!')
			})
	});
}

var caretBackground = function() {
	$('.selectionForms').each(function() {
		$(this).on('change', function() {
			var span = $('.filter-option.pull-left', $(this).parent().parent());
			if (span.html() !== ' ') {
				$('.btn-group.bootstrap-select.open .caret', $(this).parent().parent()).css('background', '#e0532c');
			}
		});
	});	
}

$(window).on('load', function() {
	caretBackground();
	checkIfAnyChosen();	
	setProperHeight();
	enableClicks();
	filterResults();
	selectOptions();
});