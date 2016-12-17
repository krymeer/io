var swapPanels = function() {
  var content_left, content_right, title;
  content_left = $('.coursePanel:nth-of-type(3)');
  content_right = $('.coursePanel:nth-of-type(4)');
  title = content_left.children('h2').text();
  if (title.indexOf('Kontakt') < 0 && window.innerWidth <= 1200) {
    content_left.replaceWith(content_right);
    content_right.after(content_left);
  } else if (title.indexOf('Kontakt') >= 0 && window.innerWidth > 1200) {
    content_left.replaceWith(content_right);
    content_right.after(content_left);
  }
  showContent();
};

var reportErrors = function() {
  $('.reportError').unbind().click(function() {
    if ($('.msgStatus').css('display') === 'none') {
      var id = $(this).parent().attr('id');
      id = id.substring(id.indexOf('_')+1);
      var msgCode = Math.floor(Math.random()*3);
      $('.msgStatus').removeClass('error').removeClass('alreadyAdded').removeClass('success');
      if (msgCode == 0) {
        $('.msgStatus').addClass('success').text('Pomyślnie zgłoszono informację.').fadeIn('slow').delay(2000).fadeOut('slow');
      } else if (msgCode == 1) {
       $('.msgStatus').addClass('error').text('Nie udało się zgłosić informacji. Spróbuj ponownie lub skontaktuj się z administratorem.').fadeIn('slow').delay(2000).fadeOut('slow');
      } else if (msgCode == 2) {
        $('.msgStatus').addClass('alreadyAdded').text('Już zgłaszałeś tę informację. Każdy użytkownik może to zrobić tylko raz.').fadeIn('slow').delay(2000).fadeOut('slow');
      }
    }
  });
  $('.reportError, .courseName a').hover(function() {
    $(this).popover('show');
  }, function() {
    $(this).popover('hide');
  });  
};

var showContent = function() {
  $('a.mobileHeader').unbind().click(function(event) {
    var content = $(this).parent().next('.panelContent');
    if (content.css('display') === 'none') {
      $('.panelContent').css('display', 'none');
      overrideAnchorBehaviour(content, this, event);
      content.css('display', 'block');
    } else {
      overrideAnchorBehaviour(content, this, event);
      content.css('display', 'none');
    }
  });
};

var listsOfTasks = function() {
  $('.groupInfo h4 i.toggle').unbind().click(function() {
    var hiddenList = $(this).parent().next('.hiddenList');
    var toggle = $(this).prev('span.toggleTriangle');
    if (hiddenList.css('display') === 'none') {
      hiddenList.css('display', 'block');
      toggle.css('display', 'inline');
    } else if (hiddenList.css('display') === 'block') {
      hiddenList.css('display', 'none');
      toggle.css('display', 'none');
    }
  });
};

var overrideAnchorBehaviour = function(content, that, event) {
  event.preventDefault();
  if (that.hash !== '') {
    if (content.css('display') === 'none') {
      $('html, body').animate({scrollTop: $(that.hash).offset().top-52}, 'slow');
    }
  }
}

$(document).ready(function() {
  swapPanels();
  reportErrors();
  showContent();
  listsOfTasks();
  $(window).resize(function() {
    swapPanels();
    if (window.innerWidth > 720 && $('.panelContent').css('display') === 'none') {
      $('.panelContent').css('display', 'inline');
    }
    if ($('.mobileHeader').css('display') !== 'none') {
      $('.panelContent').css('display', 'none');
    }
  });  
});