/**
* Inserts HTML tags.<br>
* If any text is highlighted by the user, it is wrapped with a chosen tag. Otherwise the tag is appended to the rest of the contents of the text area.
* @param {string} t a chosen tag
*/
function insert_html_tag(t) {
  if ($('#item_text_popup').css('display') !== 'none') {
    var textarea = document.getElementById('item_contents'),
        tag_start = '['+t+']',
        tag_end = '[/'+t+']',
        contents = textarea.value,
        list_tag = false;

    if (t === 'ul' || t === 'ol') {
      list_tag = true;
    }

    if (t === 'a') {
      tag_start = '[a href="';
      tag_end = '"][/a]';
    }

    if (!list_tag && textarea.selectionStart !== undefined) {
      var start_pos = textarea.selectionStart,
          end_pos = textarea.selectionEnd,
          selected_text = contents.substring(start_pos, end_pos),
          text_before = contents.substring(0, start_pos),
          text_after = contents.substring(end_pos, contents.length);

      contents = text_before + tag_start + selected_text + tag_end + text_after;
    } else {
      if (list_tag) {
        var li = '\n  [li][/li]\n';
        contents += tag_start + li + tag_end;
      } else {
        contents += tag_start + tag_end;    
      }
    } 
    $('#item_contents').val(contents);
  }
}

/*
* HTML tags that are allowed inside the grid items.
* Below there are regular expressions for allowed and forbidden tags
* Regex for urls taken from:
* https://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript#answer-8943487
*/
var url_regex = '|a href=(\\\'|\\\")(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|](\\\'|\\\")',
    style_regex = '([ ]+style=(\\\"|\\\')[ a-zA-Z0-9.,;:()-]*(\\\"|\\\'))?',
    tags_allowed = ['b', 'i', 'u', 's', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'ul', 'ol', 'li', 'a', 'button', 'p', 'span'],
    end_tags = tags_allowed.join('|'),
    start_tags = end_tags.replace('|a', url_regex);

var regexp_text_start = new RegExp('\\[('+ start_tags +')'+ style_regex +'\\]', 'ig'),
    regexp_html_start = new RegExp('<(' + start_tags + ')'+ style_regex +'>', 'ig'),
    regexp_text_end = new RegExp('\\[\/(' + end_tags + ')\\]', 'ig'),
    regexp_html_end = new RegExp('<\/(' + end_tags + ')>', 'ig');

/**
* Converts the allowed HTML tags into their counterparts.
* @param {string} match an allowed tag
* @param {string} offset a name of a tag
* @param {number} k a starting index
* @returns {string} a converted tag
*/
function convert_tag(match, offset, k) {
  if (match.indexOf('[') !== -1) {
    return '<' + match.substring(1, match.length-1) + '>';
  }
  return '[' + match.substring(1, match.length-1) + ']';
}

/** 
* Escapes any not allowed HTML tags.
* @param {string} match a not allowed tag
* @param {string} offset a name of a tag
* @param {number} k a starting index
* @returns {string} an escaped tag
*/
function escape_tag(match, offset, k) {
  return '&lt;' + match.substring(1, match.length-1) + '&gt;';
}