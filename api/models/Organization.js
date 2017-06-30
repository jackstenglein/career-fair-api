/**
 * Organization.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
    },

    creator: {
      model: 'user',
      required: true
    },

    administartors: {
      collection: 'user',
      via: 'organization'
    },

    fairs: {
      collection: 'fair',
      via: 'organization'
    }
  }
};
