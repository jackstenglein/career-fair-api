/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

  /***** TEST ROUTES *****/


  /***** USER ROUTES *****/
  'GET /user/fairs-all'       :   'UserController.allFairs',
  'GET /user/interactions-all'    : 'UserController.allInteractions',
  'GET /user/interactions-fair'   : 'UserController.interactionsForFair',
  'POST /user/signup'           :   'UserController.signup',
  'POST /user/login'            :   'UserController.login',
  'GET /user/logout'            :   'UserController.logout',
  'PUT /user/update-info'       :   'UserController.updateInfo',
  'POST /user/upload-resume'    :   'UserController.uploadResume',
  'POST /user/register-fair'    :   'UserController.registerFair',
  'POST /user/request-password-reset' : 'UserController.requestPasswordReset',
  'POST /user/confirm-password-reset' : 'UserController.confirmPasswordReset',
  'PUT /user/change-password':    'UserController.changePassword',
  'GET /user/confirm-password-reset' : 'UserController.passwordResetView',


  /***** ORGANIZATION ROUTES *****/
  'POST /organization/add-admin' :  'OrganizationController.addAdministrator',
  'GET /organization/fair'      :   'OrganizationController.getFair',
  'GET /organization/fairs-all' :   'OrganizationController.allFairs',
  'GET /organization/invitations' : 'OrganizationController.getAdminInvitations',
  'DELETE /organization/invitation' : 'OrganizationController.deleteAdminInvitation',
  'POST /organization/new'      :   'OrganizationController.newOrganization',


  /***** FAIR ROUTES *****/
  'POST /fair/new'          :     'FairController.newFair',
  'PUT /fair/update-info'   :     'FairController.updateInfo',

  /***** INTERACTION ROUTES *****/
  'POST /interaction/new'   :     'InteractionController.newInteraction'

};
