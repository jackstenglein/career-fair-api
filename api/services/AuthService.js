const Promise = require('bluebird');
const Passwords = require('machinepack-passwords');
const Err = require('err');
const Moment = require('moment');

module.exports = {

  changePassword: function(userID, currentPassword, newPassword) {
    return User.findOne(userID).then(function(user) {
      if(!user) {
        throw new Err('User not found', 400);
      } else {
        return new Promise(function(resolve, reject) {
          Passwords.checkPassword({
            passwordAttempt: currentPassword,
            encryptedPassword: user.password
          }).exec({
            // if an unexpected error occurred
            error: function(err) {
              reject(new Err(err, 500));
            },

            // password is incorrect
            incorrect: function() {
              reject(new Err('Incorrect password', 400));
            },

            // everything is all right
            success: function() {
              Passwords.encryptPassword({
                password: newPassword
              }).exec({
                error: function(err) {
                  return reject(err);
                },

                success: function(encryptedPassword) {
                  User.update(userID, {
                    password: encryptedPassword
                  }).then(function(updatedUsers, err) {
                    if(err) return reject(err);
                    resolve({
                      'message': 'Password updated',
                      'user': updatedUsers[0]
                    });
                  }); // </User.update>
                } // </success>
              }); // </Passwords.encryptPassword>
            } // </success>
          }); // </Passwords.checkPassword>
        }); // </Promise>
      }
    }); // </User.findOne>
  },

  confirmPasswordReset: function(token, newPassword) {
    return Token.findOne({
      token: token,
      type: 1
    }).then(function(token, err) {
      if(err) throw err;
      if(!token) throw new Err('Token not found', 400);
      if(Moment().isAfter(token.expiration)) throw new Err('This link has expired', 400);
      return new Promise(function(resolve, reject) {
        Passwords.encryptPassword({
          password: newPassword
        }).exec({
          error: function(err) {
            return reject(err);
          },

          success: function(encryptedPassword) {
            User.update(token.user, {
              password: encryptedPassword
            }).then(function(updatedUsers, err) {
              if(err) return reject(err);
              return resolve({
                'message': 'Password updated',
                'user': updatedUsers[0]
              });
            }); // </User.update>
          } // </success>
        }); // </Passwords.encryptPassword>
      }); // </Promise>
    }); // </Token.findOne>
  },


  signup: function(params) {
    return User.findOne({
      email: params.email
    }).then(function(user) {
      if(user) {
        throw new Err('Email already in use', 400);
      } else {
        return new Promise(function(resolve, reject) {
          Passwords.encryptPassword({
            password: params.password
          }).exec({
            // if an error occurred
            error: function(err) {
              reject(new Err(err, 500));
            },

            // everything went OK
            success: function(encryptedPassword) {
              User.create({
                name: params.name,
                email: params.email,
                password: encryptedPassword,
                role: params.role
              }).then(function(newUser, err) {
                if(err) {
                  reject(new Err(err, 500));
                } else {
                  resolve({
                    message: 'User created',
                    user: newUser
                  });
                }
              }); // </User.create>
            } // </success>
          }); // </Passwords.encryptPassword>
        }); // </Promise>
      }
    }); // </User.findOne>
  }, // </AuthService.signup>


  login: function(params) {
    return User.findOne({
      email: params.email
    }).then(function(user) {
      if(!user) {
        throw new Err('Email not found', 400);
      } else {
        return new Promise(function(resolve, reject) {
          Passwords.checkPassword({
            passwordAttempt: params.password,
            encryptedPassword: user.password
          }).exec({
            // if an unexpected error occurred
            error: function(err) {
              reject(new Err(err, 500));
            },

            // password is incorrect
            incorrect: function() {
              reject(new Err('Incorrect password', 400));
            },

            // everything is all right
            success: function() {
              resolve({
                message: 'Logged in',
                user: user
              });
            }
          }); // </Passwords.checkPassword>
        }); // </Promise>
      }
    }); // </User.findOne>
  },


  requestPasswordReset: function(email) {
    return User.findOne({
      email: email
    }).then(function(user, err) {
      if(err) throw err;
      if(!user) throw new Err('Email not found', 400);
      return TokenService.createNewToken({
        'email': email,
        'user': user.id
      }).then(function(newToken) {

        return MailService.send(
          email,
          'Password Reset Requested',
          'passwordReset',
          {
            emailAddress: email,
            userName: user.name,
            resetPasswordLink: 'http://localhost:1337/user/confirm-password-reset?token=' + newToken.token
          }
        ).then(function(response) {
          return {'message': 'Email sent successfully'};
        });
      });
    });
  }
}
