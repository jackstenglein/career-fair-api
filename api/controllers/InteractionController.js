/**
 * InteractionController
 *
 * @description :: Server-side logic for managing interactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 const checkParams = require('check-params');
 const Err = require('err');


 module.exports = {

   newInteraction: function(req, res) {
     return checkParams(req, {
       bodyParams: [
         'employer',
         'fair'
       ]
     }).then(function() {
       return InteractionService.newInteraction(req.session.user, req.body.employer, req.body.fair)
       .then(function(response) {
         res.json(response);
       });
     }).catch(function(err) {
       return HelperService.handleError(err, res);
     });
   },

  


 }
