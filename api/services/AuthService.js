var Promise = require('bluebird');
var Passwords = require('machinepack-passwords');
var Err = require('err');

module.exports = {

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
  }
}
