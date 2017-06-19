const nodemailer = require('nodemailer');
const fs = require('fs');
const mustache = require('mustache');

module.exports = {
  send: (from, to, subject, template, data, credentials) => {
    const transporter = nodemailer.createTransport(credentials);

    fs.readFile(`./resources/emails/${template}`, (err, content) => {
      if (err) throw err;

      template = content.toString();
      const html = mustache.render(template, data);

      const mailOptions = {
        from,
        to,
        subject,
        html
      };

      transporter.sendMail(mailOptions);
    });
  }
};
