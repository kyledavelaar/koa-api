const kafka = require("kafka-node");

async function authenticate(ctx, next) {
  const { authenticated } = ctx.request.headers;
  console.log('authenticated', authenticated)
  if (authenticated !== 'true') {
    return ctx.body = 'you are not authenticated'
  }
  await next();
}

async function addDefaultLimitOffset(ctx, next) {
  if (!ctx.request.querystring) {
    ctx.request.url = '/api/users?limit=5&offset=0'
  }
  await next();
}

async function transferData(ctx, next) {
  const MainApp = require('../server'); // must require inside method, otherwise MainApp will be undefined
  console.log('transferring')

  const messages = JSON.stringify(ctx.request.body)

  payloads = [
    { topic: "cat", messages, partition: 0 }
  ];

  MainApp.producer.send(payloads, function(err, data) {
    console.log('topic_ ', payloads[0].topic, ': message sent_ ', messages);
  });

  await next();
}

module.exports = {
  authenticate,
  addDefaultLimitOffset,
  transferData,
}