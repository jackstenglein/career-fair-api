module.exports = function confirmPasswordReset(token) {
  var res = this.res;
  res.status(200);

  return res.view('confirmPasswordReset', {token: token, title: 'Title'}, function(err, html) {
    if (err) {
      console.log('Error: %j', err);
      //
      // Additionally:
      // • If the view was missing, ignore the error but provide a verbose log.
      if (err.code === 'E_VIEW_FAILED') {
        sails.log.verbose('res.confirmPasswordReset() :: Could not locate view for confirm password reset page (sending JSON instead).  Details: ', err);
      }
      // Otherwise, if this was a more serious error, log to the console with the details.
      else {
        sails.log.warn('res.confirmPasswordReset() :: When attempting to render confirm password reset view, an error occured (sending JSON instead).  Details: ', err);
      }
      return res.jsonx(swap);
    }

    return res.send(html);
  })
}
