var parent, hits = 0, timeout, timing = 500;

function insert_grid(with_lipsum) {
  var width = parent.width() / 2,
      grid = $('<div/>');

  grid.css({
    'background': get_random_color()
  });

  grid.addClass('grid');
/*
  if (with_lipsum) {
    grid.html('<div class="lipsum">' + lipsum[get_random_int(0, lipsum_length-1)] + '</div>');
  }
*/

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