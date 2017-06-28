/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var checkParams = require('check-params');
var Err = require('err');

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
		try {
			var fileUpload = req.file('resume');

      var filename = fileUpload._files[0].stream.filename;
      console.log('Filename: %j', filename);

      //console.log('File Upload: %j', fileUpload);
      if(filename.indexOf('.pdf') !== filename.length - 4) {
        throw new Err('The resume must be a PDF', 400);
      }

      fileUpload.upload({
	  		// Required to upload to S3
	  		adapter: require('skipper-s3'),
	  		key: process.env.AWS_KEY,
	  		secret: process.env.AWS_SECRET,
	  		bucket: 'career-fair-resumes',
			}, function whenDone(err, uploadedFiles) {
	  		if (err) {
	    		return HelperService.handleError(err, res);
	  		}

	  		return res.json({
					message: 'Resume uploaded',
          file: uploadedFiles[0]
				});
			});
		} catch(err) {
			return HelperService.handleError(err, res);
		}
	}
};
