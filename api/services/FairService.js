const Err = require('err');




function isValidDateTimeFormat(dateTime) {
  if(dateTime.length !== 20) {
    return false;
  }

  for(var i = 0; i < dateTime.length; i++) {
    var c = dateTime.charAt(i);
    var j = (i+1) % 3;
    if( (j !== 0) && (c < '0' || c > '9')) {
      return false;
    } else if (j === 0 && c !== '/') {
      return false;
    }
  }

  return true;
}

module.exports = {

  newFair: function(creatorID, params) {
    return User.findOne(creatorID).populate('organization')
    .then(function(user, err) {
      if(err) throw err;
      if(!user) throw new Err('User not found', 400);
      params.organization = user.organization.id;
      return Fair.create(params).then(function(fair, err) {
        if(err) throw err;
        return {
          'message': 'Fair created',
          'fair': fair
        };
      }); // </Fair.create>
    }); // </User.findOne>
  },

  updateDateTime: function(userID, fairID, dateTime) {

    // first check the format of the date/time
    if(!isValidDateTimeFormat(dateTime)) {
      throw new Err('Invalid date/time format', 400);
    }

    return User.findOne(userID).then(function(user) {
      if(!user) throw new Err('User not found');

      return Fair.findOne(fairID).then(function(fair) {
        if(!fair) throw new Err('Fair not found', 400);

        if(fair.organization !== user.organization) {
          throw new Err('You are not authorized for this action', 403);
        }

        return new Promise(function(resolve, reject) {
          fair.dateTime = dateTime;
          fair.save(function(err) {
            if(err) reject(err);
            resolve({
              'message': 'Fair updated',
              'fair': fair
            });
          }); // </fair.save>
        }); // </Promise>
      }); // </Fair.findOne>
    }); // </User.findOne>
  }
}
