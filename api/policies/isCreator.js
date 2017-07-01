/**
 * isCreator
 *
 * @module      :: Policy
 * @description :: Simple policy to allow authenticated users with creator role`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

  //console.log('req.session: %j', req.session);

  if (req.session.authenticated) {
    return User.findOne({
      id: req.session.user,
      role: 0
    }).then(function(user, err) {
      if(err) {
        return HelperService.handleError(err, res);
      }

      if(!user) {
        return res.status(403).json({'error': 'You do not have creator access'});
      }

      return next();
    });
  }

  return res.status(403).json({'error': 'You are not logged in'});
};
