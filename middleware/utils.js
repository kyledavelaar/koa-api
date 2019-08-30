
async function authenticate(ctx, next) {
  const { authenticated } = ctx.request.headers;
  console.log('authenticated', authenticated)
  if (authenticated !== 'true') {
    return ctx.body = 'you are not authenticated'
  }
  await next();
}

async function alterRequest(ctx, next) {
  // ctx.request.url = '/api/users?id=5d6716379a2d615d61cadf2b'
  await next();
}

module.exports = {
  authenticate,
  alterRequest
}