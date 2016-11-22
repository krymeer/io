var checkWhichPage = function() {
  var addr = window.location.href;
  addr = addr.substring(addr.lastIndexOf('/')+1, addr.length);
  if (addr.length != 0) {
    $('#verticalBar li a').each(function() {
      var a = $(this)[0].attributes[0].nodeValue;
      if (a == addr) {
        $(this).append('<div class="chosen"></div>');
      } else {
        $(this).children().remove();
      }
    });
  }
};

var addLineBreaks = function() {
  $('#verticalBar li a').each(function() {
    var text = $(this)[0].outerText;
    if (text.length >= 25) {
      var words = text.split(' '), formattedText = '';
      for (var i = 0; i < words.length; i++) {
        formattedText += words[i] + ' ';
        if ((formattedText.length + words[i].length >= 25) && i != words.length-1) {
           formattedText += '<br/>';
        }
      }
      if ($(this)[0].lastElementChild != null && $(this)[0].lastChild.className === "chosen") {
        $(this).html(formattedText + $(this)[0].lastElementChild.outerHTML);
      } else {
        $(this).html(formattedText);
      }
    }
  });
};

var activeSearch = function() {
  $('#verticalBar #inputWrapper input').on('input', function() {
    $('#verticalBar li').css({'border-top': '1px solid #6c6a65', 'border-bottom': '0' });
    $('#verticalBar li:last-child').css('border-bottom', '1px solid #6c6a65');
    var content = $(this).val().toLowerCase();
    var i = -1;
    $('#verticalBar li a').each(function() {
      var group = $(this)[0].outerText.toLowerCase();
      if (group.indexOf(content) !== -1) {
        $(this).css('display', 'block');
        i++;
      } else {
        $(this).css('display', 'none').parent().css('border', '0');   
      }
    });
    $('#verticalBar li:visible:last').css('border-bottom', '1px solid #6c6a65');
  });
};

var toggleMenu = function() {
  $('#moreButton').click(function() {
    if (!$('#verticalBar').is(':visible')) {
      $('#verticalBar').css('display', 'inline-block');
    } else {
      $('#verticalBar').css('display', 'none');
    }
  });
};

var detectScroll = function() {
  var attr = $('body').width();
  console.log(attr)
  if (attr < 720) {
    $(window).scroll(function() {
      if ($(this).scrollTop() > 0) {
        $('#horizontalBar').css('height', '45px');
        $('#horizontalBar #menu').hide();
        $('#moreButton').css('top', '-45px').css('z-index', '110');
        $('#verticalBar').css('top', '83px');
        $('#main #content').css('margin-top', '83px');
        $('[data-toggle="popover"]').popover('hide').data('bs.popover').inState.click = false;       
      } else {
        $('#horizontalBar').css('height', '90px');
        $('#horizontalBar #menu').show();
        $('#moreButton').css('top', '0').css('z-index', '80');
        $('#verticalBar').css('top', '128px');
        $('#main #content').css('margin-top', '128px');
      }
    });
  }
};

var closePopover = function() {
  $(document).click(function(e) {
    $('[data-toggle="popover"]').each(function() {
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
        $(this).popover('hide').data('bs.popover').inState.click = false;
      }
    });
  });
};

$(document).ready(function() {
  $('[data-toggle="popover"]').popover();
  checkWhichPage();
  addLineBreaks();
  activeSearch();
  toggleMenu();
  detectScroll();
  closePopover();
  var numberOfNotifications = Math.floor((Math.random()*100));
  /* Liczba powiadomień dla danego użytkownika; na razie to jakaś losowa wartość. */
  if (numberOfNotifications > 0) {
    $('#alertSquare').css('display', 'inline').html(numberOfNotifications);
  }
});