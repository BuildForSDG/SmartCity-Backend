const mailer = require('nodemailer');
const actionRequired = require('./templates/actionRequired');

const welcomeText = 'Welcome to Smart City, your online market place to buy and sell anything. Click the button bellow to verify your email address.';
const passText = 'You have requested to reset your password. Click on the link below set a new password';

const getEmailData = (to, name, template) => {
  let data = {};
  switch (template) {
    case 'welcome':
      data = {
        from: 'SMART CITY <scletus40@gmail.com>',
        to,
        subject: 'Welcome to Smart City Hub',
        html: actionRequired(name, welcomeText, 'verify', 'Verify Your Email')
      };
      break;

    case 'passwordReset':
      data = {
        from: 'SMART CITY <scletus40@gmail.com>',
        to,
        subject: 'Password Reset Email',
        html: actionRequired(name, passText, 'passwordReset', 'Reset Password')
      };
      break;
    default:
      data = {};
  }
  return data;
};

module.exports = (to, name, type) => {
  const smtpTransport = mailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mail = getEmailData(to, name, type);

  return { smtpTransport, mail };
};
