$(document).ready(function() {
  var positioning = function() {
    if ($(window).width() > 720) {
      $('.popup').each(function() {
        $(this).css({
          'top': $('#form').position().top/2,
          'right': '50%',
          'margin-top': -$('.popup').height(),
          'margin-right': -$(this).width()/2
        });
      })
    } else {
      $('.popup').each(function() {
        $(this).css({
          'top': '0',
          'right': '0',
          'margin-top': '0',
          'margin-right': '0'
        })
      });
    }
    var numberOfErrors = $('.popup').length;
    if (numberOfErrors > 1) {
      var w = 1;
      for (var i = 1; i < numberOfErrors; i++) {
        if ($(window).width() <= 720 && i == 1) {
          w += 1;
        }
        $('.popup#'+i).css('margin-top', $('.popup').height()*w);
        w += 2;
      }
    }
  }
  positioning();
  $('.popup i').click(function() {
    var n = $(this).parent().attr('id');
    $('.popup#' + n).fadeOut('fast');
    console.log(n)
  });
  $(window).resize(function() {
    positioning();
  })
});