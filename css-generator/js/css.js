var basic_css = '@import url("https://fonts.googleapis.com/css?family=Saira+Semi+Condensed"); \n\
html, body { \n\
  padding: 0; \n\
  margin: 0; \n\
} \n\
\n\
* { \n\
  box-sizing: border-box; \n\
} \n\
\n\
#main_container { \n\
  font-family: "Saira Semi Condensed", Verdana, Tahoma, sans-serif;\n\
  max-width: 1024px; \n\
  width: 90%; \n\
  height: 840px; \n\
  position: absolute; \n\
  top: 50%; \n\
  left: 50%; \n\
  transform: translate(-50%, -50%);\n\
} \n\
\n\
#main_container, header, #main_content, footer { \n\
  display: grid; \n\
} \n\
#main_container { \n\
  grid-template: 1fr 1fr 1fr / auto; \n\
}\n\
div.item { \n\
  height: 100%; \n\
  padding: .25rem; \n\
  align-items: center; \n\
  display: grid; \n\
}';

var no_lato = true, no_roboto = true;

function move_css(grid, name) {
  var style = grid.attr('style');
  if (style !== undefined) {
    basic_css += '\n' + name + ' {\n  ' + grid.attr('style') + '\n} ';
    grid.removeAttr('style');
  }
  $('.item', grid).each(function() {
    style = $(this).attr('style');
    style = style.replace(/; /g, ';\n  ');
    basic_css += '\n#' + $(this).attr('id') + ' {\n  ' + style + '\n} ';
    if (style.indexOf('Roboto') >= 0 && no_roboto) {
      basic_css += '\n@import url("https://fonts.googleapis.com/css?family=Roboto");'
    }
    if (style.indexOf('Lato') >= 0 && no_lato) {
      basic_css += '\n@import url("https://fonts.googleapis.com/css?family=Lato");'
    }
    $(this).removeAttr('style');
  });
  return grid;
}