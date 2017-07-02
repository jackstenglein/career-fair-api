/**
 * FairController
 *
 * @description :: Server-side logic for managing fairs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const checkParams = require('check-params');

module.exports = {

   newFair: function(req, res) {
     return checkParams(req, {
       bodyParams: [
         'name'
       ]
     }).then(function() {
       return FairService.newFair(req.session.user, req.body)
       .then(function(response) {
         return res.json(response);
       });
     }).catch(function(err) {
       return HelperService.handleError(err, res);
     });
   },


   updateInfo: function(req, res) {
     return checkParams(req, {
       bodyParams: [
         'fair'
       ]
     }).then(function() {
      if(!req.body.dateTime && !req.body.name)
        return HelperService.handleError(new Err('No parameters specified', 400), res);

      return FairService.updateInfo(req.session.user, req.body.fair, req.body)
      .then(function(response) {
        return res.json(response);
      });
     }).catch(function(err) {
       return HelperService.handleError(err, res);
     });
   }


 }
