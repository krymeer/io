// Getting the title of the popup
function get_popup_title(id) {
  var h2 = '';

  switch(id) {
    case 'file_creator_popup':
      h2 = 'Nazwa pliku';
      break;
    case 'item_text_popup':
      h2 = 'Zawartość';
      break;
    case 'file_save_success':
      h2 = 'Sukces';
      break;
    case 'item_style_popup':
      h2 = 'Styl';
      break;
    default:
      h2 = '&nbsp;';
      break;
  }

  return h2;
}

// Getting a requested popup and setting its features
function get_popup(id) {
  if (id !== last_popup_id) {
    $('.tiny_popup .btn').each(function() {
      $(this).off('click');
    });
    $('.tiny_popup').attr('id', id);
    $('.tiny_popup h2').text(get_popup_title(id));
    $('#popup_contents').html(get_contents(id));

    $('.tiny_popup .btn_save').text('Zapisz');
    if (id === 'file_save_success') {
      $('.tiny_popup .btn_save').text('OK!');
    }
  }

  show_popup('#'+id);
}

// Getting HTML contents of the popup
function get_contents(id) {
  if (id === 'file_creator_popup') {
    return '\
      <div class="wrapper block"> \
        <input type="text" id="filename" maxlength="24" onkeypress="return validate_filename(event)"><span>.html</span> \
      </div> \
      <div class="popup_err">To pole nie może pozostać puste.</div>';
  } else if (id === 'file_save_success') {
    return '<span>Plik został zapisany!</span>';
  } else if (id === 'grid_settings_popup') {
    return '\
      <div class="wrapper block grid_number" id="grid_rows_number"> \
        <span>Ilość elementów w&nbsp;wierszu</span> \
        <span class="grid_math_btn plus">+</span> \
        <span class="grid_n">1</span> \
        <span class="grid_math_btn minus">-</span> \
      </div>';
  } else if (id === 'item_text_popup') {
    return '\
      <textarea id="item_contents"></textarea> \
      <div id="item_tags"> \
        <h3>Tagi</h3> \
        <div class="sq_btn" id="tag_b">b</div> \
        <div class="sq_btn" id="tag_i">i</div> \
        <div class="sq_btn" id="tag_u">u</div> \
        <div class="sq_btn" id="tag_s">s</div> \
      </div> \
      <div id="item_additions"> \
        <h3>Dodatki</h3>\
        <div class="sq_btn" id="lipsum">Lorem ipsum</div> \
      </div> \
      <div class="popup_err alert visible">Uwaga: inne tagi (także te w postaci znaczników <b>HTML</b>) zostaną zinterpretowane jako tekst.</div>';
  } else if (id === 'item_style_popup') {
    return '\
      <div class="wrapper block" id="item_select_colors"> \
        <span>Kolor tła</span> \
        <span id="item_bg_sq">&nbsp;</span> \
        <div> \
          <input type="text" class="item_bg" id="item_bg_0" maxlength="3" onkeypress="return check_if_digit(event)"> \
          <input type="text" class="item_bg" id="item_bg_1" maxlength="3" onkeypress="return check_if_digit(event)"> \
          <input type="text" class="item_bg" id="item_bg_2" maxlength="3" onkeypress="return check_if_digit(event)"> \
        </div> \
        <span>Kolor tekstu</span> \
        <span id="item_color_sq">&nbsp;</span> \
        <div> \
          <input type="text" class="item_color" id="item_color_0" maxlength="3" onkeypress="return check_if_digit(event)"> \
          <input type="text" class="item_color" id="item_color_1" maxlength="3" onkeypress="return check_if_digit(event)"> \
          <input type="text" class="item_color" id="item_color_2" maxlength="3" onkeypress="return check_if_digit(event)"> \
        </div> \
        <span>Czcionka</span> \
        <select id="select_font"> \
          <option value="Saira Semi Condensed">Saira Semi Condensed</option> \
          <option value="Roboto">Roboto</option> \
          <option value="Lato">Lato</option> \
          <option value="sans_serif">bezszeryfowa</option> \
          <option value="serif">szeryfowa</option> \
        </select> \
        <span class="line_height_one">Wyrównanie tekstu w&nbsp;pionie</span> \
        <select id="vertical_alignment"> \
          <option value="start">góra</option> \
          <option value="center">środek</option> \
          <option value="end">dół</option> \
        </select> \
        <span class="line_height_one">Wyrównanie tekstu w&nbsp;poziomie</span> \
        <select id="horizontal_alignment"> \
          <option value="left">do lewej</option> \
          <option value="center">do środka</option> \
          <option value="right">do prawej</option> \
          <option value="justify">wyjustuj</option> \
        </select> \
      </div> \
      <div class="popup_err"></div>';
  }
}