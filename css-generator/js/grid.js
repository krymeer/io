var id = 0, grids_ok = 0, number_of_columns = [1, 1, 1];

/**
* Changes settings of the grid container.
* Supported feature: number of grid items in one row.
* @param {object} e a grid container
*/
function change_grid_settings(e) {
  var heading = $('h2', e).text();
  heading = heading.charAt(0).toUpperCase() + heading.slice(1);
  $('#grid_settings_popup h2').text(heading);
  var k = e.attr('id').slice(4),
      n = number_of_columns[k];
  $('.grid_n').text(n);
  $('#grid_rows_number .minus').click(function() {
    if (n-1 > 0) {
      n--;
      $('.grid_n').text(n);
    }
  });
  $('#grid_rows_number .plus').click(function() {
    if (n+1 < 11) {
      n++;
      $('.grid_n').text(n);
    }
  });
  $('#grid_settings_popup .btn').click(function() {
    number_of_columns[k] = n;
    var rule = '';
    for (i = 0; i < n; i++) {
      rule += '1fr ';
    }
    rule = rule.substring(0, rule.length-1);
    $('.grid', e).css('grid-template-columns', rule);
    close_popup('#grid_settings_popup');
    $(this).off('click');
  });
}

/**
* Adds a new item to the grid container.
* @param {object} grid the grid container
*/
function add_new_item(grid) {
  var br = '';
  if (grid.find('.item').length > 0) {
    br = '\n';
  }
  grid.append(br+get_item_basic_content(id));
  $('#item_'+id, grid)
    .css('background', get_random_color())
    .css('color', get_random_color());
  id += 1;
}

/*
* Handling click events
*/
$(document).ready(function() {
  $('#next_step').click(function() {
    get_popup('file_creator_popup');
    $(':animated').promise().done(function() {
      $('input#filename').get(0).focus();
    });
    $('#file_creator_popup .btn_save').click(function() {
      save_file();
    });
  });
  $('.grid').each(function() {
    var grid = $(this),
        parent = grid.parent();
    grid.click(function(e) {
      if (e.target === this) {
        if (!grid.hasClass('not_empty')) {
          $('.control_panel', grid.parent()).fadeIn('fast');
          grid.addClass('not_empty');
          add_new_item(grid);
          grids_ok++;
        }
        if (grids_ok == 3 && $('#next_step').css('display') === 'none') {
          $('#samples').addClass('visible');
          $('#next_step').slideDown('fast', function() {
            $('#next_step').addClass('visible');
          });
        }
      } else if (e.target.id.indexOf('item') !== -1 && e.target.id.indexOf('style') !== -1) {
        var id = '#item_' + e.target.id.substring(
          e.target.id.indexOf('item')+5,
          e.target.id.indexOf('style')-1);
        get_popup('item_style_popup');
        $('#select_font, #vertical_alignment, #horizontal_alignment').niceSelect();
        change_item_style(id);
      } else if (e.target.id.indexOf('item') !== -1 && e.target.id.indexOf('text') !== -1) {
        var id = '#item_' + e.target.id.substring(
          e.target.id.indexOf('item')+5,
          e.target.id.indexOf('text')-1);
        $('#item_text_popup .popup_err').show();
        get_popup('item_text_popup');
        change_item_contents(id);
      }
    });
    $('#samples').click(function() {
      insert_samples();
    });
    $('#choose_colors').click(function() {
      get_popup('list_of_schemes');
      choose_scheme();
    });
    $('.control_panel .icon_settings', parent).click(function() {
      get_popup('grid_settings_popup');
      change_grid_settings(parent);
    });
    $('.control_panel .icon_add_item', parent).click(function() {
      if (grid.hasClass('not_empty')) {
        add_new_item(grid);
        if ($('.item', grid).length == 2) { 
          grid.sortable({
            containment: 'parent',
            tolerance: 'pointer'
          });
          grid.disableSelection();
        }
      }
    });
  });
});