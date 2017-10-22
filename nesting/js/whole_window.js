function insert_grids(parent) {
  var grid_1 = $('<div/>'), grid_2 = $('<div/>');

  grid_1.css('background', get_random_color()).addClass('grid');
  grid_2.css('background', get_random_color()).addClass('grid');

  parent.append(grid_1).append(grid_2);
  grid_1.hide().fadeIn();
  grid_2.hide().fadeIn();
}

function nest() {
  $('.grid').each(function() {
    if ($(this).children().length === 0) {
      insert_grids($(this));
    }
  });
}

$(document).ready(function() {
  set_w3_urls();
  var k = 1;
  $('.grid').click(function() {
    if ($('#btn_2_1').css('display') !== 'none') {
      $('#btn_2_1').hide()
    }
    console.log('');
    var start_time = performance.now();
    nest();
    var n = $('.grid').length, d = (n+1)/2;
    $('.info#leaves .value').text(d);
    $('.info#grids .value').text(n);
    var end_time = performance.now();
    //console.log('level: ' + k + ' / time [ms]: \n' + (end_time-start_time));
    $(":animated").promise().done(function() {
      end_time = performance.now();
      console.log(d + '\t' + (end_time-start_time));
      //console.log('nodes = '+ n +'\nleaves = '+ d +' \ntime [ms]: \n ' + (end_time-start_time));
      //console.log('level: ' + k + ' / time (w/ animations) [ms]: \n' + (end_time-start_time));
      k++;
    });
  });
  $('#btn_2_1').click(function() {
    $('body').addClass('p_2_1');
  });
});