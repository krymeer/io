var current_popup = '', last_popup_id = '';

/**
* Closes a selected popup window.
* @param {string} popup_id an identifier of the popup
*/
function close_popup(popup_id) {
  if ($(popup_id+' .popup_err').css('display') === 'block') {
    $(popup_id+' .popup_err').slideUp('fast');
  }
  $(popup_id+' .clickable_button').each(function() {
    $(this).off('click');
  });
  $(popup_id).fadeOut('fast', function() {
    $('#mask').fadeOut('fast');
    last_popup_id = popup_id.substring(1);
    current_popup = '';
    if (last_popup_id === 'item_style_popup' && $('#item_set_css').css('display') === 'none') {
      $('#item_set_css').show();
      $('#color_picker').hide();
    }
    if ($('.tiny_popup .tag_list + ul').length > 0) {
      $('.tiny_popup .tag_list + ul').hide();
    }
  });
}

/**
* Opens a selected popup window.
* @param {string} popup_id an identifier of the popup
*/
function show_popup(popup_id) {
  $('#mask').fadeIn('fast', function() {
    $(popup_id).fadeIn('fast');
    current_popup = popup_id;
  });
}

/**
* Changes CSS styling of the grid items. <br>
* Supported features: background-color, font-color, font-family, font-color, a few HTML tags, a color picker, a vertical and horizontal alignment of the text.
* @param {string} id an identifier of the grid item.
*/
function change_item_style(id) {
  var curr_bg = $(id).css('background-color'),
      curr_col = $(id).css('color'),
      rgb_bg = curr_bg.replace(/[^\d,]/g, '').split(','),
      rgb_col = curr_col.replace(/[^\d,]/g, '').split(','),
      valid_colors = true;
      new_bg_rgb = curr_bg,
      new_col_rgb = curr_col,
      font_family = $(id).css('font-family').replace(/, /g, ',').replace(/\"/g, '').split(','),
      current_font = font_family,
      vertical_alignment = $(id).css('align-items'),
      horizontal_alignment = $(id).css('text-align'),
      sq_id = '';

  if (font_family.length > 1) {
    current_font = font_family[0];
  }
  $('#select_font + div.nice-select > ul > li[data-value="'+current_font+'"]').trigger('click');
  $('#select_font + div.nice-select > span.current').attr('data-value', current_font);
  $('#select_font + div.nice-select > ul > li').click(function() {
    $('#select_font + div.nice-select > span.current').attr('data-value', $(this).attr('data-value'));
  });

  $('#vertical_alignment + div.nice-select > ul > li[data-value="'+vertical_alignment+'"]').trigger('click');
  $('#vertical_alignment + div.nice-select > span.current').attr('data-value', vertical_alignment);
  $('#vertical_alignment + div.nice-select > ul > li').click(function() {
    $('#vertical_alignment + div.nice-select > span.current').attr('data-value', $(this).attr('data-value'));
  });

  $('#horizontal_alignment + div.nice-select > ul > li[data-value="'+horizontal_alignment+'"]').trigger('click');
  $('#horizontal_alignment + div.nice-select > span.current').attr('data-value', horizontal_alignment);
  $('#horizontal_alignment + div.nice-select > ul > li').click(function() {
    $('#horizontal_alignment + div.nice-select > span.current').attr('data-value', $(this).attr('data-value'));
  });

  $('#padding').val(parseInt($(id+' .item_contents').css('padding')));
  $('#border_radius').val(parseInt($(id).css('border-radius')));
  $('#item_bg_sq').css('background', curr_bg);
  $('#item_color_sq').css('background', curr_col);
  for (var k = 0; k < 3; k++) {
    $('#item_bg_'+k).val(rgb_bg[k]);
    $('#item_color_'+k).val(rgb_col[k]);
  }

  var line_height = parseFloat($(id+' .item_contents')[0]['style']['lineHeight']);
  if (line_height === 'normal' || isNaN(line_height)) {
    line_height = 1;
  }
  $('#line_height').val(line_height);
  $('#line_height_wrapper .plus').click(function() {
    if (line_height <= 9.75) {
      line_height += 0.25;
      $('#line_height').val(parseFloat(line_height));
    }
  });
  $('#line_height_wrapper .minus').click(function() {
    if (line_height >= 0.25) {
      line_height -= 0.25;
      $('#line_height').val(parseFloat(line_height));
    }
  });

  $('.item_bg, .item_color').change(function() {
    valid_colors = check_colors();
  });

  $('#item_style_popup .color_square').click(function() {
    var color = $(this).css('background-color');
    sq_id = $(this).attr('id');
    $('#item_set_css').slideUp('fast', function() {
      window.setTimeout(function() {
        $('#color_picker').slideDown('fast');
        pick_color(color);
      }, 250);
    });
  });

  $('#item_style_popup .btn').click(function() {
    if ($('#item_set_css').css('display') !== 'none') {
      if (valid_colors) {
        vertical_alignment = $('#vertical_alignment + div.nice-select > span.current').attr('data-value');
        horizontal_alignment = $('#horizontal_alignment + div.nice-select > span.current').attr('data-value');
        current_font = $('#select_font + div.nice-select > span.current').attr('data-value');
        font_family = current_font;
        if (current_font !== 'sans-serif' && current_font !== 'serif') {
          font_family = '"'+current_font+'"' + ', sans-serif';
        }
        $(id).css({"background": new_bg_rgb, "color": new_col_rgb, "font-family": font_family, "align-items": vertical_alignment, "text-align": horizontal_alignment});
        
        var padding = parseInt($('#padding').val());
        if (padding+'px' !== $(id+' .item_contents').css('padding') && !isNaN(padding)) {
          $(id+' .item_contents').css('padding', padding);
        }

        var border_radius = parseInt($('#border_radius').val());
        if (border_radius+'px' !== $(id).css('border-radius') && !isNaN(border_radius)) {
          $(id).css('border-radius', border_radius);
        }
        
        line_height = parseFloat($('#line_height').val());
        if (isNaN(line_height)) {
          line_height = 1;
        }
        if (line_height !== $(id+' .item_contents').css('line-height') && !(line_height === 1 && $(id+' .item_contents').css('line-height') === 'normal')) {
          $(id+' .item_contents').css('line-height', line_height);
        } 

        close_popup('#item_style_popup');
        $(this).off('click');
      } else {
        $('#item_style_popup .popup_err').html('Nieprawidłowa wartość koloru.').slideDown('fast');
      }
    } else {
      check_color_picker(sq_id);
      valid_colors = check_colors();
    }
  });
}

/**
* Changes contents of one of the grid items.<br>
* Note that all the newlines (\n) are converted into line breaks (&lt;br&gt;).
* @param {string} an identifier of the grid item
*/ 
function change_item_contents(id) {
  $('#item_additions #lipsum').click(function() {
    $('#item_contents').val($('#item_contents').val() + lipsum[get_random_int(0, lipsum_length-1)]);
  });
  $('#item_tags .sq_btn:not(.tag_list)').click(function() {
    insert_html_tag($(this).attr('id').substring(4));
    var uncle_name = $(this).parent().prev().attr('class');
    if (uncle_name !== undefined && uncle_name.indexOf('tag_list') !== -1) {
      $(this).parent().hide();
    } else if ($('.tiny_popup .tag_list + ul').length > 0) {
      $('.tiny_popup .tag_list + ul').hide();
    }
  });
  $('#item_tags .tag_list').click(function() {
    if ($(this).next().css('display') === 'none') {
      var tp_offset = $('.tiny_popup').offset(),
          tag_offset = $(this).offset();
      $(this).next().css({
        'top': tag_offset.top - tp_offset.top + 30,
        'left': tag_offset.left - tp_offset.left,
        'width': $(this).outerWidth()
      }).show();
    } else {
      $(this).next().hide();
    }
  });
  $('#item_contents').val($(id+' .item_contents').html()
    .replace(/<br>/g, '\n')
    .replace(regexp_html_start, convert_tag)
    .replace(regexp_html_end, convert_tag)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
  );
  $('#item_text_popup .btn').click(function() {
    $(id+' .item_contents').html($('#item_contents').val()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(regexp_text_start, convert_tag)
      .replace(regexp_text_end, convert_tag)
    );

    /*
    * Newlines inside the paragraphs have to remain unchanged
    */
    $(id+' .item_contents > p').each(function() {
      $(this).html($(this).html().replace(/\n/g, '<br>'));
    });

    close_popup('#item_text_popup');
    $(this).off('click');
    $('#item_tags .sq_btn').each(function() {
      $(this).off('click');
    })
  });
}

$(document).ready(function() {
  $('.close_popup').click(function() {
    var id = $(this).parent().attr('id');
    close_popup('#'+id);
  });

  /*
  * Hitting the Enter and Esc buttons fires particular events.
  */
  $(document).keydown(function(key) {
    if (key.which === 13) {
      if ((current_popup === '#file_creator_popup' || current_popup === '#file_save_success') && $(current_popup + ' .btn_save').length > 0) {
        $(current_popup + ' .btn_save').trigger('click');
      }
    }
    if (key.which === 27) {
      if (current_popup !== '' && $(current_popup + ' .btn_cancel').length > 0) {
        $(current_popup + ' .btn_cancel').trigger('click');
      }
    }
  });
});