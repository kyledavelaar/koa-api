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
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = 400
    ctx.body = `Uh-oh: ${err.message}`
    console.log('Error handler:', err.message)
  }
})

// app.use(async (ctx) => {
//   if (ctx.query.greet !== 'world') {
//     throw new Error('can only greet "world"')
//   }

//   console.log('Sending response')
//   ctx.status = 200
//   ctx.body = `Hello ${ctx.query.greet} from Koa`
// })

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

//------------------
// STREAM
//------------------
const Transform = require('stream').Transform;
const ProducerStream = require('./node_modules/kafka-node/lib/producerStream');
// const _ = require('lodash');
const producerStream = new ProducerStream();

const stdinTransform = new Transform({
  objectMode: true,
  decodeStrings: true,
  transform (text, encoding, callback) {
    // text = _.trim(text);
    console.log(`pushing message ${text} to ExampleTopic`);
    callback(null, {
      topic: 'cat',
      messages: text
    });
  }
});

process.stdin.setEncoding('utf8');
// console.log('stdin', process.stdin);
process.stdin.pipe(stdinTransform).pipe(producerStream);


/////////////////////////////////////////////////
// NODE STREAM
/////////////////////////////////////////////////

const fs = require('fs');
const file = fs.createWriteStream('./bigfile.txt');
for(let i=0; i<= 100000; i++) {
  file.write('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n');
}
file.end();






/////////////////////////////////////////////////
// SERVER
/////////////////////////////////////////////////
const HOST = '0.0.0.0';
const port = process.env.PORT || 4000
const server = app.listen(port, HOST, () => console.log(`API server started on ${port}`))

module.exports = {
  producer,
  server
}