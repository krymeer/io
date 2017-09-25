var parent, hits = 0, timeout, timing = 500;

function insert_grid() {
  var width = parent.width() / 2,
      grid = $('<div/>');

  grid.css({
    'background': get_random_color()
  });

  grid.addClass('grid');

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