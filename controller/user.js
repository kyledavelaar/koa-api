const User = require('../models/user');
const querystring = require('querystring');



const getUsers = async (ctx) => {
  const qs = querystring.parse(ctx.request.querystring)
  const limit = Number(qs.limit);
  const offset = Number(qs.offset);
  ctx.body = await User.find({}).sort('name').skip(offset).limit(limit);

}

const getUser = async(ctx) => {
  const user = await User.findById(ctx.params.id);
  ctx.body = user;
}

async function createUser(ctx) {
  const body = ctx.request.body;
  const newUser = await User.create(body);
  ctx.body = newUser;
}

const updateUser = async (ctx) => {
  const id = ctx.params.id;
  const body = ctx.request.body;
  const updatedUser = await User.findByIdAndUpdate(id, {$set: body}, {new: true})
  ctx.body = updatedUser;
}

const deleteUser = async (ctx) => {
  const id = ctx.params.id;
  const deletedUser = await User.findByIdAndDelete(id);
  ctx.body = deletedUser;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}