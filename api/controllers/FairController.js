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


   updateDateTime: function(req, res) {
     return checkParams(req, {
       bodyParams: [
         'id',
         'dateTime'
       ]
     }).then(function() {
       return FairService.updateDateTime(req.session.user, req.body.id, req.body.dateTime)
       .then(function(response) {
         return res.json(response);
       });
     }).catch(function(err) {
       return HelperService.handleError(err, res);
     });

   }



 }
