var parent, hits = 0, timeout, timing = 500;

function insert_grid() {
  var start_time = performance.now();
  var width = parent.width() / 2,
      grid = $('<div/>');

  grid.css({
    'background': get_random_color()
  });

  grid.addClass('grid');

  parent.append(grid);
  grid.hide().fadeIn();

  parent = grid;

  hits++;
  $('#hits + div').html(hits);
  $('#dims + div').html(width + '&times;' + width + 'px');

  var end_time = performance.now();
  console.log('\n  hits: ' + hits + '\n  time [ms]: \n  ' + (end_time-start_time));
  $(":animated").promise().done(function() {
    end_time = performance.now();
    console.log('\n  hits: ' + hits + '\n  time (w/ animations) [ms]: \n  ' + (end_time-start_time));
  });
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