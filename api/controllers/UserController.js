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
    // get the file and determine whether we should upload to S3
    var fileUpload = req.file('resume');
    var filename = fileUpload._files[0].stream.filename;
    if(filename.substring(filename.length - 4) !== '.pdf') {
      throw new Err('The resume must be a PDF', 400);
    }

    try {
      // begin the upload
      fileUpload.upload({
	  		// Required to upload to S3
	  		adapter: require('skipper-s3'),
	  		key: process.env.AWS_KEY,
	  		secret: process.env.AWS_SECRET,
	  		bucket: 'career-fair-resumes',
        // Changes the name of the file
        saveAs: req.session.user + '-resume.pdf'
			}, function whenDone(err, uploadedFiles) {
	  		if (err) {
	    		return HelperService.handleError(err, res);
	  		}

        // update the user's resume url in database
        return User.update(req.session.user, {
          resumeUrl: uploadedFiles[0].extra.Location
        }).then(function(updatedRecords, err) {
          if(err) return HelperService.handleError(err, res);

          return res.json({
  					message: 'Resume uploaded',
            url: updatedRecords[0].resumeUrl
  				});
        }); // </User.update>
			}); // </fileUpload.upload>
		} catch(err) {
			return HelperService.handleError(err, res);
		}
	} // </uploadResume>
};
