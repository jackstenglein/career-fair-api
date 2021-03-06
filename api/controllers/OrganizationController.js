/**
 * OrganizationController
 *
 * @description :: Server-side logic for managing organizations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const checkParams = require('check-params');

module.exports = {

  addAdministrator: function(req, res) {
    checkParams(req, {
      bodyParams: [
        'email'
      ]
    }).then(function() {
      return OrganizationService.addAdministrator(req.session.user, req.body.email)
      .then(function(response) {
        return res.json(response);
      });
    }).catch(function(err) {
      return HelperService.handleError(err, res);
    });
  },

  newOrganization: function(req, res) {
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
  },

  allFairs: function(req, res) {
    return OrganizationService.allFairs(req.session.user)
    .then(function(response) {
      return res.json(response);
    }).catch(function(err) {
      return HelperService.handleError(err, res);
    });
  },

  deleteAdminInvitation: function(req, res) {
    return checkParams(req, {
      queryParams: [
        'invitation'
      ]
    }).then(function() {
      return OrganizationService.deleteAdminInvitation(req.session.user, req.query.invitation)
      .then(function(response) {
        return res.json(response);
      });
    }).catch(function(err) {
      return HelperService.handleError(err, res);
    });
  },

  getFair: function(req, res) {
    return checkParams(req, {
      queryParams: [
        'fair'
      ]
    }).then(function() {
      return OrganizationService.getFair(req.session.user, req.query.fair)
      .then(function(response) {
        return res.json(response);
      });
    }).catch(function(err) {
      return HelperService.handleError(err, res);
    });
  },

  getAdminInvitations: function(req, res) {
    return OrganizationService.getAdminInvitations(req.session.user)
    .then(function(response) {
      return res.json(response);
    }).catch(function(err) {
      return HelperService.handleError(err, res);
    });
  }
}
