module.exports = {
  handleError: function(err, res) {
    console.log('Handle error: %j', err);
    if(err.code && err.code !== 0) {
      if(Number(err.code[0]) === 5) {
        // this is a server error
        sails.log.error(err);
        // send an email notification so I know to fix it
        MailService.sendErrorEmail(err);
      }

      res.status(Number(err.code)).json({'error': err.message});
    } else {
      // this is an unknown error, so log it
      sails.log.error(err);
      res.status(500).json({'error': err.message});
    }
  }
}
