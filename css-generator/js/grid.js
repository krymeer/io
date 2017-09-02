var id = 0, grids_ok = 0;

function add_new_item(grid) {
  var color = get_random_color();
  grid.append('<div class="item" id=item_'+id+'></div>');
  $('#item_'+id, grid).css('background', color);
  id += 1;
}

function save_file() {
  var header = $('.template.header .grid').html(),
      main_part = $('.template.main_part .grid').html(),
      footer = $('.template.footer .grid').html(),
      html = create_html_template(header, main_part, footer);

  var filename = $('#filename').val();
  if (filename === '') {
    $('#file_creator_popup .no_val_err').slideDown('fast');
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
  $('#file_creator_popup i').click(function() {
    close_popup('#file_creator_popup');
  });
  $('.grid').each(function() {
    var grid = $(this),
        parent = grid.parent();
    grid.click(function() {
      console.log('click')
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
    });
    $('.control_panel .icon_add_item', parent).click(function() {
      if (grid.hasClass('not_empty')) {
        add_new_item(grid);
      }
    });
  });
});