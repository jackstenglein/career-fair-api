/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var checkParams = require('check-params');

module.exports = {



  /**
   * `UserController.login()`
   */
  login: function (req, res) {
		checkParams(req, {
			bodyParams: [
				'email',
				'password'
			]
		}).then(function() {
			return AuthService.login(req.body).then(function(response) {
				return res.json(response);
			});
		}).catch(function(err) {
			return HelperService.handleError(err, res);
		});
  },


  /**
   * `UserController.logout()`
   */
  logout: function (req, res) {
    return res.json({
      todo: 'logout() is not implemented yet!'
    });
  },


  /**
   * `UserController.signup()`
   */
  signup: function (req, res) {
		checkParams(req, {
			bodyParams: [
				'name',
				'email',
				'password',
				'role'
			]
		}).then(function() {
			return AuthService.signup(req.body).then(function(response) {
				return res.json(response);
			});
		}).catch(function(err) {
			return HelperService.handleError(err, res);
		});
  }
};
