var i = 1;

function append_grid() {
  var start_time = performance.now();
  var grid = $('<div/>');
  grid.addClass('grid').appendTo('#grid_container');
  for (var k = 0; k < 500; k++) {
    grid.append('<div style="background: '+ get_random_color() +'"></div>');
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
    append_grid();
  });
  $('#auto_appending').click(function() {
    $('.btn:not(#go_back)').hide();
    append_automatically();
  });
})