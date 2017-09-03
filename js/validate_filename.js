function validate_filename(e) {
  return ((e.charCode === 95) 
    || (e.charCode >= 48 && e.charCode <= 57)
    || (e.charCode >= 65 && e.charCode <= 90)
    || (e.charCode >= 97 && e.charCode <= 122));
}

function check_if_digit(e) {
  return (e.charCode >= 48 && e.charCode <= 57);
}