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
    nest();
    var n = $('.grid').length, d = (n+1)/2;
    $('.info#leaves .value').text(d);
    $('.info#grids .value').text(n);
    k++;
  });
});