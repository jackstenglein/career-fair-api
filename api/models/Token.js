/**
 * Token.js
 *
 * @description :: Represents a token to authenticate emails sent to unauthenticated users
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    token: {
      type: 'string',
      required: true
    },
    type: {
      type: 'integer',
      required: true
    }
    expiration: {
      type: 'datetime',
      required: true
    },
    organization: {
      model: 'organization'
    }
  }
};
