var err = 0;

var resetTooltip = function(param) {
  $(param[0]).css({'background': '#fefdff', 'color': '#252323'});
  $(param[0].children[1]).css({'background': '#fefdff', 'color': '#252323'});
  if ($(param[0].children[2]).length > 0) {
    $(param[0].children[2]).css('color', '#252323');
    err = 0;
  }
  $('#' + param[0].id + ' + .tooltip > .tooltip-inner').css('background', '#252323');
  $('#' + param[0].id + ' + .tooltip.right > .tooltip-arrow').css('border-right-color', '#252323');
  $('#' + param[0].id + ' + .tooltip.top > .tooltip-arrow').css('border-top-color', '#252323');
};

var tooltipError = function(param) {
  $(param[0]).css({'background': '#f2dede', 'color': '#a94442'});
  $(param[0].children[1]).css({'background': '#f2dede', 'color': '#a94442'});
  if ($(param[0].children[2]).length > 0) {
    if ($(param[0].children[1]).val().length > 0) {
      $(param[0].children[2]).css('color', '#a94442');
    } else {
      $(param[0].children[2]).css('color', '#c1bfb5');
    }
    err = 1;
  }
  $('#' + param[0].id + ' + .tooltip > .tooltip-inner').css('background', '#a94442');
  $('#' + param[0].id + ' + .tooltip.right > .tooltip-arrow').css('border-right-color', '#a94442');
  $('#' + param[0].id + ' + .tooltip.top > .tooltip-arrow').css('border-top-color', '#a94442');
}

$(document).ready(function() {
  if ($(window).width() <= 720) {
    $('.input').attr('data-placement', 'top');
    $('.tooltip-inner').css('max-width', '500px');
  } else {

  }

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

  var loginMsg = $('#loginInput').attr('title'),
      passOneMsg = $('#passOne').attr('title'),
      passTwoMsg = $('#passTwo').attr('title'),
      mailMsg = $('#mailInput').attr('title');
  $('[data-toggle="tooltip"]').tooltip(); 

  $('#mailInput').on('click', function() {
    $('#mail').focus();
  });
  $('#mail').on('input', function() {
    $(this).val($(this).val().replace(/[^0-9]/g, ''));
    if($(this).val().length > 0 && err == 0) {
      $('.input span').css('color', '#252323');
    } else if($(this).val().length > 0 && err > 0) {
      $('.input span').css('color', '#a94442');
    } else if($(this).val().length == 0) {
      $('.input span').css('color', '#c1bfb5');
    }
  });

  $('#signUpForm input[name="login"]').blur(function() {
    var len = $(this).val().length, newMsg;
    if (len < 3) {
      tooltipError($(this).parent());
      if (len > 0) {
        newMsg = "Login jest za krótki.";
      } else {
        newMsg = "Pole nie może pozostać puste.";
      }
    } else {
      resetTooltip($(this).parent());
      newMsg = loginMsg;
    }
    $(this).parent().attr('data-original-title', newMsg);
  });  
  $('#signUpForm input[name="pass1"]').blur(function() {
    var len = $(this).val().length, newMsg;
    if (len < 8) {
      tooltipError($(this).parent());
      if (len > 0) {
        newMsg = "Hasło jest za krótkie.";
      } else {
        newMsg = "Pole nie może pozostać puste.";
      }
    } else {
      resetTooltip($(this).parent());
      newMsg = passOneMsg;
    }
    $(this).parent().attr('data-original-title', newMsg);
  });
  $('#signUpForm input[name="pass2"]').blur(function() {
    var len = $(this).val().length, newMsg;
    if (len == 0) {
      tooltipError($(this).parent());
      newMsg = "Pole nie może pozostać puste.";
    } else if ($(this).val() != $('#signUpForm input[name="pass1"]').val()) {
      tooltipError($(this).parent());
      newMsg = "Hasła nie są takie same.";
    } else {
      resetTooltip($(this).parent());
      newMsg = passTwoMsg;
    }
    $(this).parent().attr('data-original-title', newMsg);
  });
  $('#signUpForm input[name="email"]').blur(function() {
    var len = $(this).val().length, newMsg;
    if (len < 6) {
      tooltipError($(this).parent());
      if (len > 0) {
        newMsg = "Numer indeksu jest za krótki.";
      } else {
        newMsg = "Pole nie może pozostać puste.";
      }
    } else {
      resetTooltip($(this).parent());
      newMsg = mailMsg;
    }
    $(this).parent().attr('data-original-title', newMsg);
  });

  $('input[name="login"]').on('input', function() {
    $(this).val($(this).val().replace(/[^\w.-]/g, ''));
  })
  $('input[type="password"]').on('input', function() {
    $(this).val($(this).val().replace(/[^\x21-\x7E]/g, ''));
  });
;});