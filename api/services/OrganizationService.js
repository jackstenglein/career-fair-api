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
  }

}
