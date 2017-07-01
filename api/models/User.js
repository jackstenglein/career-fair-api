/**
 * User.js
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

    email: {
      type: 'string',
      required: true
    },

    password: {
      type: 'string',
      required: true
    },

    phone: {
      type: 'string'
    },

    website: {
      type: 'string'
    },

    resumeUrl: {
      type: 'string'
    },

    role: {
      type: 'integer',
      required: true
    },

    organization: {
      model: 'organization'
    },

    studentFairs: {
      collection: 'fair',
      via: 'students',
      dominant: true
    },

    employerFairs: {
      collection: 'fair',
      via: 'employers',
      dominant: true
    },

    studentInteractions: {
      collection: 'interaction',
      via: 'student'
    },

    employerInteractions: {
      collection: 'interaction',
      via: 'employer'
    }

  }
};
