$(document).ready(function() {
  set_w3_urls();
  parent = $('#big_grid');
  $('button#insert').click(function() {
    insert_grid();
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