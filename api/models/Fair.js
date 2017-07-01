/**
 * Fair.js
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

    date: {
      type: 'string'
    },

    startTime: {
      type: 'string'
    },

    endTime: {
      type: 'string'
    },

    organization: {
      model: 'organization',
      required: true
    },

    students: {
      collection: 'user',
      via: 'studentFairs'
    },

    employers: {
      collection: 'user',
      via: 'employerFairs'
    },

    interactions: {
      collection: 'interaction',
      via: 'fair'
    }
  }
};
