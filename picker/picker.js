var rgb;

function update_rgb() {
  var color = 'rgb('+ rgb[0] +', '+ rgb[1] +', '+ rgb[2] +')';

  $('#rgb').val(color);
  $('#rect').css('background', color);
}

function update_hex() {
  var hex = '#';
  for (var k = 0; k < 3; k++) {
    var n = parseInt(rgb[k]).toString(16).toUpperCase();
    if (n.length === 1) {
      n = '0' + n;
    }
    hex += n;
  }
  $('#hex').val(hex);
}

function update_sliders() {
  $('#sh_0').val(rgb[0]); $('#sh_1').val(rgb[1]); $('#sh_2').val(parseInt(rgb[2]));
}

function check_hex(hex) {
  return /^#[A-Fa-f0-9]{6}$/.test(hex);
}

function check_rgb(in_rgb) {
  return /^rgb\((([0-9]{1,3}),[ ]*){2}([0-9]{1,3})[ ]*\)$/.test(in_rgb);
}

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

$(document).ready(function() {
  var table_1 = '<table><tr>', table_2 = table_1, table_3 = table_2;
  rgb = [0, 0, 0];
  for (var k = 0; k <= 255; k++) {
    table_1 += '<td style="background: rgb('+k+', 0, 0)"></td>';
    table_2 += '<td style="background: rgb(0, '+k+', 0)"></td>';
    table_3 += '<td style="background: rgb(0, 0, '+k+')"></td>';
  }
  table_1 += '</tr></table>'; table_2 += '</tr></table>'; table_3 += '</tr></table>';

  $('#strap_1').html(table_1); $('#strap_2').html(table_2); $('#strap_3').html(table_3);

  $('.strap_handler').on('input', function() {
    var val = $(this).val(),
        id = $(this).attr('id').substring(3);

    rgb[id] = val;
    update_rgb();
    update_hex();
  });

  $('#hex').on('input', handle_hex);
  $('#rgb').on('input', handle_rgb);
});