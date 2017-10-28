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

/**
* Sets a tiny color palette chosen by the user.
*/
function choose_colors() {
  $('#list_of_schemes .scheme').click(function() {
    $('#list_of_schemes .scheme.chosen').removeClass('chosen');
    $(this).addClass('chosen');
  });
  $('#list_of_schemes .btn_save').click(function() {
    var chosen = $('#list_of_schemes .scheme.chosen');
    if (chosen.html() !== undefined) {
      var col_1 = $('div:nth-of-type(1)', chosen).css('background-color'),
          col_2 = $('div:nth-of-type(2)', chosen).css('background-color'),
          col_3 = $('div:nth-of-type(3)', chosen).css('background-color'),
          col_4 = $('div:nth-of-type(4)', chosen).css('background-color'),
          col_5 = $('div:nth-of-type(5)', chosen).css('background-color');

      $('.item.with_samples').css({
        'background': col_2,
        'color': col_1
      });
      $('.item.with_samples .item_contents blockquote').css({
        'background': col_3,
        'color': col_1
      });
      $('.item.with_samples .item_contents button#ex_1').css({
        'background': col_1,
        'color': col_2
      })
      $('.item.with_samples .item_contents button#ex_2').css({
        'background': col_4,
        'color': col_1
      })
      $('.item.with_samples .item_contents button#ex_3').css({
        'background': col_5,
        'color': col_2
      })
    }
    close_popup('#list_of_schemes');
    $(this).off('click');
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
      valid_bg_rgb = true,
      valid_col_rgb = true,
      new_bg_rgb = curr_bg,
      new_col_rgb = curr_col,
      font_family = $(id).css('font-family').replace(/, /g, ',').replace(/\"/g, '').split(','),
      current_font = font_family,
      vertical_alignment = $(id).css('align-items'),
      horizontal_alignment = $(id).css('text-align'),
      sq_id, rgb;

  /**
  * Nested function.
  * Opens the color picker and sets a given value of the color.
  * @param {array} color in the RGB format
  */
  function pick_color(color) {
    rgb = color.replace(/[^\d,]/g, '').split(',');

    /**
    * Updates an input field for the RGB value.
    */ 
    function update_rgb() {
      var color = 'rgb('+ rgb[0] +', '+ rgb[1] +', '+ rgb[2] +')';

      $('#rgb').val(color);
      $('#rect').css('background', color);
    }

    /**
    * Updates an input field for the HEX value.
    */ 
    function update_hex() {
      var hex = '#';
      for (var k = 0; k < 3; k++) {
        var n = parseInt(rgb[k]).toString(16);
        if (n.length === 1) {
          n = '0' + n;
        }
        hex += n;
      }
      $('#hex').val(hex);
    }

    /**
    * Updates sliders with colors.
    */
    function update_sliders() {
      $('#sh_0').val(rgb[0]); $('#sh_1').val(rgb[1]); $('#sh_2').val(parseInt(rgb[2]));
    }

    /**
    * Validates an RGB value of the color.
    */
    function handle_rgb() {
      var in_rgb = $('#rgb').val(),
          valid_rgb = check_rgb(in_rgb); 

      if (valid_rgb) {
        in_rgb = in_rgb.replace(/[^\d,]/g, '').split(',');
        rgb[0] = in_rgb[0]; rgb[1] = in_rgb[1]; rgb[2] = in_rgb[2];
        update_sliders();
        update_rgb();
        update_hex();
      }
    }

    /**
    * Validates a hexadecimal value of the color.
    */
    function handle_hex() {
      var hex = $('#hex').val(),
          valid_hex = check_hex(hex),
          j = 1;

      if (valid_hex) {
        for (var k = 0; k < 3; k++) {
          rgb[k] = parseInt(hex.substring(j, j+2), 16).toString();
          j += 2;
        }
        update_sliders();
        update_rgb();
      }
    }

    var table_1 = '<table><tr>', table_2 = table_1, table_3 = table_2;
    for (var k = 0; k <= 255; k++) {
      table_1 += '<td style="background: rgb('+k+', 0, 0)"></td>';
      table_2 += '<td style="background: rgb(0, '+k+', 0)"></td>';
      table_3 += '<td style="background: rgb(0, 0, '+k+')"></td>';
    }
    table_1 += '</tr></table>'; table_2 += '</tr></table>'; table_3 += '</tr></table>';

    $('#strap_1').html(table_1); $('#strap_2').html(table_2); $('#strap_3').html(table_3);

    update_rgb();
    update_hex();
    update_sliders();

    $('.strap_handler').on('input', function() {
      var val = $(this).val(),
          id = $(this).attr('id').substring(3);

      rgb[id] = val;
      update_rgb();
      update_hex();
    });

    $('#hex').on('input', handle_hex);
    $('#rgb').on('input', handle_rgb);
  }

  /**
  * Checks if given colors are valid.
  */
  function check_colors() {
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

  $('.item_bg, .item_color').change(check_colors);

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
      if (valid_bg_rgb && valid_col_rgb) {
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
      if ($('#color_picker').css('display') !== 'none') {
        if (!check_hex($('#hex').val()) || !check_rgb($('#rgb').val())) {
          $('#item_style_popup .popup_err')
            .html('Podane dane są nieprawidłowe.')
            .slideDown('fast');
        } else {
          if ($('#item_style_popup .popup_err').css('display') !== 'none') {
            $('#item_style_popup .popup_err').slideUp('fast', function() {
              $('#item_style_popup .popup_err').html('');
            });
          }
          $('#'+sq_id).css('background-color', 'rgb(' + rgb.join(',').replace(/,/g, ', ') +')')
          for (var k = 0; k < 3; k++) {
            $('#'+sq_id+'+ div input:eq('+k+')').val(rgb[k]);
          }
          $('#color_picker').slideUp('fast', function() {
            $('#item_set_css').slideDown('fast');
          });
        }
      }

      check_colors();
    }
  });
}

/**
* Inserts HTML tags.<br>
* If any text is highlighted by the user, it is wrapped with a chosen tag. Otherwise the tag is appended to the rest of the contents of the text area.
* @param {string} t a chosen tag
*/
function insert_html_tag(t) {
  if ($('#item_text_popup').css('display') !== 'none') {
    var textarea = document.getElementById('item_contents'),
        tag_start = '['+t+']',
        tag_end = '[/'+t+']',
        contents = textarea.value,
        list_tag = false;

    if (t === 'ul' || t === 'ol') {
      list_tag = true;
    }

    if (t === 'a') {
      tag_start = '[a href="';
      tag_end = '"][/a]';
    }

    if (!list_tag && textarea.selectionStart !== undefined) {
      var start_pos = textarea.selectionStart,
          end_pos = textarea.selectionEnd,
          selected_text = contents.substring(start_pos, end_pos),
          text_before = contents.substring(0, start_pos),
          text_after = contents.substring(end_pos, contents.length);

      contents = text_before + tag_start + selected_text + tag_end + text_after;
    } else {
      if (list_tag) {
        var li = '\n  [li][/li]\n';
        contents += tag_start + li + tag_end;
      } else {
        contents += tag_start + tag_end;    
      }
    } 
    $('#item_contents').val(contents);
  }
}

/*
* HTML tags that are allowed inside the grid items.
* Below there are regular expressions for allowed and forbidden tags
* Regex for urls taken from:
* https://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript#answer-8943487
*/
var url_regex = '|a href=(\\\'|\\\")(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|](\\\'|\\\")',
    style_regex = '([ ]+style=(\\\"|\\\')[ a-zA-Z0-9.,;:()-]*(\\\"|\\\'))?';
    tags_allowed = ['b', 'i', 'u', 's', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'ul', 'ol', 'li', 'a', 'button', 'p', 'span'],
    end_tags = tags_allowed.join('|'),
    start_tags = end_tags.replace('|a', url_regex);

var regexp_text_start = new RegExp('\\[('+ start_tags +')'+ style_regex +'\\]', 'ig'),
    regexp_html_start = new RegExp('<(' + start_tags + ')'+ style_regex + '>', 'ig'),
    regexp_text_end = new RegExp('\\[\/(' + end_tags + ')\\]', 'ig'),
    regexp_html_end = new RegExp('<\/(' + end_tags + ')>', 'ig');

/**
* Converts the allowed HTML tags into their counterparts.
* @param {string} match an allowed tag
* @param {string} offset a name of a tag
* @param {number} string a starting index
* @returns {string} a converted tag
*/
function convert_tag(match, offset, string) {
  if (match.indexOf('[') !== -1) {
    return '<' + match.substring(1, match.length-1) + '>';
  }
  return '[' + match.substring(1, match.length-1) + ']';
}

/** 
* Escapes any not allowed HTML tags.
* @param {string} match a not allowed tag
* @param {string} offset a name of a tag
* @param {number} string a starting index
* @returns {string} an escaped tag
*/
function escape_tag(match, offset, string) {
  return '&lt;' + match.substring(1, match.length-1) + '&gt;';
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
      .replace(/\n/g, '<br>')
      .replace(regexp_text_start, convert_tag)
      .replace(regexp_text_end, convert_tag)
    );

    $(id+' .item_contents').html($(id+' .item_contents').html().replace(/<br>/g, '\n'))
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

/**
* Changes settings of the grid container.
* Supported feature: number of grid items in one row.
* @param {object} e a grid container
*/
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

/**
* Regex for 'rgb(n, n, n)' strings where 0 <= n <= 9.
* @param {object} e a pressed key
* @returns {boolean} if the pressed key can be a part of the string
*/
function rgb_char(e) {
  return /^[rgb\(\)0-9, ]$/.test(e.key);
}

/**
* Regex for '#xxxxxx' strings where x can be a letter from A to F.<br>
* (case insensitive)
* @param {object} e a pressed key
* @returns {boolean} if the pressed key is a number, a '#' sign or a letter from A to F
*/
function hex_char(e) {
  return /^[A-Fa-f0-9#]$/.test(e.key);
}

/**
* Regex for a color value in HEX.
* @param {string} hex color in the HEX format
* @returns {boolean} if a given string is valid
*/
function check_hex(hex) {
  return /^#[A-Fa-f0-9]{6}$/.test(hex);
}

/*
* Regex for a color value in RGB
* @param {string} in_rgb color in the RGB format
* @returns {boolean} if a given string is valid
*/
function check_rgb(in_rgb) {
  if (/^rgb\((([0-9]{1,3}),[ ]*){2}([0-9]{1,3})[ ]*\)$/.test(in_rgb) === false) {
    return false;
  }
  
  in_rgb = in_rgb.replace(/[^\d,]/g, '').split(',');
  for (var k = 0; k < 3; k++) {
    if (parseInt(in_rgb[k]) > 255) {
      return false;
    }
  }

  return true;
}