function close_popup(popup_id) {
  if ($(popup_id+' .popup_err').css('display') === 'block') {
    $(popup_id+' .popup_err').slideUp('fast');
  }
  $(popup_id).fadeOut('fast', function() {
    $('#mask').fadeOut('fast');
  });
//  $(popup_id + ', #mask').fadeOut('fast');
}

function show_popup(popup_id) {
  $('#mask').fadeIn('fast', function() {
    $(popup_id).fadeIn('fast');
//  $(popup_id + ', #mask').fadeIn('fast');
  });
}

$(document).ready(function() {
  $('.close_popup').click(function() {
    close_popup('#'+$(this).parent().attr('id'));
  });
});

function change_item_background(id) {
  var curr_bg = $(id).css('background-color'),
      rgb = curr_bg.replace(/[^\d,]/g, '').split(','),
      valid_rgb = true,
      new_rgb;
  $('#item_bg_sq').css('background', curr_bg);
  for (var k = 0; k < 3; k++) {
    $('#item_bg_'+k).val(rgb[k]);
  }
  $('.item_bg').change(function() {
    var r = parseInt($('#item_bg_0').val()),
        g = parseInt($('#item_bg_1').val()),
        b = parseInt($('#item_bg_2').val());

    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      $('#item_bg_0').val(r);
      $('#item_bg_1').val(g);
      $('#item_bg_2').val(b);
      new_rgb = 'rgb('+r+','+g+','+b+')';
      $('#item_bg_sq').css('background', new_rgb);
      valid_rgb = true;
    } else {
      valid_rgb = false;
    }
  });
  $('#item_style_popup .btn').click(function() {
    if (valid_rgb) {
      $(id).css('background', new_rgb);
      close_popup('#item_style_popup');
    } else {
      $('#item_style_popup .popup_err').html('Nieprawidłowa wartość koloru.').slideDown('fast');
    }
  });
}