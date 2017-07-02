const Err = require('err');

module.exports = {


  registerFair: function(userID, fairID) {

    return User.findOne(userID).then(function(user, err) {
      if(err) throw err;
      if(!user) throw new Err('User not found', 400);

      if(user.role === 2) {
        user.employerFairs.add(fairID);
      } else if(user.role === 3) {
        user.studentFairs.add(fairID);
      } else {
        throw new Err('You must be an employer or student to register', 400);
      }

      return new Promise(function(resolve, reject) {
        user.save({populate: false}, function(err) {
          if(err) reject(err);

          resolve({
            'message': 'User added to fair',
            'user': user
          });
        }); // </user.save>
      }); // </Promise>
    }); // </User.findOne>
  }


}
