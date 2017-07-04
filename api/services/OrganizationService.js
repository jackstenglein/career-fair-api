const Err = require('err');
const nestedPop = require('nested-pop');

module.exports = {

  newOrganization: function(creatorID, name) {
    return Organization.findOne({
      name: name
    }).then(function(org) {
      if(org) {
        throw new Err('Organization name already exists', 400);
      } else {
        return Organization.create({
          name: name,
          creator: creatorID
        }).then(function(newOrg, err) {
          if(err) throw err;
          return User.update(creatorID, {
            organization: newOrg.id
          }).then(function(updatedRecords, err) {
            if(err) throw err;

            return {'message': 'Organization created', 'organization': newOrg};
          });
        }); // </Organization.create>
      }
    }); // </Organization.findOne>
  }, // </newOrganization()>


  allFairs: function(userID) {
    return User.findOne(userID)
    .populate('organization')
    .then(function(user, err) {
      if(err) throw err;
      if(!user) throw new Err('User not found', 400);

      return nestedPop(user, {
        organization: [
          'fairs'
        ]
      }).then(function(user) {
        return {'message': 'Fairs found', 'fairs': user.organization.fairs};
      });
    });
  },

  getFair: function(userID, fairID) {
    return User.findOne(userID)
    .then(function(user, err) {
      if(err) throw err;
      if(!user) throw new Err('User not found', 400);
      if(user.role !== 0 && user.role !== 1) throw new Err('You must have creator or administrator status', 403);

      return Fair.findOne(fairID)
      .populate('students')
      .populate('employers')
      .populate('interactions')
      .then(function(fair, err) {
        if(err) throw err;
        if(!fair) throw new Err('Fair not found', 400);
        if(fair.organization !== user.organization) throw new Err('You are not a creator or administrator of this fair', 400);

        var finalFair = {
          name: fair.name,
          organization: fair.organization,
          createdAt: fair.createdAt,
          updatedAt: fair.updatedAt,
          dateTime: fair.dateTime,
          id: fair.id,
          numberOfStudents: fair.students.length,
          numberOfEmployers: fair.employers.length,
          numberOfInteractions: fair.interactions.length
        };

        return {'message': 'Fair found', 'fair': finalFair};
      });
    });
  }

}
