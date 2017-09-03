var id = 0, grids_ok = 0, number_of_columns = [1, 1, 1];

function add_new_item(grid) {
  grid.append(get_item_basic_content(id));
  $('#item_'+id, grid)
    .css('background', get_random_color())
    .css('color', get_random_color());
  id += 1;
}

function save_file() {
  var header = $('.template.header .grid').clone(),
      main_part = $('.template.main_part .grid').clone(),
      footer = $('.template.footer .grid').clone();

  $('.item_panel', header).remove();
  $('.item_panel', main_part).remove();
  $('.item_panel', footer).remove();

  header = move_css(header, 'header');
  main_part = move_css(main_part, '#main_content');
  footer = move_css(footer, '.footer');
  
  var html = create_html_template(header.html(), main_part.html(), footer.html());

  var filename = $('#filename').val();
  if (filename === '') {
    $('#file_creator_popup .popup_err').slideDown('fast');
  } else {
    $('#file_creator_popup').fadeOut('fast', function() {
      create_file(html, filename);
      $('#file_save_success').fadeIn('fast');
    });
  }
}

$(document).ready(function() {
  $('#ok_btn').click(function() {
    close_popup('#file_save_success');
    restart();
  });
  $('#save_file').click(function() {
    save_file();
  });
  $('#next_step').click(function() {
    show_popup('#file_creator_popup');
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
        show_popup('#item_style_popup');
        change_item_colors(id);
      } else if (e.target.id.indexOf('item') !== -1 && e.target.id.indexOf('text') !== -1) {
        var id = '#item_' + e.target.id.substring(
          e.target.id.indexOf('item')+5,
          e.target.id.indexOf('text')-1);
        show_popup('#item_text_popup');
        change_item_contents(id);
      }
    });
    $('.control_panel .icon_settings', parent).click(function() {
      show_popup($('#grid_settings_popup'));
      change_grid_settings(parent);
    });
    $('.control_panel .icon_add_item', parent).click(function() {
      if (grid.hasClass('not_empty')) {
        add_new_item(grid);
      }
    });
  });
});