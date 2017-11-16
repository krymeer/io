/*
* Basic contents of the generated document
*/
var template = '\
<!DOCTYPE html> \n\
<html lang="pl"> \n\
  <head> \n\
    <meta charset="utf-8"> \n\
    <meta name="viewport" content="width=device-width,initial-scale=1.0">\n\
    <title>Wygenerowany szablon</title> \n\
    <style>{{style}}\
    </style>\n\
  </head> \n\
  <body> \n\
    <div id="main_container"> \n\
      <header> \n\
        {{header}} \n\
      </header> \n\
      <div id="main_content"> \n\
        {{main_content}} \n\
      </div> \n\
      <footer> \n\
        {{footer}} \n\
      </footer> \n\
    </div> \n\
  </body> \n\
</html>';

/* 
* A skeleton of a code of a freshly generated grid item.
* Formatted text is inserted into the "item_contents" div
*/
var item_template = '\
<div class="item" id=item_{{id}} style="text-align: left"> \n\
  <div class="item_panel">  \n\
    <i class="material-icons" id="item_{{id}}_text">text_fields</i> \n\
    <i class="material-icons" id="item_{{id}}_style">palette</i>\n\
  </div> \n\
  <div class="item_contents"></div> \n\
</div>';

/**
* Removes any unwanted spacing between siblings.
* @param {string} elem HTML code
*/
function convert_to_one_line(elem) {
  elem.html(elem.html().replace(/>\s+</g, '><').replace('\n', ''));  
}

/**
* Takes care of a proper indentation and creates a "human-readable" output.
* @param {object} elem a HTML element
* @param {number} k number of tabs
*/
function beautify_html(elem, k) {
  if (elem.hasClass('grid')) {
    convert_to_one_line(elem);
  }

  /*
  * Handles element's children (providing they have their own descendants)
  */
  elem.children().each(function() {
    if ($(this).children().length > 0) {
      beautify_html($(this), k+1);
    }
  });

  if (elem.html() !== '') {
    elem.html(elem.html() + '\n' + tab.repeat(k-1))
        .html(elem.html().replace(/><(?=[A-Za-z])/g, '>\n' + tab.repeat(k) +'<'))
        .html('\n' + tab.repeat(k) + elem.html());

    if (elem.hasClass('grid')) {
      elem.html(elem.html().trim().replace(/^\n|\n$/g, ''));
    }
  }
}

/**
* Gets a basic HTML code of the grid item.
* @param {string} id id of the element
* @returns {string} basic contents of the grid item
*/
function get_item_basic_content(id) {
  return item_template.replace(/{{id}}/g, id);
}


/**
* Creates a template of the document.
* The page consists of three parts: the header, the main container and the footer.
* @param {object} header a header of the website
* @param {object} main_content main website content
* @param {object} footer a footer of the website
* @returns {string} a HTML template of the website 
*/
function create_html_template(header, main_content, footer) {
  css_out = css_out
            .replace(/\n/g, '\n'+tab.repeat(3))
            .replace(/}/g, '}\n')
            .replace(/\n$/, '');

  beautify_html(header, 4);
  beautify_html(main_content, 4);
  beautify_html(footer, 4);

  return  template.replace('{{header}}', header.html())
                  .replace('{{main_content}}', main_content.html())
                  .replace('{{footer}}', footer.html())
                  .replace('{{style}}', css_out+'\n');
}

var page_part_template = '\
<h2></h2> \
<div class="grid"></div> \
<div class="no_content_panel"> \
  <i class="icon_add_item material-icons">add_circle_outline</i> \
  <div class="add_item_msg"> \
    <span>Dodaj element</span> \
  </div> \
</div> \
<div class="control_panel"> \
  <i title="Ustawienia" class="icon_settings material-icons">settings</i><i title="Dodaj element" class="icon_add_item material-icons">add_circle</i> \
</div>';

var page_parts = [{'class_name': 'header', 'displayed_name': 'nagłówek'}, {'class_name': 'main_part', 'displayed_name': 'główna treść'}, {'class_name': 'footer', 'displayed_name': 'stopka'}];

/**
* Inserts parts of the template into the generator.
*/
function insert_parts() {
  for (var k = 2; k >= 0; k--) {
    var obj = $('<div/>').attr('id', 'tmp_'+k).addClass('template').addClass(page_parts[k].class_name);
    obj.html(page_part_template);
    obj.find('h2').text(page_parts[k].displayed_name);
    $('#main_content').prepend(obj);
    add_listeners(obj);
  }
}