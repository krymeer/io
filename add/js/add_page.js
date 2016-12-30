var addCaret = function() {
  $('.nice-select.input').each(function() {
    $(this).append('<div class="myBloodyCaret"><i class="material-icons">expand_more</i></div>');
  });
}

/*
webshim.setOptions('forms-ext', {
  replaceUI: 'auto',
  types: 'date',
  date: {
    startView: 2,
    inlinePicker: true,
    classes: 'hide-inputbtns'
  }
});
webshim.activeLang('pl');
webshim.polyfill('forms forms-ext');
*/


$(document).ready(function() {
  $('.info_calendar').hide();
  $('select').niceSelect();
  addCaret();
});