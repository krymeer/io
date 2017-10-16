/**
* Creates a new file.
* @param {string} data file contents
* @param {string} filename
*/
function create_file(data, filename) {
  var encoded_uri = encodeURI(data),
      link = document.createElement('a');

  link.setAttribute('download', filename);
  link.setAttribute('href', 'data: text/html; charset=utf-8,' + encoded_uri);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}