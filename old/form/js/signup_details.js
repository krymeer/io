$(document).ready(function() {
  $('select').niceSelect();
  $('#signUpForm input').on('input', function() {
    $(this).val($(this).val().replace(/[^-A-Za-z. ]/g, ''));
  })
  $('li').each(function() {
    $(this).removeClass('selected');
  });
  $('select').each(function(){
    var name = $(this).attr('name');
    if (name === 'university') {
      $(this).next('.nice-select.input').children().first().html('Uczelnia');
    } else if (name === 'faculty') {
      $(this).next('.nice-select.input').children().first().html('Wydział');
    } else if (name === 'fieldOfStudy') {
      $(this).next('.nice-select.input').children().first().html('Kierunek');
    }
      });
  $('select').change(function() {
      $(this).next('.nice-select.input').children().first().css('color', '#252323')
  });
  $('.nice-select.input').each(function() {
    $(this).append('<div class="myBloodyCaret"><i class="material-icons">expand_more</i></div>');
  })
});