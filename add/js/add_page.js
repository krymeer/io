var addCaret = function() {
  $('.nice-select.input').each(function() {
    $(this).append('<div class="myBloodyCaret"><i class="material-icons">expand_more</i></div>');
  });
}

$(document).ready(function() {
  $('select').niceSelect();
  addCaret();
  $('#datepicker').datepicker({
    'weekStart': 1, 
    'language': 'pl',
    'startDate': '-1y',
    'endDate': '+2y',
    'format': 'd MM yyyy',
    'templates': {
      'leftArrow': '<i class="material-icons">arrow_back</i>',
      'rightArrow': '<i class="material-icons">arrow_forward</i>'
    }
  });
  $('#datepicker').on('changeDate', function() {
    var date = $('#datepicker').datepicker('getFormattedDate'),
        month = date.split(' ')[1];
    switch(month) {
      case 'Styczeń':
        date = date.replace(month, 'stycznia');
        break;
      case 'Luty':
        date = date.replace(month, 'lutego');
        break;
      case 'Marzec':
        date = date.replace(month, 'marca');
        break;
      case 'Kwiecień':
        date = date.replace(month, 'kwietnia');
        break;
      case 'Maj':
        date = date.replace(month, 'maja');
        break;
      case 'Czerwiec':
        date = date.replace(month, 'czercwa');
        break;
      case 'Lipiec':
        date = date.replace(month, 'lipca');
        break;
      case 'Sierpień':
        date = date.replace(month, 'sierpnia');
        break;
      case 'Wrzesień':
        date = date.replace(month, 'września');
        break;
      case 'Październik':
        date = date.replace(month, 'października');
        break;
      case 'Listopad':
        date = date.replace(month, 'listopada');
        break;
      case 'Grudzień':
        date = date.replace(month, 'grudnia');
        break;
    }
    $('#hiddenInput').val(date);
  });
});