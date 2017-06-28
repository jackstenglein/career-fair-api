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
  } // </AuthService.signup>


}
