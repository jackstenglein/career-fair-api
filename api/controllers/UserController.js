/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var checkParams = require('check-params');
var Err = require('err');

module.exports = {

  allFairs: function(req, res) {
    return checkParams(req, {
      queryParams: [
        'role'
      ]
    }).then(function() {
      return UserService.allFairs(req.session.user, req.query.role)
      .then(function(response) {
        return res.json(response);
      });
    }).catch(function(err) {
      return HelperService.handleError(err, res);
    });
  },

  allInteractions: function(req, res) {
    return checkParams(req, {
      queryParams: [
        'role'
      ]
    }).then(function() {
      return UserService.allInteractions(req.session.user, req.query.role)
      .then(function(response) {
        return res.json(response);
      });
    }).catch(function(err) {
      return HelperService.handleError(err, res);
    })
  },

  changePassword: function(req, res) {
    return checkParams(req, {
      bodyParams: [
        'currentPassword',
        'newPassword'
      ]
    }).then(function() {
      return AuthService.changePassword(req.session.user, req.body.currentPassword, req.body.newPassword)
      .then(function(response) {
        return res.json(response);
      });
    }).catch(function(err) {
      return HelperService.handleError(err, res);
    });
  },

  confirmPasswordReset: function(req, res) {
    return checkParams(req, {
      bodyParams: [
        'token',
        'newPassword'
      ]
    }).then(function(response) {
      return AuthService.confirmPasswordReset(req.body.token, req.body.newPassword)
      .then(function(response) {
        return res.json(response);
      });
    }).catch(function(err) {
      return HelperService.handleError(err, res);
    });
  },

  interactionsForFair: function(req, res) {
    return checkParams(req, {
      queryParams: [
        'role',
        'fair'
      ]
    }).then(function() {
      return UserService.interactionsForFair(req.session.user, req.query.role, req.query.fair)
      .then(function(response) {
        return res.json(response);
      });
    }).catch(function(err) {
      return HelperService.handleError(err, res);
    });
  },



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
    req.session.authenticated = false;
    req.session.user = null;
    return res.json({
      message: 'Logged out'
    });
  },


  updateInfo: function(req, res) {
    var update = {};
    var needsUpdate = false;

    if(req.body.phone) {
      update.phone = req.body.phone;
      needsUpdate = true;
    }

    if(req.body.website) {
      update.website = req.body.website;
      needsUpdate = true;
    }

    if(!needsUpdate) {
      return HelperService.handleError(new Err('You are missing required parameters.', 400), res);
    }

    return User.update(req.session.user, update).then(function(updatedRecords, err) {
      if(err) return HelperService.handleError(err, res);
      return res.json({
        message: 'User updated',
        user: updatedRecords[0]
      });
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
	}, // </uploadResume>

  registerFair: function(req, res) {
    checkParams(req, {
      bodyParams: [
        'fair'
      ]
    }).then(function() {
      return UserService.registerFair(req.session.user, req.body.fair)
      .then(function(response) {
        res.json(response);
      });
    }).catch(function(err) {
      return HelperService.handleError(err, res);
    });
  },

  requestPasswordReset: function(req, res) {
    checkParams(req, {
      bodyParams: [
        'email'
      ]
    }).then(function() {
      return AuthService.requestPasswordReset(req.body.email)
      .then(function(response) {
        return res.json(response);
      });
    }).catch(function(err) {
      return HelperService.handleError(err, res);
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
