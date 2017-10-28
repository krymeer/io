/*
* Very basic styling of the generated document
*/
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
  max-width: 960px; \n\
  width: 90%; \n\
  height: 100vh; \n\
  margin: 0 auto; \n\
  grid-template: 1fr 3fr 1fr / auto; \n\
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


/*
*  Basic styling of the blockquote
*/
var blockquote_css = '\n\
div.item blockquote { \n\
  margin: 0; \n\
  background: rgba(0, 0, 0, .25); \n\
  display: inline-block; \n\
  padding: .25rem .5rem; \n\
} \n\
\
div.item blockquote::before { \n\
  content: "„"; \n\
} \n\
\
div.item blockquote::after { \n\
  content: "”"; \n\
}';

var a_css = '\n\
div.item a { \n\
  text-decoration: none; \n\
  color: inherit; \n\
}\n\
\
div.item a:hover { \n\
  text-decoration: underline; \n\
}';

var button_css = '\n\
div.item button { \n\
  background: rgba(0, 0, 0, .5); \n\
  color: #fff; \n\
  font-family: inherit; \n\
  border: none; \n\
  border-radius: 4px; \n\
  outline: none; \n\
  cursor: pointer; \n\
}';

/*
* Flags indicating if any custom fonts are used
*/
var no_lato = true, no_roboto = true, tab = '  ', basic_css = '';

/**
* Converts the inlined styling into one section between <head> and </head> tags.
* @param {object} grid a grid object
* @param {string} name name of a section of the page
* @returns {object} a grid object without CSS inlined rules
*/
function move_css(grid, name) {
  var grid_style = grid.attr('style'), id = grid.attr('id');
  if (grid_style !== '' && grid_style !== undefined) {
    basic_css += '\n' + name + ' {\n' + tab + grid_style + '\n}';
    grid.removeAttr('style');
  }
  $('.item, .item_contents, .item_contents *', grid).each(function() {
    var style = $(this).attr('style');
    if (style === undefined) {
      return;
    }
    style = style.replace(/; /g, ';\n  ');
    
    if ($(this).html().indexOf('<blockquote') > 0 && basic_css.indexOf('div.item blockquote') === -1) {
      basic_css += blockquote_css;
    }

    if ($(this).html().indexOf('<a') > 0 && basic_css.indexOf('div.item a') === -1) {
      basic_css += a_css;
    }

    if ($(this).html().indexOf('<button') > 0 && basic_css.indexOf('div.item button') === -1) {
      basic_css += button_css;
    }

    var selector;
    if ($(this).hasClass('item')) {
      selector = $(this).attr('id');
    } else if ($(this).parent().hasClass('item_contents')) {
      var tag_name = $(this).prop('nodeName').toLowerCase(),
          id = $(this).attr('id');
      selector = $(this).parent().parent().attr('id') + ' ' + tag_name;
      if (id !== undefined && id !== selector) {
        selector += '#' + id;
      } else {
        var this_type = $(this).parent().find(tag_name);
        if (this_type.length > 1) {
          selector += ':nth-of-type('+ (this_type.index($(this))+1) +')';
        }
      }
    } else {
      selector = $(this).parent().attr('id') + ' .item_contents';
    }

    var s = '\n#' + selector + ' {\n' + tab + style + '\n}';
    if (basic_css.indexOf(s) === -1) {
      basic_css += s;
    }
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