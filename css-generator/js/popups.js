var current_popup = '', last_popup_id = '';

// Function that closes a selected popup window
function close_popup(popup_id) {
  if ($(popup_id+' .popup_err').css('display') === 'block') {
    $(popup_id+' .popup_err').slideUp('fast');
  }
  $(popup_id).fadeOut('fast', function() {
    $('#mask').fadeOut('fast');
    last_popup_id = popup_id.substring(1);
    current_popup = '';
  });
//  $(popup_id + ', #mask').fadeOut('fast');
}

// Function that opens a selected popup window
function show_popup(popup_id) {
  $('#mask').fadeIn('fast', function() {
    $(popup_id).fadeIn('fast');
    current_popup = popup_id;
//  $(popup_id + ', #mask').fadeIn('fast');
  });
}

$(document).ready(function() {
  $('.close_popup').click(function() {
    close_popup('#'+$(this).parent().attr('id'));
  });

  // Hitting the Enter and Esc buttons fires particular events
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

// Changing CSS styling of the grid items.
// Supported features: background-color, font-family, font-color, a few HTML tags, a vertical and horizontal alignment of the text
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
      current_font = font_family,
      vertical_alignment = $(id).css('align-items'),
      horizontal_alignment = $(id).css('text-align');

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

  $('#item_bg_sq').css('background', curr_bg);
  $('#item_color_sq').css('background', curr_col);
  for (var k = 0; k < 3; k++) {
    $('#item_bg_'+k).val(rgb_bg[k]);
    $('#item_color_'+k).val(rgb_col[k]);
  }
  
  var check_colors = function() {
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
  }
  $('.item_bg, .item_color').change(check_colors);

  $('#item_style_popup .btn').click(function() {
    if (valid_bg_rgb && valid_col_rgb) {
      vertical_alignment = $('#vertical_alignment + div.nice-select > span.current').attr('data-value');
      horizontal_alignment = $('#horizontal_alignment + div.nice-select > span.current').attr('data-value');
      current_font = $('#select_font + div.nice-select > span.current').attr('data-value');
      font_family = current_font;
      if (current_font !== 'sans-serif' && current_font !== 'serif') {
        font_family = '"'+current_font+'"' + ', sans-serif';
      }
      $(id).css({"background": new_bg_rgb, "color": new_col_rgb, "font-family": font_family, "align-items": vertical_alignment, "text-align": horizontal_alignment});
      close_popup('#item_style_popup');
      $(this).off('click');
    } else {
      $('#item_style_popup .popup_err').html('Nieprawidłowa wartość koloru.').slideDown('fast');
    }
  });
}

// Inserting HTML tags.
// If any text is highlighted by the user, it is wrapped with a chosen tag.
// Otherwise the tag is appended to the rest of the contents of the text area.
function insert_html_tag(t) {
  if ($('#item_text_popup').css('display') !== 'none') {
    var textarea = document.getElementById('item_contents'),
        tag_start = '['+t+']',
        tag_end = '[/'+t+']',
        contents = textarea.value;

    if (textarea.selectionStart !== undefined) {
      var start_pos = textarea.selectionStart,
          end_pos = textarea.selectionEnd,
          selected_text = contents.substring(start_pos, end_pos),
          text_before = contents.substring(0, start_pos),
          text_after = contents.substring(end_pos, contents.length);

      contents = text_before + tag_start + selected_text + tag_end + text_after;
    } else {
      contents += tag_start + tag_end;    
    } 
    $('#item_contents').val(contents);
  }
}

// HTML tags that are allowed inside the grid items.
// Below there are regular expressions for allowed and forbidden tags
var tags_allowed = ['b', 'i', 'u', 's'],
    regexp_text_start = new RegExp('\\[(' + tags_allowed.join('|') + ')\\]', 'g'),
    regexp_text_end = new RegExp('\\[\/(' + tags_allowed.join('|') + ')\\]', 'g'),
    regexp_html_start = new RegExp('<(' + tags_allowed.join('|') + ')>', 'g'),
    regexp_html_end = new RegExp('<\/(' + tags_allowed.join('|') + ')>', 'g');
    regexp_forbidden_html_start = new RegExp('<[^' + tags_allowed.join('') + ']+ [^<' + tags_allowed.join('') + ']*>', 'g'),
    regexp_forbidden_html_end = new RegExp('<\/[^' + tags_allowed.join('') + ']+>', 'g');

// Function that converts the allowed HTML tags into their counterparts
function convert_tag(match, offset, string) {
  if (match.indexOf('[') !== -1) {
    return '<' + match.substring(1, match.length-1) + '>';
  }
  return '[' + match.substring(1, match.length-1) + ']';
}

// Function that escapes any not allowed HTML tags
function escape_tag(match, offset, string) {
  return '&lt;' + match.substring(1, match.length-1) + '&gt;';
}

// Changing contents of one of the grid items.
// Note that all the newlines (\n) are converted into line breaks (<br>).
function change_item_contents(id) {
  $('#item_additions #lipsum').click(function() {
    $('#item_contents').val($('#item_contents').val() + lipsum[get_random_int(0, lipsum_length-1)]);
  });
  $('#item_tags .sq_btn').click(function() {
    insert_html_tag($(this).attr('id').substring(4));
  });
  $('#item_contents').val($(id+' .item_contents').html()
    .replace(/<br>/g, '\n')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(regexp_html_start, convert_tag)
    .replace(regexp_html_end, convert_tag)
  );
  $('#item_text_popup .btn').click(function() {
    $(id+' .item_contents').html($('#item_contents').val()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>')
      .replace(regexp_text_start, convert_tag)
      .replace(regexp_text_end, convert_tag)
/*
      .replace(regexp_forbidden_html_start, escape_tag)
      .replace(regexp_forbidden_html_end, escape_tag)
*/
    );
    close_popup('#item_text_popup');
    $(this).off('click');
    $('#item_tags .sq_btn').each(function() {
      $(this).off('click');
    })
  });
}

// Changing setting of the grid container.
// Supported feature: number of grid items in one row
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