/**
* Updates an input field for the RGB value.
*/ 
function update_rgb(rgb) {
  var color = 'rgb('+ rgb[0] +', '+ rgb[1] +', '+ rgb[2] +')';

  $('#rgb').val(color);
  $('#rect').css('background', color);
}

/**
* Updates an input field for the HEX value.
*/ 
function update_hex(arr) {
  var hex = '#';
  for (var k = 0; k < 3; k++) {
    var n = parseInt(arr[k]).toString(16);
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
function update_sliders(rgb) {
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
    var rgb = [in_rgb[0], in_rgb[1], in_rgb[2]];
    update_sliders(rgb);
    update_rgb(rgb);
    update_hex(rgb);
  }
}

/**
* Validates a hexadecimal value of the color.
*/
function handle_hex() {
  console.log('handled')
  var hex = $('#hex').val(),
      valid_hex = check_hex(hex),
      j = 1, rgb = [];

  if (valid_hex) {
    for (var k = 0; k < 3; k++) {
      rgb.push(parseInt(hex.substring(j, j+2), 16).toString());
      j += 2;
    }
    update_sliders(rgb);
    update_rgb(rgb);
  }
}

/**
* Opens the color picker and sets a given value of the color.
* @param {array} color in the RGB format
*/
function pick_color(color) {
  var rgb = color.replace(/[^\d,]/g, '').split(',');


  var table_1 = '<table><tr>', table_2 = table_1, table_3 = table_2;
  for (var k = 0; k <= 255; k++) {
    table_1 += '<td style="background: rgb('+k+', 0, 0)"></td>';
    table_2 += '<td style="background: rgb(0, '+k+', 0)"></td>';
    table_3 += '<td style="background: rgb(0, 0, '+k+')"></td>';
  }
  table_1 += '</tr></table>'; table_2 += '</tr></table>'; table_3 += '</tr></table>';

  $('#strap_1').html(table_1); $('#strap_2').html(table_2); $('#strap_3').html(table_3);

  update_rgb(rgb);
  update_hex(rgb);
  update_sliders(rgb);

  $('.strap_handler').on('input', function() {
    var val = $(this).val(),
        id = $(this).attr('id').substring(3);

    rgb[id] = val;
    update_rgb(rgb);
    update_hex(rgb);
  });

  $('#hex').on('input', handle_hex);
  $('#rgb').on('input', handle_rgb);
}

function check_color_picker(id) {
  if ($('#color_picker').css('display') !== 'none') {
    var rgb_val = $('#rgb').val();
    if (!check_hex($('#hex').val()) || !check_rgb(rgb_val)) {
      $('#item_style_popup .popup_err')
        .html('Podane dane są nieprawidłowe.')
        .slideDown('fast');
    } else {
      if ($('#item_style_popup .popup_err').css('display') !== 'none') {
        $('#item_style_popup .popup_err').slideUp('fast', function() {
          $('#item_style_popup .popup_err').html('');
        });
      }
      $('#'+id).css('background-color', rgb_val);
      rgb_val = rgb_val.replace(/[^\d,]/g, '').split(',');
      for (var k = 0; k < 3; k++) {
        $('#'+id+'+ div input:eq('+k+')').val(rgb_val[k]);
      }
      $('#color_picker').slideUp('fast', function() {
        $('#item_set_css').slideDown('fast');
      });
    }
  }
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

  if (!valid_bg_rgb || !valid_col_rgb) {
    return false;
  }
  return true;
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