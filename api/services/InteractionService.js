const Err = require('err');
const nestedPop = require('nested-pop');

module.exports = {

  newInteraction: function(student, employer, fair) {
    // first check that the employerID user is actually an employer
    return User.findOne(employer).then(function(user) {
      if(user.role !== 2) throw new Err('Specified employer does not have employer role', 400);

      return Interaction.create({
        'student': student,
        'employer': employer,
        'fair': fair
      }).then(function(interaction, err) {
        if(err) throw err;
        return {
          'message': 'Interaction created',
          'interaction': interaction
        }
      });
    });
  }
}
