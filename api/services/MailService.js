const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');
const ejs = require('ejs');

// AWS.config.loadFromPath('aws-config.json');
AWS.config = new AWS.Config({
  accessKeyId: process.env.AWS_KEY, secretAccessKey: process.env.AWS_SECRET, region: 'us-west-2'
});

var transporter = nodemailer.createTransport({
  SES: new AWS.SES({
    apiVersion: '2010-12-01'
  })
});


module.exports = {

  send: function(to, subject, templateName, parameters) {

    return new Promise(function(resolve, reject) {
      var template = process.cwd() + '/views/emailTemplates/' + templateName +'/html.ejs';

      ejs.renderFile(template, parameters, {}, function(err, html) {
        if(err) reject(err);

        transporter.sendMail({
          from: process.env.SENDER_EMAIL,
          to: to,
          subject: subject,
          html: html
        }, (err, info) => {
          if(err) reject(err);
          resolve({'info': info, 'error': err});
        });
      });
    });
  },

  sendErrorEmail: function(err) {
    return MailService.send(process.env.ERROR_EMAIL, 'Career Fair API: 500 Server Error', 'errorNotification', {'error': err})
    .then(function(response) {
      return response;
    }).catch(function(error) {
      return error;
    });
  }
}
