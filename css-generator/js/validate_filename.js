/**
* Validates a pressed key; the valid ones are: uppercase and lowercase letters, numbers and underscores.
* @param {object} e the pressed key
* @returns {boolean} if the pressed key is valid
*/
function validate_filename(e) {
  return ((e.charCode === 95) 
    || (e.charCode >= 48 && e.charCode <= 57)
    || (e.charCode >= 65 && e.charCode <= 90)
    || (e.charCode >= 97 && e.charCode <= 122));
}

/**
* Checks if a pressed key is a number.
* @param {object} e the pressed key
* @returns {boolean} if the pressed key is a number
*/
function check_if_digit(e) {
  return (e.charCode >= 48 && e.charCode <= 57);
}