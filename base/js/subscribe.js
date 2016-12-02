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

$(window).on('load', function() {
	setProperHeight();
/* OBSŁUGA ZAPYTAŃ GET
	$('#selectDep').hide();
	$('#selectFld').hide();
	$('#selectUni select').change(function() { 
		var university = ($('#selectUni select option:selected').attr('id'));
		$.get('https://whatever.test/example.php', {uni: university})
			.done(function(data) {
				var faculties = JSON.parse(data);
				$('#selectDep').html('<span class="title">Wydział</span><select class="selectpicker" data-width="300px" data-style="btn-primary" title=" "></select>');
				for (var i = 0; i < faculties.length; i++) {
					var option = '<option id="' + faculties[i][1] + '">' + faculties[i][0] + '</option>'
					$('#selectDep .selectpicker').append(option);
				}
				$('.selectpicker').selectpicker('refresh');
				setProperHeight();
				$('#selectDep').fadeIn('fast');
				$('#selectDep select').change(function() { 
					var faculty = ($('#selectDep select option:selected').attr('id'));
					$.get('https://whatever.test/example.php', {fac: faculty})
					.done(function(data) {
						var faculties = JSON.parse(data);
						$('#selectFld').html('<span class="title">Kierunek</span><select class="selectpicker" data-width="300px" data-style="btn-primary" title=" "></select>');
						for (var i = 0; i < faculties.length; i++) {
							var option = '<option id="' + faculties[i][1] + '">' + faculties[i][0] + '</option>'
							$('#selectFld .selectpicker').append(option);
						}
						$('.selectpicker').selectpicker('refresh');
						setProperHeight();
						$('#selectFld').fadeIn('fast');
					});
				});
			})
			.fail(function() {
				console.error('Problem with getting a list of faculties!')
			})
	});
*/	
});