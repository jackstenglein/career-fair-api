const Err = require('err');
const nestedPop = require('nested-pop');

module.exports = {



  allInteractions: function(userID, role) {
    var populate1;
    var populate2;
    if(role === '2') {
      populate1 = 'employerInteractions';
      populate2 = {
        employerInteractions: {
          as: 'interaction',
          populate: [
            'fair',
            'student'
          ]
        }
      };
    } else if(role === '3') {
      populate1 = 'studentInteractions';
      populate2 = {
        studentInteractions: {
          as: 'interaction',
          populate: [
            'fair',
            'employer'
          ]
        }
      };
    } else {
      throw new Err('You must have employer or student role', 400);
    }

    return User.findOne({id: userID, role: role})
    .populate(populate1)
    .then(function(user, err) {
      if(err) throw err;
      if(!user) throw new Err('User not found', 400);

      return nestedPop(user, populate2).then(function(user) {
        if(role === '2') {
          return {'message': 'Interactions found', 'interactions': user.employerInteractions};
        } else {
          return {'message': 'Interactions found', 'interactions': user.studentInteractions};
        }
      });
    }); // </User.findOne>
  }, // </allInteractions>


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
