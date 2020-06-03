const mongoose = require('mongoose');
const config = require('./keys');

const connect = () => {
  mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.dir('we are connected!');
  });
};
exports.connect = connect;
