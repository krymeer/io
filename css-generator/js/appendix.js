// Getting an integer that is not less than the minimum and not greater than
// the maximum (at the same time!).
function get_random_int(min, max) {
  return Math.floor(Math.random() * (max-min+1)) + min;
}

// Getting a random color.
// Three integers, each of them between 0 and 255, are chosen
// in order to give a value of a new color.
function get_random_color() {
  var r = get_random_int(0, 255),
      g = get_random_int(0, 255),
      b = get_random_int(0, 255),
      rgb = 'rgb('+r+', '+g+', '+b+')';

  return rgb;
}

// Escaping harmful HTML characters - their selection based on:
// https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.231_-_HTML_Escape_Before_Inserting_Untrusted_Data_into_HTML_Element_Content
// http://wonko.com/post/html-escaping
// The interesting fact is that the jQuery escapes '&', '>' and '<' itself.
function escape_characters(str)).
  return str.replace(/{{"}}/g, '&quot;')
            .replace(/{{'}}/g, '&#x27;')
            .replace(/{{\/}}/g, '&#x2F;');
            //.replace(/</g, '&lt;')
            //.replace(/>/g, '&gt;')
            //.replace(/&/g, '&amp;')
}

