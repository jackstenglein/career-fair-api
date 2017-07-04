const Err = require('err');
const nestedPop = require('nested-pop');

function generateNestedPopAll(role) {
  if(role === '2') {
    return {
      populate1: 'employerInteractions',
      populate2: {
        employerInteractions: {
          as: 'interaction',
          populate: [
            'student',
            'fair'
          ]
        }
      }
    };
  } else if(role === '3') {
    return {
      populate1: 'studentInteractions',
      populate2: {
        studentInteractions: {
          as: 'interaction',
          populate: [
            'employer',
            'fair'
          ]
        }
      }
    };
  } else {
    throw new Err('You must have employer or student role', 400);
  }
}


function generateNestedPopFair(role, fairID) {
  if(role === '2') {
    return {
      populate1: 'employerInteractions',
      populate2: {
        employerInteractions: {
          as: 'interaction',
          populate: [
            'student'
          ],
          where: {
            fair: fairID
          }
        }
      }
    };
  } else if(role === '3') {
    return {
      populate1: 'studentInteractions',
      populate2: {
        studentInteractions: {
          as: 'interaction',
          populate: [
            'employer'
          ],
          where: {
            fair: fairID
          }
        }
      }
    };
  } else {
    throw new Err('You must have employer or student role', 400);
  }
}

module.exports = {

  allFairs: function(userID, role) {
    var populate;
    if(role === '2') {
      populate = 'employerFairs';
    } else if (role === '3') {
      populate = 'studentFairs';
    } else {
      throw new Err('You must have employer or student role', 400);
    }

    return User.findOne({id: userID, role: role})
    .populate(populate)
    .then(function(user, err) {
      if(err) throw err;
      if(!user) throw new Err('User not found', 400);
      if(user.role === 2) {
        return {'message': 'Fairs found', 'fairs': user.employerFairs};
      } else {
        return {'message': 'Fairs found', 'fairs': user.studentFairs};
      }
    });
  },


  allInteractions: function(userID, role) {
    var populate = generateNestedPopAll(role);

    return User.findOne({id: userID, role: role})
    .populate(populate.populate1)
    .then(function(user, err) {
      if(err) throw err;
      if(!user) throw new Err('User not found', 400);

      return nestedPop(user, populate.populate2).then(function(user) {
        if(role === '2') {
          return {'message': 'Interactions found', 'interactions': user.employerInteractions};
        } else {
          return {'message': 'Interactions found', 'interactions': user.studentInteractions};
        }
      });
    }); // </User.findOne>
  }, // </allInteractions>


  interactionsForFair: function(userID, role, fairID) {
    var populate = generateNestedPopFair(role, fairID);

    return User.findOne({id: userID, role: role})
    .populate(populate.populate1)
    .then(function(user, err) {
      if(err) throw err;
      if(!user) throw new Err('User not found', 400);

      return nestedPop(user, populate.populate2).then(function(user) {
        if(role === '2') {
          return {'message': 'Interactions found', 'interactions': user.employerInteractions};
        } else {
          return {'message': 'Interactions found', 'interactions': user.studentInteractions};
        }
      });
    }); // </User.findOne>
  },


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
