const elasticApi = require('elastic-email');
const fs = require('fs');
const mustache = require('mustache');

module.exports = {
  send: (from, to, subject, template, data, config) => {
    const client = elasticApi.createClient(config.mail.elastic);

    fs.readFile(`./resources/emails/${template}`, (err, content) => {
      if (err) throw err;

      template = content.toString();
      const html = mustache.render(template, data);

      const mailOptions = {
        from,
        msgTo: to,
        subject,
        bodyHtml: html
      };

      client.email.send(mailOptions, err => console.log(err));
    });
  }
};
