var id = 0, grids_ok = 0, number_of_columns = [1, 1, 1];

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

/**
* Saves contents of the document to a separate file.
*/
function save_file() {
  var header = $('.template.header .grid').clone(),
      main_part = $('.template.main_part .grid').clone(),
      footer = $('.template.footer .grid').clone();

  $('.item_panel', header).remove();
  $('.item_panel', main_part).remove();
  $('.item_panel', footer).remove();

  basic_css = basic_css_org;
  header = move_css(header, 'header');
  main_part = move_css(main_part, '#main_content');
  footer = move_css(footer, '.footer');

  var html = create_html_template(header, main_part, footer);

  var filename = $('#filename').val();
  if (filename === '') {
    $('#file_creator_popup .popup_err').slideDown('fast');
  } else {
    $('#file_creator_popup').fadeOut('fast', function() {
      create_file(html, filename);
      get_popup('file_save_success');
      $('#file_save_success .btn_save').click(function() {
        close_popup('#file_save_success');
        restart();
      });
    });
  }
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
/*
  // Testing
  $('.template:first-of-type .grid').trigger('click');
  //$('#item_0_style').trigger('click');
  $('#item_0_text').trigger('click');
//*/  
});