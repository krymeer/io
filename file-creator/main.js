function create_file(data, filename) {
  var encoded_uri = encodeURI(data),
      link = document.createElement('a');

  link.setAttribute('download', filename);
  link.setAttribute('href', 'data: text/html; charset=utf-8,' + encoded_uri);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function is_empty(field_value, object) {
  var alert_block = $('#' + object.attr('id') + ' ~ .alert_msg'),
      width = object.outerWidth();
  if (field_value === '') {
    if (alert_block.css('display') === 'none') {
      alert_block
        .html('This field cannot be empty')
        .css('width', width)
        .slideDown('fast');
    }
    return true;
  }
  if (alert_block.css('display') !== 'none') {
    alert_block.slideUp('fast');
  }
  return false;
};

function set_w3_urls() {
  var url = window.location.href;
  url = url.replace(/\//g, '%2F');
  url = url.replace(/:/g, '%3A');
  $('#w3_html').attr('href', 'https://validator.w3.org/nu/?doc=' + url);
  $('#w3_css').attr('href', 'https://jigsaw.w3.org/css-validator/validator?uri=' + url + '&profile=css3&usermedium=all&warning=1&vextwarning=&lang=en');
}

$(document).ready(function() {
  set_w3_urls();

  $('#clear_data').click(function() {
    $('.alert_msg').each(function() {
      if ($(this).css('display') !== 'none') {
        $(this).slideUp('fast');
      }
    });
    $('textarea, input').each(function() {
      $(this).val('');
    });
  });
  $('#create_file').click(function() {
    var textarea = $('textarea#file_contents'),
        data = textarea.val(),
        input = $('input#filename'),
        filename = input.val();

    var cond1 = is_empty(data, textarea),
        cond2 = is_empty(filename, input);

    if (!cond1 && !cond2) {
      create_file(data, filename + '.html');
    }
  }); 
});