// Very basic styling of the generated document
var basic_css_org = '\n\
@import url("https://fonts.googleapis.com/css?family=Saira+Semi+Condensed");\n\
\n\
html, body { \n\
  padding: 0; \n\
  margin: 0; \n\
} \n\
\
* { \n\
  box-sizing: border-box; \n\
} \n\
\
#main_container { \n\
  font-family: "Saira Semi Condensed", Verdana, Tahoma, sans-serif;\n\
  max-width: 1024px; \n\
  width: 90%; \n\
  height: 840px; \n\
  margin: 10px auto; \n\
  grid-template: 1fr 1fr 1fr / auto; \n\
} \n\
\
#main_container, header, #main_content, footer { \n\
  display: grid; \n\
} \n\
\
div.item { \n\
  height: 100%; \n\
  padding: .25rem; \n\
  align-items: center; \n\
  display: grid; \n\
}';

// Flags indicating if any custom fonts are used
var no_lato = true, no_roboto = true, tab = '  ', basic_css = '';

// Converting the inlined styling into one section between <head> and </head> tags
function move_css(grid, name) {
  var style = grid.attr('style');
  if (style !== '' && style !== undefined) {
    basic_css += '\n' + name + ' {\n' + tab + style + '\n}';
    grid.removeAttr('style');
  }
  $('.item, .item_contents', grid).each(function() {
    style = $(this).attr('style');
    if (style === undefined) {
      return;
    }
    style = style.replace(/; /g, ';\n  ');
    
    var selector;
    if ($(this).hasClass('item')) {
      selector = $(this).attr('id');
    } else {
      selector = $(this).parent().attr('id') + ' .item_contents';
    }

    basic_css += '\n#' + selector + ' {\n' + tab + style + '\n}';
    if (style.indexOf('Roboto') >= 0 && no_roboto) {
      basic_css = '\n@import url("https://fonts.googleapis.com/css?family=Roboto");' + basic_css;
    }
    if (style.indexOf('Lato') >= 0 && no_lato) {
      basic_css = '\n@import url("https://fonts.googleapis.com/css?family=Lato");' + basic_css;
    }
    $(this).removeAttr('style');
  });
  return grid;
}