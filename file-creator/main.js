function create_file(data, filename) {
  var encoded_uri = encodeURI(data),
      link = document.createElement('a');

  link.setAttribute('download', filename);
  link.setAttribute('href', 'data: text/html; charset=utf-8,' + encoded_uri);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

$(document).ready(function() {
  $('#create_file').click(function() {
    var data = $('textarea#file_contents').val(),
        filename = $('input#filename').val();

    if (filename === '') {
      $('#filename ~ .alert_msg')
        .html('This field cannot be empty')
        .css('width', $('input#filename').outerWidth())
        .slideDown('fast');
    } else {
      if ($('#filename ~ .alert_msg').css('display') !== 'none') {
        $('#filename ~ .alert_msg').slideUp('fast')
      }
      create_file(data, filename + '.html');
    }
  }); 
});