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
  var attr = $('#horizontalBar #menu').width();
  if (attr < 720) {
    console.log($('body').width())
    $(window).scroll(function() {
      if ($(this).scrollTop() > 0) {
        $('#horizontalBar').animate({'height': '45px'}, 'slow');
        $('#horizontalBar #menu').fadeOut('slow');
        $('#moreButton').animate({'top': '-45px'}, 'slow').css('z-index', '110');
        $('#verticalBar').animate({'top': '83px'}, 'slow');
        $('#main #content').animate({'margin-top': '83px'}, 'slow');
      } else {
        $('div').finish();
        $('#horizontalBar').animate({'height': '90px'}, 'slow');
        $('#horizontalBar #menu').fadeIn('slow');
        $('#moreButton').animate({'top': '0'}, 'slow');
        $('#verticalBar').animate({'top': '128px'}, 'slow');
        $('#main #content').animate({'margin-top': '128px'}, 'slow');
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