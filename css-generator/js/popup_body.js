/**
* Returns the title of the popup.
* @param  {string} id an identifier of the popup
* @returns {string} a title of the popup
*/
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
    case 'color_picker':
      h2 = 'Kolor';
      break;
    default:
      h2 = '&nbsp;';
      break;
  }

  return h2;
}

/**
* Finds a requested popup and sets its features.
* @param {string} id an identifier of the popup
*/
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

/**
* Returns HTML contents of the popup.
* @param {string} id an identifier of the popup
* @returns {string} contents of the popup
*/
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
        <span class="clickable_button grid_math_btn plus">+</span> \
        <span class="grid_n">1</span> \
        <span class="clickable_button grid_math_btn minus">-</span> \
      </div>';
  } else if (id === 'item_text_popup') {
    return '\
      <textarea id="item_contents"></textarea> \
      <div id="item_tags"> \
        <h3>Tagi</h3> \
        <div class="btn_grid">\
          <div class="clickable_button sq_btn" id="tag_b">b</div> \
          <div class="clickable_button sq_btn" id="tag_i">i</div> \
          <div class="clickable_button sq_btn" id="tag_u">u</div> \
          <div class="clickable_button sq_btn" id="tag_s">s</div> \
          <div class="clickable_button sq_btn" id="tag_blockquote"><i class="material-icons">format_quote</i></div> \
          <div class="clickable_button sq_btn tag_list" id="tag_h">h*</div> \
          <ul id="h_tags_list"> \
            <li class="clickable_button sq_btn" id="tag_h1">h1</li> \
            <li class="clickable_button sq_btn" id="tag_h2">h2</li> \
            <li class="clickable_button sq_btn" id="tag_h3">h3</li> \
            <li class="clickable_button sq_btn" id="tag_h4">h4</li> \
            <li class="clickable_button sq_btn" id="tag_h5">h5</li> \
          </ul>\
          <div class="clickable_button sq_btn" id="tag_ul">ul</div> \
          <div class="clickable_button sq_btn" id="tag_ol">ol</div> \
          <div class="clickable_button sq_btn" id="tag_li">li</div> \
          <div class="clickable_button sq_btn" id="tag_a">a</div> \
        </div> \
      </div> \
      <div id="item_additions"> \
        <h3>Dodatki</h3>\
        <div class="clickable_button sq_btn" id="lipsum">Lorem ipsum</div> \
      </div> \
      <div class="popup_err alert visible">Uwaga: inne tagi (także te w postaci znaczników <b>HTML</b>) zostaną zinterpretowane jako tekst.</div>';
  } else if (id === 'item_style_popup') {
    return '\
      <div class="wrapper block" id="item_set_css"> \
        <div class="grid_line color_selection"> \
          <span>Kolor tła</span> \
          <span class="color_square" id="item_bg_sq">&nbsp;</span> \
          <div> \
            <input type="text" class="item_bg" id="item_bg_0" maxlength="3" onkeypress="return check_if_digit(event)"> \
            <input type="text" class="item_bg" id="item_bg_1" maxlength="3" onkeypress="return check_if_digit(event)"> \
            <input type="text" class="item_bg" id="item_bg_2" maxlength="3" onkeypress="return check_if_digit(event)"> \
          </div> \
        </div> \
        <div class="grid_line color_selection"> \
          <span>Kolor tekstu</span> \
          <span class="color_square" id="item_color_sq">&nbsp;</span> \
          <div> \
            <input type="text" class="item_color" id="item_color_0" maxlength="3" onkeypress="return check_if_digit(event)"> \
            <input type="text" class="item_color" id="item_color_1" maxlength="3" onkeypress="return check_if_digit(event)"> \
            <input type="text" class="item_color" id="item_color_2" maxlength="3" onkeypress="return check_if_digit(event)"> \
          </div> \
        </div> \
        <div class="grid_line"> \
          <span>Czcionka</span> \
          <div class="select_wrapper"> \
            <select id="select_font"> \
              <option value="Saira Semi Condensed">Saira Semi Condensed</option> \
              <option value="Roboto">Roboto</option> \
              <option value="Lato">Lato</option> \
              <option value="sans_serif">bezszeryfowa</option> \
              <option value="serif">szeryfowa</option> \
            </select> \
          </div> \
        </div> \
        <div class="grid_line"> \
          <span class="line_height_one">Wyrównanie tekstu w&nbsp;pionie</span> \
          <div class="select_wrapper"> \
            <select id="vertical_alignment"> \
              <option value="start">góra</option> \
              <option value="center">środek</option> \
              <option value="end">dół</option> \
            </select> \
          </div> \
        </div> \
        <div class="grid_line"> \
          <span class="line_height_one">Wyrównanie tekstu w&nbsp;poziomie</span> \
          <div class="select_wrapper"> \
            <select id="horizontal_alignment"> \
              <option value="left">do lewej</option> \
              <option value="center">do środka</option> \
              <option value="right">do prawej</option> \
              <option value="justify">wyjustuj</option> \
            </select> \
          </div> \
        </div> \
        <div class="grid_line"> \
          <span>Margines wewnętrzny</span> \
          <div class="grid_line col2_row1 justify_start">\
            <input id="padding" type="text" maxlength="2" onkeypress="return check_if_digit(event)"> \
            <span>px</span> \
          </div> \
        </div> \
        <div class="grid_line"> \
          <span>Zaokrąglenie rogów</span> \
          <div class="grid_line col2_row1 justify_start">\
            <input id="border_radius" type="text" maxlength="2" onkeypress="return check_if_digit(event)"> \
            <span>px</span> \
          </div> \
        </div> \
        <div class="grid_line" id="line_height_wrapper"> \
          <span>Interlinia</span> \
          <div class="grid_line col3_row1 justify_start">\
            <span class="clickable_button grid_math_btn plus">+</span> \
            <input id="line_height" type="text" maxlength="4" onkeypress="return (check_if_digit(event) || event.charCode === 46)"> \
            <span class="clickable_button grid_math_btn minus">-</span> \
          </div> \
        </div> \
      </div> \
      <div id="color_picker"> \
        <div class="grid_line col2_row1"> \
          <div id="rect_wrap"> \
            <div id="rect"></div> \
          </div> \
          <div class="grid_line  col1_row2"> \
            <input class="color" id="rgb" type="text" maxlength="18" value="rgb(0, 0, 0)" onkeypress="return rgb_char(event)"> \
            <input class="color" id="hex" type="text" maxlength="7" value="#000000" onkeypress="return hex_char(event)"> \
          </div> \
        </div> \
        <div class="strap_container"> \
          <input type="range" min="0" max="255" value="0" class="strap_handler" id="sh_0"> \
          <div class="strap" id="strap_1"></div> \
        </div> \
        <div class="strap_container"> \
          <input type="range" min="0" max="255" value="0" class="strap_handler" id="sh_1"> \
          <div class="strap" id="strap_2"></div> \
        </div>\
        <div class="strap_container"> \
          <input type="range" min="0" max="255" value="0" class="strap_handler" id="sh_2"> \
          <div class="strap" id="strap_3"></div> \
        </div> \
      </div> \
      <div class="popup_err"></div>';
  }
}