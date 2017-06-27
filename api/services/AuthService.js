var Promise = require('bluebird');
var Passwords = require('machinepack-passwords');

module.exports = {

  signup: function(params) {
    return User.findOne({
      email: params.email
    }).then(function(user) {
      if(user) {
        throw new Err('Email already in use', 400);
      } else {
        return Passwords.encryptPassword({
          password: params.password
        }).exec({
          // if an error occurred
          error: function(err) {
            throw new Err(err, 500);
          },

          // everything went OK
          success: function(encryptedPassword) {
            return User.create({
              name: params.name,
              email: params.email,
              password: encryptedPassword,
              role: params.role
            }).then(function(err, newUser) {
              if(err) {
                throw new Err(err, 500);
              } else {
                return {
                  message: 'User created',
                  user: newUser
                };
              }

            }); // </User.create>
          } // </success>
        }); // </Passwords.encryptPassword>
      }
    }); // </User.findOne>
  }, // </AuthService.signup>


}
