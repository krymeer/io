/**
* Sets urls of the footer for the W3C validators.
*/
function set_w3_urls() {
  var url = window.location.href;
  url = url.replace(/\//g, '%2F');
  url = url.replace(/:/g, '%3A');
  $('#w3_html').attr('href', 'https://validator.w3.org/nu/?doc=' + url);
  $('#w3_css').attr('href', 'https://jigsaw.w3.org/css-validator/validator?uri=' + url + '&profile=css3&usermedium=all&warning=1&vextwarning=&lang=en');
}