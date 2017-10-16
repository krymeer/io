/**
* Returns a random number from the [min, max] range.
* @param {number} min the minimum
* @param {number} max the maximum
* @returns {number} an integer that is not less than the minimum and not greater than the minimum
*/
function get_random_int(min, max) {
  return Math.floor(Math.random() * (max-min+1)) + min;
}

/**
* Gets a random color.
* @returns {string} an RGB color value
*/
function get_random_color() {
  var r = get_random_int(0, 255),
      g = get_random_int(0, 255),
      b = get_random_int(0, 255),
      rgb = 'rgb('+r+', '+g+', '+b+')';

  return rgb;
}

/**
* Escapes harmful HTML characters.
* Their selection based on: <br>
* https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.231_-_HTML_Escape_Before_Inserting_Untrusted_Data_into_HTML_Element_Content <br>
* http://wonko.com/post/html-escaping
* @param {string} str input string
* @returns {string} input string with escaped HTML characters
*/
function escape_characters(str) {
  return str.replace(/{{"}}/g, '&quot;')
            .replace(/{{'}}/g, '&#x27;')
            .replace(/{{\/}}/g, '&#x2F;');
            //.replace(/</g, '&lt;')
            //.replace(/>/g, '&gt;')
            //.replace(/&/g, '&amp;')
}