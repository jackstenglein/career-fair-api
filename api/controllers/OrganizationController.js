/**
 * OrganizationController
 *
 * @description :: Server-side logic for managing organizations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const checkParams = require('check-params');

module.exports = {

  newOrganization(req, res) {
    return checkParams(req, {
      bodyParams: [
        'name'
      ]
    }).then(function() {
      return OrganizationService.newOrganization(req.session.user, req.body.name)
      .then(function(response) {
        return res.json(response);
      });
    }).catch(function(err) {
      return HelperService.handleError(err, res);
    });
  }
}
