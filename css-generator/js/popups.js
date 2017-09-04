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

function change_item_style(id) {
  var curr_bg = $(id).css('background-color'),
      curr_col = $(id).css('color'),
      rgb_bg = curr_bg.replace(/[^\d,]/g, '').split(','),
      rgb_col = curr_col.replace(/[^\d,]/g, '').split(','),
      valid_bg_rgb = true,
      valid_col_rgb = true,
      new_bg_rgb = curr_bg,
      new_col_rgb = curr_col,
      font_family = $(id).css('font-family').replace(/, /g, ',').replace(/\"/g, '').split(','),
      current_font = font_family;
  
  if (font_family.length > 1) {
    current_font = font_family[0];
  }
  $('#select_font + div.nice-select > ul > li[data-value="'+current_font+'"]').trigger('click');
  $('#select_font + div.nice-select > span.current').attr('data-value', current_font);

  $('#select_font + div.nice-select > ul > li').click(function() {
    $('#select_font + div.nice-select > span.current').attr('data-value', $(this).attr('data-value'));
  });
  
  $('#item_bg_sq').css('background', curr_bg);
  $('#item_color_sq').css('background', curr_col);
  for (var k = 0; k < 3; k++) {
    $('#item_bg_'+k).val(rgb_bg[k]);
    $('#item_color_'+k).val(rgb_col[k]);
  }
  $('.item_bg, .item_color').change(function() {
    var r = parseInt($('#item_bg_0').val()),
        g = parseInt($('#item_bg_1').val()),
        b = parseInt($('#item_bg_2').val());

    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      $('#item_bg_0').val(r);
      $('#item_bg_1').val(g);
      $('#item_bg_2').val(b);
      new_bg_rgb = 'rgb('+r+','+g+','+b+')';
      $('#item_bg_sq').css('background', new_bg_rgb);
      valid_bg_rgb = true;
    } else {
      valid_bg_rgb = false;
    }

    r = parseInt($('#item_color_0').val()),
    g = parseInt($('#item_color_1').val()),
    b = parseInt($('#item_color_2').val());

    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      $('#item_color_0').val(r);
      $('#item_color_1').val(g);
      $('#item_color_2').val(b);
      new_col_rgb = 'rgb('+r+','+g+','+b+')';
      $('#item_color_sq').css('background', new_col_rgb);
      valid_col_rgb = true;
    } else {
      valid_col_rgb = false;
    }
  });
  $('#item_style_popup .btn').click(function() {
    if (valid_bg_rgb && valid_col_rgb) {
      current_font = $('#select_font + div.nice-select > span.current').attr('data-value');
      font_family = current_font;
      if (current_font !== 'sans-serif' && current_font !== 'serif') {
        font_family = '"'+current_font+'"' + ', sans-serif';
      }
      $(id).css({"background": new_bg_rgb, "color": new_col_rgb, "font-family": font_family});
      close_popup('#item_style_popup');
      $(this).off('click');
    } else {
      $('#item_style_popup .popup_err').html('Nieprawidłowa wartość koloru.').slideDown('fast');
    }
  });
}

function change_item_contents(id) {
  $('#item_contents').val($(id+' .item_contents').text());
  $('#item_text_popup .btn').click(function() {
    var str = $('#item_contents').val();
    text = $('<textarea/>').text(str).html();
    $(id+' .item_contents').text(text);
    close_popup('#item_text_popup');
    $(this).off('click');
  });
}

function change_grid_settings(e) {
  var heading = $('h2', e).text();
  heading = heading.charAt(0).toUpperCase() + heading.slice(1);
  $('#grid_settings_popup h2').text(heading);
  var k = e.attr('id').slice(4),
      n = number_of_columns[k];
  $('.grid_n').text(n);
  $('#grid_rows_number .minus').click(function() {
    if (n-1 > 0) {
      n--;
      $('.grid_n').text(n);
    }
  });
  $('#grid_rows_number .plus').click(function() {
    if (n+1 < 11) {
      n++;
      $('.grid_n').text(n);
    }
  });
  $('#grid_settings_popup .btn').click(function() {
    number_of_columns[k] = n;
    var rule = '';
    for (i = 0; i < n; i++) {
      rule += '1fr ';
    }
    rule = rule.substring(0, rule.length-1);
    $('.grid', e).css('grid-template-columns', rule);
    close_popup('#grid_settings_popup');
    $(this).off('click');
  });
}