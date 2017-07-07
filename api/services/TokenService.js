const Crypto = require('crypto');
const Promise = require('bluebird');
const Moment = require('moment');
const Err = require('err');



function generateTokenString() {
  return new Promise(function(resolve, reject) {
    Crypto.randomBytes(48, function(err, buffer) {
      if(err) return reject(err);
      resolve(buffer.toString('hex'));
    });
  });
}

function createNewPasswordToken(params) {
  return generateTokenString().then(function(token) {
    return Token.create({
      token: token,
      type: 1,
      email: params.email,
      expiration: Moment().add(24, 'hours').toDate(),
      user: params.user
    }).then(function(newToken, err) {
      if(err) throw err;
      return newToken;
    });
  });
}

function createNewAdminToken(params) {
  return generateTokenString().then(function(token) {
    return Token.create({
      token: token,
      type: 0,
      email: params.email,
      expiration: Moment().add(5, 'days').toDate(),
      organization: params.organization
    }).then(function(newToken, err) {
      if(err) throw err;
      return newToken;
    });
  });
}

module.exports = {

  createNewToken: function(params) {
    if(params.user) {
      return createNewPasswordToken(params)
      .then(function(token) {
        return token;
      });
    } else if(params.organization) {
      return createNewAdminToken(params)
      .then(function(token) {
        return token;
      });
    } else {
      throw new Err('User or organization must be included in token creation', 500);
    }
  }

}
