const User = require('../models/user');


const getUsers = async (ctx) => {
  const users = await User.find({})
  ctx.body = users;
}

async function createUser(ctx) {
  const body = ctx.request.body;
  const newUser = await User.create(body);
  ctx.body = newUser;
}

module.exports = {
  getUsers,
  createUser,
  // updateUser,
  // deleteUser
}