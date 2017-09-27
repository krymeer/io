function update_rgb(val) {
  var hex = '#', color = 'rgb('+ val[0] +', '+ val[1] +', '+ val[2] +')';
  for (var k = 0; k < 3; k++) {
    var n = parseInt(val[k]).toString(16).toUpperCase();
    if (n.length === 1) {
      n = '0' + n;
    }
    hex += n;
  }

  $('#hex').text(hex);
  $('#rgb').text(color);
  $('#rect').css('background', color);
}

$(document).ready(function() {
  var table_1 = '<table><tr>', table_2 = table_1, table_3 = table_2, rgb = [0, 0, 0];
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
    update_rgb(rgb);
  });

});