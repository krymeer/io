$(document).ready(function() {
  var flag = 0;
  if ($('a.mobileHeader').css('display') !== 'none') {
    var content3 = $('.coursePanel:nth-of-type(3)'),
        content4 = $('.coursePanel:nth-of-type(4)');
    $(content3).replaceWith(content4);
    $('.coursePanel:nth-of-type(3)').after(content3);
  }
  $(window).resize(function() {
    if (window.innerWidth >= 720) {
      $(content4).replaceWith(content3);
      $('.coursePanel:nth-of-type(3)').after(content4);
      $('.panelContent').css('display', 'block');
      flag = 1;
    }
  })
  $('.reportError').click(function() {
    alert($(this).parent().children('h4').html())
  })
  $('.reportError, .courseName a').hover(function() {
    $(this).popover('show');
  }, function() {
    $(this).popover('hide');
  });
  $('a.mobileHeader').click(function() {
    var content = $(this).parent().next('.panelContent');
    if (content.css('display') === 'none') {
      $('.panelContent').css('display', 'none');
      content.css('display', 'block');
    } else {
      content.css('display', 'none');
    }
  });
  $('.groupInfo h4 i.toggle').click(function() {
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
});