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
}

/**
* Checks if a pressed key is a number.
* @param {object} e the pressed key
* @returns {boolean} if the pressed key is a number
*/
function check_if_digit(e) {
  return (e.charCode >= 48 && e.charCode <= 57);
}

/*
* Exemplary contents of a grid item: headings, paragraphs, links and buttons
*/
var samples = '\
<h1>Tytuł</h1> \n\
<h2>Podtytuł</h2> \n\
<blockquote>Fusce tempus at ex et finibus. Nullam at augue congue, vulputate risus et, varius ex.</blockquote>\n\
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sit amet gravida purus. Nulla rhoncus a nunc sed varius. Nullam nibh tortor, pharetra eu hendrerit et, scelerisque sed sem. Fusce volutpat in metus et elementum. Sed sed scelerisque enim.</p> \n\
<button>Przycisk 1</button> <button>Przycisk 2</button> <button>Przycisk 3</button> \n\
<p><a href="http://example.com/">Link 1</a> <a href="http://example.com/">Link 2</a></p>';

/**
* Inserts exemplary tags into the main container of the HTML template.
*/
function insert_samples() {
  var item_contents = $('.main_part .item:first-of-type .item_contents');
  if (item_contents.html() !== undefined) {
    item_contents.html(samples);
    item_contents.parent().addClass('with_samples');
    $('#samples').removeClass('visible');
    $('#choose_colors').addClass('visible');    
  }
}

/**
* Sets a tiny color palette chosen by the user.
*/
function choose_scheme() {
  $('#list_of_schemes .scheme').click(function() {
    $('#list_of_schemes .scheme.chosen').removeClass('chosen');
    $(this).addClass('chosen');
  });
  $('#list_of_schemes .btn_save').click(function() {
    var chosen = $('#list_of_schemes .scheme.chosen');
    if (chosen.html() !== undefined) {
      var col_1 = $('div:nth-of-type(1)', chosen).css('background-color'),
          col_2 = $('div:nth-of-type(2)', chosen).css('background-color'),
          col_3 = $('div:nth-of-type(3)', chosen).css('background-color'),
          col_4 = $('div:nth-of-type(4)', chosen).css('background-color'),
          col_5 = $('div:nth-of-type(5)', chosen).css('background-color');

      $('.item.with_samples').css({
        'background': col_2,
        'color': col_1
      });
      $('.item.with_samples .item_contents blockquote').css({
        'background': col_3,
        'color': col_1
      });
      $('.item.with_samples .item_contents button:nth-of-type(1)').css({
        'background': col_1,
        'color': col_2
      })
      $('.item.with_samples .item_contents button:nth-of-type(2)').css({
        'background': col_4,
        'color': col_1
      })
      $('.item.with_samples .item_contents button:nth-of-type(3)').css({
        'background': col_5,
        'color': col_2
      })
    }
    close_popup('#list_of_schemes');
    $(this).off('click');
  });
}