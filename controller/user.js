const User = require('../models/user');


const getUsers = async (ctx) => {
  const users = await User.find({})
  ctx.body = users;
}

module.exports = {
  getUsers
}