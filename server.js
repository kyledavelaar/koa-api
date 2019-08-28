const Koa = require('koa');
const KoaLogger = require('koa-logger');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

const app = new Koa()

const mongooseOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
}
const database = 'mongodb://localhost/koa-api';
mongoose.connect(database, mongooseOptions, (err, db) => {
  if (err) console.log('err', err)
  else { console.log(` connected to ${database}`)}
});



const HOST = '0.0.0.0';
const port = process.env.PORT || 4000
const server = app.listen(port, HOST, () => console.log(`API server started on ${port}`))
module.exports = server;