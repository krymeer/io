/**
* Creates a new file.
* @param {string} data file contents
* @param {string} filename
*/
function create_file(data, filename) {
  var encoded_uri = encodeURI(data),
      link = document.createElement('a');

  link.setAttribute('download', filename);
  link.setAttribute('href', 'data: text/html; charset=utf-8,' + encoded_uri);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
* Validates a pressed key; the valid ones are: uppercase and lowercase letters, numbers and underscores.
* @param {object} e the pressed key
* @returns {boolean} if the pressed key is valid
*/
function validate_filename(e) {
  return ((e.charCode === 95) 
    || (e.charCode >= 48 && e.charCode <= 57)
    || (e.charCode >= 65 && e.charCode <= 90)
    || (e.charCode >= 97 && e.charCode <= 122));
}

/**
* Saves contents of the document to a separate file.
*/
function save_file() {
  var header = $('.template.header .grid').clone(),
      main_part = $('.template.main_part .grid').clone(),
      footer = $('.template.footer .grid').clone();

  $('.item_panel', header).remove();
  $('.item_panel', main_part).remove();
  $('.item_panel', footer).remove();

  css_out = basic_css_org;
  header = move_css(header, 'header');
  main_part = move_css(main_part, '#main_content');
  footer = move_css(footer, '.footer');

  var html = create_html_template(header, main_part, footer);

  var filename = $('#filename').val();
  if (filename === '') {
    $('#file_creator_popup .popup_err').slideDown('fast');
  } else {
    $('#file_creator_popup').fadeOut('fast', function() {
      create_file(html, filename);
      get_popup('file_save_success');
      $('#file_save_success .btn_save, #file_save_success .btn_cancel').click(function() {
        close_popup('#file_save_success');
        restart();
      });
    });
  }
}