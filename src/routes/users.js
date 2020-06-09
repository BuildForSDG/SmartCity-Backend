const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const mailer = require('../mail/mailer');

const saltRounds = 10;
const router = express.Router();
router.use(session({
  secret: 'team241 smartcity',
  resave: false,
  saveUninitialized: false
}));

const serializeUser = (user) => {
  const { _id } = user;
  return {
    _id,
    isAdmin: user.role === 1,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
    address1: user.address1,
    address2: user.address2,
    city: user.city,
    state: user.state,
    gender: user.gender,
    dob: user.dob,
    emailVerified: user.emailVerified,
    filename: user.filename
  };
};

router.get('/auth', auth, (req, res) => {
  res.status(200).json(req.session.user);
});

router.post('/register', (req, res, next) => {
  const user = new User(req.body);

  bcrypt.genSalt(saltRounds, (error, salt) => {
    if (error) return next(error);
    return bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) next(err);
      user.password = hash;
      user.save((er, doc) => {
        if (er) return res.status(400).json({ success: false, message: 'email already exists' });

        const { smtpTransport, mail } = mailer(doc.email, doc.firstname, 'welcome');
        return smtpTransport.sendMail(mail, (errors, response) => {
          const emailResponse = (errors || response);
          smtpTransport.close();
          req.session.user = serializeUser(doc);
          return res.status(201).json({
            message: 'registration successful!',
            user: serializeUser(doc),
            emailResponse
          });
        });
      });
    });
  });
});

router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (error, user) => {
    if (!user) {
      return res.status(400).json({
        loginSuccess: false,
        message: 'Authentication failed, email not found'
      });
    }
    return bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err || !isMatch) return res.json({ loginSuccess: false, message: 'Wrong password' });

      req.session.user = serializeUser(user);
      return res.status(200).json({
        message: 'login successful',
        data: serializeUser(user)
      });
    });
  });
});

router.get('/logout', auth, (req, res) => req.session.destroy((err) => {
  if (err) return res.status(400).json({ logoutSuccess: false, err });
  return res.status(200).json({ message: 'logout successful' });
}));

router.get('/verify', auth, (req, res) => {
  const { email } = req.session.user;
  User.findOneAndUpdate({ email }, { $set: { emailVerified: true } }, (err, doc) => {
    if (!doc) return res.status(404).send('Email not found');
    req.session.user.emailVerified = true;
    return res.status(200).render('verify');
  });
});

module.exports = router;
