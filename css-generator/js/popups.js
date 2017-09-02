function close_popup(popup_id) {
  $(popup_id + ', #mask').fadeOut('fast');
}

function show_popup(popup_id) {
  $(popup_id + ', #mask').fadeIn('fast');
}