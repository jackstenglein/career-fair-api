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
				req.session.authenticated = true;
				req.session.user = response.user.id;
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
  },

	uploadResume: function(req, res) {
		/*req.file('resume').upload({ dirname: 'assets/images'}, function(err, uploadedFiles) {
			console.log('Err: %j', err);
			console.log('UploadedFiles: %j', uploadedFiles);


			if(err) return HelperService.handleError(err, res);

			return res.json({
				message: uploadedFiles.length + ' file(s) uploaded successfully!',
				files: uploadedFiles
			});
		});*/
		try {
			req.file('resume').upload({
	  		// Required
	  		adapter: require('skipper-s3'),
	  		key: process.env.AWS_KEY,
	  		secret: process.env.AWS_SECRET,
	  		bucket: 'career-fair-resumes',
			}, function whenDone(err, uploadedFiles) {
	  		if (err) {
	    		return HelperService.handleError(err, res);
	  		}

	  		return res.json({
					message: uploadedFiles.length + ' file(s) uploaded successfully!',
	    		files: uploadedFiles
				});
			});
		} catch(err) {
			return HelperService.handleError(err, res);
		}
	}
};
