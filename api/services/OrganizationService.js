const Err = require('err');
const nestedPop = require('nested-pop');
const Crypto = require('crypto');
const Promise = require('bluebird');
const Moment = require('moment');


function generateTokenString() {
  return new Promise(function(resolve, reject) {
    Crypto.randomBytes(48, function(err, buffer) {
      if(err) return reject(err);
      resolve(buffer.toString('hex'));
    });
  });
}



module.exports = {


  addAdministrator: function(userID, email) {
    return User.findOne(userID)
    .populate('organization')
    .then(function(user, err) {
      if(err) throw err;
      if(!user) throw new Err('User not found', 400);
      if(user.role !== 0 && user.role !== 1) throw new Err('You must have creator or administrator status', 400);

      return generateTokenString().then(function(token) {
        return Token.create({
          token: token,
          type: 0,
          email: email,
          expiration: Moment().add(5, 'days').toDate(),
          organization: user.organization.id
        }).then(function(newToken, err) {
          if(err) throw err;

          return MailService.send(
            email,
            'Join ' + user.organization.name + ' as an administrator',
            'adminInvitation',
            {
              senderName: user.name,
              organizationName: user.organization.name,
              invitationLink: 'http://localhost:1337/organization/join?token=' + token
            }
          ).then(function(response) {
            return {'message': 'Email sent successfully'};
          });
        });
      })

    });
  },


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

  deleteAdminInvitation: function(userID, invitationID) {
    return User.findOne(userID)
    .then(function(user, err) {
      if(err) throw err;
      if(!user) throw new Err('User not found', 400);
      if(user.role !== 0 && user.role !== 1) throw new Err('You must have creator or administrator status', 403);

      return Token.findOne(invitationID)
      .then(function(token, err) {
        if(err) throw err;
        if(!token) throw new Err('Invitation not found', 400);
        if(token.organization !== user.organization) throw new Err('You are not associated with this organization', 403);

        return Token.destroy(invitationID)
        .then(function(deletedRecords, err) {
          if(err) throw err;
          return {
            'message': 'Invitation deleted',
            'invitation': deletedRecords[0]
          };
        });
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
  },

  getAdminInvitations: function(userID) {
    return User.findOne(userID)
    .populate('organization')
    .then(function(user, err) {
      if(err) throw err;
      if(!user) throw new Err('User not found', 400);
      if(user.role !== 0 && user.role !== 1) throw new Err('You must have creator or administrator status', 403);

      return nestedPop(user, {
        organization: [
          'invitationTokens'
        ]
      }).then(function(user) {
        return {'message': 'Invitations found', 'invitations': user.organization.invitationTokens};
      });
    })
  }

}
