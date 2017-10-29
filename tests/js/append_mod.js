var i = 1, n = 500, cols;

function append_grid() {
  var start_time = performance.now();
  var grid = $('<div/>');
  grid.addClass('grid').appendTo('#grid_container');
  for (var k = 0; k < n-i+1; k++) {
    grid.append('<div style="background: '+ get_random_color() +'"></div>');
  }
  if (cols === undefined) {
    $('div:first-of-type', grid).css({
      'grid-column': 'span ' + i,
      'width': (2*i) + 'px'
    });
  } else {
    $('div:first-of-type', grid).css({
      'grid-row': 'span ' + i,
      'height': (2*i) + 'px'
    });
  }
  console.log(i+'  ', (performance.now()-start_time));
  i++;
}

function append_automatically() {
  append_grid();
  if (i <= 500) {
    window.setTimeout(function() {
      append_automatically();
    }, 500);  
  }
}

$(document).ready(function() {
  $('#appending_button').click(function() {
    if (i === 1) {
      $('#auto_appending').hide();
    }
    append_grid();
  });
  $('#auto_appending').click(function() {
    $('.btn:not(#go_back)').hide();
    append_automatically();
  });
})