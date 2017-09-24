var parent, hits = 0, timeout, timing = 500;

function insert_grid() {
  var width = parent.width() / 2,
      grid = $('<div/>');

  grid.css({
    'background': get_random_color(),
    'width': width+'px',
    'height': width+'px'
  });

  grid.addClass('grid');
  grid.html('<div class="lipsum">' + lipsum[get_random_int(0, lipsum_length-1)] + '</div>')

  parent.append(grid);
  if (width > 0) {
    grid.hide().fadeIn();
  }

  parent = grid;

  hits++;
  $('#hits + div').html(hits);
  $('#dims + div').html(width + '&times;' + width + 'px');
}

function reset() {
  $('#big_grid div').fadeOut(function() {
    $('#big_grid').html('');
  });
  $('#stats').slideUp();
  hits = 0;
  parent = $('#big_grid');
  timing = 500;
  window.clearTimeout(timeout);
}

function auto_adding() {
  $('button#insert').trigger('click');
  timeout = window.setTimeout(function() {
    auto_adding();
  }, timing);
}

$(document).ready(function() {
  set_w3_urls();
  parent = $('#big_grid');
  $('button#insert').click(function() {
    insert_grid(parent);
    $('#stats').slideDown();
  });
  $('button#auto').click(function() {
    auto_adding();
  });
  $('button#reset').click(function() {
    reset();
  });
  $('button#turbo').click(function() {
    timing = 1;
    if (hits === 0) {
      auto_adding();
    }
  });
});