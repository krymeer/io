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

var item_template = '\
<div class="item" id=item_{{id}}> \n\
  <div class="item_panel">  \n\
    <i class="material-icons" id="item_{{id}}_text">text_fields</i> \n\
    <i class="material-icons" id="item_{{id}}_style">palette</i>\n\
  </div> \n\
  <div class="item_contents"></div> \n\
</div>';

function convert_to_one_line(elem) {
  elem.html(elem.html().replace(/>\s+</g, '><').replace('\n', ''));  
}

function beautify_html(elem, k) {
  if (elem.hasClass('grid')) {
    convert_to_one_line(elem);
  }

  elem.children().each(function() {
    beautify_html($(this), k+1);
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


function get_item_basic_content(id) {
  return item_template.replace(/{{id}}/g, id);
}

function create_html_template(header, main_content, footer) {
  basic_css = basic_css
              .replace(/\n/g, '\n'+tab.repeat(3))
              .replace(/}/g, '}\n')
              .replace(/\n$/, '');

  beautify_html(header, 4);
  beautify_html(main_content, 4);
  beautify_html(footer, 4);

  return  template.replace('{{header}}', header.html())
                  .replace('{{main_content}}', main_content.html())
                  .replace('{{footer}}', footer.html())
                  .replace('{{style}}', basic_css+'\n');
}

/*
  header = header.replace(/\n\s+\n/g, '\n').replace(/\n\s+\n/g, '\n')
                 .replace(/\n/g, '\n'+tab.repeat(4));
  footer = footer.replace(/\n\s+\n/g, '\n')
                 .replace(/\n/g, '\n'+tab.repeat(4));
  main_content = main_content.replace(/\n\s+\n/g, '\n')
                 .replace(/\n/g, '\n'+tab.repeat(4));
*/