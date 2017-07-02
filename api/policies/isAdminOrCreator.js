/**
 * isAdminOrCreator
 *
 * @module      :: Policy
 * @description :: Allows users with administrator or creator role`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

  //console.log('req.session: %j', req.session);

  if(req.session.authenticated) {
    return User.findOne({
      id: req.session.user,
    }).then(function(user, err) {
      if(err) {
        return HelperService.handleError(err, res);
      }

      if(!user) {
        return res.status(403).json({'error': 'No user found'});
      }

      if(user.role !== 0 && user.role !== 1) {
        return res.status(403).json({'error': 'You do not have permission to access this function'});
      }

      return next();
    });
  }

  return res.status(403).json({'error': 'You are not logged in'});
};
