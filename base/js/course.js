$(document).ready(function() {
  var content3 = $('.coursePanel:nth-of-type(3)'),
      content4 = $('.coursePanel:nth-of-type(4)'),
      flag = 0;
  if ($('i.mobileHeader').css('display') !== 'none') {
    $(content3).replaceWith(content4);
    $('.coursePanel:nth-of-type(3)').after(content3);
    flag = 1;
  }
  $(window).resize(function() {
    alert('coś')
    if (window.innerWidth >= 720) {
      $(content4).replaceWith(content3);
      $('.coursePanel:nth-of-type(3)').after(content4);
      $('.panelContent').css('display', 'block');
    };
  })
  $('.reportError').click(function() {
    alert($(this).parent().children('h4').html())
  })
  $('.reportError, .courseName a').hover(function() {
    $(this).popover('show');
  }, function() {
    $(this).popover('hide');
  });
  $('i.mobileHeader').click(function() {
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