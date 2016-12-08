$(document).ready(function() {
  var numberOfErrors = $('[id^=errorPanel]').length;
  if (numberOfErrors > 0) {
    if ($(window).width() > 720) {
      $('[id^=errorPanel]').css({
        'top': $('#form').position().top/2,
        'right': '50%',
        'margin-top': -$('[id^=errorPanel]').height(),
        'margin-right': -$('[id^=errorPanel]').width()/2,
      });
    }
    if (numberOfErrors > 1) {
      var w = 0;
      for (var i = 1; i < numberOfErrors; i++) {
        if ($(window).width() > 720) {
          w = 1;
        } else {
          w = 2;
        }
        $('#errorPanel' + i).css('margin-top', $('[id^=errorPanel]').height()*w);
      }
    }
    $('[id^=errorPanel] i').click(function() {
      var name = $(this).parent()[0].id;
      var n = name.substring(10, name.length);
      $('#errorPanel' + n).fadeOut('fast');
    });
  }
});