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