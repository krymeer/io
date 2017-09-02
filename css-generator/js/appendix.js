function get_random_int(min, max) {
  return Math.floor(Math.random() * (max-min+1)) + min;
}

function get_random_color() {
  var r = get_random_int(0, 255),
      g = get_random_int(0, 255),
      b = get_random_int(0, 255),
      rgb = 'rgb('+r+', '+g+', '+b+')';

  return rgb;
}