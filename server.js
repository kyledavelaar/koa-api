const Koa = require('koa');
const Logger = require('koa-logger');
const mongoose = require('mongoose');
const Cors = require('@koa/cors')
const BodyParser = require('koa-bodyparser')
const respond = require('koa-respond')
const kafka = require("kafka-node");

const Router = require('koa-router')
const router = new Router()

const app = new Koa()



/////////////////////////////////////////////////
// DB
/////////////////////////////////////////////////
const mongooseOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
}
const database = 'mongodb://localhost/koa-api';
// const database = 'mongodb://database:27017/koa-api';  // use when in docker

mongoose.connect(database, mongooseOptions, (err, db) => {
  if (err) console.log('err', err)
  else { console.log(` connected to ${database}`)}
});

/////////////////////////////////////////////////
// MIDDLEWARE
/////////////////////////////////////////////////
app.use(Cors())
app.use(BodyParser({
  enableTypes: ['json'],
  jsonLimit: '5mb',
  strict: true,
  onerror: function (err, ctx) {
    ctx.throw('body parse error', 422)
  }
}))
app.use(respond())
app.use(Logger())

require('./routes')(router)
app.use(router.routes())
app.use(router.allowedMethods())


/////////////////////////////////////////////////
// KAFKA
/////////////////////////////////////////////////
const Producer = kafka.Producer;
const client = new kafka.KafkaClient('localhost:2181');
const producer = new Producer(client);
let count = 0;

producer.on("ready", function() {
  console.log("ready");

  // setInterval(function() {
  //   payloads = [
  //     { topic: "cat", messages: `I have ${count} cats`, partition: 0 }
  //   ];

  //   producer.send(payloads, function(err, data) {
  //     console.log(data);
  //     count += 1;
  //   });
  // }, 5000);

});

producer.on("error", function(err) {
  console.log(err);
});










/////////////////////////////////////////////////
// SERVER
/////////////////////////////////////////////////
const HOST = '0.0.0.0';
const port = process.env.PORT || 4000
const server = app.listen(port, HOST, () => console.log(`API server started on ${port}`))

module.exports = {
  producer: producer,
  server: server
}