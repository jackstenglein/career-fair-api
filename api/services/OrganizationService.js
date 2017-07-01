const Err = require('err');

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
  } // </newOrganization()>


}
