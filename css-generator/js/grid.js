var id = 0;

function get_random_int(min, max) {
  return Math.floor(Math.random() * (max-min+1)) + min;
}

function get_random_color() {
  var r = get_random_int(0, 255),
      g = get_random_int(0, 255),
      b = get_random_int(0, 255),
      rgb = 'rgb('+r+', '+g+', '+b+')';

  return rgb;
}


function add_new_item(grid) {
  var color = get_random_color();
  grid.append('<div class="new" id=item_'+id+'></div>');
  $('#item_'+id, grid).css('background', color);
  id += 1;
}

$(document).ready(function() {
  $('.grid').each(function() {
    var parent = $(this);
    $(this).click(function() {
      if (!parent.hasClass('not_empty')) {
        parent.addClass('not_empty');
        add_new_item(parent);
      }
    });
    $('.add_item_icon', this).click(function() {
      if (parent.hasClass('not_empty')) {
        add_new_item(parent);
      }
    });
  });
});